import assert from 'node:assert/strict'
import test from 'node:test'
import { demoCourses } from '../data/demoCourses.js'
import { matchesProfile, profiles } from './profileRules.js'

const matchingCases = {
  PAT: ['TRT-501-DEMO', 'SEM202-DEMO'],
  PE: ['CO-101-DEMO', 'SEM-122-DEMO', 'EP-100', 'PO-100', 'OMP-100'],
  POL: ['FP204-DEMO'],
  PEN: ['OCD315-DEMO'],
  PJ: ['PJ-410-DEMO'],
}

test('chaque profil reconnaît tous ses préfixes autorisés', () => {
  for (const [profileCode, courseCodes] of Object.entries(matchingCases)) {
    for (const courseCode of courseCodes) {
      assert.equal(matchesProfile(courseCode, profileCode), true)
    }
  }
})

test('les limites des règles excluent les codes non conformes', () => {
  const nonMatchingCases = [
    ['SEM-122-DEMO', 'PAT'],
    ['SEM202-DEMO', 'PE'],
    ['CO101-DEMO', 'PE'],
    ['F-204-DEMO', 'POL'],
    ['OC-315-DEMO', 'PEN'],
    ['PJ410-DEMO', 'PJ'],
  ]

  for (const [courseCode, profileCode] of nonMatchingCases) {
    assert.equal(matchesProfile(courseCode, profileCode), false)
  }
})

test('les règles sont sensibles à la casse', () => {
  for (const [profileCode, [courseCode]] of Object.entries(matchingCases)) {
    assert.equal(matchesProfile(courseCode.toLowerCase(), profileCode), false)
  }
})

test('un profil inconnu ne correspond à aucun cours', () => {
  assert.equal(matchesProfile('TRT-501-DEMO', 'INCONNU'), false)
})

test('les sept cours fictifs couvrent chacun des cinq profils', () => {
  assert.equal(demoCourses.length, 7)

  for (const { code: profileCode } of profiles) {
    assert.equal(
      demoCourses.some((course) => matchesProfile(course.code, profileCode)),
      true,
      `Aucun cours fictif ne correspond au profil ${profileCode}`,
    )
  }
})

test('les données fictives ne déclarent pas de profils en parallèle des règles', () => {
  for (const course of demoCourses) {
    assert.equal(Object.hasOwn(course, 'profiles'), false)
  }
})
