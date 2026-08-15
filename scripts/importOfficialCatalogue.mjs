import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const INDEX_URL = 'https://outils.ge.ch/referentiel/formation/CatalogueDescription/'
const SNAPSHOT_DATE = '2026-08-13'
const MAX_ATTEMPTS = 3
const REQUEST_TIMEOUT_MS = 20_000
const WORKER_COUNT = 3
const WORKER_DELAY_MS = 200
const MAX_CONSECUTIVE_SERVER_ERRORS = 10

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const snapshotPath = path.join(projectRoot, 'src', 'data', 'officialCatalogueSnapshot.json')
const reportPath = path.join(projectRoot, 'reports', 'catalogue-import-report.md')

const detailFields = [
  'organizingEntityRaw',
  'domainRaw',
  'themeRaw',
  'publicRaw',
  'durationRaw',
  'targetAudienceRaw',
  'generalInformationRaw',
  'objectivesRaw',
  'contentRaw',
  'prerequisitesRaw',
  'additionalInformationRaw',
]

const references = {
  OPE: ['SEM1098', 'SEM0735', 'SEM1080'],
  DIP: ['DIP-002', 'EP-520', 'SEM-P1575'],
  Police: ['FP173', 'FP203'],
  OCD: ['OCD151', 'OCD207'],
  'Pouvoir judiciaire': ['PJ-0001', 'PJ-0026'],
}

const sectionFields = new Map([
  ['public vise', 'targetAudienceRaw'],
  ['generalites', 'generalInformationRaw'],
  ['generalite', 'generalInformationRaw'],
  ['objectifs', 'objectivesRaw'],
  ['contenu', 'contentRaw'],
  ['pre-requis', 'prerequisitesRaw'],
  ['prerequis', 'prerequisitesRaw'],
  ['informations complementaires', 'additionalInformationRaw'],
  ['information complementaire', 'additionalInformationRaw'],
])

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function decodeHtml(value) {
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"' }
  return value
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name) => {
      if (name.startsWith('#x')) return String.fromCodePoint(Number.parseInt(name.slice(2), 16))
      if (name.startsWith('#')) return String.fromCodePoint(Number.parseInt(name.slice(1), 10))
      return named[name.toLowerCase()] ?? entity
    })
    .normalize('NFC')
}

function htmlToText(value) {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p\s*>/gi, '\n')
      .replace(/<\/li\s*>/gi, '\n')
      .replace(/<li\b[^>]*>/gi, '- ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/[\t ]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

function normalizeLabel(value) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function markdown(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>')
}

function markdownValue(value) {
  return value === null ? '`null`' : `\`${markdown(value)}\``
}

function hasContactDetails(value) {
  return Boolean(
    value &&
      (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(value) ||
        /(?:\+41|0041|0\d{2})[\s./-]*\d{3}[\s./-]*\d{2}[\s./-]*\d{2}/.test(value)),
  )
}

async function fetchText(url, fetchState) {
  let lastError
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CatalogueFormationEGE snapshot importer (low-frequency public catalogue read)',
        },
        signal: controller.signal,
      })
      if (response.ok) {
        fetchState.consecutiveServerErrors = 0
        return await response.text()
      }
      lastError = new Error(`HTTP ${response.status}`)
      if (![403, 429].includes(response.status) && response.status < 500) break
      fetchState.consecutiveServerErrors += 1
      if (fetchState.consecutiveServerErrors >= MAX_CONSECUTIVE_SERVER_ERRORS) {
        throw new Error(
          `Arrêt de prudence après ${fetchState.consecutiveServerErrors} réponses HTTP problématiques consécutives`,
        )
      }
    } catch (error) {
      lastError = error
      if (error.message.startsWith('Arrêt de prudence après')) throw error
    } finally {
      clearTimeout(timeout)
    }
    if (attempt < MAX_ATTEMPTS) await sleep(500 * attempt)
  }
  throw lastError
}

