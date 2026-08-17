export const SESSION_FACET_OPTIONS = [
  'Inscriptions ouvertes',
  'Ouverture programmée',
]

export function getCourseSessionFacetValues(course) {
  const values = []
  if (course.officialData.hasOpenSession === true) values.push(SESSION_FACET_OPTIONS[0])
  if (course.officialData.hasScheduledSession === true) values.push(SESSION_FACET_OPTIONS[1])
  return values
}

export function matchesCourseSessionFacet(course, selectedSessions) {
  return (
    selectedSessions.length === 0 ||
    getCourseSessionFacetValues(course).some((value) => selectedSessions.includes(value))
  )
}

export function hasCourseFacetSelection(filters) {
  return ['offers', 'entities', 'domains', 'themes', 'publics'].some(
    (facet) => (filters[facet]?.length ?? 0) > 0,
  )
}

const FACET_VALUE_READERS = {
  sessions: getCourseSessionFacetValues,
  offers: (course) => course.catalogueOffers,
  entities: (course) => [course.officialData.organizingEntityRaw],
  domains: (course) => [course.officialData.domainRaw],
  themes: (course) => [course.officialData.themeRaw],
  publics: (course) => [course.officialData.publicValue],
}

function getCourseFacetValues(course, facet) {
  return FACET_VALUE_READERS[facet](course).filter(
    (value) => typeof value === 'string' && value.trim() !== '',
  )
}

function matchesSearch(course, search) {
  const query = search.trim().toLocaleLowerCase('fr-CH')
  const searchableText = `${course.code} ${course.officialData.titleRaw ?? ''}`
    .toLocaleLowerCase('fr-CH')

  return !query || searchableText.includes(query)
}

function matchesFacet(course, facet, selectedValues) {
  const values = selectedValues ?? []
  return (
    values.length === 0 ||
    getCourseFacetValues(course, facet).some((value) =>
      values.includes(value),
    )
  )
}

export function getFacetValueCounts(courses, filters, omittedFacet) {
  const counts = new Map()

  for (const course of courses) {
    if (!matchesSearch(course, filters.search)) continue

    const matchesOtherFacets = Object.keys(FACET_VALUE_READERS).every(
      (facet) =>
        facet === omittedFacet || matchesFacet(course, facet, filters[facet]),
    )
    if (!matchesOtherFacets) continue

    for (const value of getCourseFacetValues(course, omittedFacet)) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }

  return counts
}

export function keepAvailableFacetOptions(options, counts, selectedValues) {
  return options.filter(
    (option) => (counts.get(option) ?? 0) > 0 || selectedValues.includes(option),
  )
}

export function filterFacetOptions(options, search) {
  const query = search.trim().toLocaleLowerCase('fr-CH')
  if (!query) return options

  return options.filter((option) =>
    option.toLocaleLowerCase('fr-CH').includes(query),
  )
}
