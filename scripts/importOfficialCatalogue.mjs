import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compareCatalogueSnapshots } from './catalogueDiff.mjs'

const INDEX_URL = 'https://outils.ge.ch/referentiel/formation/CatalogueDescription/'
const now = new Date()
const SNAPSHOT_DATE = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-')
const MAX_ATTEMPTS = 3
const REQUEST_TIMEOUT_MS = 20_000
const WORKER_COUNT = 3
const WORKER_DELAY_MS = 200
const MAX_CONSECUTIVE_SERVER_ERRORS = 10

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const officialSnapshotPath = path.join(projectRoot, 'src', 'data', 'officialCatalogueSnapshot.json')
const snapshotPath = path.join(projectRoot, 'reports', 'officialCatalogueSnapshot.candidate.json')
const reportPath = path.join(projectRoot, 'reports', 'catalogue-import-report.candidate.md')

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

const monitoredReferenceFields = [
  'titleRaw',
  'organizingEntityRaw',
  'publicRaw',
  'targetAudienceRaw',
  'domainRaw',
]

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

function imageBasename(source) {
  return decodeHtml(source)
    .split(/[?#]/, 1)[0]
    .replaceAll('\\', '/')
    .split('/')
    .at(-1)
    .toLowerCase()
}

export function parseSessionFlags(html) {
  let sessionsStart = -1
  for (const heading of html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)) {
    if (normalizeLabel(htmlToText(heading[1])) === 'liste des sessions') {
      sessionsStart = heading.index + heading[0].length
      break
    }
  }

  if (sessionsStart === -1) {
    return { hasOpenSession: false, hasScheduledSession: false }
  }

  const remainingHtml = html.slice(sessionsStart)
  const nextHeadingIndex = remainingHtml.search(/<h[1-3]\b/i)
  const sessionsSection = nextHeadingIndex === -1 ? remainingHtml : remainingHtml.slice(0, nextHeadingIndex)
  const sessionsTable = sessionsSection.match(/<table\b[^>]*>([\s\S]*?)<\/table>/i)?.[1] ?? ''
  const statusImages = new Set()
  for (const image of sessionsTable.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    statusImages.add(imageBasename(image[1]))
  }

  return {
    hasOpenSession: statusImages.has('icon_vert.png'),
    hasScheduledSession: statusImages.has('icon_timer.png'),
  }
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
  const sessionFlags = parseSessionFlags(html)
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
    ...sessionFlags,
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

function normalizedReferenceValue(value) {
  if (value === null || value === undefined) return null
  const normalized = String(value).trim().replace(/\s+/g, ' ')
  return normalized || null
}

function referenceDifferenceCategory(field, referenceValue, currentValue) {
  if (referenceValue === null && currentValue !== null) return 'ENRICHISSEMENT'
  if (
    referenceValue !== null &&
    currentValue !== null &&
    referenceValue.toLocaleLowerCase('fr') === currentValue.toLocaleLowerCase('fr')
  ) {
    return 'DIFFÉRENCE TYPOGRAPHIQUE'
  }
  if (field === 'publicRaw') return 'REVUE MÉTIER PRIORITAIRE'
  if (field === 'organizingEntityRaw') return 'REVUE MÉTIER'
  if (field === 'targetAudienceRaw') return 'INFORMATION À EXAMINER'
  return 'ÉVOLUTION CONTEXTUELLE'
}

export function monitorValidatedReferences(officialCourseSamples, snapshot) {
  const importedByCode = new Map(snapshot.map((course) => [course.code, course]))
  const differences = []
  const presentCodes = new Set()

  for (const sample of officialCourseSamples) {
    const imported = importedByCode.get(sample.code)
    if (!imported) {
      differences.push({
        code: sample.code,
        category: 'RÉFÉRENCE ABSENTE',
        field: 'présence',
        referenceValue: 'présente',
        currentValue: 'absente',
      })
      continue
    }
    presentCodes.add(sample.code)
    for (const field of monitoredReferenceFields) {
      const referenceValue = normalizedReferenceValue(sample.officialData[field])
      const currentValue = normalizedReferenceValue(imported[field])
      if (referenceValue !== currentValue) {
        differences.push({
          code: sample.code,
          category: referenceDifferenceCategory(field, referenceValue, currentValue),
          field,
          referenceValue: sample.officialData[field] ?? null,
          currentValue: imported[field] ?? null,
        })
      }
    }
  }

  const codesByCategory = new Map()
  for (const difference of differences) {
    const codes = codesByCategory.get(difference.category) ?? new Set()
    codes.add(difference.code)
    codesByCategory.set(difference.category, codes)
  }
  const differingCodes = new Set(differences.map(({ code }) => code))
  const categoryCount = (category) => codesByCategory.get(category)?.size ?? 0
  const businessReviewCodes = new Set([
    ...(codesByCategory.get('REVUE MÉTIER PRIORITAIRE') ?? []),
    ...(codesByCategory.get('REVUE MÉTIER') ?? []),
  ])

  return {
    differences,
    summary: {
      checked: officialCourseSamples.length,
      present: presentCodes.size,
      absent: officialCourseSamples.length - presentCodes.size,
      identical: officialCourseSamples.length - differingCodes.size,
      priorityBusinessReviews: categoryCount('REVUE MÉTIER PRIORITAIRE'),
      businessReviews: categoryCount('REVUE MÉTIER'),
      businessReviewReferences: businessReviewCodes.size,
      informationToReview: categoryCount('INFORMATION À EXAMINER'),
      enrichments: categoryCount('ENRICHISSEMENT'),
      contextualEvolutions: categoryCount('ÉVOLUTION CONTEXTUELLE'),
      typographicalDifferences: categoryCount('DIFFÉRENCE TYPOGRAPHIQUE'),
    },
  }
}

async function monitorOfficialReferences(snapshot) {
  const moduleUrl = new URL(`../src/data/officialCourseSamples.js?time=${Date.now()}`, import.meta.url)
  const { officialCourseSamples } = await import(moduleUrl.href)
  return monitorValidatedReferences(officialCourseSamples, snapshot)
}

function percentage(count, total) {
  return total === 0 ? '0,0 %' : `${((count / total) * 100).toFixed(1)} %`
}

function shortDiffValue(value) {
  if (value === null || value === undefined) return '`null`'
  const compact = String(value).replace(/\s+/g, ' ').trim()
  const readable = compact.length > 240 ? `${compact.slice(0, 237)}…` : compact
  return `« ${markdown(readable)} »`
}

function courseSummaryRow(course) {
  return `| ${course.code} | ${markdown(course.titleRaw ?? '')} | ${(course.catalogueOffers ?? []).map(markdown).join('<br>')} | ${markdown(course.organizingEntityRaw ?? '')} | ${markdown(course.domainRaw ?? '')} |`
}

function buildCatalogueDiffLines(catalogueDiff, technicalAnomalies) {
  const visibleModified = catalogueDiff.modified.filter(({ visibleChanges }) => visibleChanges.length > 0)
  const longModified = catalogueDiff.modified.filter(({ longFields }) => longFields.length > 0)
  const lines = []

  if (catalogueDiff.sessionFlagsInitialization) {
    const statistics = catalogueDiff.sessionFlagsInitialization
    lines.push(
      '## Initialisation des informations de sessions',
      '',
      'Le snapshot officiel historique ne contient encore aucun flag Sessions. Leur ajout au candidat est traité comme une initialisation et non comme une modification métier.',
      '',
      '| Indicateur | Cours |',
      '| --- | ---: |',
      `| Cours avec inscriptions ouvertes | ${statistics.openCourses} |`,
      `| Cours avec sessions programmées | ${statistics.scheduledCourses} |`,
      `| Cours avec les deux statuts | ${statistics.bothStatuses} |`,
      `| Cours sans ces deux statuts | ${statistics.neitherStatus} |`,
      '',
    )
  }

  lines.push(
    '## Comparaison avec le snapshot officiel',
    '',
    'Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.',
    '',
    '| Indicateur | Valeur |',
    '| --- | ---: |',
    `| Cours dans le snapshot officiel | ${catalogueDiff.summary.officialCourses} |`,
    `| Cours dans le candidat | ${catalogueDiff.summary.candidateCourses} |`,
    `| Cours ajoutés | ${catalogueDiff.summary.addedCourses} |`,
    `| Cours supprimés | ${catalogueDiff.summary.removedCourses} |`,
    `| Cours modifiés | ${catalogueDiff.summary.modifiedCourses} |`,
    `| Cours dont les offres ont changé | ${catalogueDiff.summary.coursesWithOfferChanges} |`,
    `| Anomalies techniques | ${technicalAnomalies.length} |`,
    '',
    '### Cours ajoutés',
    '',
  )

  if (catalogueDiff.added.length === 0) {
    lines.push('Aucun cours ajouté.', '')
  } else {
    lines.push(
      '| Code | Intitulé | Offres | Entité | Domaine |',
      '| --- | --- | --- | --- | --- |',
      ...catalogueDiff.added.map(courseSummaryRow),
      '',
    )
  }

  lines.push('### Cours supprimés', '')
  if (catalogueDiff.removed.length === 0) {
    lines.push('Aucun cours supprimé.', '')
  } else {
    lines.push(
      '| Code | Intitulé | Offres | Entité | Domaine |',
      '| --- | --- | --- | --- | --- |',
      ...catalogueDiff.removed.map(courseSummaryRow),
      '',
    )
  }

  lines.push('### Cours modifiés — champs visibles ou utilisés', '')
  if (visibleModified.length === 0) {
    lines.push('Aucun champ visible ou utilisé n’a changé.', '')
  } else {
    lines.push('| Code | Intitulé candidat | Changements |', '| --- | --- | --- |')
    for (const course of visibleModified) {
      const changes = course.visibleChanges
        .map(({ field, oldValue, newValue }) => `\`${field}\` : ${shortDiffValue(oldValue)} → ${shortDiffValue(newValue)}`)
        .join('<br>')
      lines.push(`| ${course.code} | ${markdown(course.titleRaw ?? '')} | ${changes} |`)
    }
    lines.push('')
  }

  lines.push('### Cours modifiés — champs descriptifs longs', '')
  if (longModified.length === 0) {
    lines.push('Aucun champ descriptif long n’a changé.', '')
  } else {
    lines.push('| Code | Intitulé candidat | Champs modifiés |', '| --- | --- | --- |')
    lines.push(
      ...longModified.map(
        (course) => `| ${course.code} | ${markdown(course.titleRaw ?? '')} | ${course.longFields.map((field) => `\`${field}\``).join(', ')} |`,
      ),
      '',
    )
  }

  lines.push('### Changements d’offres', '')
  if (catalogueDiff.offerChanges.length === 0) {
    lines.push('Aucun rattachement à une offre n’a changé.', '')
  } else {
    lines.push('| Code | Intitulé | Offres ajoutées | Offres retirées |', '| --- | --- | --- | --- |')
    lines.push(
      ...catalogueDiff.offerChanges.map(
        (course) => `| ${course.code} | ${markdown(course.titleRaw ?? '')} | ${course.added.map(markdown).join('<br>') || '—'} | ${course.removed.map(markdown).join('<br>') || '—'} |`,
      ),
      '',
    )
  }

  lines.push('### Anomalies techniques', '')
  if (technicalAnomalies.length === 0) {
    lines.push('Aucune anomalie technique.', '')
  } else {
    lines.push('| Type | Code ou élément | Détail |', '| --- | --- | --- |')
    lines.push(
      ...technicalAnomalies.map(
        ({ type, code, detail }) => `| ${markdown(type)} | ${markdown(code ?? '—')} | ${markdown(detail)} |`,
      ),
      '',
    )
  }

  return lines
}

export function buildReferenceMonitoringLines(referenceMonitoring) {
  const { differences, summary } = referenceMonitoring
  const lines = [
    '## Surveillance des références validées',
    '',
    'Ces signaux sont informatifs et non bloquants. Ils ne modifient ni le ciblage ni le statut de validation.',
    '',
    '| Indicateur | Références |',
    '| --- | ---: |',
    `| Références contrôlées | ${summary.checked} |`,
    `| Références présentes | ${summary.present} |`,
    `| Références absentes | ${summary.absent} |`,
    `| Références identiques | ${summary.identical} |`,
    `| Revues métier prioritaires | ${summary.priorityBusinessReviews} |`,
    `| Revues métier | ${summary.businessReviews} |`,
    `| Références nécessitant une revue métier | ${summary.businessReviewReferences} |`,
    `| Informations à examiner | ${summary.informationToReview} |`,
    `| Enrichissements | ${summary.enrichments} |`,
    `| Évolutions contextuelles | ${summary.contextualEvolutions} |`,
    `| Différences typographiques | ${summary.typographicalDifferences} |`,
    '',
  ]

  if (differences.length === 0) {
    lines.push('Aucun écart ni absence détecté.', '')
  } else {
    lines.push(
      '| Code | Catégorie d’écart | Champ | Valeur de référence | Valeur actuelle |',
      '| --- | --- | --- | --- | --- |',
      ...differences.map(
        ({ code, category, field, referenceValue, currentValue }) =>
          `| ${code} | ${category} | \`${field}\` | ${markdownValue(referenceValue)} | ${markdownValue(currentValue)} |`,
      ),
      '',
    )
  }

  return lines
}

