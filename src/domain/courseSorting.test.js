import assert from 'node:assert/strict'
import test from 'node:test'
import { getPageResults, paginationReducer } from './coursePagination.js'
import {
  DEFAULT_COURSE_SORT,
  sortCourses,
} from './courseSorting.js'

function course(code, title) {
  return { code, officialData: { titleRaw: title } }
}

const courses = [
  course('C-300', 'zèbre'),
  course('A-200', 'Éthique'),
  course('B-100', 'arbre'),
]

test('le tri Intitulé A-Z respecte le français, les accents et la casse', () => {
  assert.deepEqual(
    sortCourses(courses, DEFAULT_COURSE_SORT).map((item) => item.code),
    ['B-100', 'A-200', 'C-300'],
  )
})

test('le tri Intitulé Z-A inverse l’ordre alphabétique', () => {
  assert.deepEqual(
    sortCourses(courses, 'title-desc').map((item) => item.code),
    ['C-300', 'A-200', 'B-100'],
  )
})

test('le tri Code A-Z utilise le code existant', () => {
  assert.deepEqual(
    sortCourses(courses, 'code-asc').map((item) => item.code),
    ['A-200', 'B-100', 'C-300'],
  )
})

test('le tri Code Z-A inverse l’ordre des codes', () => {
  assert.deepEqual(
    sortCourses(courses, 'code-desc').map((item) => item.code),
    ['C-300', 'B-100', 'A-200'],
  )
})

test('le tri global est appliqué avant le découpage paginé', () => {
  const unorderedCourses = Array.from({ length: 25 }, (_, index) => {
    const number = String(25 - index).padStart(2, '0')
    return course(`C-${number}`, `Formation ${number}`)
  })
  const firstPage = getPageResults(
    sortCourses(unorderedCourses, 'title-asc'),
    1,
  )

  assert.equal(firstPage.length, 20)
  assert.equal(firstPage[0].code, 'C-01')
  assert.equal(firstPage[19].code, 'C-20')
})

test('un changement de tri revient en page 1 sans modifier les critères', () => {
  const criteria = Object.freeze({
    search: 'projet',
    domains: Object.freeze(['Gestion de projet']),
  })
  const sourceOrder = courses.map((item) => item.code)

  assert.equal(paginationReducer(4, { type: 'sortChanged' }), 1)
  assert.deepEqual(criteria, {
    search: 'projet',
    domains: ['Gestion de projet'],
  })
  assert.deepEqual(courses.map((item) => item.code), sourceOrder)
})
