import assert from 'node:assert/strict'
import test from 'node:test'
import {
  normalizeCourseSearchState,
  parseCourseSearchUrl,
  serializeCourseSearchState,
} from './courseSearchUrl.js'

function course(code, offers, entity, domain, theme, publicValue) {
  return {
    code,
    catalogueOffers: offers,
    officialData: {
      organizingEntityRaw: entity,
      domainRaw: domain,
      themeRaw: theme,
      publicValue,
    },
  }
}

const courses = [
  course('A', ['Offre A', 'Offre & commune'], 'Entité École', 'Médias, image & numérique', 'Thème été', 'Tout public'),
  course('B', ['Offre B', 'Offre & commune'], 'Entité Police', 'Gestion', 'Sécurité', 'Public ciblé'),
  course('C', ['Offre A'], 'Entité École', 'Gestion', 'Collaboration', 'Public ciblé'),
]

const emptyState = {
  search: '',
  offers: [],
  entities: [],
  domains: [],
  themes: [],
  publics: [],
  sort: 'title-asc',
}

test('un état vide produit une URL vide et se restaure avec les valeurs par défaut', () => {
  assert.equal(serializeCourseSearchState(emptyState, courses), '')
  assert.deepEqual(parseCourseSearchUrl('', courses), emptyState)
})

test('la recherche conserve les accents et caractères spéciaux', () => {
  const query = serializeCourseSearchState(
    { ...emptyState, search: 'éthique & égalité ?' },
    courses,
  )

  assert.equal(new URLSearchParams(query).get('q'), 'éthique & égalité ?')
  assert.equal(parseCourseSearchUrl(query, courses).search, 'éthique & égalité ?')
})

test('plusieurs valeurs utilisent des paramètres répétés', () => {
  const query = serializeCourseSearchState(
    { ...emptyState, offers: ['Offre B', 'Offre A'] },
    courses,
  )
  const params = new URLSearchParams(query)

  assert.deepEqual(params.getAll('offer'), ['Offre A', 'Offre B'])
})

test('la sérialisation déduplique et rend l’ordre de sélection sans effet', () => {
  const first = serializeCourseSearchState(
    { ...emptyState, offers: ['Offre B', 'Offre A', 'Offre A'] },
    courses,
  )
  const second = serializeCourseSearchState(
    { ...emptyState, offers: ['Offre A', 'Offre B'] },
    courses,
  )

  assert.equal(first, second)
})

test('ignore les offres et entités inconnues', () => {
  assert.deepEqual(
    parseCourseSearchUrl('?offer=Inconnue&entity=Entit%C3%A9+%C3%89cole', courses),
    { ...emptyState, entities: ['Entité École'] },
  )
})

test('Domaine et Public nécessitent une offre ou une entité valide', () => {
  const restored = parseCourseSearchUrl(
    '?domain=Gestion&public=Public+cibl%C3%A9&theme=Collaboration',
    courses,
  )

  assert.deepEqual(restored, emptyState)
})

test('valide Domaine et Public selon les facettes primaires', () => {
  const restored = parseCourseSearchUrl(
    '?offer=Offre+A&domain=Gestion&domain=Inconnu&public=Public+cibl%C3%A9',
    courses,
  )

  assert.deepEqual(restored.domains, ['Gestion'])
  assert.deepEqual(restored.publics, ['Public ciblé'])
})

test('valide le Thème selon Domaine, Public et les facettes primaires', () => {
  const valid = parseCourseSearchUrl(
    '?offer=Offre+A&domain=Gestion&public=Public+cibl%C3%A9&theme=Collaboration',
    courses,
  )
  const invalid = parseCourseSearchUrl(
    '?offer=Offre+A&domain=Gestion&public=Public+cibl%C3%A9&theme=S%C3%A9curit%C3%A9',
    courses,
  )

  assert.deepEqual(valid.themes, ['Collaboration'])
  assert.deepEqual(invalid.themes, [])
})

test('une ancienne URL conserve ses valeurs encore valides', () => {
  const restored = parseCourseSearchUrl(
    '?q=projet&offer=Offre+A&offer=Ancienne&domain=Gestion&theme=Ancien',
    courses,
  )

  assert.equal(restored.search, 'projet')
  assert.deepEqual(restored.offers, ['Offre A'])
  assert.deepEqual(restored.domains, ['Gestion'])
  assert.deepEqual(restored.themes, [])
})

test('accepte un tri valide, rejette un tri inconnu et omet le tri par défaut', () => {
  assert.equal(parseCourseSearchUrl('?sort=code-desc', courses).sort, 'code-desc')
  assert.equal(parseCourseSearchUrl('?sort=inconnu', courses).sort, 'title-asc')
  assert.equal(serializeCourseSearchState(emptyState, courses), '')
})

test('un aller-retour état vers URL restaure le même état normalisé', () => {
  const state = {
    search: 'formation numérique',
    offers: ['Offre A'],
    entities: ['Entité École'],
    domains: ['Gestion'],
    themes: ['Collaboration'],
    publics: ['Public ciblé'],
    sort: 'code-asc',
  }
  const normalized = normalizeCourseSearchState(state, courses)
  const query = serializeCourseSearchState(state, courses)

  assert.deepEqual(parseCourseSearchUrl(query, courses), normalized)
})

test('la canonicalisation est stable et n’ajoute jamais de pagination', () => {
  const first = serializeCourseSearchState(
    parseCourseSearchUrl('?page=4&offer=Offre+B&offer=Offre+A&sort=title-asc', courses),
    courses,
  )
  const second = serializeCourseSearchState(
    parseCourseSearchUrl(first, courses),
    courses,
  )

  assert.equal(first, second)
  assert.equal(new URLSearchParams(first).has('page'), false)
  assert.equal(new URLSearchParams(first).has('sort'), false)
})
