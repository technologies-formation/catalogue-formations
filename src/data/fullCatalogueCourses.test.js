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
function snapshotCourse(overrides = {}) {
  return {
    code: 'SYNTHETIQUE-001',
    sourceUrl: 'https://example.test/SYNTHETIQUE-001',
    titleRaw: 'Cours synthétique',
    organizingEntityRaw: 'Entité synthétique',
    domainRaw: 'Domaine synthétique',
    themeRaw: 'Thème synthétique',
    publicRaw: 'Public synthétique',
    targetAudienceRaw: 'Public visé synthétique',
    hasOpenSession: false,
    hasScheduledSession: false,
    catalogueOffers: ['Offre synthétique'],
    ...overrides,
  }
}

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

test('une formation multi-offres reste un objet unique sans offre dupliquée', () => {
  const offers = ['Offre A', 'Offre B', 'Offre C']
  const projectedCourses = [snapshotCourse({ catalogueOffers: offers })].map(
    projectSnapshotCourse,
  )

  assert.equal(projectedCourses.length, 1)
  assert.deepEqual(projectedCourses[0].catalogueOffers, offers)
  assert.equal(
    new Set(projectedCourses[0].catalogueOffers).size,
    projectedCourses[0].catalogueOffers.length,
  )
})

test('les données descriptives projetées proviennent du snapshot', () => {
  const sourceCourse = snapshotCourse()
  const projectedCourse = projectSnapshotCourse(sourceCourse)

  assert.deepEqual(projectedCourse.officialData, {
    titleRaw: sourceCourse.titleRaw,
    organizingEntityRaw: sourceCourse.organizingEntityRaw,
    domainRaw: sourceCourse.domainRaw,
    themeRaw: sourceCourse.themeRaw,
    publicRaw: sourceCourse.publicRaw,
    publicValue: sourceCourse.publicRaw,
    targetAudienceRaw: sourceCourse.targetAudienceRaw,
    objectivesRaw: sourceCourse.objectivesRaw,
    contentRaw: sourceCourse.contentRaw,
    hasOpenSession: false,
    hasScheduledSession: false,
  })
  assert.equal(projectedCourse.sourceUrl, sourceCourse.sourceUrl)
})

test('les flags Sessions sont projetés comme deux booléens indépendants', () => {
  const sourceCourse = snapshotCourse()
  const combinations = [
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ]

  for (const [hasOpenSession, hasScheduledSession] of combinations) {
    const projected = projectSnapshotCourse({
      ...sourceCourse,
      hasOpenSession,
      hasScheduledSession,
    })

    assert.equal(projected.officialData.hasOpenSession, hasOpenSession)
    assert.equal(projected.officialData.hasScheduledSession, hasScheduledSession)
  }
})

test('les flags Sessions absents du snapshot historique deviennent false', () => {
  const historicalCourse = {
    code: 'HISTORIQUE-001',
    sourceUrl: 'https://example.test/HISTORIQUE-001',
    titleRaw: 'Cours historique',
    organizingEntityRaw: 'Entité historique',
    domainRaw: 'Domaine historique',
    themeRaw: null,
    publicRaw: null,
    targetAudienceRaw: null,
    catalogueOffers: ['Offre historique'],
  }
  const projected = projectSnapshotCourse(historicalCourse)

  assert.equal(Object.hasOwn(historicalCourse, 'hasOpenSession'), false)
  assert.equal(Object.hasOwn(historicalCourse, 'hasScheduledSession'), false)
  assert.equal(projected.officialData.hasOpenSession, false)
  assert.equal(projected.officialData.hasScheduledSession, false)
})

test('la projection des flags Sessions ne modifie aucune autre donnée ni le ciblage', () => {
  const sourceCourse = snapshotCourse()
  const withoutFlags = projectSnapshotCourse(sourceCourse)
  const withFlags = projectSnapshotCourse({
    ...sourceCourse,
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
  for (const course of fullCatalogueCourses) {
    const sourcePublic = snapshotByCode.get(course.code).publicRaw

    assert.equal(course.officialData.publicRaw, sourcePublic)
    if (typeof sourcePublic === 'string' && sourcePublic.trim() !== '') {
      assert.equal(course.officialData.publicValue, sourcePublic)
    } else {
      assert.equal(course.officialData.publicValue, 'Non renseigné')
    }
  }
})

test('les ciblages validés existants sont réutilisés sans être recalculés', () => {
  const activeValidatedSamples = officialCourseSamples.filter(
    (sample) =>
      sample.normalizationStatus === 'validated' &&
      sample.targeting !== null &&
      snapshotByCode.has(sample.code),
  )

  for (const sampleCourse of activeValidatedSamples) {
    const projectedCourse = coursesByCode.get(sampleCourse.code)

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
  const course = projectSnapshotCourse(snapshotCourse())

  assert.equal(course.normalizationStatus, 'needsReview')
  assert.equal(course.targeting, null)
  assert.equal(isCourseTargetingReady(course), false)
})

test('les échantillons absents du snapshot ne sont pas réinjectés', () => {
  const absentSampleCodes = officialCourseSamples
    .map(({ code }) => code)
    .filter((code) => !snapshotByCode.has(code))

  for (const code of absentSampleCodes) {
    assert.equal(coursesByCode.has(code), false)
  }
})

test('la projection ne recrée aucun champ profiles historique', () => {
  for (const course of fullCatalogueCourses) {
    assert.equal(Object.hasOwn(course, 'profiles'), false)
  }
})

test('la couverture de ciblage correspond aux échantillons validés encore actifs', () => {
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

  const expectedValidatedCodes = officialCourseSamples
    .filter(
      (sample) =>
        sample.normalizationStatus === 'validated' &&
        sample.targeting !== null &&
        snapshotByCode.has(sample.code),
    )
    .map(({ code }) => code)

  assert.deepEqual(
    validatedCourses.map(({ code }) => code),
    officialCatalogueSnapshot
      .map(({ code }) => code)
      .filter((code) => expectedValidatedCodes.includes(code)),
  )
  assert.equal(
    coursesNeedingReview.length,
    officialCatalogueSnapshot.length - validatedCourses.length,
  )
  assert.equal(
    validatedCourses.length + coursesNeedingReview.length,
    officialCatalogueSnapshot.length,
  )
})
