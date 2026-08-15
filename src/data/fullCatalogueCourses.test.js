import assert from 'node:assert/strict'
import test from 'node:test'
import { isCourseTargetingReady } from '../domain/courseNormalization.js'
import officialCatalogueSnapshot from './officialCatalogueSnapshot.json' with {
  type: 'json',
}
import { officialCourseSamples } from './officialCourseSamples.js'
import { fullCatalogueCourses } from './fullCatalogueCourses.js'

const coursesByCode = new Map(
  fullCatalogueCourses.map((course) => [course.code, course]),
)
const snapshotByCode = new Map(
  officialCatalogueSnapshot.map((course) => [course.code, course]),
)
const samplesByCode = new Map(
  officialCourseSamples.map((course) => [course.code, course]),
)

test('la projection contient exactement les 1 078 formations du snapshot', () => {
  assert.equal(fullCatalogueCourses.length, 1078)
  assert.deepEqual(
    fullCatalogueCourses.map((course) => course.code),
    officialCatalogueSnapshot.map((course) => course.code),
  )
})

test('les 1 078 codes projetés sont uniques', () => {
  assert.equal(
    new Set(fullCatalogueCourses.map((course) => course.code)).size,
    1078,
  )
})

test('les rattachements aux offres sont conservés sans duplication', () => {
  for (const course of fullCatalogueCourses) {
    const snapshotCourse = snapshotByCode.get(course.code)

    assert.deepEqual(course.catalogueOffers, snapshotCourse.catalogueOffers)
    assert.equal(
      new Set(course.catalogueOffers).size,
      course.catalogueOffers.length,
      `${course.code} contient une offre dupliquée`,
    )
  }
})

test('une formation présente dans cinq offres reste un objet unique', () => {
  const code = 'SEM-10204'
  const matchingCourses = fullCatalogueCourses.filter(
    (course) => course.code === code,
  )

  assert.equal(matchingCourses.length, 1)
  assert.equal(matchingCourses[0].catalogueOffers.length, 5)
})

test('les données descriptives projetées proviennent du snapshot', () => {
  const projectedCourse = coursesByCode.get('SEM1098')
  const snapshotCourse = snapshotByCode.get('SEM1098')

  assert.deepEqual(projectedCourse.officialData, {
    titleRaw: snapshotCourse.titleRaw,
    organizingEntityRaw: snapshotCourse.organizingEntityRaw,
    domainRaw: snapshotCourse.domainRaw,
    publicRaw: snapshotCourse.publicRaw,
    targetAudienceRaw: snapshotCourse.targetAudienceRaw,
  })
  assert.equal(projectedCourse.sourceUrl, snapshotCourse.sourceUrl)
})

test('les ciblages validés existants sont réutilisés sans être recalculés', () => {
  for (const code of ['SEM1098', 'FP203', 'OCD207', 'PJ-0026']) {
    const projectedCourse = coursesByCode.get(code)
    const sampleCourse = samplesByCode.get(code)

    assert.ok(projectedCourse, `${code} doit être présent dans la projection`)
    assert.equal(projectedCourse.normalizationStatus, 'validated')
    assert.deepEqual(projectedCourse.targeting, sampleCourse.targeting)
    assert.equal(
      projectedCourse.targeting.targetingSource,
      sampleCourse.targeting.targetingSource,
    )
    assert.equal(isCourseTargetingReady(projectedCourse), true)
  }
})

test('une formation sans validation métier reste à revoir sans ciblage', () => {
  const course = coursesByCode.get('OCD371')

  assert.ok(course)
  assert.equal(course.normalizationStatus, 'needsReview')
  assert.equal(course.targeting, null)
  assert.equal(isCourseTargetingReady(course), false)
})

test('EP-520 et les autres échantillons absents ne sont pas réinjectés', () => {
  assert.equal(coursesByCode.has('EP-520'), false)
  assert.equal(coursesByCode.has('CO-01660'), false)
})

test('la projection ne recrée aucun champ profiles historique', () => {
  for (const course of fullCatalogueCourses) {
    assert.equal(Object.hasOwn(course, 'profiles'), false)
  }
})

test('la couverture de ciblage correspond aux 22 échantillons encore actifs', () => {
  const validatedCourses = fullCatalogueCourses.filter(
    (course) =>
      course.normalizationStatus === 'validated' &&
      course.targeting !== null,
  )
  const coursesNeedingReview = fullCatalogueCourses.filter(
    (course) =>
      course.normalizationStatus === 'needsReview' &&
      course.targeting === null,
  )

  assert.equal(validatedCourses.length, 22)
  assert.equal(coursesNeedingReview.length, 1056)
  assert.equal(validatedCourses.length + coursesNeedingReview.length, 1078)
})
