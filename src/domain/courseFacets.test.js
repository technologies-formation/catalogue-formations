import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterFacetOptions,
  getCourseSessionFacetValues,
  getFacetValueCounts,
  hasCourseFacetSelection,
  matchesCourseSessionFacet,
  SESSION_FACET_OPTIONS,
} from './courseFacets.js'
import { getPageResults } from './coursePagination.js'
import { searchCourses } from './courseSearch.js'
import { sortCourses } from './courseSorting.js'

function course({
  code,
  offer,
  entity,
  domain,
  theme,
  publicValue,
  hasOpenSession = false,
  hasScheduledSession = false,
}) {
  return {
    code,
    catalogueOffers: [offer],
    officialData: {
      titleRaw: code,
      organizingEntityRaw: entity,
      domainRaw: domain,
      themeRaw: theme,
      publicValue,
      hasOpenSession,
      hasScheduledSession,
    },
  }
}

const courses = [
  course({ code: 'A1', offer: 'Offre A', entity: 'Entité 1', domain: 'Domaine X', theme: 'Thème Alpha', publicValue: 'Tout public', hasOpenSession: true }),
  course({ code: 'A2', offer: 'Offre A', entity: 'Entité 2', domain: 'Domaine Y', theme: 'Thème Bêta', publicValue: 'Public ciblé', hasScheduledSession: true }),
  course({ code: 'B1', offer: 'Offre B', entity: 'Entité 1', domain: 'Domaine X', theme: 'Thème Alpha', publicValue: 'Tout public', hasOpenSession: true, hasScheduledSession: true }),
  course({ code: 'C1', offer: 'Offre C', entity: 'Entité 3', domain: 'Domaine Z', theme: 'Thème Gamma', publicValue: 'Tout public' }),
]

const emptyFilters = {
  search: '',
  sessions: [],
  offers: [],
  entities: [],
  domains: [],
  themes: [],
  publics: [],
}

function reconcileSessionsWithCourseCriteria(filters, sessions) {
  return hasCourseFacetSelection(filters) ? sessions : []
}

test('la recherche interne est insensible à la casse', () => {
  assert.deepEqual(
    filterFacetOptions(['Thème Alpha', 'Thème Bêta'], 'ALPHA'),
    ['Thème Alpha'],
  )
})

test('la recherche interne ne modifie pas les résultats du catalogue', () => {
  const catalogueBeforeSearch = structuredClone(courses)

  filterFacetOptions(['Offre A', 'Offre B'], 'offre b')

  assert.deepEqual(courses, catalogueBeforeSearch)
})

test('le compteur d’une valeur de facette est correct', () => {
  const counts = getFacetValueCounts(courses, emptyFilters, 'offers')

  assert.equal(counts.get('Offre A'), 2)
  assert.equal(counts.get('Offre B'), 1)
})

test('les compteurs sont recalculés après changement d’une autre facette', () => {
  const counts = getFacetValueCounts(
    courses,
    { ...emptyFilters, entities: ['Entité 1'] },
    'offers',
  )

  assert.equal(counts.get('Offre A'), 1)
  assert.equal(counts.get('Offre B'), 1)
})

test('plusieurs valeurs de la même facette ne s’excluent pas des compteurs', () => {
  const counts = getFacetValueCounts(
    courses,
    { ...emptyFilters, offers: ['Offre A', 'Offre B'] },
    'offers',
  )

  assert.equal(counts.get('Offre A'), 2)
  assert.equal(counts.get('Offre B'), 1)
})

test('les compteurs conservent le OU interne et le ET entre facettes', () => {
  const counts = getFacetValueCounts(
    courses,
    {
      ...emptyFilters,
      offers: ['Offre A', 'Offre B'],
      domains: ['Domaine X'],
    },
    'entities',
  )

  assert.equal(counts.get('Entité 1'), 2)
  assert.equal(counts.has('Entité 2'), false)
})

test('les compteurs utilisent le sous-ensemble produit par la recherche enrichie', () => {
  const searchedCourses = searchCourses(searchIntegrationCourses, 'tableur')
  const counts = getFacetValueCounts(searchedCourses, emptyFilters, 'offers')

  assert.deepEqual(Object.fromEntries(counts), {
    'Offre Bureautique': 2,
  })
})

