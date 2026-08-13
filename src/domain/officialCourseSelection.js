import { isCourseTargetingReady } from './courseNormalization.js'
import { evaluateCourseTargeting } from './courseTargeting.js'

export function getFilteredOfficialCourses(courses, filters = {}) {
  const {
    search = '',
    personnelCategory = '',
    entity = '',
    domain = '',
    organizingEntity = '',
  } = filters
  const query = normalizeSearchText(search)

  return courses.filter((course) => {
    if (!isCourseTargetingReady(course)) {
      return false
    }

    const matchesSearch =
      !query || getSearchableCourseText(course).includes(query)
    const matchesOrganizer =
      !organizingEntity ||
      course.officialData.organizingEntityRaw === organizingEntity
    const matchesDomain =
      !domain || course.officialData.domainRaw === domain

    return (
      matchesSearch &&
      matchesDomain &&
      matchesOrganizer &&
      matchesTargetingFilters(course, personnelCategory, entity)
    )
  })
}

function getSearchableCourseText(course) {
  return normalizeSearchText(
    [course.code, course.officialData.titleRaw]
      .filter((value) => typeof value === 'string')
      .join(' '),
  )
}

function normalizeSearchText(value) {
  return String(value)
    .trim()
    .toLocaleLowerCase('fr-CH')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function matchesTargetingFilters(course, personnelCategory, entity) {
  if (personnelCategory && entity) {
    return evaluateCourseTargeting(course.targeting, {
      personnelCategory,
      entity,
    }).matches
  }

  if (personnelCategory) {
    return course.targeting.targets.some(
      (target) => target.category === personnelCategory,
    )
  }

  if (entity) {
    return course.targeting.targets.some(
      (target) => target.entity === null || target.entity === entity,
    )
  }

  return true
}
