import assert from 'node:assert/strict'
import test from 'node:test'
import { personnelCategories } from './personnelCategories.js'

const expectedCategoryIds = ['PAT', 'PE', 'POL', 'PEN', 'MAG', 'AUTRES']

test('le référentiel contient les six catégories attendues', () => {
  assert.deepEqual(
    personnelCategories.map((category) => category.id),
    expectedCategoryIds,
  )
})

test('les identifiants des catégories sont uniques', () => {
  const ids = personnelCategories.map((category) => category.id)

  assert.equal(new Set(ids).size, ids.length)
})

test('chaque catégorie possède un intitulé non vide', () => {
  for (const category of personnelCategories) {
    assert.equal(typeof category.label, 'string')
    assert.notEqual(category.label.trim(), '')
  }
})
