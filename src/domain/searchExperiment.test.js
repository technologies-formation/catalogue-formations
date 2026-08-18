import assert from 'node:assert/strict'
import test from 'node:test'
import { performance } from 'node:perf_hooks'
import officialCatalogueSnapshot from '../data/officialCatalogueSnapshot.json' with {
  type: 'json',
}
import {
  normalizeExperimentalSearchText,
  searchCoursesV0,
  searchCoursesV1,
  tokenizeExperimentalSearch,
} from './searchExperiment.js'
import {
  evaluateSearchBenchmark,
  SEARCH_BENCHMARK,
} from './searchBenchmark.js'

const codes = (results) => results.map(({ course, code }) => course?.code ?? code)

test('le benchmark fige exactement 36 requêtes réparties entre A, B et C', () => {
  assert.equal(SEARCH_BENCHMARK.length, 36)
  assert.deepEqual(
    ['A', 'B', 'C'].map(
      (level) => SEARCH_BENCHMARK.filter((entry) => entry.level === level).length,
    ),
    [18, 14, 4],
  )
})

test('V0 reproduit la recherche actuelle sur le code et le titre', () => {
  assert.equal(searchCoursesV0(officialCatalogueSnapshot, 'IA').length, 118)
  assert.equal(searchCoursesV0(officialCatalogueSnapshot, 'prise de parole').length, 0)
  assert.deepEqual(codes(searchCoursesV0(officialCatalogueSnapshot, 'TRT1005')), ['TRT1005'])
})

test('la normalisation V1 homogénéise accents, apostrophes, tirets et espaces', () => {
  assert.equal(
    normalizeExperimentalSearchText('  L’Éthique—dans  l’administration  '),
    'l ethique dans l administration',
  )
  assert.deepEqual(tokenizeExperimentalSearch('Gérer les conflits'), ['gerer', 'conflit'])
})

test('IA et SI sont recherchés comme des mots complets', () => {
  const ia = codes(searchCoursesV1(officialCatalogueSnapshot, 'IA'))
  const si = codes(searchCoursesV1(officialCatalogueSnapshot, 'SI'))

  assert.ok(ia.length < 30)
  assert.ok(ia.includes('SEM-10349'))
  assert.ok(!ia.includes('OCD373'))
  assert.ok(si.length < 20)
  assert.ok(si.includes('PJ-0080'))
  assert.ok(!si.includes('OCD012'))
})

test('ethique et éthique donnent exactement les mêmes résultats', () => {
  assert.deepEqual(
    codes(searchCoursesV1(officialCatalogueSnapshot, 'ethique')),
    codes(searchCoursesV1(officialCatalogueSnapshot, 'éthique')),
  )
})

test('V1 traite les variantes qualitatives prioritaires', () => {
  const expectations = [
    ['gérer un conflit', 'SEM1199'],
    ['prise de parole', 'SEM1108'],
    ['tableur', 'TRT3000E'],
    ['nouvel employé', 'DIP-002'],
  ]

  for (const [query, expectedCode] of expectations) {
    assert.ok(
      codes(searchCoursesV1(officialCatalogueSnapshot, query)).slice(0, 10).includes(expectedCode),
      `${expectedCode} doit apparaître dans le top 10 pour « ${query} »`,
    )
  }
})

test('V1 améliore les métriques principales du benchmark sans apprentissage automatique', () => {
  const v0 = evaluateSearchBenchmark(officialCatalogueSnapshot, searchCoursesV0)
  const v1 = evaluateSearchBenchmark(officialCatalogueSnapshot, searchCoursesV1)

  assert.ok(v1.global.zeroResultRate < v0.global.zeroResultRate)
  assert.ok(v1.global.essentialRecallAt10 > v0.global.essentialRecallAt10)
  assert.ok(v1.global.usefulPrecisionAt5 > v0.global.usefulPrecisionAt5)
  assert.ok(v1.global.meanFirstEssentialRank < v0.global.meanFirstEssentialRank)
})

test('le benchmark V0/V1 reste rapide sur le snapshot actuel', () => {
  const startedAt = performance.now()
  evaluateSearchBenchmark(officialCatalogueSnapshot, searchCoursesV0)
  evaluateSearchBenchmark(officialCatalogueSnapshot, searchCoursesV1)
  const duration = performance.now() - startedAt

  assert.ok(duration < 5_000, `le benchmark a pris ${duration.toFixed(1)} ms`)
})
