import { createHash } from 'node:crypto'
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const defaultPromotionPaths = {
  candidateSnapshot: path.join(projectRoot, 'reports', 'officialCatalogueSnapshot.candidate.json'),
  candidateReport: path.join(projectRoot, 'reports', 'catalogue-import-report.candidate.md'),
  officialSnapshot: path.join(projectRoot, 'src', 'data', 'officialCatalogueSnapshot.json'),
  officialReport: path.join(projectRoot, 'reports', 'catalogue-import-report.md'),
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

export function validateCandidateSnapshot(candidate) {
  if (!Array.isArray(candidate)) throw new Error('Le snapshot candidat doit être un tableau')
  if (candidate.length === 0) throw new Error('Le snapshot candidat est vide')

  const codes = new Set()
  const dates = new Set()
  for (const course of candidate) {
    if (!course || typeof course !== 'object') throw new Error('Une formation candidate est invalide')
    if (typeof course.code !== 'string' || course.code.trim() === '') {
      throw new Error('Une formation candidate ne possède pas de code valide')
    }
    if (codes.has(course.code)) throw new Error(`Code candidat dupliqué : ${course.code}`)
    codes.add(course.code)
    if (typeof course.titleRaw !== 'string' || course.titleRaw.trim() === '') {
      throw new Error(`${course.code}: intitulé absent`)
    }
    if (typeof course.sourceUrl !== 'string' || course.sourceUrl.trim() === '') {
      throw new Error(`${course.code}: URL source absente`)
    }
    if (!Array.isArray(course.catalogueOffers)) {
      throw new Error(`${course.code}: catalogueOffers absent ou invalide`)
    }
    if (course.catalogueOffers.length === 0) {
      throw new Error(`${course.code}: aucune offre dans catalogueOffers`)
    }
    if (course.catalogueOffers.some((offer) => typeof offer !== 'string' || offer.trim() === '')) {
      throw new Error(`${course.code}: offre vide ou invalide`)
    }
    if (new Set(course.catalogueOffers).size !== course.catalogueOffers.length) {
      throw new Error(`${course.code}: offre dupliquée dans catalogueOffers`)
    }
    if (course.fetchStatus !== 'ok') {
      throw new Error(`${course.code}: fiche indisponible (${String(course.fetchStatus)})`)
    }
    if (typeof course.sourceSnapshotDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(course.sourceSnapshotDate)) {
      throw new Error(`${course.code}: date de snapshot absente ou invalide`)
    }
    dates.add(course.sourceSnapshotDate)
  }

  if (dates.size !== 1) throw new Error('Les dates du snapshot candidat sont incohérentes')
  return { courseCount: candidate.length, snapshotDate: [...dates][0] }
}

function requiredReportValue(report, pattern, label) {
  const match = report.match(pattern)
  if (!match) throw new Error(`Rapport candidat invalide : ${label} absent`)
  return match[1]
}

export function validateCandidateReport(report, expected) {
  const reportDate = requiredReportValue(
    report,
    /^- Date du snapshot : (\d{4}-\d{2}-\d{2})$/m,
    'date du snapshot',
  )
  const reportHash = requiredReportValue(
    report,
    /^- Empreinte SHA-256 du snapshot : `([a-f0-9]{64})`$/m,
    'empreinte SHA-256',
  )
  const reportCourseCount = Number(
    requiredReportValue(
      report,
      /^\| Cours dans le candidat \| (\d+) \|$/m,
      'nombre de cours candidats',
    ),
  )
  const technicalAnomalies = Number(
    requiredReportValue(
      report,
      /^\| Anomalies techniques \| (\d+) \|$/m,
      'nombre d’anomalies techniques',
    ),
  )

  if (reportDate !== expected.snapshotDate) {
    throw new Error(`Date incohérente entre le candidat (${expected.snapshotDate}) et le rapport (${reportDate})`)
  }
  if (reportCourseCount !== expected.courseCount) {
    throw new Error(`Nombre de cours incohérent entre le candidat (${expected.courseCount}) et le rapport (${reportCourseCount})`)
  }
  if (reportHash !== expected.snapshotHash) {
    throw new Error('Empreinte SHA-256 incohérente entre le candidat et le rapport')
  }
  if (technicalAnomalies !== 0) {
    throw new Error(`Le rapport contient ${technicalAnomalies} anomalie(s) technique(s) bloquante(s)`)
  }
}

export async function promoteCatalogue({
  confirmationDate,
  paths = defaultPromotionPaths,
  promotedAt = new Date(),
} = {}) {
  let candidateSnapshotText
  let candidateReportText
  try {
    ;[candidateSnapshotText, candidateReportText] = await Promise.all([
      readFile(paths.candidateSnapshot, 'utf8'),
      readFile(paths.candidateReport, 'utf8'),
    ])
  } catch (error) {
    throw new Error(`Artefact candidat introuvable ou illisible : ${error.message}`)
  }

  let candidate
  try {
    candidate = JSON.parse(candidateSnapshotText)
  } catch (error) {
    throw new Error(`JSON candidat invalide : ${error.message}`)
  }

  const candidateMetadata = validateCandidateSnapshot(candidate)
  const snapshotHash = sha256(candidateSnapshotText)
  validateCandidateReport(candidateReportText, { ...candidateMetadata, snapshotHash })

  if (confirmationDate !== candidateMetadata.snapshotDate) {
    throw new Error(
      `Confirmation requise. Relancer avec : npm.cmd run promote:catalogue -- --confirm-date ${candidateMetadata.snapshotDate}`,
    )
  }

  const [previousOfficialSnapshot, previousOfficialReport] = await Promise.all([
    readFile(paths.officialSnapshot, 'utf8'),
    readFile(paths.officialReport, 'utf8'),
  ])
  const promotionTrace = [
    '',
    '## Promotion',
    '',
    `- Date et heure de promotion : ${promotedAt.toISOString()}`,
    `- Snapshot candidat validé : ${candidateMetadata.snapshotDate}`,
    `- Empreinte SHA-256 : \`${snapshotHash}\``,
    '- Promotion manuelle confirmée.',
    '',
  ].join('\n')
  const promotedReport = `${candidateReportText.trimEnd()}\n${promotionTrace}`

  try {
    await writeFile(paths.officialSnapshot, candidateSnapshotText, 'utf8')
    await writeFile(paths.officialReport, promotedReport, 'utf8')

    const [writtenSnapshot, writtenReport] = await Promise.all([
      readFile(paths.officialSnapshot, 'utf8'),
      readFile(paths.officialReport, 'utf8'),
    ])
    if (writtenSnapshot !== candidateSnapshotText || sha256(writtenSnapshot) !== snapshotHash) {
      throw new Error('Le snapshot officiel ne correspond pas exactement au candidat')
    }
    if (writtenReport !== promotedReport) {
      throw new Error('Le rapport officiel ne correspond pas au rapport promu')
    }
  } catch (error) {
    await Promise.all([
      writeFile(paths.officialSnapshot, previousOfficialSnapshot, 'utf8'),
      writeFile(paths.officialReport, previousOfficialReport, 'utf8'),
    ])
    throw error
  }

  await Promise.all([
    rm(paths.candidateSnapshot),
    rm(paths.candidateReport),
  ])

  return { ...candidateMetadata, snapshotHash, promotedAt: promotedAt.toISOString() }
}

function confirmationDateFromArgs(args) {
  const index = args.indexOf('--confirm-date')
  return index === -1 ? undefined : args[index + 1]
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  promoteCatalogue({ confirmationDate: confirmationDateFromArgs(process.argv.slice(2)) })
    .then((result) => {
      console.log(`Catalogue du ${result.snapshotDate} promu (${result.courseCount} cours).`)
      console.log(`SHA-256 : ${result.snapshotHash}`)
      console.log('Contrôles à lancer : npm.cmd test, npm.cmd run lint, npm.cmd run build, git diff --check')
    })
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
