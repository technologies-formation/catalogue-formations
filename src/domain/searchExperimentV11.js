import {
  EXPERIMENTAL_QUERY_VARIANTS,
  normalizeExperimentalSearchText,
} from './searchExperiment.js'

const SEARCH_FIELDS = [
  ['code', 100],
  ['titleRaw', 24],
  ['domainRaw', 10],
  ['themeRaw', 10],
  ['publicRaw', 5],
  ['targetAudienceRaw', 5],
  ['catalogueOffers', 5],
]

const GENERIC_FRENCH_STOP_WORDS = new Set([
  'a',
  'au',
  'aux',
  'avec',
  'dans',
  'd',
  'de',
  'des',
  'du',
  'en',
  'et',
  'faire',
  'la',
  'le',
  'les',
  'l',
  'ma',
  'mes',
  'mon',
  'par',
  'pour',
  'qu',
  'que',
  'qui',
  'sa',
  'ses',
  'son',
  'sur',
  'une',
  'un',
])

const SHORT_ACRONYMS = new Set(['IA', 'SI', 'RH'])
const corpusCache = new WeakMap()
const frenchCollator = new Intl.Collator('fr', { sensitivity: 'base' })

export function searchCoursesV11(courses, search) {
  const normalizedQuery = normalizeExperimentalSearchText(search)
  if (!normalizedQuery) {
    return courses.map((course) => ({ course, score: 0, explanation: null })).sort(compareResults)
  }

  const corpus = getCorpus(courses)
  const variants = buildQueryVariants(normalizedQuery, search)

  const scoredResults = corpus.documents
    .map((document) => scoreDocument(document, variants, normalizedQuery, corpus))
    .filter(({ score }) => score > 0)
    .sort(compareResults)
  const bestScore = scoredResults[0]?.score ?? 0

  return scoredResults.filter(({ score }) => score >= bestScore * 0.4)
}

export function tokenizeSearchV11(value) {
  return normalizeExperimentalSearchText(value)
    .split(' ')
    .filter(Boolean)
    .filter((token) => !GENERIC_FRENCH_STOP_WORDS.has(token))
    .map(normalizeToken)
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
        normalized: normalizeExperimentalSearchText(value),
        rawTokens: tokenizeCaseSensitive(value),
        tokens: tokenizeSearchV11(value),
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
  const normalizedKey = tokenizeSearchV11(normalizedQuery).join(' ')
  const synonymVariants = EXPERIMENTAL_QUERY_VARIANTS[normalizedKey] ?? []
  const trimmedQuery = String(originalQuery).trim()

  return [
    {
      tokens: tokenizeSearchV11(normalizedQuery),
      factor: 1,
      literal: true,
      acronym: SHORT_ACRONYMS.has(trimmedQuery) ? trimmedQuery : null,
    },
    ...synonymVariants.map((variant) => ({
      tokens: tokenizeSearchV11(variant),
      factor: 0.82,
      literal: false,
      acronym: null,
    })),
  ].filter(({ tokens }) => tokens.length > 0)
}

function scoreDocument(document, variants, normalizedQuery, corpus) {
  let best = null

  for (const variant of variants) {
    const tokenDetails = variant.tokens.map((token) =>
      scoreToken(document, token, variant.acronym, corpus),
    )
    const matched = tokenDetails.filter(({ fieldScore }) => fieldScore > 0)
    if (matched.length === 0) continue

    const totalImportance = tokenDetails.reduce(
      (sum, detail) => sum + detail.idf * detail.queryFactor,
      0,
    )
    const matchedImportance = matched.reduce(
      (sum, detail) => sum + detail.idf * detail.queryFactor,
      0,
    )
    const coverage = matchedImportance / totalImportance
    const strongestEvidence = Math.max(
      ...matched.map(({ fieldScore, idf, queryFactor }) => fieldScore * idf * queryFactor),
    )

    // Une correspondance partielle reste admise si elle est suffisamment discriminante.
    if (coverage < 0.5 && strongestEvidence < 45) continue
    if (!variant.literal && coverage < 0.5) continue

    let score = matched.reduce(
      (sum, detail) => sum + detail.fieldScore * detail.idf * detail.queryFactor,
      0,
    )
    score += coverage * 45
    if (matched.length > 1) score += (matched.length - 1) * 14
    if (coverage === 1 && variant.tokens.length > 1) score += 30

    const title = document.fields.find(({ field }) => field === 'titleRaw').normalized
    const variantExpression = variant.tokens.join(' ')
    if (variant.literal && title.includes(normalizedQuery)) score += 90
    if (!variant.literal && title.includes(variantExpression)) score += 70
    if (
      variant.literal &&
      normalizeExperimentalSearchText(document.course.code) === normalizedQuery
    ) {
      score += 1000
    }

    score *= variant.factor
    const candidate = {
      course: document.course,
      score: round(score),
      explanation: {
        variant: variant.literal ? 'literal' : 'synonym',
        coverage: round(coverage),
        matchedTerms: matched.map(({ token, idf, fields }) => ({
          token,
          idf: round(idf),
          queryFactor: detailQueryFactor(token),
          fields,
        })),
      },
    }

    if (!best || candidate.score > best.score) best = candidate
  }

  return best ?? { course: document.course, score: 0, explanation: null }
}

function scoreToken(document, token, acronym, corpus) {
  const fields = document.fields
    .filter((field) =>
      acronym ? field.rawTokens.includes(acronym) : field.tokens.includes(token),
    )
    .map(({ field, weight }) => ({ field, weight }))

  return {
    token,
    fields,
    fieldScore: fields.reduce((sum, { weight }) => sum + weight, 0),
    idf: getIdf(token, corpus),
    queryFactor: detailQueryFactor(token),
  }
}

function detailQueryFactor(token) {
  return /(?:er|ir|re)$/.test(token) && token.length > 4 ? 0.55 : 1
}

function getIdf(token, corpus) {
  const frequency = corpus.documentFrequency.get(token) ?? 0
  return Math.log((corpus.size + 1) / (frequency + 1)) + 1
}

function readField(course, field) {
  const value = course[field]
  return Array.isArray(value) ? value.join(' ') : value
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

function compareResults(left, right) {
  return (
    right.score - left.score ||
    frenchCollator.compare(left.course.titleRaw ?? '', right.course.titleRaw ?? '')
  )
}

function round(value) {
  return Math.round(value * 100) / 100
}
