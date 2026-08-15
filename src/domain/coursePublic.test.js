import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getCoursePublicValue,
  getPublicFacetOptions,
  matchesPublicFacet,
  PUBLIC_NOT_PROVIDED,
} from './coursePublic.js'

function course(publicValue) {
  return { officialData: { publicValue } }
}

test('un Public renseigné conserve exactement la valeur source', () => {
  assert.equal(getCoursePublicValue('Personnel administratif'), 'Personnel administratif')
})

test('un Public vide, null ou absent devient Non renseigné', () => {
  assert.equal(getCoursePublicValue(''), PUBLIC_NOT_PROVIDED)
  assert.equal(getCoursePublicValue('   '), PUBLIC_NOT_PROVIDED)
  assert.equal(getCoursePublicValue(null), PUBLIC_NOT_PROVIDED)
  assert.equal(getCoursePublicValue(undefined), PUBLIC_NOT_PROVIDED)
})

test('Non renseigné apparaît dans les options quand un cours correspondant existe', () => {
  const options = getPublicFacetOptions([
    course('Personnel administratif'),
    course(PUBLIC_NOT_PROVIDED),
  ])

  assert.ok(options.includes(PUBLIC_NOT_PROVIDED))
})

test('filtrer sur Non renseigné retourne uniquement les cours concernés', () => {
  const courses = [
    course('Personnel administratif'),
    course(PUBLIC_NOT_PROVIDED),
    course(PUBLIC_NOT_PROVIDED),
  ]

  assert.deepEqual(
    courses.filter((item) => matchesPublicFacet(item, [PUBLIC_NOT_PROVIDED])),
    [courses[1], courses[2]],
  )
})
