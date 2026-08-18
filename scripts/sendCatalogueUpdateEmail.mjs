import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultReportPath = path.join(projectRoot, 'reports', 'catalogue-import-report.candidate.md')

const statusLabels = {
  SUCCESS: 'SUCCÈS',
  NO_CHANGE: 'AUCUN CHANGEMENT',
  ALERT: 'ALERTE',
}

function reportNumber(report, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = report.match(new RegExp(`^\\| ${escapedLabel} \\| (\\d+) \\|$`, 'm'))
  return match ? Number(match[1]) : null
}

export function parseCatalogueReport(report) {
  const date = report.match(/^- Date du snapshot : (\d{4}-\d{2}-\d{2})$/m)?.[1] ?? null
  return {
    date,
    courseCount: reportNumber(report, 'Cours dans le candidat'),
    added: reportNumber(report, 'Cours ajoutés'),
    removed: reportNumber(report, 'Cours supprimés'),
    modified: reportNumber(report, 'Cours modifiés'),
    offerChanges: reportNumber(report, 'Cours dont les offres ont changé'),
    technicalAnomalies: reportNumber(report, 'Anomalies techniques'),
    businessReviewReferences: reportNumber(
      report,
      'Références nécessitant une revue métier',
    ),
  }
}

export function normalizeStatus(value) {
  const status = String(value ?? '').trim().toUpperCase().replaceAll(' ', '_')
  if (status === 'SUCCÈS' || status === 'SUCCESS') return 'SUCCESS'
  if (status === 'AUCUN_CHANGEMENT' || status === 'NO_CHANGE') return 'NO_CHANGE'
  if (status === 'ALERTE' || status === 'ALERT' || status === 'FAILURE') return 'ALERT'
  throw new Error('CATALOGUE_STATUS doit valoir SUCCESS, NO_CHANGE ou ALERT')
}

export function smtpConfiguration(env) {
  const requiredNames = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'MAIL_FROM',
    'MAIL_TO',
  ]
  const missing = requiredNames.filter((name) => !env[name]?.trim())
  if (missing.length > 0) {
    throw new Error(`Variables d’environnement obligatoires manquantes : ${missing.join(', ')}`)
  }

  const port = Number(env.SMTP_PORT)
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('SMTP_PORT doit être un entier compris entre 1 et 65535')
  }
  if (env.SMTP_SECURE && !['true', 'false'].includes(env.SMTP_SECURE.toLowerCase())) {
    throw new Error('SMTP_SECURE doit valoir true ou false')
  }

  return {
    transport: {
      host: env.SMTP_HOST,
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE.toLowerCase() === 'true' : port === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
      logger: false,
      debug: false,
    },
    from: env.MAIL_FROM,
    to: env.MAIL_TO,
  }
}

function displayMetric(value) {
  return value === null ? 'indisponible' : String(value)
}

export function buildCatalogueEmail({ status, metrics, runUrl, now = new Date(), attachmentPath }) {
  const label = statusLabels[status]
  if (!label) throw new Error('Statut de catalogue invalide')

  const lines = [
    `Statut : ${label}`,
    `Date et heure : ${now.toISOString()}`,
    `Date du catalogue : ${metrics.date ?? 'indisponible'}`,
    `Nombre de formations : ${displayMetric(metrics.courseCount)}`,
    `Ajouts : ${displayMetric(metrics.added)}`,
    `Suppressions : ${displayMetric(metrics.removed)}`,
    `Modifications : ${displayMetric(metrics.modified)}`,
    `Changements d’offres : ${displayMetric(metrics.offerChanges)}`,
    `Anomalies techniques : ${displayMetric(metrics.technicalAnomalies)}`,
    ...(['SUCCESS', 'NO_CHANGE'].includes(status) && metrics.businessReviewReferences > 0
      ? [
          `${metrics.businessReviewReferences} référence${metrics.businessReviewReferences > 1 ? 's' : ''} validée${metrics.businessReviewReferences > 1 ? 's' : ''} nécessite${metrics.businessReviewReferences > 1 ? 'nt' : ''} une revue métier`,
        ]
      : []),
    `Exécution GitHub Actions : ${runUrl || 'indisponible'}`,
  ]

  return {
    subject: `[Catalogue des formations] ${label}`,
    text: lines.join('\n'),
    attachments: attachmentPath
      ? [{ filename: 'catalogue-import-report.candidate.md', path: attachmentPath }]
      : [],
  }
}

export async function prepareCatalogueEmail({ env = process.env, reportPath = defaultReportPath } = {}) {
  const status = normalizeStatus(env.CATALOGUE_STATUS)
  let report = null
  let attachmentPath = null
  try {
    await access(reportPath)
    report = await readFile(reportPath, 'utf8')
    attachmentPath = reportPath
  } catch {
    // Une alerte doit rester envoyable lorsque l’import échoue avant la création du rapport.
  }

  const metrics = report
    ? parseCatalogueReport(report)
    : {
        date: null,
        courseCount: null,
        added: null,
        removed: null,
        modified: null,
        offerChanges: null,
        technicalAnomalies: null,
        businessReviewReferences: null,
      }

  return buildCatalogueEmail({
    status,
    metrics,
    runUrl: env.ACTIONS_RUN_URL,
    attachmentPath,
  })
}

export async function sendCatalogueUpdateEmail({
  env = process.env,
  reportPath = defaultReportPath,
  createTransport = nodemailer.createTransport,
} = {}) {
  const smtp = smtpConfiguration(env)
  const message = await prepareCatalogueEmail({ env, reportPath })
  const transporter = createTransport(smtp.transport)
  try {
    await transporter.sendMail({ from: smtp.from, to: smtp.to, ...message })
  } catch {
    throw new Error('Échec de l’envoi SMTP du rapport de catalogue')
  }
  return { status: normalizeStatus(env.CATALOGUE_STATUS), attachmentIncluded: message.attachments.length > 0 }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  sendCatalogueUpdateEmail()
    .then(({ status, attachmentIncluded }) => {
      console.log(`Courriel catalogue envoyé (${status}, pièce jointe : ${attachmentIncluded ? 'oui' : 'non'}).`)
    })
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
