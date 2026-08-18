import assert from 'node:assert/strict'
import test from 'node:test'
import officialCatalogueSnapshot from '../data/officialCatalogueSnapshot.json' with { type: 'json' }
import { EXPERIMENTAL_QUERY_VARIANTS } from './searchExperiment.js'
import { explainSearchV12, searchCoursesV12 } from './searchExperimentV12.js'

const codes = (results) => results.map(({ course }) => course.code)

test('les requêtes de benchmark conservent leurs caractères UTF-8', () => {
  const queries = ['équipe', 'réception', 'éthique', 'numérique', 'l’équipe', 'risques – projet']
  const encoder = new TextEncoder()
  const decoder = new TextDecoder('utf-8', { fatal: true })

  for (const query of queries) {
    const roundTrip = decoder.decode(encoder.encode(query))
    assert.equal(roundTrip, query)
    assert.equal(roundTrip.includes('?'), false)
  }
})

test('V1.2 réutilise le dictionnaire V1 sans aucun enrichissement', () => {
  assert.equal(Object.isFrozen(EXPERIMENTAL_QUERY_VARIANTS), true)
  for (const forbidden of ['python', 'publipostage', 'feedback', 'carriere', 'document long']) {
    assert.equal(forbidden in EXPERIMENTAL_QUERY_VARIANTS, false)
  }
})

test('V1.2 conserve les acquis lexicaux solides', () => {
  for (const query of ['FP173', 'SEM1108', 'TRT1005']) {
    assert.equal(codes(searchCoursesV12(officialCatalogueSnapshot, query))[0], query)
  }
  for (const [query, expected] of [
    ['excel', 'TRT1005'], ['IA', 'SEM-P1575'], ['SI', 'PJ-0068'],
    ['tableur', 'TRT3000E'], ['prise de parole', 'SEM1108'],
    ['cybersécurité', 'PJ-0068'], ['maîtriser PowerPoint', 'TRT1013'],
    ['créer des graphiques', 'TRT1008'], ['préparer le budget annuel de mon service', 'SEM1086'],
    ['rédiger le compte rendu d’une séance', 'SEM0631'],
  ]) {
    assert.ok(codes(searchCoursesV12(officialCatalogueSnapshot, query)).slice(0, 10).includes(expected), `${query} doit retrouver ${expected}`)
  }
})

test('V1.2 sait s’abstenir quand un terme important est absent', () => {
  assert.deepEqual(codes(searchCoursesV12(officialCatalogueSnapshot, 'développer une application en Python')), [])
  assert.deepEqual(codes(searchCoursesV12(officialCatalogueSnapshot, 'progresser professionnellement')), [])
})

test('un mot générique isolé ne constitue pas une preuve minimale', () => {
  const result = explainSearchV12(officialCatalogueSnapshot, 'développer une application en Python')
  const moodle = result.rejected.find(({ course }) => course.code === 'SEM-10912')
  assert.ok(moodle)
  assert.equal(moodle.explanation.decision, 'REJETE')
  assert.ok(moodle.explanation.missingImportantTerms.some(({ token }) => token === 'python'))
  assert.ok(moodle.explanation.informativeCoverage < 0.68)
})

test('l’explication expose masse, IDF, champs, couverture, seuil et décision', () => {
  const result = explainSearchV12(officialCatalogueSnapshot, 'préparer le budget annuel de mon service')
  const budget = result.accepted.find(({ course }) => course.code === 'SEM1086')
  assert.ok(budget)
  assert.ok(budget.explanation.totalInformativeMass > 0)
  assert.ok(budget.explanation.coveredInformativeMass > 0)
  assert.ok(budget.explanation.matchedTerms.every(({ idf, fields }) => idf > 0 && fields.length > 0))
  assert.ok(budget.explanation.appliedThreshold >= result.thresholds.absolute)
  assert.equal(budget.explanation.decision, 'ACCEPTE')
})

test('V1.2 ne masque pas le bruit par une limite arbitraire de résultats', () => {
  const results = searchCoursesV12(officialCatalogueSnapshot, 'administration')
  assert.ok(results.length > 0)
  assert.equal(results.length, explainSearchV12(officialCatalogueSnapshot, 'administration').accepted.length)
})
