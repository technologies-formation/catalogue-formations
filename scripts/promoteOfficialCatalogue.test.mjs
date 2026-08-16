import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import {
  promoteCatalogue,
  sha256,
  validateCandidateReport,
  validateCandidateSnapshot,
} from './promoteOfficialCatalogue.mjs'

function course(overrides = {}) {
  return {
    code: 'TEST-001',
    sourceUrl: 'https://example.test/TEST-001.html',
    titleRaw: 'Cours de test',
    catalogueOffers: ['Offre A'],
    fetchStatus: 'ok',
    sourceSnapshotDate: '2026-08-16',
    ...overrides,
  }
}

function reportFor(snapshotText, { count = 1, date = '2026-08-16', anomalies = 0, hash } = {}) {
  return [
    '# Rapport candidat',
    '',
    `- Date du snapshot : ${date}`,
    `- Empreinte SHA-256 du snapshot : \`${hash ?? sha256(snapshotText)}\``,
    '',
    '| Indicateur | Valeur |',
    '| --- | ---: |',
    `| Cours dans le candidat | ${count} |`,
    `| Anomalies techniques | ${anomalies} |`,
    '',
  ].join('\n')
}

async function fixture() {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'catalogue-promotion-'))
  const paths = {
    candidateSnapshot: path.join(directory, 'candidate.json'),
    candidateReport: path.join(directory, 'candidate.md'),
    officialSnapshot: path.join(directory, 'official.json'),
    officialReport: path.join(directory, 'official.md'),
  }
  const candidateSnapshotText = `${JSON.stringify([course()], null, 2)}\n`
  const candidateReportText = reportFor(candidateSnapshotText)
  await Promise.all([
    writeFile(paths.candidateSnapshot, candidateSnapshotText),
    writeFile(paths.candidateReport, candidateReportText),
    writeFile(paths.officialSnapshot, 'ancien snapshot'),
    writeFile(paths.officialReport, 'ancien rapport'),
  ])
  return { directory, paths, candidateSnapshotText, candidateReportText }
}

test('valide un candidat minimal cohérent', () => {
  assert.deepEqual(validateCandidateSnapshot([course()]), {
    courseCount: 1,
    snapshotDate: '2026-08-16',
  })
})

test('refuse un candidat vide, un code dupliqué et une fiche indisponible', () => {
  assert.throws(() => validateCandidateSnapshot([]), /vide/)
  assert.throws(() => validateCandidateSnapshot([course(), course()]), /dupliqué/)
  assert.throws(
    () => validateCandidateSnapshot([course({ fetchStatus: 'unavailable' })]),
    /indisponible/,
  )
})

test('refuse catalogueOffers absent, vide ou dupliqué', () => {
  assert.throws(() => validateCandidateSnapshot([course({ catalogueOffers: null })]), /catalogueOffers/)
  assert.throws(() => validateCandidateSnapshot([course({ catalogueOffers: [] })]), /aucune offre/)
  assert.throws(
    () => validateCandidateSnapshot([course({ catalogueOffers: ['A', 'A'] })]),
    /dupliquée/,
  )
})

test('refuse des dates candidates absentes ou incohérentes', () => {
  assert.throws(
    () => validateCandidateSnapshot([course({ sourceSnapshotDate: null })]),
    /date de snapshot/,
  )
  assert.throws(
    () => validateCandidateSnapshot([course(), course({ code: 'TEST-002', sourceSnapshotDate: '2026-08-17' })]),
    /dates.*incohérentes/,
  )
})

test('refuse un rapport dont la date, le total ou l’empreinte diffère', () => {
  const snapshotText = `${JSON.stringify([course()])}\n`
  const expected = { courseCount: 1, snapshotDate: '2026-08-16', snapshotHash: sha256(snapshotText) }

  assert.throws(() => validateCandidateReport(reportFor(snapshotText, { date: '2026-08-17' }), expected), /Date incohérente/)
  assert.throws(() => validateCandidateReport(reportFor(snapshotText, { count: 2 }), expected), /Nombre de cours incohérent/)
  assert.throws(() => validateCandidateReport(reportFor(snapshotText, { hash: '0'.repeat(64) }), expected), /Empreinte SHA-256 incohérente/)
})

test('refuse un rapport contenant une anomalie technique', () => {
  const snapshotText = `${JSON.stringify([course()])}\n`
  assert.throws(
    () => validateCandidateReport(reportFor(snapshotText, { anomalies: 2 }), {
      courseCount: 1,
      snapshotDate: '2026-08-16',
      snapshotHash: sha256(snapshotText),
    }),
    /2 anomalie\(s\).*bloquante/,
  )
})

test('refuse la promotion sans confirmation et ne modifie aucun fichier', async (t) => {
  const data = await fixture()
  t.after(() => rm(data.directory, { recursive: true, force: true }))

  await assert.rejects(() => promoteCatalogue({ paths: data.paths }), /--confirm-date 2026-08-16/)
  assert.equal(await readFile(data.paths.officialSnapshot, 'utf8'), 'ancien snapshot')
  assert.equal(await readFile(data.paths.officialReport, 'utf8'), 'ancien rapport')
  assert.equal(await readFile(data.paths.candidateSnapshot, 'utf8'), data.candidateSnapshotText)
})

test('refuse une confirmation incorrecte sans modifier le snapshot officiel', async (t) => {
  const data = await fixture()
  t.after(() => rm(data.directory, { recursive: true, force: true }))

  await assert.rejects(
    () => promoteCatalogue({ paths: data.paths, confirmationDate: '2026-08-17' }),
    /--confirm-date 2026-08-16/,
  )
  assert.equal(await readFile(data.paths.officialSnapshot, 'utf8'), 'ancien snapshot')
})

test('promeut les deux artefacts, vérifie leur contenu puis supprime les candidats', async (t) => {
  const data = await fixture()
  t.after(() => rm(data.directory, { recursive: true, force: true }))
  const promotedAt = new Date('2026-08-16T12:00:00.000Z')

  const result = await promoteCatalogue({
    paths: data.paths,
    confirmationDate: '2026-08-16',
    promotedAt,
  })

  assert.equal(await readFile(data.paths.officialSnapshot, 'utf8'), data.candidateSnapshotText)
  const officialReport = await readFile(data.paths.officialReport, 'utf8')
  assert.match(officialReport, /Date et heure de promotion : 2026-08-16T12:00:00.000Z/)
  assert.match(officialReport, new RegExp(result.snapshotHash))
  await assert.rejects(() => readFile(data.paths.candidateSnapshot), /ENOENT/)
  await assert.rejects(() => readFile(data.paths.candidateReport), /ENOENT/)
})

test('refuse la promotion quand un artefact candidat manque', async (t) => {
  const data = await fixture()
  t.after(() => rm(data.directory, { recursive: true, force: true }))
  await rm(data.paths.candidateReport)

  await assert.rejects(
    () => promoteCatalogue({ paths: data.paths, confirmationDate: '2026-08-16' }),
    /Artefact candidat introuvable/,
  )
})
