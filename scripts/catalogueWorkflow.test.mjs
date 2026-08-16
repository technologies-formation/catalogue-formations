import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import {
  allowedCommitFiles,
  assertAllowedCommitFiles,
  determineCatalogueAction,
  determineNotificationStatus,
} from './catalogueWorkflow.mjs'

const unchangedMetrics = { added: 0, removed: 0, modified: 0, offerChanges: 0, technicalAnomalies: 0 }

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

test('le workflow reste manuel et exclut add global, force push et schedule', async () => {
  const workflow = await readFile(new URL('../.github/workflows/update-catalogue.yml', import.meta.url), 'utf8')
  assert.match(workflow, /workflow_dispatch:/)
  assert.doesNotMatch(workflow, /^\s*schedule:/m)
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
