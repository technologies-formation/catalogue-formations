import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateCourseTargeting } from './courseTargeting.js'

const targetingSource = 'explicit'

function createTargeting(targets) {
  return { targets, targetingSource }
}

function createUserProfile(personnelCategory, entity) {
  return { personnelCategory, entity }
}

function assertDecision(actual, matches, reason) {
  assert.deepEqual(actual, { matches, reason, source: targetingSource })
}

test('un PAT du DIP correspond à une formation PAT limitée au DIP', () => {
  const targeting = createTargeting([{ category: 'PAT', entity: 'DIP' }])
  const userProfile = createUserProfile('PAT', 'DIP')

  assertDecision(evaluateCourseTargeting(targeting, userProfile), true, 'matched')
})

test('un PAT de la Police correspond à une formation PAT limitée à la Police', () => {
  const targeting = createTargeting([{ category: 'PAT', entity: 'POLICE' }])
  const userProfile = createUserProfile('PAT', 'POLICE')

  assertDecision(evaluateCourseTargeting(targeting, userProfile), true, 'matched')
})

test('un PAT du DIP ne correspond pas à une formation PAT limitée à la Police', () => {
  const targeting = createTargeting([{ category: 'PAT', entity: 'POLICE' }])
  const userProfile = createUserProfile('PAT', 'DIP')

  assertDecision(
    evaluateCourseTargeting(targeting, userProfile),
    false,
    'entityMismatch',
  )
})

test('un personnel policier correspond à une formation Police', () => {
  const targeting = createTargeting([{ category: 'POL', entity: 'POLICE' }])
  const userProfile = createUserProfile('POL', 'POLICE')

  assertDecision(evaluateCourseTargeting(targeting, userProfile), true, 'matched')
})

test('un personnel de la détention correspond à une formation OCD', () => {
  const targeting = createTargeting([{ category: 'PEN', entity: 'OCD' }])
  const userProfile = createUserProfile('PEN', 'OCD')

  assertDecision(evaluateCourseTargeting(targeting, userProfile), true, 'matched')
})

test('un PAT de l’OCD correspond à une formation administrative OCD', () => {
  const targeting = createTargeting([{ category: 'PAT', entity: 'OCD' }])
  const userProfile = createUserProfile('PAT', 'OCD')

  assertDecision(evaluateCourseTargeting(targeting, userProfile), true, 'matched')
})

test('un magistrat du PJ correspond à une formation de magistrature', () => {
  const targeting = createTargeting([{ category: 'MAG', entity: 'PJ' }])
  const userProfile = createUserProfile('MAG', 'PJ')

  assertDecision(evaluateCourseTargeting(targeting, userProfile), true, 'matched')
})

test('un PAT du PJ correspond à une formation PAT limitée au PJ', () => {
  const targeting = createTargeting([{ category: 'PAT', entity: 'PJ' }])
  const userProfile = createUserProfile('PAT', 'PJ')

  assertDecision(evaluateCourseTargeting(targeting, userProfile), true, 'matched')
})

test('une formation sans restriction d’entité correspond aux catégories déclarées', () => {
  const targeting = createTargeting([
    { category: 'PAT', entity: null },
    { category: 'PE', entity: null },
  ])
  const patOcdProfile = createUserProfile('PAT', 'OCD')
  const patPoliceProfile = createUserProfile('PAT', 'POLICE')
  const peProfile = createUserProfile('PE', 'DIP')

  assertDecision(
    evaluateCourseTargeting(targeting, patOcdProfile),
    true,
    'matched',
  )
  assertDecision(
    evaluateCourseTargeting(targeting, patPoliceProfile),
    true,
    'matched',
  )
  assertDecision(evaluateCourseTargeting(targeting, peProfile), true, 'matched')
})

test('une catégorie absente du ciblage ne correspond pas', () => {
  const targeting = createTargeting([{ category: 'PAT', entity: null }])
  const userProfile = createUserProfile('MAG', 'PJ')

  assertDecision(
    evaluateCourseTargeting(targeting, userProfile),
    false,
    'categoryMismatch',
  )
})

const multiRelationTargeting = createTargeting([
  { category: 'POL', entity: 'POLICE' },
  { category: 'PAT', entity: 'POLICE' },
  { category: 'PEN', entity: 'OCD' },
])

const multiRelationCases = [
  ['POL + POLICE correspond', 'POL', 'POLICE', true, 'matched'],
  ['PAT + POLICE correspond', 'PAT', 'POLICE', true, 'matched'],
  ['PEN + OCD correspond', 'PEN', 'OCD', true, 'matched'],
  ['POL + OCD ne correspond pas', 'POL', 'OCD', false, 'entityMismatch'],
  [
    'PEN + POLICE ne correspond pas',
    'PEN',
    'POLICE',
    false,
    'entityMismatch',
  ],
  [
    'une catégorie absente ne correspond pas',
    'MAG',
    'PJ',
    false,
    'categoryMismatch',
  ],
]

for (const [name, category, entity, matches, reason] of multiRelationCases) {
  test(`le ciblage multi-relations distingue ${name}`, () => {
    const userProfile = createUserProfile(category, entity)

    assertDecision(
      evaluateCourseTargeting(multiRelationTargeting, userProfile),
      matches,
      reason,
    )
  })
}
