import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  MAX_AUTOMATIC_CATALOGUE_DROP_RATIO,
  allowedCommitFiles,
  assessCatalogueVolume,
  assertAllowedCommitFiles,
  determineCatalogueAction,
  determineNotificationStatus,
  validateWorkflowCandidate,
} from './catalogueWorkflow.mjs'
import { sha256 } from './promoteOfficialCatalogue.mjs'

const unchangedMetrics = { added: 0, removed: 0, modified: 0, offerChanges: 0, technicalAnomalies: 0 }

function volumeAssessment(officialCount, candidateCount, allowLargeCatalogueDrop = false) {
  return assessCatalogueVolume({ officialCount, candidateCount, allowLargeCatalogueDrop })
}

function candidateCourse(index, sourceSnapshotDate = '2026-08-21') {
  return {
    code: `TEST-${String(index).padStart(3, '0')}`,
    sourceUrl: `https://example.test/TEST-${index}.html`,
    titleRaw: `Cours ${index}`,
    catalogueOffers: ['Offre A'],
    fetchStatus: 'ok',
    sourceSnapshotDate,
  }
}

function candidateReport(snapshotText, count) {
  return [
    '# Rapport candidat',
    '',
    '- Date du snapshot : 2026-08-21',
    `- Empreinte SHA-256 du snapshot : \`${sha256(snapshotText)}\``,
    '',
    '| Indicateur | Valeur |',
    '| --- | ---: |',
    `| Cours dans le candidat | ${count} |`,
    '| Cours ajoutés | 0 |',
    '| Cours supprimés | 1 |',
    '| Cours modifiés | 0 |',
    '| Cours dont les offres ont changé | 0 |',
    '| Anomalies techniques | 0 |',
    '',
  ].join('\n')
}

test('dry_run=true conserve les contrôles sans autoriser la publication', () => {
  assert.deepEqual(determineCatalogueAction({ dryRun: true, metrics: { ...unchangedMetrics, added: 1 } }), {
    hasChanges: true,
    shouldPublish: false,
    successfulStatus: 'SUCCESS',
  })
})

test('dry_run=false sans changement ne publie rien et notifie AUCUN CHANGEMENT', () => {
  assert.deepEqual(determineCatalogueAction({ dryRun: false, metrics: unchangedMetrics }), {
    hasChanges: false,
    shouldPublish: false,
    successfulStatus: 'NO_CHANGE',
  })
  assert.equal(determineNotificationStatus({ dryRun: false, hasChanges: false, validationResult: 'success', publicationResult: 'skipped' }), 'NO_CHANGE')
})

test('dry_run=false avec changement autorise la publication après les contrôles', () => {
  const decision = determineCatalogueAction({ dryRun: false, metrics: { ...unchangedMetrics, modified: 2 } })
  assert.equal(decision.shouldPublish, true)
})

test('une anomalie technique bloque la décision de publication', () => {
  assert.throws(() => determineCatalogueAction({ dryRun: false, metrics: { ...unchangedMetrics, technicalAnomalies: 1 } }), /1 anomalie/)
})

test('le seuil automatique provisoire est fixé à 5 %', () => {
  assert.equal(MAX_AUTOMATIC_CATALOGUE_DROP_RATIO, 0.05)
})

test('autorise une hausse, un volume identique et les petites baisses', () => {
  assert.equal(volumeAssessment(1_057, 1_058).largeDrop, false)
  assert.equal(volumeAssessment(1_057, 1_057).largeDrop, false)
  assert.equal(volumeAssessment(1_057, 1_056).largeDrop, false)
  assert.equal(volumeAssessment(1_057, 1_010).largeDrop, false)
})

test('bloque une baisse exactement égale à 5 % sans dérogation', () => {
  assert.throws(() => volumeAssessment(1_000, 950), /Chute anormale.*5\.00 %/)
})

test('bloque les baisses supérieures au seuil et les chutes massives', () => {
  assert.throws(() => volumeAssessment(1_057, 900), /Chute anormale/)
  assert.throws(() => volumeAssessment(1_057, 400), /Chute anormale/)
})

test('autorise une baisse exceptionnelle après dérogation humaine explicite', () => {
  const result = volumeAssessment(1_057, 400, true)
  assert.equal(result.largeDrop, true)
  assert.ok(result.dropRatio > 0.6)
})

test('refuse les volumes officiels ou candidats invalides', () => {
  assert.throws(() => volumeAssessment(0, 1), /snapshot officiel/)
  assert.throws(() => volumeAssessment(10, 0), /snapshot candidat/)
})

