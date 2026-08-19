const SEARCH_FIELDS = [
  ['code', 100],
  ['titleRaw', 24],
  ['domainRaw', 10],
  ['themeRaw', 10],
  ['publicRaw', 5],
  ['targetAudienceRaw', 5],
  ['catalogueOffers', 5],
]

const QUERY_VARIANTS = Object.freeze({
  ia: ['intelligence artificielle'],
  'intelligence artificielle': ['ia'],
  si: ['systeme information', 'systemes information'],
  rh: ['ressources humaines'],
  tableur: ['excel'],
  'prise parole': ['parler public'],
  'parler devant groupe': ['parler public', 'prise parole'],
  cybersecurite: ['securite informatique', 'securite systeme information'],
  'securite informatique': ['cybersecurite', 'securite systeme information'],
  'nouvel employe': [
    'nouveau collaborateur',
    'nouveaux collaborateurs',
    'accueil collaborateurs',
  ],
  'nouvelle collaboratrice': [
    'nouveau collaborateur',
    'nouveaux collaborateurs',
    'accueil collaborateurs',
  ],
  manager: ['management'],
  management: ['manager'],
  'gerer conflit': ['conflit'],
  'debuter administration': [
    'accueil administration',
    'fonctionnement administration',
  ],
  'apprendre manager': [
    'prise fonction manager',
    'competences manager',
    'management',
  ],
  'mieux communiquer equipe': [
    'communication interpersonnelle equipe',
    'dynamique equipe',
  ],
  'faire presentation': ['presentation orale', 'prise parole'],
})

const STOP_WORDS = new Set([
  'a', 'au', 'aux', 'avec', 'dans', 'd', 'de', 'des', 'du', 'en', 'et', 'faire',
  'la', 'le', 'les', 'l', 'ma', 'mes', 'mon', 'par', 'pour', 'qu', 'que', 'qui',
  'sa', 'ses', 'son', 'sur', 'une', 'un',
])
const SHORT_ACRONYMS = new Set(['IA', 'SI', 'RH'])
const ABSOLUTE_SCORE_THRESHOLD = 42
const RELATIVE_SCORE_THRESHOLD = 0.45
const GLOBAL_COVERAGE_THRESHOLD = 0.68
const HIGH_IDF_THRESHOLD = 4.5
const VERY_HIGH_IDF_THRESHOLD = 6.5
const corpusCache = new WeakMap()
const frenchCollator = new Intl.Collator('fr', { sensitivity: 'base' })

export function searchCourses(courses, query) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return courses

  const corpus = getCorpus(courses)
  const variants = buildQueryVariants(normalizedQuery, query)
  const candidates = corpus.documents
    .map((document) => evaluateDocument(document, variants, normalizedQuery, corpus))
    .filter((candidate) => candidate.minimumEvidence)
    .sort(compareResults)
  const bestScore = candidates[0]?.score ?? 0
  const appliedThreshold = Math.max(
    ABSOLUTE_SCORE_THRESHOLD,
    bestScore * RELATIVE_SCORE_THRESHOLD,
  )

  return candidates
    .filter(({ score }) => score >= appliedThreshold)
    .map(({ course }) => course)
}

function getCorpus(courses) {
  const cached = corpusCache.get(courses)
  if (cached) return cached

  const documents = courses.map((course) => ({
    course,
    fields: SEARCH_FIELDS.map(([field, weight]) => {
      const value = readField(course, field)
      return {
        field,
        weight,
        normalized: normalizeSearchText(value),
        rawTokens: tokenizeCaseSensitive(value),
        tokens: tokenizeSearch(value),
      }
    }),
  }))
  const documentFrequency = new Map()
  for (const document of documents) {
    const uniqueTokens = new Set(document.fields.flatMap(({ tokens }) => tokens))
    for (const token of uniqueTokens) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1)
    }
  }

  const corpus = { documents, documentFrequency, size: documents.length }
  corpusCache.set(courses, corpus)
  return corpus
}

function buildQueryVariants(normalizedQuery, originalQuery) {
  const normalizedKey = tokenizeSearch(normalizedQuery).join(' ')
  const synonymVariants = QUERY_VARIANTS[normalizedKey] ?? []
  const trimmedQuery = String(originalQuery).trim()

  return [
    {
      tokens: tokenizeSearch(normalizedQuery),
      factor: 1,
      literal: true,
      acronym: SHORT_ACRONYMS.has(trimmedQuery) ? trimmedQuery : null,
    },
    ...synonymVariants.map((variant) => ({
      tokens: tokenizeSearch(variant),
      factor: 0.82,
      literal: false,
      acronym: null,
    })),
  ].filter(({ tokens }) => tokens.length > 0)
}