export function parseCatalogueIndex(html) {
  const occurrences = []
  const unparsedCourseRows = []
  let currentOffer = null

  for (const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cell = row[1].match(/<td\b[^>]*class=["']([^"']+)["'][^>]*>([\s\S]*?)<\/td>/i)
    if (!cell) continue
    const [, className, cellHtml] = cell
    if (className === 'level0') {
      currentOffer = htmlToText(cellHtml)
      continue
    }
    if (className !== 'course') continue

    const link = cellHtml.match(/window\.open\(\s*['"]\.\/([^'"?]+?)\.html['"]/i)
    if (!link || !currentOffer) {
      unparsedCourseRows.push(htmlToText(cellHtml))
      continue
    }
    const code = decodeHtml(link[1]).trim()
    const visibleText = htmlToText(cellHtml)
    const prefix = `${code} - `
    occurrences.push({
      code,
      offer: currentOffer,
      sourceUrl: new URL(`${link[1]}.html`, INDEX_URL).href,
      titleFromIndex: visibleText.startsWith(prefix) ? visibleText.slice(prefix.length).trim() : visibleText,
    })
  }

  const byCode = new Map()
  const duplicateOccurrencesWithinOffer = []
  for (const occurrence of occurrences) {
    const course = byCode.get(occurrence.code) ?? {
      code: occurrence.code,
      sourceUrl: occurrence.sourceUrl,
      indexOccurrences: 0,
      catalogueOffers: [],
      titlesFromIndex: [],
    }
    course.indexOccurrences += 1
    if (course.catalogueOffers.includes(occurrence.offer)) {
      duplicateOccurrencesWithinOffer.push({ code: occurrence.code, offer: occurrence.offer })
    } else {
      course.catalogueOffers.push(occurrence.offer)
    }
    if (!course.titlesFromIndex.includes(occurrence.titleFromIndex)) {
      course.titlesFromIndex.push(occurrence.titleFromIndex)
    }
    byCode.set(occurrence.code, course)
  }

  return {
    occurrences,
    courses: [...byCode.values()],
    duplicateOccurrencesWithinOffer,
    unparsedCourseRows,
  }
}

function firstText(html, pattern) {
  const match = html.match(pattern)
  return match ? htmlToText(match[1]) || null : null
}

export function parseCourseDetail(html) {
  const h1 = firstText(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  const detailCode = h1?.match(/^COURS\s+(.+?)\s+-\s+/i)?.[1]?.trim() ?? null
  const titleRaw = firstText(html, /<h3\b[^>]*>([\s\S]*?)<\/h3>/i)
  const organizerTable = html.match(
    /<h2\b[^>]*>\s*ENTIT(?:É|&Eacute;) DE FORMATION ORGANISATRICE\s*<\/h2>[\s\S]*?<table\b[^>]*>([\s\S]*?)<\/table>/i,
  )
  const organizingEntityRaw = organizerTable
    ? firstText(organizerTable[1], /<b\b[^>]*>([\s\S]*?)<\/b>/i)
    : null
  const metadata = { domainRaw: null, themeRaw: null, publicRaw: null, durationRaw: null }
  const metadataFields = { domaine: 'domainRaw', theme: 'themeRaw', public: 'publicRaw', duree: 'durationRaw' }

  for (const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) =>
      htmlToText(cell[1]),
    )
    if (cells.length < 2) continue
    const field = metadataFields[normalizeLabel(cells[0])]
    if (field && metadata[field] === null) metadata[field] = cells[1] || null
  }

  const sections = {}
  const observedSectionLabels = []
  const suppressedContactSections = []
  const blockPattern =
    /<div\b[^>]*>\s*<p\b[^>]*>\s*<b\b[^>]*>([\s\S]*?)<\/b>\s*<\/p>\s*<p\b[^>]*class=["']pComment["'][^>]*>([\s\S]*?)<\/p>\s*<\/div>/gi

  for (const block of html.matchAll(blockPattern)) {
    const sourceLabel = htmlToText(block[1])
    observedSectionLabels.push(sourceLabel)
    const field = sectionFields.get(normalizeLabel(sourceLabel))
    if (!field || Object.hasOwn(sections, field)) continue
    const value = htmlToText(block[2]) || null
    if (hasContactDetails(value)) {
      sections[field] = null
      suppressedContactSections.push({ field, sourceLabel })
    } else {
      sections[field] = value
    }
  }

  return {
    detailCode,
    titleRaw,
    organizingEntityRaw,
    ...metadata,
    targetAudienceRaw: sections.targetAudienceRaw ?? null,
    generalInformationRaw: sections.generalInformationRaw ?? null,
    objectivesRaw: sections.objectivesRaw ?? null,
    contentRaw: sections.contentRaw ?? null,
    prerequisitesRaw: sections.prerequisitesRaw ?? null,
    additionalInformationRaw: sections.additionalInformationRaw ?? null,
    observedSectionLabels: [...new Set(observedSectionLabels)],
    suppressedContactSections,
  }
}

function validateSnapshot(snapshot, indexData, processedCodes) {
  const failures = []
  if (new Set(snapshot.map(({ code }) => code)).size !== snapshot.length) {
    failures.push('des codes sont dupliqués dans le snapshot')
  }
  if (snapshot.length !== indexData.courses.length) {
    failures.push("le nombre d'objets JSON diffère du nombre de codes uniques")
  }
  if (processedCodes.size !== indexData.courses.length) {
    failures.push('le nombre de fiches traitées diffère du nombre de codes uniques')
  }
  for (const course of snapshot) {
    if (new Set(course.catalogueOffers).size !== course.catalogueOffers.length) {
      failures.push(`${course.code}: offre dupliquée dans catalogueOffers`)
    }
  }
  return failures
}

async function compareReferences(snapshot) {
  const moduleUrl = new URL(`../src/data/officialCourseSamples.js?time=${Date.now()}`, import.meta.url)
  const { officialCourseSamples } = await import(moduleUrl.href)
  const importedByCode = new Map(snapshot.map((course) => [course.code, course]))
  const sampleByCode = new Map(officialCourseSamples.map((course) => [course.code, course]))
  const fields = ['titleRaw', 'organizingEntityRaw', 'domainRaw', 'publicRaw', 'targetAudienceRaw']
  const divergences = []

  for (const [group, codes] of Object.entries(references)) {
    for (const code of codes) {
      const imported = importedByCode.get(code)
      const sample = sampleByCode.get(code)
      if (!imported || !sample) {
        divergences.push({
          group,
          code,
          field: 'présence',
          currentValue: sample ? 'présent' : 'absent',
          importedValue: imported ? 'présent' : 'absent',
        })
        continue
      }
      for (const field of fields) {
        const currentValue = sample.officialData[field] ?? null
        const importedValue = imported[field] ?? null
        if (currentValue !== importedValue) {
          divergences.push({ group, code, field, currentValue, importedValue })
        }
      }
    }
  }
  return divergences
}

function percentage(count, total) {
  return total === 0 ? '0,0 %' : `${((count / total) * 100).toFixed(1)} %`
}

function buildReport(context) {
  const {
    durationSeconds,
    errors,
    indexData,
    integrityFailures,
    divergences,
    sectionLabels,
    securityIssues,
    snapshot,
    snapshotBytes,
    suppressedContactSections,
  } = context
  const offerCounts = new Map()
  for (const occurrence of indexData.occurrences) {
    offerCounts.set(occurrence.offer, (offerCounts.get(occurrence.offer) ?? 0) + 1)
  }
  const multiOffer = indexData.courses
    .filter(({ catalogueOffers }) => catalogueOffers.length > 1)
    .sort(
      (left, right) =>
        right.catalogueOffers.length - left.catalogueOffers.length ||
        left.code.localeCompare(right.code),
    )
  const divergentTitles = indexData.courses.filter(({ titlesFromIndex }) => titlesFromIndex.length > 1)
  const successful = snapshot.filter(({ fetchStatus }) => fetchStatus === 'ok').length
  const unavailable = snapshot.length - successful
  const maxOffers = Math.max(0, ...indexData.courses.map(({ catalogueOffers }) => catalogueOffers.length))
  const lines = [
    '# Rapport d’import du catalogue officiel',
    '',
    `- Date du snapshot : ${SNAPSHOT_DATE}`,
    `- URL source : ${INDEX_URL}`,
    `- Durée totale de l’import : ${durationSeconds.toFixed(1)} secondes`,
    `- Taille du JSON final : ${(snapshotBytes / 1024 / 1024).toFixed(2)} Mio (${snapshotBytes} octets)`,
    '',
    '## Synthèse',
    '',
    `- Occurrences détectées dans l’index : ${indexData.occurrences.length}`,
    `- Codes uniques : ${indexData.courses.length}`,
    `- Occurrences éliminées par déduplication : ${indexData.occurrences.length - indexData.courses.length}`,
    `- Formations présentes dans plusieurs offres : ${multiOffer.length}`,
    `- Nombre maximal d’offres pour une formation : ${maxOffers}`,
    `- Fiches récupérées avec succès : ${successful}`,
    `- Fiches indisponibles : ${unavailable}`,
    '',
    '## Offres détectées',
    '',
    '| Offre | Occurrences | Formations uniques |',
    '| --- | ---: | ---: |',
    ...[...offerCounts].map(([offer, count]) => {
      const unique = indexData.courses.filter(({ catalogueOffers }) => catalogueOffers.includes(offer)).length
      return `| ${markdown(offer)} | ${count} | ${unique} |`
    }),
    '',
    '## Disponibilité des champs',
    '',
    '| Champ | Présent | Pourcentage |',
    '| --- | ---: | ---: |',
    ...detailFields.map((field) => {
      const count = snapshot.filter((course) => course[field] !== null).length
      return `| \`${field}\` | ${count}/${snapshot.length} | ${percentage(count, snapshot.length)} |`
    }),
    '',
    '### Correspondance des libellés officiels',
    '',
    '- `Public visé` → `targetAudienceRaw`',
    '- `Généralités` / `Généralité` → `generalInformationRaw`',
    '- `Objectifs` → `objectivesRaw`',
    '- `Contenu` → `contentRaw`',
    '- `Pré-requis` → `prerequisitesRaw`',
    '- `Informations complémentaires` → `additionalInformationRaw`',
    '',
    `Libellés de blocs observés : ${[...sectionLabels].sort().map((label) => `\`${markdown(label)}\``).join(', ') || 'aucun'}.`,
    '',
    '## Exemples de formations multi-offres',
    '',
    '| Code | Intitulé | Occurrences | Offres finales | Objets JSON |',
    '| --- | --- | ---: | --- | ---: |',
    ...multiOffer.slice(0, 10).map((course) => {
      const count = snapshot.filter(({ code }) => code === course.code).length
      return `| ${course.code} | ${markdown(course.titlesFromIndex[0] ?? '')} | ${course.indexOccurrences} | ${course.catalogueOffers.map(markdown).join('<br>')} | ${count} |`
    }),
    '',
    '## Anomalies de l’index et minimisation des données',
    '',
    `- Lignes de cours non analysées : ${indexData.unparsedCourseRows.length}`,
    `- Occurrences répétées dans une même offre : ${indexData.duplicateOccurrencesWithinOffer.length}`,
    `- Codes avec plusieurs intitulés dans l’index : ${divergentTitles.length}`,
    `- Sections écartées car elles contenaient une coordonnée de contact : ${suppressedContactSections.length}`,
    '',
  ]

  if (indexData.unparsedCourseRows.length > 0) {
    lines.push('### Lignes non analysées', '', ...indexData.unparsedCourseRows.map((row) => `- ${markdown(row)}`), '')
  }
  if (indexData.duplicateOccurrencesWithinOffer.length > 0) {
    lines.push(
      '### Occurrences répétées dans une même offre',
      '',
      ...indexData.duplicateOccurrencesWithinOffer.map(({ code, offer }) => `- ${code} — ${markdown(offer)}`),
      '',
    )
  }
  if (divergentTitles.length > 0) {
    lines.push(
      '### Intitulés divergents dans l’index',
      '',
      ...divergentTitles.map(
        ({ code, titlesFromIndex }) => `- ${code} : ${titlesFromIndex.map((title) => `« ${markdown(title)} »`).join(' / ')}`,
      ),
      '',
    )
  }
  if (suppressedContactSections.length > 0) {
    lines.push(
      '### Sections exclues pour minimisation des données',
      '',
      'Ces sections n’ont pas été copiées car elles contenaient une adresse électronique ou un numéro de téléphone.',
      '',
      ...suppressedContactSections.map(({ code, field, sourceLabel }) => `- ${code} — ${sourceLabel} (\`${field}\`)`),
      '',
    )
  }

  lines.push('## Erreurs de récupération', '')
  if (errors.length === 0) {
    lines.push('Aucune erreur.', '')
  } else {
    lines.push('| Code | URL | Type d’erreur |', '| --- | --- | --- |')
    lines.push(...errors.map(({ code, sourceUrl, error }) => `| ${code} | ${sourceUrl} | ${markdown(error)} |`), '')
  }

  lines.push('## Comparaison avec les formations de référence', '')
  if (divergences.length === 0) {
    lines.push('Aucune différence significative détectée.', '')
  } else {
    lines.push(
      '| Groupe | Code | Champ | Valeur de l’échantillon V1.1 | Valeur importée |',
      '| --- | --- | --- | --- | --- |',
      ...divergences.map(
        ({ group, code, field, currentValue, importedValue }) =>
          `| ${markdown(group)} | ${code} | \`${field}\` | ${markdownValue(currentValue)} | ${markdownValue(importedValue)} |`,
      ),
      '',
    )
  }

  lines.push(
    '## Contrôles d’unicité',
    '',
    `- Aucun code dupliqué : ${new Set(snapshot.map(({ code }) => code)).size === snapshot.length ? 'réussi' : 'échec'}`,
    `- Nombre d’objets égal au nombre de codes uniques : ${snapshot.length === indexData.courses.length ? 'réussi' : 'échec'}`,
    `- Aucune offre dupliquée dans \`catalogueOffers\` : ${snapshot.every(({ catalogueOffers }) => new Set(catalogueOffers).size === catalogueOffers.length) ? 'réussi' : 'échec'}`,
    `- Chaque code traité une seule fois : ${integrityFailures.some((failure) => failure.includes('traitées')) ? 'échec' : 'réussi'}`,
    `- Une formation multi-offres reste un objet unique : ${multiOffer.every(({ code }) => snapshot.filter((course) => course.code === code).length === 1) ? 'réussi' : 'échec'}`,
    '',
  )
  if (integrityFailures.length > 0) {
    lines.push('### Échecs', '', ...integrityFailures.map((failure) => `- ${failure}`), '')
  }

  lines.push(
    '## Audit de sécurité',
    '',
    securityIssues.length === 0
      ? 'Aucun token, secret, mot de passe, chemin Windows personnel, clé privée ou adresse électronique n’a été détecté dans les artefacts générés.'
      : `Éléments à contrôler : ${securityIssues.join(', ')}.`,
    '',
    '## Conclusion technique',
    '',
    integrityFailures.length === 0 && indexData.unparsedCourseRows.length === 0
      ? 'Les contrôles structurels sont réussis. Toute intégration dans l’application reste soumise à une validation distincte.'
      : 'Des anomalies structurelles subsistent ; le snapshot ne doit pas être intégré sans examen.',
    '',
  )
  return `${lines.join('\n')}\n`
}

