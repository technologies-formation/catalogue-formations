const SEARCH_FIELDS = [
  ['code', 100],
  ['titleRaw', 24],
  ['domainRaw', 10],
  ['themeRaw', 10],
  ['publicRaw', 5],
  ['targetAudienceRaw', 5],
  ['catalogueOffers', 5],
]

const STOP_WORDS = new Set([
  'a',
  'au',
  'aux',
  'avec',
  'dans',
  'de',
  'des',
  'du',
  'et',
  'faire',
  'la',
  'le',
  'les',
  'mon',
  'une',
  'un',
])
const SHORT_ACRONYMS = new Set(['IA', 'SI', 'RH'])

// Petit dictionnaire volontairement limité au banc d'essai exploratoire.
export const EXPERIMENTAL_QUERY_VARIANTS = Object.freeze({
  ia: ['intelligence artificielle'],
  'intelligence artificielle': ['ia'],
  si: ["systeme information", "systemes information"],
  rh: ['ressources humaines'],
  tableur: ['excel'],
  'prise parole': ['parler public'],
  'parler devant groupe': ['parler public', 'prise parole'],
  cybersecurite: ['securite informatique', 'securite systeme information'],
  'securite informatique': ['cybersecurite', 'securite systeme information'],
  'nouvel employe': ['nouveau collaborateur', 'nouveaux collaborateurs', 'accueil collaborateurs'],
  'nouvelle collaboratrice': [
    'nouveau collaborateur',
    'nouveaux collaborateurs',
    'accueil collaborateurs',
  ],
  manager: ['management'],
  management: ['manager'],
  'gerer conflit': ['conflit'],
  'debuter administration': ['accueil administration', 'fonctionnement administration'],
  'apprendre manager': ['prise fonction manager', 'competences manager', 'management'],
  'mieux communiquer equipe': [
    'communication interpersonnelle equipe',
    'dynamique equipe',
  ],
  'faire presentation': ['presentation orale', 'prise parole'],
})

const frenchCollator = new Intl.Collator('fr', { sensitivity: 'base' })
const indexedCourseCache = new WeakMap()

export function normalizeExperimentalSearchText(value) {
  return String(value ?? '')
    .toLocaleLowerCase('fr-CH')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[\u2018\u2019\u201a\u201b\u2032\u00b4`]/gu, "'")
    .replace(/[\u2010-\u2015\u2212]/gu, '-')
    .replace(/[\u2019'\-_/]+/gu, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

export function tokenizeExperimentalSearch(value) {
  return normalizeExperimentalSearchText(value)
    .split(' ')
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token))
    .map(normalizeToken)
}

export function searchCoursesV0(courses, search) {
  const query = String(search).trim().toLocaleLowerCase('fr-CH')

  return courses
    .filter((course) =>
      `${course.code} ${course.titleRaw ?? ''}`
        .toLocaleLowerCase('fr-CH')
        .includes(query),
    )
    .sort(compareByTitle)
}

export function searchCoursesV1(courses, search) {
  const normalizedQuery = normalizeExperimentalSearchText(search)
  if (!normalizedQuery) return [...courses].sort(compareByTitle)

  const variants = buildQueryVariants(normalizedQuery, search)

  return courses
    .map((course) => ({ course, score: scoreCourse(course, variants, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || compareByTitle(left.course, right.course))
}

function buildQueryVariants(normalizedQuery, originalQuery) {
  const normalizedKey = tokenizeExperimentalSearch(normalizedQuery).join(' ')
  const synonymVariants = EXPERIMENTAL_QUERY_VARIANTS[normalizedKey] ?? []
  const trimmedQuery = String(originalQuery).trim()

  return [
    {
      tokens: tokenizeExperimentalSearch(normalizedQuery),
      factor: 1,
      literal: true,
      acronym: SHORT_ACRONYMS.has(trimmedQuery) ? trimmedQuery : null,
    },
    ...synonymVariants.map((variant) => ({
      tokens: tokenizeExperimentalSearch(variant),
      factor: 0.82,
      literal: false,
    })),
  ].filter(({ tokens }) => tokens.length > 0)
}

function scoreCourse(course, variants, normalizedQuery) {
  const indexedFields = getIndexedFields(course)

  let bestScore = 0

  for (const variant of variants) {
    const matchedTokens = variant.tokens.filter((queryToken) =>
      indexedFields.some(({ rawTokens, tokens }) =>
        variant.acronym ? rawTokens.includes(variant.acronym) : tokens.includes(queryToken),
      ),
    )
    const minimumMatches =
      variant.tokens.length <= 2 ? variant.tokens.length : Math.ceil(variant.tokens.length * 0.6)
    if (matchedTokens.length < minimumMatches) continue

    let score = 0
    for (const queryToken of matchedTokens) {
      const fieldScore = indexedFields.reduce(
        (total, field) =>
          total +
          ((variant.acronym
            ? field.rawTokens.includes(variant.acronym)
            : field.tokens.includes(queryToken))
            ? field.weight
            : 0),
        0,
      )
      score += fieldScore
    }

    const coverage = matchedTokens.length / variant.tokens.length
    score += coverage * 35
    if (coverage === 1 && variant.tokens.length > 1) score += 35

    const title = indexedFields.find(({ field }) => field === 'titleRaw').normalized
    if (variant.literal && title.includes(normalizedQuery)) score += 90
    if (!variant.literal && title.includes(variant.tokens.join(' '))) score += 70
    if (variant.literal && normalizeExperimentalSearchText(course.code) === normalizedQuery) score += 1000

    bestScore = Math.max(bestScore, score * variant.factor)
  }

  return Math.round(bestScore * 100) / 100
}

function getIndexedFields(course) {
  const cached = indexedCourseCache.get(course)
  if (cached) return cached

  const indexedFields = SEARCH_FIELDS.map(([field, weight]) => ({
    field,
    weight,
    normalized: normalizeExperimentalSearchText(readField(course, field)),
    rawTokens: tokenizeCaseSensitive(readField(course, field)),
    tokens: tokenizeExperimentalSearch(readField(course, field)),
  }))
  indexedCourseCache.set(course, indexedFields)
  return indexedFields
}

function tokenizeCaseSensitive(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^\p{L}\p{N}]+/gu)
    .filter(Boolean)
}

function readField(course, field) {
  const value = course[field]
  return Array.isArray(value) ? value.join(' ') : value
}

function normalizeToken(token) {
  if (token.length <= 3) return token
  if (token.endsWith('aux') && token.length > 5) return `${token.slice(0, -3)}al`
  if (token.endsWith('s') && token.length > 4) return token.slice(0, -1)
  return token
}

function compareByTitle(left, right) {
  return frenchCollator.compare(left.titleRaw ?? '', right.titleRaw ?? '')
}