test('une facette filtre les résultats sans perdre leur ordre de pertinence', () => {
  const searchedCourses = searchCourses(searchIntegrationCourses, 'prise de parole')
  const filteredCourses = searchedCourses.filter(
    (item) => item.officialData.domainRaw === 'Communication',
  )

  assert.ok(filteredCourses.some((item) => item.code === 'SEM1108'))
  assert.deepEqual(
    filteredCourses.map(({ code }) => code),
    searchedCourses
      .filter((item) => item.officialData.domainRaw === 'Communication')
      .map(({ code }) => code),
  )
  assert.ok(
    filteredCourses.every(
      (item) => item.officialData.domainRaw === 'Communication',
    ),
  )
})

test('Sessions se combine avec le sous-ensemble produit par la recherche', () => {
  const searchedCourses = searchCourses(searchIntegrationCourses, 'tableur')
  const openCourses = searchedCourses.filter((item) =>
    matchesCourseSessionFacet(item, ['Inscriptions ouvertes']),
  )

  assert.deepEqual(openCourses.map(({ code }) => code), ['EXCEL-TITRE'])
})

test('effacer la recherche permet de restaurer le tri utilisateur', () => {
  const searchedCourses = searchCourses(searchIntegrationCourses, 'tableur')
  assert.equal(searchedCourses[0].code, 'EXCEL-TITRE')

  const allCourses = searchCourses(searchIntegrationCourses, '')
  assert.deepEqual(
    sortCourses(allCourses, 'code-desc').map(({ code }) => code),
    ['SEM1108', 'PAROLE-SECONDAIRE', 'EXCEL-TITRE', 'EXCEL-PUBLIC'],
  )
})

test('la pagination intervient après la recherche et les facettes', () => {
  const searchedCourses = searchCourses(paginationSearchCourses, 'excel')
  const filteredCourses = searchedCourses.filter(
    (item) => item.officialData.domainRaw === 'Bureautique',
  )

  assert.equal(searchedCourses.length, 24)
  assert.equal(filteredCourses.length, 22)
  assert.equal(getPageResults(filteredCourses, 1).length, 20)
  assert.equal(getPageResults(filteredCourses, 2).length, 2)
})

test('dérive les valeurs Sessions sans doublon et exclut un cours sans flag', () => {
  assert.deepEqual(getCourseSessionFacetValues(courses[0]), ['Inscriptions ouvertes'])
  assert.deepEqual(getCourseSessionFacetValues(courses[1]), ['Ouverture programmée'])
  assert.deepEqual(getCourseSessionFacetValues(courses[2]), SESSION_FACET_OPTIONS)
  assert.deepEqual(getCourseSessionFacetValues(courses[3]), [])
})

test('compte chaque cours une fois dans chaque statut Sessions applicable', () => {
  const counts = getFacetValueCounts(courses, emptyFilters, 'sessions')

  assert.equal(counts.get('Inscriptions ouvertes'), 2)
  assert.equal(counts.get('Ouverture programmée'), 2)
})

test('les compteurs Sessions tiennent compte des autres facettes', () => {
  const counts = getFacetValueCounts(
    courses,
    { ...emptyFilters, offers: ['Offre A'] },
    'sessions',
  )

  assert.equal(counts.get('Inscriptions ouvertes'), 1)
  assert.equal(counts.get('Ouverture programmée'), 1)
})

test('les compteurs Sessions ignorent la sélection Sessions elle-même', () => {
  const counts = getFacetValueCounts(
    courses,
    { ...emptyFilters, sessions: ['Inscriptions ouvertes'] },
    'sessions',
  )

  assert.equal(counts.get('Inscriptions ouvertes'), 2)
  assert.equal(counts.get('Ouverture programmée'), 2)
})

test('Sessions utilise un OU interne et un ET avec les autres facettes', () => {
  const openOffers = getFacetValueCounts(
    courses,
    { ...emptyFilters, sessions: ['Inscriptions ouvertes'] },
    'offers',
  )
  const scheduledOffers = getFacetValueCounts(
    courses,
    { ...emptyFilters, sessions: ['Ouverture programmée'] },
    'offers',
  )
  const eitherStatusOffers = getFacetValueCounts(
    courses,
    { ...emptyFilters, sessions: SESSION_FACET_OPTIONS },
    'offers',
  )
  const entityOneEitherStatusOffers = getFacetValueCounts(
    courses,
    {
      ...emptyFilters,
      sessions: SESSION_FACET_OPTIONS,
      entities: ['Entité 1'],
    },
    'offers',
  )

  assert.deepEqual(Object.fromEntries(openOffers), { 'Offre A': 1, 'Offre B': 1 })
  assert.deepEqual(Object.fromEntries(scheduledOffers), { 'Offre A': 1, 'Offre B': 1 })
  assert.deepEqual(Object.fromEntries(eitherStatusOffers), { 'Offre A': 2, 'Offre B': 1 })
  assert.deepEqual(Object.fromEntries(entityOneEitherStatusOffers), {
    'Offre A': 1,
    'Offre B': 1,
  })
})

