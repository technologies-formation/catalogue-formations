import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterFacetOptions,
  getFacetValueCounts,
} from './courseFacets.js'

function course({ code, offer, entity, domain, theme, publicValue }) {
  return {
    code,
    catalogueOffers: [offer],
    officialData: {
      titleRaw: code,
      organizingEntityRaw: entity,
      domainRaw: domain,
      themeRaw: theme,
      publicValue,
    },
  }
}

const courses = [
  course({ code: 'A1', offer: 'Offre A', entity: 'Entité 1', domain: 'Domaine X', theme: 'Thème Alpha', publicValue: 'Tout public' }),
  course({ code: 'A2', offer: 'Offre A', entity: 'Entité 2', domain: 'Domaine Y', theme: 'Thème Bêta', publicValue: 'Public ciblé' }),
  course({ code: 'B1', offer: 'Offre B', entity: 'Entité 1', domain: 'Domaine X', theme: 'Thème Alpha', publicValue: 'Tout public' }),
]

const emptyFilters = {
  search: '',
  offers: [],
  entities: [],
  domains: [],
  themes: [],
  publics: [],
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