function auditGeneratedText(snapshotText, reportText) {
  const combined = `${snapshotText}\n${reportText}`
  const checks = [
    ['chemin Windows personnel', /[A-Z]:\\Users\\/i],
    ['clé privée', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i],
    ['secret déclaré', /\b(?:api[_-]?key|client[_-]?secret|password|passwd|bearer)\b\s*[:=]/i],
    ['jeton GitHub', /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/],
    ['adresse électronique', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
  ]
  return checks.filter(([, pattern]) => pattern.test(combined)).map(([label]) => label)
}

async function main() {
  const startedAt = performance.now()
  const fetchState = { consecutiveServerErrors: 0 }
  const indexData = parseCatalogueIndex(await fetchText(INDEX_URL, fetchState))
  if (indexData.courses.length === 0 || indexData.unparsedCourseRows.length > 0) {
    throw new Error(
      `Index inutilisable : ${indexData.courses.length} code(s), ${indexData.unparsedCourseRows.length} ligne(s) non analysée(s)`,
    )
  }

  const snapshot = new Array(indexData.courses.length)
  const errors = []
  const processedCodes = new Set()
  const sectionLabels = new Set()
  const suppressedContactSections = []
  let nextIndex = 0
  let completed = 0

  async function worker() {
    while (true) {
      const index = nextIndex
      nextIndex += 1
      if (index >= indexData.courses.length) return
      const indexedCourse = indexData.courses[index]
      if (processedCodes.has(indexedCourse.code)) {
        throw new Error(`Code traité plusieurs fois : ${indexedCourse.code}`)
      }
      processedCodes.add(indexedCourse.code)
      let parsed = null
      let fetchStatus = 'unavailable'
      try {
        parsed = parseCourseDetail(await fetchText(indexedCourse.sourceUrl, fetchState))
        if (!parsed.detailCode || parsed.detailCode !== indexedCourse.code || !parsed.titleRaw) {
          throw new Error(
            `fiche inutilisable (code lu : ${parsed.detailCode ?? 'absent'}, titre : ${parsed.titleRaw ? 'présent' : 'absent'})`,
          )
        }
        fetchStatus = 'ok'
        for (const label of parsed.observedSectionLabels) sectionLabels.add(label)
        for (const section of parsed.suppressedContactSections) {
          suppressedContactSections.push({ code: indexedCourse.code, ...section })
        }
      } catch (error) {
        errors.push({ code: indexedCourse.code, sourceUrl: indexedCourse.sourceUrl, error: error.message })
      }

      snapshot[index] = {
        code: indexedCourse.code,
        sourceUrl: indexedCourse.sourceUrl,
        titleRaw: parsed?.titleRaw ?? indexedCourse.titlesFromIndex[0] ?? null,
        ...Object.fromEntries(detailFields.map((field) => [field, parsed?.[field] ?? null])),
        catalogueOffers: indexedCourse.catalogueOffers,
        fetchStatus,
        sourceSnapshotDate: SNAPSHOT_DATE,
      }
      completed += 1
      if (completed % 50 === 0 || completed === indexData.courses.length) {
        process.stdout.write(`\rFiches traitées : ${completed}/${indexData.courses.length}`)
      }
      await sleep(WORKER_DELAY_MS)
    }
  }

  await Promise.all(Array.from({ length: WORKER_COUNT }, () => worker()))
  process.stdout.write('\n')

  const integrityFailures = validateSnapshot(snapshot, indexData, processedCodes)
  if (integrityFailures.length > 0) {
    throw new Error(`Contrôles d’intégrité en échec : ${integrityFailures.join('; ')}`)
  }
  const divergences = await compareReferences(snapshot)
  const snapshotText = `${JSON.stringify(snapshot, null, 2)}\n`
  const baseContext = {
    durationSeconds: (performance.now() - startedAt) / 1000,
    errors,
    indexData,
    integrityFailures,
    divergences,
    sectionLabels,
    snapshot,
    snapshotBytes: Buffer.byteLength(snapshotText),
    suppressedContactSections,
  }
  let reportText = buildReport({ ...baseContext, securityIssues: [] })
  const securityIssues = auditGeneratedText(snapshotText, reportText)
  reportText = buildReport({ ...baseContext, securityIssues })
  if (securityIssues.length > 0) {
    throw new Error(`Audit de sécurité en échec : ${securityIssues.join(', ')}`)
  }

  await mkdir(path.dirname(snapshotPath), { recursive: true })
  await mkdir(path.dirname(reportPath), { recursive: true })
  await Promise.all([
    writeFile(snapshotPath, snapshotText, 'utf8'),
    writeFile(reportPath, reportText, 'utf8'),
  ])

  console.log(
    JSON.stringify(
      {
        occurrences: indexData.occurrences.length,
        uniqueCodes: indexData.courses.length,
        duplicatesRemoved: indexData.occurrences.length - indexData.courses.length,
        multiOfferCourses: indexData.courses.filter(({ catalogueOffers }) => catalogueOffers.length > 1).length,
        maximumOffers: Math.max(...indexData.courses.map(({ catalogueOffers }) => catalogueOffers.length)),
        successful: snapshot.filter(({ fetchStatus }) => fetchStatus === 'ok').length,
        unavailable: snapshot.filter(({ fetchStatus }) => fetchStatus === 'unavailable').length,
        snapshotBytes: Buffer.byteLength(snapshotText),
        durationSeconds: Number(baseContext.durationSeconds.toFixed(1)),
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
