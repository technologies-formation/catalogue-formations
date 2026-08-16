import { appendFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCatalogueReport } from './sendCatalogueUpdateEmail.mjs'
import { sha256, validateCandidateReport, validateCandidateSnapshot } from './promoteOfficialCatalogue.mjs'

export const allowedCommitFiles = [
  'reports/catalogue-import-report.md',
  'src/data/officialCatalogueSnapshot.json',
]

function booleanEnvironmentValue(value, name) {
  if (value === 'true' || value === true) return true
  if (value === 'false' || value === false) return false
  throw new Error(`${name} doit valoir true ou false`)
}

export function determineCatalogueAction({ dryRun, metrics }) {
  if (metrics.technicalAnomalies === null || metrics.technicalAnomalies === undefined) {
    throw new Error('Le nombre d’anomalies techniques est absent')
  }
  if (metrics.technicalAnomalies !== 0) {
    throw new Error(`Le rapport contient ${metrics.technicalAnomalies} anomalie(s) technique(s)`)
  }
  const comparedFields = ['added', 'removed', 'modified', 'offerChanges']
  if (comparedFields.some((field) => !Number.isInteger(metrics[field]) || metrics[field] < 0)) {
    throw new Error('Le rapport différentiel ne contient pas tous les indicateurs requis')
  }
  const hasChanges = comparedFields.some((field) => metrics[field] > 0)
  return {
    hasChanges,
    shouldPublish: !dryRun && hasChanges,
    successfulStatus: hasChanges ? 'SUCCESS' : 'NO_CHANGE',
  }
}

export function determineNotificationStatus({ dryRun, hasChanges, validationResult, publicationResult }) {
  if (validationResult !== 'success') return 'ALERT'
  if (!dryRun && hasChanges && publicationResult !== 'success') return 'ALERT'
  return hasChanges ? 'SUCCESS' : 'NO_CHANGE'
}

export function assertAllowedCommitFiles(files) {
  const normalized = [...files].map((file) => file.replaceAll('\\', '/')).sort()
  if (
    normalized.length !== allowedCommitFiles.length ||
    normalized.some((file, index) => file !== allowedCommitFiles[index])
  ) {
    throw new Error(`Fichiers modifiés non autorisés pour le commit : ${normalized.join(', ') || 'aucun'}`)
  }
}

export async function validateWorkflowCandidate({
  dryRun,
  snapshotPath = 'reports/officialCatalogueSnapshot.candidate.json',
  reportPath = 'reports/catalogue-import-report.candidate.md',
} = {}) {
  const [snapshotText, report] = await Promise.all([
    readFile(snapshotPath, 'utf8'),
    readFile(reportPath, 'utf8'),
  ])
  const candidate = JSON.parse(snapshotText)
  const metadata = validateCandidateSnapshot(candidate)
  validateCandidateReport(report, { ...metadata, snapshotHash: sha256(snapshotText) })
  const metrics = parseCatalogueReport(report)
  return { ...metadata, metrics, ...determineCatalogueAction({ dryRun, metrics }) }
}

async function writeOutputs(outputs) {
  if (!process.env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT est absent')
  const lines = Object.entries(outputs).map(([name, value]) => `${name}=${value}`).join('\n')
  await appendFile(process.env.GITHUB_OUTPUT, `${lines}\n`)
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const notificationMode = process.argv.includes('--notification-status')
  const operation = notificationMode
    ? writeOutputs({
        status: determineNotificationStatus({
          dryRun: booleanEnvironmentValue(process.env.DRY_RUN, 'DRY_RUN'),
          hasChanges: process.env.HAS_CHANGES === 'true',
          validationResult: process.env.VALIDATION_RESULT,
          publicationResult: process.env.PUBLICATION_RESULT,
        }),
      })
    : validateWorkflowCandidate({ dryRun: booleanEnvironmentValue(process.env.DRY_RUN, 'DRY_RUN') })
        .then(async (result) => {
          await writeOutputs({ has_changes: result.hasChanges, snapshot_date: result.snapshotDate })
          console.log(`${result.courseCount} formations candidates valides.`)
          console.log(result.hasChanges ? 'Des évolutions métier sont détectées.' : 'Aucun changement métier détecté.')
        })

  operation.catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
