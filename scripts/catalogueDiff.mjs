export const visibleCourseFields = [
  'sourceUrl',
  'titleRaw',
  'organizingEntityRaw',
  'domainRaw',
  'themeRaw',
  'publicRaw',
  'targetAudienceRaw',
  'hasOpenSession',
  'hasScheduledSession',
]

export const longCourseFields = [
  'durationRaw',
  'generalInformationRaw',
  'objectivesRaw',
  'contentRaw',
  'prerequisitesRaw',
  'additionalInformationRaw',
]

const compareCodes = (left, right) => left.code.localeCompare(right.code, 'fr-CH')
const sessionFlagFields = ['hasOpenSession', 'hasScheduledSession']

function sessionFlagsState(courses) {
  const isLegacy =
    courses.length > 0 &&
    courses.every((course) => sessionFlagFields.every((field) => !Object.hasOwn(course, field)))
  const isComplete = courses.every((course) =>
    sessionFlagFields.every((field) => typeof course?.[field] === 'boolean'),
  )
  return { isLegacy, isComplete }
}

function sessionInitializationStatistics(courses) {
  return {
    openCourses: courses.filter(({ hasOpenSession }) => hasOpenSession === true).length,
    scheduledCourses: courses.filter(({ hasScheduledSession }) => hasScheduledSession === true)
      .length,
    bothStatuses: courses.filter(
      ({ hasOpenSession, hasScheduledSession }) => hasOpenSession && hasScheduledSession,
    ).length,
    neitherStatus: courses.filter(
      ({ hasOpenSession, hasScheduledSession }) => !hasOpenSession && !hasScheduledSession,
    ).length,
  }
}

function indexCourses(courses, source, technicalAnomalies) {
  if (!Array.isArray(courses)) {
    throw new TypeError(`${source} doit être un tableau de formations`)
  }

  const coursesByCode = new Map()
  for (const course of courses) {
    if (!course || typeof course.code !== 'string' || course.code.trim() === '') {
      technicalAnomalies.push({
        type: 'structure',
        code: null,
        detail: `${source}: formation sans code valide`,
      })
      continue
    }
    if (coursesByCode.has(course.code)) {
      technicalAnomalies.push({
        type: 'doublon',
        code: course.code,
        detail: `${source}: code présent plusieurs fois`,
      })
      continue
    }
    if (!Array.isArray(course.catalogueOffers)) {
      technicalAnomalies.push({
        type: 'structure',
        code: course.code,
        detail: `${source}: catalogueOffers absent ou invalide`,
      })
    } else if (new Set(course.catalogueOffers).size !== course.catalogueOffers.length) {
      technicalAnomalies.push({
        type: 'doublon',
        code: course.code,
        detail: `${source}: offre dupliquée dans catalogueOffers`,
      })
    }
    if (source === 'candidat' && course.fetchStatus !== 'ok') {
      technicalAnomalies.push({
        type: 'fiche indisponible',
        code: course.code,
        detail: `fetchStatus: ${String(course.fetchStatus)}`,
      })
    }
    coursesByCode.set(course.code, course)
  }
  return coursesByCode
}

function compareOffers(officialCourse, candidateCourse) {
  const officialOffers = new Set(
    Array.isArray(officialCourse.catalogueOffers) ? officialCourse.catalogueOffers : [],
  )
  const candidateOffers = new Set(
    Array.isArray(candidateCourse.catalogueOffers) ? candidateCourse.catalogueOffers : [],
  )
  const added = [...candidateOffers]
    .filter((offer) => !officialOffers.has(offer))
    .sort((left, right) => left.localeCompare(right, 'fr-CH'))
  const removed = [...officialOffers]
    .filter((offer) => !candidateOffers.has(offer))
    .sort((left, right) => left.localeCompare(right, 'fr-CH'))

  return { added, removed }
}

export function compareCatalogueSnapshots(officialCourses, candidateCourses) {
  const technicalAnomalies = []
  const officialByCode = indexCourses(officialCourses, 'officiel', technicalAnomalies)
  const candidateByCode = indexCourses(candidateCourses, 'candidat', technicalAnomalies)
  const officialSessionFlags = sessionFlagsState(officialCourses)
  const candidateSessionFlags = sessionFlagsState(candidateCourses)
  const initializesSessionFlags = officialSessionFlags.isLegacy

  if (!officialSessionFlags.isLegacy && !officialSessionFlags.isComplete) {
    technicalAnomalies.push({
      type: 'structure',
      code: null,
      detail: 'officiel: initialisation partielle ou incohérente des flags Sessions',
    })
  }
  if (!candidateSessionFlags.isComplete) {
    technicalAnomalies.push({
      type: 'structure',
      code: null,
      detail: 'candidat: flags Sessions absents ou invalides',
    })
  }

  const added = [...candidateByCode.values()]
    .filter((course) => !officialByCode.has(course.code))
    .sort(compareCodes)
  const removed = [...officialByCode.values()]
    .filter((course) => !candidateByCode.has(course.code))
    .sort(compareCodes)
  const modified = []
  const offerChanges = []

  for (const [code, officialCourse] of officialByCode) {
    const candidateCourse = candidateByCode.get(code)
    if (!candidateCourse) continue

    const comparedVisibleFields = initializesSessionFlags
      ? visibleCourseFields.filter((field) => !sessionFlagFields.includes(field))
      : visibleCourseFields
    const visibleChanges = comparedVisibleFields
      .filter((field) => officialCourse[field] !== candidateCourse[field])
      .map((field) => ({
        field,
        oldValue: officialCourse[field] ?? null,
        newValue: candidateCourse[field] ?? null,
      }))
    const longFields = longCourseFields.filter(
      (field) => officialCourse[field] !== candidateCourse[field],
    )
    const offers = compareOffers(officialCourse, candidateCourse)
    const offersChanged = offers.added.length > 0 || offers.removed.length > 0

    if (offersChanged) {
      offerChanges.push({
        code,
        titleRaw: candidateCourse.titleRaw,
        ...offers,
      })
    }
    if (visibleChanges.length > 0 || longFields.length > 0 || offersChanged) {
      modified.push({
        code,
        titleRaw: candidateCourse.titleRaw,
        visibleChanges,
        longFields,
        offersChanged,
      })
    }
  }

  modified.sort(compareCodes)
  offerChanges.sort(compareCodes)

  return {
    added,
    removed,
    modified,
    offerChanges,
    technicalAnomalies,
    sessionFlagsInitialization: initializesSessionFlags
      ? sessionInitializationStatistics(candidateCourses)
      : null,
    summary: {
      officialCourses: officialCourses.length,
      candidateCourses: candidateCourses.length,
      addedCourses: added.length,
      removedCourses: removed.length,
      modifiedCourses: modified.length,
      coursesWithOfferChanges: offerChanges.length,
      technicalAnomalies: technicalAnomalies.length,
    },
  }
}