test('le filtrage Sessions retourne chaque cours compatible une seule fois', () => {
  const openCourses = courses.filter((course) =>
    matchesCourseSessionFacet(course, ['Inscriptions ouvertes']),
  )
  const scheduledCourses = courses.filter((course) =>
    matchesCourseSessionFacet(course, ['Ouverture programmée']),
  )
  const eitherStatusCourses = courses.filter((course) =>
    matchesCourseSessionFacet(course, SESSION_FACET_OPTIONS),
  )

  assert.deepEqual(openCourses.map(({ code }) => code), ['A1', 'B1'])
  assert.deepEqual(scheduledCourses.map(({ code }) => code), ['A2', 'B1'])
  assert.deepEqual(eitherStatusCourses.map(({ code }) => code), ['A1', 'A2', 'B1'])
  assert.equal(
    new Set(eitherStatusCourses.map(({ code }) => code)).size,
    eitherStatusCourses.length,
  )
})

test('une sélection Sessions est conservée tant qu’un critère Cours reste actif', () => {
  const selectedSessions = ['Inscriptions ouvertes']
  const filters = {
    ...emptyFilters,
    offers: ['Offre A'],
    entities: ['Entité 1'],
  }

  assert.deepEqual(
    reconcileSessionsWithCourseCriteria(
      { ...filters, offers: [] },
      selectedSessions,
    ),
    selectedSessions,
  )
})

test('la sélection Sessions est supprimée avec le dernier critère Cours', () => {
  assert.deepEqual(
    reconcileSessionsWithCourseCriteria(emptyFilters, ['Inscriptions ouvertes']),
    [],
  )
})

test('les deux sélections Sessions sont supprimées ensemble', () => {
  assert.deepEqual(
    reconcileSessionsWithCourseCriteria(emptyFilters, SESSION_FACET_OPTIONS),
    [],
  )
})

test('la recherche texte seule ne conserve pas une sélection Sessions', () => {
  assert.deepEqual(
    reconcileSessionsWithCourseCriteria(
      { ...emptyFilters, search: 'A1' },
      ['Ouverture programmée'],
    ),
    [],
  )
})

test('le reset général désactive Sessions', () => {
  const resetFilters = {
    ...emptyFilters,
    search: '',
    sessions: [],
  }

  assert.equal(hasCourseFacetSelection(resetFilters), false)
  assert.deepEqual(
    reconcileSessionsWithCourseCriteria(resetFilters, resetFilters.sessions),
    [],
  )
})

const searchIntegrationCourses = [
  searchCourse('EXCEL-TITRE', 'Excel : fonctions essentielles', {
    offer: 'Offre Bureautique',
    domain: 'Bureautique',
    hasOpenSession: true,
  }),
  searchCourse('EXCEL-PUBLIC', 'Analyser des données', {
    offer: 'Offre Bureautique',
    domain: 'Bureautique',
    targetAudienceRaw: 'Personnes utilisant Excel',
    hasScheduledSession: true,
  }),
  searchCourse('SEM1108', 'Prise de parole en public', {
    offer: 'Offre Communication',
    domain: 'Communication',
  }),
  searchCourse('PAROLE-SECONDAIRE', 'Communication professionnelle', {
    offer: 'Offre Communication',
    domain: 'Communication',
    targetAudienceRaw: 'Personnes préparant une prise de parole',
  }),
]

const paginationSearchCourses = Array.from({ length: 24 }, (_, index) =>
  searchCourse(`EXCEL-${String(index + 1).padStart(2, '0')}`, `Excel niveau ${index + 1}`, {
    offer: 'Offre Bureautique',
    domain: index < 22 ? 'Bureautique' : 'Autre domaine',
  }),
)

function searchCourse(
  code,
  titleRaw,
  {
    offer,
    domain,
    targetAudienceRaw = '',
    hasOpenSession = false,
    hasScheduledSession = false,
  },
) {
  return {
    code,
    catalogueOffers: [offer],
    officialData: {
      titleRaw,
      organizingEntityRaw: 'Entité de test',
      domainRaw: domain,
      themeRaw: 'Thème de test',
      publicRaw: 'Tout public',
      publicValue: 'Tout public',
      targetAudienceRaw,
      hasOpenSession,
      hasScheduledSession,
    },
  }
}
