import assert from 'node:assert/strict'
import test from 'node:test'
import { isCourseTargetingReady } from '../domain/courseNormalization.js'
import officialCatalogueSnapshot from './officialCatalogueSnapshot.json' with {
  type: 'json',
}
import { officialCourseSamples } from './officialCourseSamples.js'
import {
  fullCatalogueCourses,
  projectSnapshotCourse,
} from './fullCatalogueCourses.js'

const coursesByCode = new Map(
  fullCatalogueCourses.map((course) => [course.code, course]),
)
const snapshotByCode = new Map(
  officialCatalogueSnapshot.map((course) => [course.code, course]),
)
const samplesByCode = new Map(
  officialCourseSamples.map((course) => [course.code, course]),
)

test('la projection contient toutes les formations d’un snapshot non vide', () => {
  assert.ok(officialCatalogueSnapshot.length > 0)
  assert.equal(fullCatalogueCourses.length, officialCatalogueSnapshot.length)
  assert.deepEqual(
    fullCatalogueCourses.map((course) => course.code),
    officialCatalogueSnapshot.map((course) => course.code),
  )
})

test('tous les codes projetés sont uniques', () => {
  assert.equal(
    new Set(fullCatalogueCourses.map((course) => course.code)).size,
    officialCatalogueSnapshot.length,
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
    themeRaw: snapshotCourse.themeRaw,
    publicRaw: snapshotCourse.publicRaw,
    publicValue: snapshotCourse.publicRaw,
    targetAudienceRaw: snapshotCourse.targetAudienceRaw,
    hasOpenSession: false,
    hasScheduledSession: false,
  })
  assert.equal(projectedCourse.sourceUrl, snapshotCourse.sourceUrl)
})

test('les flags Sessions sont projetés comme deux booléens indépendants', () => {
  const snapshotCourse = snapshotByCode.get('SEM1098')
  const combinations = [
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ]

  for (const [hasOpenSession, hasScheduledSession] of combinations) {
    const projected = projectSnapshotCourse({
      ...snapshotCourse,
      hasOpenSession,
      hasScheduledSession,
    })

    assert.equal(projected.officialData.hasOpenSession, hasOpenSession)
    assert.equal(projected.officialData.hasScheduledSession, hasScheduledSession)
  }
})

test('les flags Sessions absents du snapshot historique deviennent false', () => {
  const snapshotCourse = snapshotByCode.get('SEM1098')
  const projected = projectSnapshotCourse(snapshotCourse)

  assert.equal(Object.hasOwn(snapshotCourse, 'hasOpenSession'), false)
  assert.equal(Object.hasOwn(snapshotCourse, 'hasScheduledSession'), false)
  assert.equal(projected.officialData.hasOpenSession, false)
  assert.equal(projected.officialData.hasScheduledSession, false)
})

test('la projection des flags Sessions ne modifie aucune autre donnée ni le ciblage', () => {
  const snapshotCourse = snapshotByCode.get('SEM1098')
  const withoutFlags = projectSnapshotCourse(snapshotCourse)
  const withFlags = projectSnapshotCourse({
    ...snapshotCourse,
    hasOpenSession: true,
    hasScheduledSession: true,
  })
  const { hasOpenSession: ignoredOpen, hasScheduledSession: ignoredScheduled, ...originalData } =
    withoutFlags.officialData
  const { hasOpenSession: projectedOpen, hasScheduledSession: projectedScheduled, ...flaggedData } =
    withFlags.officialData

  assert.equal(ignoredOpen, false)
  assert.equal(ignoredScheduled, false)
  assert.equal(projectedOpen, true)
  assert.equal(projectedScheduled, true)
  assert.deepEqual(flaggedData, originalData)
  assert.deepEqual(withFlags.catalogueOffers, withoutFlags.catalogueOffers)
  assert.equal(withFlags.normalizationStatus, withoutFlags.normalizationStatus)
  assert.deepEqual(withFlags.targeting, withoutFlags.targeting)
})

test('chaque cours projeté expose toujours deux booléens de sessions', () => {
  for (const course of fullCatalogueCourses) {
    assert.equal(typeof course.officialData.hasOpenSession, 'boolean')
    assert.equal(typeof course.officialData.hasScheduledSession, 'boolean')
  }
})

test('les thèmes sont projetés sans transformation et les valeurs absentes restent nulles', () => {
  for (const course of fullCatalogueCourses) {
    const sourceTheme = snapshotByCode.get(course.code).themeRaw
    const expectedTheme =
      typeof sourceTheme === 'string' && sourceTheme.trim() !== ''
        ? sourceTheme
        : null

    assert.equal(course.officialData.themeRaw, expectedTheme)
  }
})

test('la valeur applicative Public est dérivée sans modifier publicRaw', () => {
  let coursesWithoutSourcePublic = 0

  for (const course of fullCatalogueCourses) {
    const sourcePublic = snapshotByCode.get(course.code).publicRaw

    assert.equal(course.officialData.publicRaw, sourcePublic)
    if (typeof sourcePublic === 'string' && sourcePublic.trim() !== '') {
      assert.equal(course.officialData.publicValue, sourcePublic)
    } else {
      assert.equal(course.officialData.publicValue, 'Non renseigné')
      coursesWithoutSourcePublic += 1
    }
  }

  assert.equal(coursesWithoutSourcePublic, 107)
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
  assert.equal(
    coursesNeedingReview.length,
    officialCatalogueSnapshot.length - validatedCourses.length,
  )
  assert.equal(
    validatedCourses.length + coursesNeedingReview.length,
    officialCatalogueSnapshot.length,
  )
})