test('un blocage de volume laisse le snapshot officiel inchangé', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'catalogue-volume-guard-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const paths = {
    snapshotPath: path.join(directory, 'candidate.json'),
    reportPath: path.join(directory, 'candidate.md'),
    officialSnapshotPath: path.join(directory, 'official.json'),
  }
  const officialSnapshot = Array.from({ length: 20 }, (_, index) => candidateCourse(index))
  const candidate = Array.from({ length: 19 }, (_, index) => candidateCourse(index))
  const snapshotText = `${JSON.stringify(candidate, null, 2)}\n`
  const officialSnapshotText = `${JSON.stringify(officialSnapshot, null, 2)}\n`
  await Promise.all([
    writeFile(paths.snapshotPath, snapshotText),
    writeFile(paths.reportPath, candidateReport(snapshotText, candidate.length)),
    writeFile(paths.officialSnapshotPath, officialSnapshotText),
  ])

  await assert.rejects(
    () => validateWorkflowCandidate({ dryRun: false, ...paths }),
    /Chute anormale.*5\.00 %/,
  )
  assert.equal(await readFile(paths.officialSnapshotPath, 'utf8'), officialSnapshotText)
  assert.equal(await readFile(paths.snapshotPath, 'utf8'), snapshotText)
  assert.equal(await readFile(paths.reportPath, 'utf8'), candidateReport(snapshotText, candidate.length))
})

test('un échec du job de publication produit une alerte', () => {
  assert.equal(determineNotificationStatus({ dryRun: false, hasChanges: true, validationResult: 'success', publicationResult: 'failure' }), 'ALERT')
})

test('un échec de validation produit une alerte', () => {
  assert.equal(determineNotificationStatus({ dryRun: true, hasChanges: false, validationResult: 'failure', publicationResult: 'skipped' }), 'ALERT')
})

test('accepte uniquement les deux fichiers de données autorisés au commit', () => {
  assert.doesNotThrow(() => assertAllowedCommitFiles([...allowedCommitFiles].reverse()))
  assert.throws(() => assertAllowedCommitFiles([allowedCommitFiles[0]]), /non autorisés/)
  assert.throws(() => assertAllowedCommitFiles([...allowedCommitFiles, 'package.json']), /package\.json/)
})

test('le workflow conserve le lancement manuel et planifie le mode réel quotidien', async () => {
  const workflow = await readFile(new URL('../.github/workflows/update-catalogue.yml', import.meta.url), 'utf8')
  assert.match(workflow, /workflow_dispatch:/)
  assert.match(workflow, /^\s*schedule:$/m)
  assert.match(workflow, /cron: '7 5 \* \* \*'/)
  assert.match(workflow, /timezone: 'Europe\/Zurich'/)
  assert.equal(
    workflow.match(/DRY_RUN: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\.dry_run \|\| false \}\}/g)?.length,
    2,
  )
  assert.match(workflow, /allow_large_catalogue_drop:[\s\S]*default: false[\s\S]*type: boolean/)
  assert.match(
    workflow,
    /ALLOW_LARGE_CATALOGUE_DROP: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\.allow_large_catalogue_drop \|\| false \}\}/,
  )
  assert.match(
    workflow,
    /- name: Upload candidate snapshot\s+if: \$\{\{ always\(\) \}\}/,
  )
  assert.match(
    workflow,
    /if: \$\{\{ needs\.validate\.outputs\.has_changes == 'true' && \(github\.event_name == 'schedule' \|\| !inputs\.dry_run\) \}\}/,
  )
  assert.doesNotMatch(workflow, /git add \.|git push --force/)
  assert.match(workflow, /git add -- src\/data\/officialCatalogueSnapshot\.json reports\/catalogue-import-report\.md/)
  const testsIndex = workflow.indexOf('- name: Run tests after promotion')
  const buildIndex = workflow.indexOf('- name: Build application after promotion')
  const diffIndex = workflow.indexOf('- name: Check promoted diff')
  const commitIndex = workflow.indexOf('- name: Commit promoted data only')
  const pushIndex = workflow.indexOf('- name: Push promoted data')
  assert.ok([testsIndex, buildIndex, diffIndex, commitIndex, pushIndex].every((index) => index >= 0))
  assert.ok(testsIndex < commitIndex && buildIndex < commitIndex && diffIndex < commitIndex)
  assert.ok(commitIndex < pushIndex)
})