function buildReport(context) {
  const {
    catalogueDiff,
    durationSeconds,
    errors,
    indexData,
    integrityFailures,
    referenceMonitoring,
    sectionLabels,
    securityIssues,
    snapshot,
    snapshotBytes,
    snapshotHash,
    suppressedContactSections,
    technicalAnomalies,
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
    `- Empreinte SHA-256 du snapshot : \`${snapshotHash}\``,
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
    ...buildCatalogueDiffLines(catalogueDiff, technicalAnomalies),
    ...buildReferenceMonitoringLines(referenceMonitoring),
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
        hasOpenSession: parsed?.hasOpenSession ?? null,
        hasScheduledSession: parsed?.hasScheduledSession ?? null,
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
  const referenceMonitoring = await monitorOfficialReferences(snapshot)
  const officialSnapshot = JSON.parse(await readFile(officialSnapshotPath, 'utf8'))
  const catalogueDiff = compareCatalogueSnapshots(officialSnapshot, snapshot)
  const technicalAnomalies = [
    ...catalogueDiff.technicalAnomalies.filter(
      ({ type, code }) =>
        type !== 'fiche indisponible' ||
        !errors.some((error) => error.code === code),
    ),
    ...errors.map(({ code, error }) => ({
      type: 'récupération ou parsing',
      code,
      detail: error,
    })),
    ...indexData.unparsedCourseRows.map((detail) => ({
      type: 'ligne d’index non analysée',
      code: null,
      detail,
    })),
    ...indexData.duplicateOccurrencesWithinOffer.map(({ code, offer }) => ({
      type: 'occurrence répétée',
      code,
      detail: offer,
    })),
    ...integrityFailures.map((detail) => ({
      type: 'intégrité',
      code: null,
      detail,
    })),
  ]
  const snapshotText = `${JSON.stringify(snapshot, null, 2)}\n`
  const snapshotHash = createHash('sha256').update(snapshotText).digest('hex')
  const baseContext = {
    catalogueDiff,
    durationSeconds: (performance.now() - startedAt) / 1000,
    errors,
    indexData,
    integrityFailures,
    referenceMonitoring,
    sectionLabels,
    snapshot,
    snapshotBytes: Buffer.byteLength(snapshotText),
    snapshotHash,
    suppressedContactSections,
    technicalAnomalies,
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

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
