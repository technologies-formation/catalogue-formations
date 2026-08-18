import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  buildCatalogueEmail,
  normalizeStatus,
  parseCatalogueReport,
  prepareCatalogueEmail,
  sendCatalogueUpdateEmail,
  smtpConfiguration,
} from './sendCatalogueUpdateEmail.mjs'

const report = [
  '# Rapport d’import',
  '',
  '- Date du snapshot : 2026-08-16',
  '',
  '| Indicateur | Valeur |',
  '| --- | ---: |',
  '| Cours dans le candidat | 1055 |',
  '| Cours ajoutés | 2 |',
  '| Cours supprimés | 3 |',
  '| Cours modifiés | 4 |',
  '| Cours dont les offres ont changé | 5 |',
  '| Anomalies techniques | 0 |',
  '| Références nécessitant une revue métier | 2 |',
  '',
].join('\n')

const metrics = parseCatalogueReport(report)
const smtpEnv = {
  SMTP_HOST: 'smtp.example.test',
  SMTP_PORT: '587',
  SMTP_USER: 'mailer',
  SMTP_PASSWORD: 'super-secret-password',
  MAIL_FROM: 'catalogue@example.test',
  MAIL_TO: 'recipient@example.test',
  CATALOGUE_STATUS: 'SUCCESS',
  ACTIONS_RUN_URL: 'https://github.example/actions/runs/123',
}

test('lit correctement les indicateurs du rapport', () => {
  assert.deepEqual(metrics, {
    date: '2026-08-16',
    courseCount: 1055,
    added: 2,
    removed: 3,
    modified: 4,
    offerChanges: 5,
    technicalAnomalies: 0,
    businessReviewReferences: 2,
  })
})

test('gère les statuts succès, aucun changement et alerte', () => {
  assert.equal(normalizeStatus('SUCCESS'), 'SUCCESS')
  assert.equal(normalizeStatus('AUCUN CHANGEMENT'), 'NO_CHANGE')
  assert.equal(normalizeStatus('ALERT'), 'ALERT')
  assert.match(buildCatalogueEmail({ status: 'SUCCESS', metrics }).subject, /SUCCÈS/)
  assert.match(buildCatalogueEmail({ status: 'NO_CHANGE', metrics }).subject, /AUCUN CHANGEMENT/)
  assert.match(buildCatalogueEmail({ status: 'ALERT', metrics }).subject, /ALERTE/)
})

test('un e-mail SUCCESS mentionne les références nécessitant une revue métier', () => {
  const email = buildCatalogueEmail({ status: 'SUCCESS', metrics })

  assert.match(email.subject, /SUCCÈS/)
  assert.match(email.text, /2 références validées nécessitent une revue métier/)
})

test('un e-mail NO_CHANGE mentionne les références nécessitant une revue métier', () => {
  const email = buildCatalogueEmail({ status: 'NO_CHANGE', metrics })

  assert.match(email.subject, /AUCUN CHANGEMENT/)
  assert.match(email.text, /2 références validées nécessitent une revue métier/)
})

test('un e-mail NO_CHANGE sans revue métier conserve son comportement actuel', () => {
  const email = buildCatalogueEmail({
    status: 'NO_CHANGE',
    metrics: { ...metrics, businessReviewReferences: 0 },
  })

  assert.match(email.subject, /AUCUN CHANGEMENT/)
  assert.doesNotMatch(email.text, /référence.*validée.*revue métier/)
})

test('une information à examiner seule ne produit pas de résumé de revue métier', () => {
  const email = buildCatalogueEmail({
    status: 'NO_CHANGE',
    metrics: { ...metrics, businessReviewReferences: 0, informationToReview: 1 },
  })

  assert.match(email.subject, /AUCUN CHANGEMENT/)
  assert.doesNotMatch(email.text, /revue métier/)
})

test('une revue métier ne transforme pas un succès en alerte', () => {
  const successEmail = buildCatalogueEmail({ status: 'SUCCESS', metrics })
  const alertEmail = buildCatalogueEmail({ status: 'ALERT', metrics })

  assert.doesNotMatch(successEmail.subject, /ALERTE/)
  assert.match(alertEmail.subject, /ALERTE/)
  assert.doesNotMatch(alertEmail.text, /références validées nécessitent une revue métier/)
})

test('reste préparable sans rapport ni pièce jointe', async () => {
  const email = await prepareCatalogueEmail({
    env: { CATALOGUE_STATUS: 'ALERT' },
    reportPath: path.join(os.tmpdir(), 'rapport-catalogue-absent.md'),
  })
  assert.deepEqual(email.attachments, [])
  assert.match(email.text, /Nombre de formations : indisponible/)
})

test('joint le rapport uniquement lorsqu’il existe', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'catalogue-email-'))
  const reportPath = path.join(directory, 'report.md')
  await writeFile(reportPath, report)
  try {
    const email = await prepareCatalogueEmail({ env: smtpEnv, reportPath })
    assert.deepEqual(email.attachments, [
      { filename: 'catalogue-import-report.candidate.md', path: reportPath },
    ])
  } finally {
    await rm(directory, { recursive: true })
  }
})

test('refuse les variables SMTP obligatoires manquantes', () => {
  assert.throws(() => smtpConfiguration({}), /SMTP_HOST.*SMTP_PASSWORD.*MAIL_TO/)
})

test('n’effectue aucun envoi SMTP réel et ne place pas les secrets dans le message', async () => {
  let transportConfiguration
  let sentMessage
  const result = await sendCatalogueUpdateEmail({
    env: smtpEnv,
    reportPath: path.join(os.tmpdir(), 'rapport-catalogue-absent.md'),
    createTransport(configuration) {
      transportConfiguration = configuration
      return {
        async sendMail(message) {
          sentMessage = message
        },
      }
    },
  })

  assert.deepEqual(result, { status: 'SUCCESS', attachmentIncluded: false })
  assert.equal(transportConfiguration.auth.pass, smtpEnv.SMTP_PASSWORD)
  const publicMessage = JSON.stringify(sentMessage)
  assert.ok(!publicMessage.includes(smtpEnv.SMTP_PASSWORD))
  assert.ok(!publicMessage.includes(smtpEnv.SMTP_USER))
})

test('masque les détails potentiellement sensibles d’une erreur SMTP', async () => {
  await assert.rejects(
    () =>
      sendCatalogueUpdateEmail({
        env: smtpEnv,
        reportPath: path.join(os.tmpdir(), 'rapport-catalogue-absent.md'),
        createTransport() {
          return {
            async sendMail() {
              throw new Error(`Connexion refusée pour ${smtpEnv.SMTP_USER}:${smtpEnv.SMTP_PASSWORD}`)
            },
          }
        },
      }),
    (error) => {
      assert.match(error.message, /Échec de l’envoi SMTP/)
      assert.ok(!error.message.includes(smtpEnv.SMTP_USER))
      assert.ok(!error.message.includes(smtpEnv.SMTP_PASSWORD))
      return true
    },
  )
})
