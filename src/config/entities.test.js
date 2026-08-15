import assert from 'node:assert/strict'
import test from 'node:test'
import { entities } from './entities.js'

const expectedEntityIds = ['OPE', 'DIP', 'PJ', 'POLICE', 'OCD', 'OCE']

test('le référentiel contient les six entités attendues', () => {
  assert.deepEqual(
    entities.map((entity) => entity.id),
    expectedEntityIds,
  )
})

test('les identifiants des entités sont uniques', () => {
  const ids = entities.map((entity) => entity.id)

  assert.equal(new Set(ids).size, ids.length)
})

test('chaque entité possède un intitulé non vide', () => {
  for (const entity of entities) {
    assert.equal(typeof entity.label, 'string')
    assert.notEqual(entity.label.trim(), '')
  }
})
