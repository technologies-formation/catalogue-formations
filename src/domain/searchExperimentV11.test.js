import assert from 'node:assert/strict'
import test from 'node:test'
import officialCatalogueSnapshot from '../data/officialCatalogueSnapshot.json' with {
  type: 'json',
}
import { evaluateSearchBenchmark } from './searchBenchmark.js'
import { SEARCH_HOLDOUT } from './searchHoldout.js'
import {
  EXPERIMENTAL_QUERY_VARIANTS,
  searchCoursesV1,
} from './searchExperiment.js'
import { searchCoursesV11, tokenizeSearchV11 } from './searchExperimentV11.js'

const codes = (results) => results.map(({ course }) => course.code)

test('V1.1 réutilise le dictionnaire V1 sans l’enrichir', () => {
  assert.equal(Object.isFrozen(EXPERIMENTAL_QUERY_VARIANTS), true)
  assert.equal('powerpoint' in EXPERIMENTAL_QUERY_VARIANTS, false)
  assert.equal('orthographe' in EXPERIMENTAL_QUERY_VARIANTS, false)
  assert.equal('negociation' in EXPERIMENTAL_QUERY_VARIANTS, false)
})

test('V1.1 ignore les mots fonctionnels français génériques', () => {
  assert.deepEqual(tokenizeSearchV11('dans mes données avec mon équipe'), [
    'donnee',
    'equipe',
  ])
})

test('un terme discriminant dans le titre suffit sans bloquer sur le terme absent', () => {
  const powerpoint = codes(searchCoursesV11(officialCatalogueSnapshot, 'maîtriser PowerPoint'))
  const graphiques = codes(searchCoursesV11(officialCatalogueSnapshot, 'créer des graphiques'))

  assert.ok(powerpoint.slice(0, 5).includes('TRT1013'))
  assert.ok(powerpoint.slice(0, 5).includes('TRT1014'))
  assert.equal(graphiques[0], 'TRT1008')
})

test('V1.1 conserve la protection des acronymes courts', () => {
  const ia = codes(searchCoursesV11(officialCatalogueSnapshot, 'IA'))
  const si = codes(searchCoursesV11(officialCatalogueSnapshot, 'SI'))

  assert.ok(ia.length < 30)
  assert.ok(!ia.includes('OCD373'))
  assert.ok(si.length < 20)
  assert.ok(!si.includes('SEM-10455'))
})

test('V1.1 conserve les codes exacts et les acquis lexicaux de V1', () => {
  for (const query of ['FP173', 'SEM1108', 'TRT1005']) {
    assert.equal(codes(searchCoursesV11(officialCatalogueSnapshot, query))[0], query)
  }

  for (const [query, expected] of [
    ['prise de parole', 'SEM1108'],
    ['cybersécurité', 'PJ-0068'],
    ['tableur', 'TRT3000E'],
  ]) {
    assert.ok(codes(searchCoursesV11(officialCatalogueSnapshot, query)).slice(0, 10).includes(expected))
  }
})

test('V1.1 améliore le rappel initial sans dégrader V1', () => {
  const v1 = evaluateSearchBenchmark(officialCatalogueSnapshot, searchCoursesV1)
  const v11 = evaluateSearchBenchmark(officialCatalogueSnapshot, searchCoursesV11)

  assert.ok(v11.global.essentialRecallAt10 >= v1.global.essentialRecallAt10)
  assert.ok(v11.global.zeroResultRate <= v1.global.zeroResultRate)
})

test('V1.1 améliore nettement le rappel du corpus diagnostique', () => {
  const recallAt10 = (search) => {
    const measurements = SEARCH_HOLDOUT.filter(({ essential }) => essential.length > 0).map(
      ({ essential, query }) => {
        const top10 = new Set(codes(search(officialCatalogueSnapshot, query)).slice(0, 10))
        return essential.filter((code) => top10.has(code)).length / essential.length
      },
    )
    return measurements.reduce((sum, value) => sum + value, 0) / measurements.length
  }

  assert.ok(recallAt10(searchCoursesV11) > recallAt10(searchCoursesV1))
  assert.ok(recallAt10(searchCoursesV11) > 0.6)
})

test('les résultats V1.1 exposent une explication déterministe', () => {
  const [result] = searchCoursesV11(officialCatalogueSnapshot, 'créer des graphiques')

  assert.equal(result.course.code, 'TRT1008')
  assert.ok(result.score > 0)
  assert.equal(result.explanation.variant, 'literal')
  assert.ok(result.explanation.matchedTerms.some(({ token }) => token === 'graphique'))
})
