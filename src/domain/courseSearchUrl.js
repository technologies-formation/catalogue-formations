import {
  COURSE_SORT_OPTIONS,
  DEFAULT_COURSE_SORT,
} from './courseSorting.js'

const validSorts = new Set(COURSE_SORT_OPTIONS.map(({ value }) => value))

function canonicalValues(values) {
  return [
    ...new Set(
      values.filter(
        (value) => typeof value === 'string' && value.trim() !== '',
      ),
    ),
  ].sort((left, right) => left.localeCompare(right, 'fr-CH'))
}

function availableValues(courses, getValues) {
  return new Set(
    courses.flatMap((course) => getValues(course) ?? []).filter(
      (value) => typeof value === 'string' && value.trim() !== '',
    ),
  )
}

function retainAvailable(values, available) {
  return canonicalValues(values).filter((value) => available.has(value))
}

export function normalizeCourseSearchState(state, courses) {
  const offers = retainAvailable(
    state.offers ?? [],
    availableValues(courses, (course) => course.catalogueOffers),
  )
  const entities = retainAvailable(
    state.entities ?? [],
    availableValues(courses, (course) => [course.officialData.organizingEntityRaw]),
  )
  const hasPrimarySelection = offers.length > 0 || entities.length > 0
  const primaryCourses = hasPrimarySelection
    ? courses.filter(
        (course) =>
          (offers.length === 0 ||
            course.catalogueOffers.some((offer) => offers.includes(offer))) &&
          (entities.length === 0 ||
            entities.includes(course.officialData.organizingEntityRaw)),
      )
    : []
  const domains = hasPrimarySelection
    ? retainAvailable(
        state.domains ?? [],
        availableValues(primaryCourses, (course) => [course.officialData.domainRaw]),
      )
    : []
  const publics = hasPrimarySelection
    ? retainAvailable(
        state.publics ?? [],
        availableValues(primaryCourses, (course) => [course.officialData.publicValue]),
      )
    : []
  const themeCourses = domains.length > 0
    ? primaryCourses.filter(
        (course) =>
          domains.includes(course.officialData.domainRaw) &&
          (publics.length === 0 || publics.includes(course.officialData.publicValue)),
      )
    : []
  const themes = domains.length > 0
    ? retainAvailable(
        state.themes ?? [],
        availableValues(themeCourses, (course) => [course.officialData.themeRaw]),
      )
    : []

  return {
    search: typeof state.search === 'string' ? state.search : '',
    offers,
    entities,
    domains,
    themes,
    publics,
    sort: validSorts.has(state.sort) ? state.sort : DEFAULT_COURSE_SORT,
  }
}

export function parseCourseSearchUrl(search, courses) {
  const params = new URLSearchParams(search)
  return normalizeCourseSearchState(
    {
      search: params.get('q') ?? '',
      offers: params.getAll('offer'),
      entities: params.getAll('entity'),
      domains: params.getAll('domain'),
      themes: params.getAll('theme'),
      publics: params.getAll('public'),
      sort: params.get('sort') ?? DEFAULT_COURSE_SORT,
    },
    courses,
  )
}

export function serializeCourseSearchState(state, courses) {
  const normalized = normalizeCourseSearchState(state, courses)
  const params = new URLSearchParams()

  if (normalized.search.trim() !== '') params.set('q', normalized.search)
  for (const offer of normalized.offers) params.append('offer', offer)
  for (const entity of normalized.entities) params.append('entity', entity)
  for (const domain of normalized.domains) params.append('domain', domain)
  for (const theme of normalized.themes) params.append('theme', theme)
  for (const publicValue of normalized.publics) params.append('public', publicValue)
  if (normalized.sort !== DEFAULT_COURSE_SORT) params.set('sort', normalized.sort)

  return params.toString()
}