function evaluateDocument(document, variants, normalizedQuery, corpus) {
  let best = null
  for (const variant of variants) {
    const details = variant.tokens.map((token) =>
      scoreToken(document, token, variant.acronym, corpus),
    )
    const matched = details.filter(({ fieldScore }) => fieldScore > 0)
    if (matched.length === 0) continue

    const totalMass = details.reduce((sum, detail) => sum + detail.mass, 0)
    const coveredMass = matched.reduce((sum, detail) => sum + detail.mass, 0)
    const coverage = coveredMass / totalMass
    const title = document.fields.find(({ field }) => field === 'titleRaw')
    const exactCode =
      variant.literal && normalizeSearchText(document.course.code) === normalizedQuery
    const strongTitleExpression = variant.literal
      ? title.normalized.includes(normalizedQuery)
      : title.normalized.includes(variant.tokens.join(' '))
    const discriminantTitleTerm = matched.some(
      ({ idf, token, queryFactor, fields }) =>
        idf >= HIGH_IDF_THRESHOLD &&
        queryFactor === 1 &&
        fields.some(({ field }) => field === 'titleRaw') &&
        title.tokens.includes(token),
    )
    const independentEvidence = matched.filter(
      ({ queryFactor }) => queryFactor === 1,
    ).length
    const minimumEvidence =
      exactCode ||
      strongTitleExpression ||
      (discriminantTitleTerm &&
        (variant.tokens.length === 1 || coverage >= 0.4)) ||
      (discriminantTitleTerm &&
        matched.some(({ idf }) => idf >= VERY_HIGH_IDF_THRESHOLD) &&
        coverage >= 0.25) ||
      (independentEvidence >= 2 && coverage >= 0.3) ||
      coverage >= GLOBAL_COVERAGE_THRESHOLD

    let score = matched.reduce(
      (sum, detail) => sum + detail.fieldScore * detail.mass,
      0,
    )
    score += coverage * 45
    if (independentEvidence > 1) score += (independentEvidence - 1) * 14
    if (coverage === 1 && variant.tokens.length > 1) score += 30
    if (strongTitleExpression) score += variant.literal ? 90 : 70
    if (exactCode) score += 1000
    score *= variant.factor

    const candidate = {
      course: document.course,
      score: Math.round(score * 100) / 100,
      minimumEvidence,
    }
    if (!best || candidate.score > best.score) best = candidate
  }

  return best ?? { course: document.course, score: 0, minimumEvidence: false }
}

function scoreToken(document, token, acronym, corpus) {
  const fields = document.fields
    .filter((field) =>
      acronym ? field.rawTokens.includes(acronym) : field.tokens.includes(token),
    )
    .map(({ field, weight }) => ({ field, weight }))
  const idf = getIdf(token, corpus)
  const queryFactor = intentionFactor(token)

  return {
    fields,
    fieldScore: fields.reduce((sum, field) => sum + field.weight, 0),
    idf,
    queryFactor,
    mass: idf * queryFactor,
    token,
  }
}

function normalizeSearchText(value) {
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

function tokenizeSearch(value) {
  return normalizeSearchText(value)
    .split(' ')
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token))
    .map(normalizeToken)
}

function tokenizeCaseSensitive(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^\p{L}\p{N}]+/gu)
    .filter(Boolean)
}

function normalizeToken(token) {
  if (token.length <= 3) return token
  if (token.endsWith('aux') && token.length > 5) return `${token.slice(0, -3)}al`
  if (token.endsWith('s') && token.length > 4) return token.slice(0, -1)
  return token
}

function intentionFactor(token) {
  return /(?:er|ir|re)$/.test(token) && token.length > 4 ? 0.35 : 1
}

function getIdf(token, corpus) {
  return Math.log(
    (corpus.size + 1) / ((corpus.documentFrequency.get(token) ?? 0) + 1),
  ) + 1
}

function readField(course, field) {
  const value =
    field === 'code' || field === 'catalogueOffers'
      ? course[field]
      : course.officialData?.[field]
  return Array.isArray(value) ? value.join(' ') : value
}

function compareResults(left, right) {
  return (
    right.score - left.score ||
    frenchCollator.compare(
      left.course.officialData?.titleRaw ?? '',
      right.course.officialData?.titleRaw ?? '',
    )
  )
}
