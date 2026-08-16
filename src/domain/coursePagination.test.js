import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getPageCount,
  getPageResults,
  getVisiblePages,
  paginationReducer,
  RESULTS_PER_PAGE,
} from './coursePagination.js'

test('une page contient au maximum 20 résultats', () => {
  const results = Array.from({ length: 45 }, (_, index) => index + 1)

  assert.equal(RESULTS_PER_PAGE, 20)
  assert.equal(getPageResults(results, 1).length, 20)
  assert.equal(getPageResults(results, 3).length, 5)
})

test('le nombre de pages est calculé à partir du total des résultats', () => {
  assert.equal(getPageCount(0), 0)
  assert.equal(getPageCount(20), 1)
  assert.equal(getPageCount(21), 2)
  assert.equal(getPageCount(169), 9)
})

test('la navigation suivante et précédente respecte les pages limites', () => {
  assert.equal(paginationReducer(1, { type: 'previous', pageCount: 9 }), 1)
  assert.equal(paginationReducer(1, { type: 'next', pageCount: 9 }), 2)
  assert.equal(paginationReducer(9, { type: 'next', pageCount: 9 }), 9)
  assert.equal(paginationReducer(9, { type: 'previous', pageCount: 9 }), 8)
})

test('une modification de recherche ou de filtre revient à la page 1', () => {
  assert.equal(paginationReducer(7, { type: 'criteriaChanged' }), 1)
})

test('20 résultats ou moins ne nécessitent pas de pagination', () => {
  assert.equal(getPageCount(1) > 1, false)
  assert.equal(getPageCount(20) > 1, false)
})

test('les nombreuses pages sont condensées avec des ellipses', () => {
  assert.deepEqual(getVisiblePages(5, 9), [
    1,
    'ellipsis-start',
    4,
    5,
    6,
    'ellipsis-end',
    9,
  ])
})
