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

export function searchCoursesV12(courses, search) {
  return explainSearchV12(courses, search).accepted
}

export function explainSearchV12(courses, search) {
  const normalizedQuery = normalizeExperimentalSearchText(search)
  if (!normalizedQuery) {
    const accepted = courses
      .map((course) => ({ course, score: 0, explanation: null }))
      .sort(compareResults)
    return { accepted, rejected: [], thresholds: thresholds(0) }
  }

  const corpus = getCorpus(courses)
  const variants = buildQueryVariants(normalizedQuery, search)
  const evaluated = corpus.documents
    .map((document) => evaluateDocument(document, variants, normalizedQuery, corpus))
    .sort(compareResults)
  const admissible = evaluated.filter(({ explanation }) => explanation?.minimumEvidence)
  const bestScore = admissible[0]?.score ?? 0
  const relativeThreshold = bestScore * RELATIVE_SCORE_THRESHOLD
  const appliedThreshold = Math.max(ABSOLUTE_SCORE_THRESHOLD, relativeThreshold)
  const accepted = admissible
    .filter(({ score }) => score >= appliedThreshold)
    .map((result) => withDecision(result, 'ACCEPTE', appliedThreshold))
  const acceptedCodes = new Set(accepted.map(({ course }) => course.code))
  const rejected = evaluated
    .filter(({ score, course }) => score > 0 && !acceptedCodes.has(course.code))
    .map((result) => withDecision(result, 'REJETE', appliedThreshold))

  return { accepted, rejected, thresholds: thresholds(bestScore) }
}

export function tokenizeSearchV12(value) {
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
        tokens: tokenizeSearchV12(value),
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
  const normalizedKey = tokenizeSearchV12(normalizedQuery).join(' ')
  const synonymVariants = EXPERIMENTAL_QUERY_VARIANTS[normalizedKey] ?? []
  const trimmedQuery = String(originalQuery).trim()
  return [
    {
      tokens: tokenizeSearchV12(normalizedQuery), factor: 1, literal: true,
      acronym: SHORT_ACRONYMS.has(trimmedQuery) ? trimmedQuery : null,
    },
    ...synonymVariants.map((variant) => ({
      tokens: tokenizeSearchV12(variant), factor: 0.82, literal: false, acronym: null,
    })),
  ].filter(({ tokens }) => tokens.length > 0)
}

function evaluateDocument(document, variants, normalizedQuery, corpus) {
  let best = null
  for (const variant of variants) {
    const details = variant.tokens.map((token) => scoreToken(document, token, variant.acronym, corpus))
    const matched = details.filter(({ fieldScore }) => fieldScore > 0)
    if (matched.length === 0) continue
    const totalMass = details.reduce((sum, detail) => sum + detail.mass, 0)
    const coveredMass = matched.reduce((sum, detail) => sum + detail.mass, 0)
    const coverage = coveredMass / totalMass
    const title = document.fields.find(({ field }) => field === 'titleRaw')
    const exactCode = variant.literal && normalizeExperimentalSearchText(document.course.code) === normalizedQuery
    const strongTitleExpression = variant.literal
      ? title.normalized.includes(normalizedQuery)
      : title.normalized.includes(variant.tokens.join(' '))
    const discriminantTitleTerm = matched.some(({ idf, token, queryFactor, fields }) =>
      idf >= HIGH_IDF_THRESHOLD && queryFactor === 1 && fields.some(({ field }) => field === 'titleRaw') &&
      title.tokens.includes(token),
    )
    const independentEvidence = matched.filter(({ queryFactor }) => queryFactor === 1).length
    const minimumEvidence = exactCode || strongTitleExpression ||
      (discriminantTitleTerm && (variant.tokens.length === 1 || coverage >= 0.4)) ||
      (discriminantTitleTerm && matched.some(({ idf }) => idf >= VERY_HIGH_IDF_THRESHOLD) && coverage >= 0.25) ||
      (independentEvidence >= 2 && coverage >= 0.3) ||
      coverage >= GLOBAL_COVERAGE_THRESHOLD

    let score = matched.reduce((sum, detail) => sum + detail.fieldScore * detail.mass, 0)
    score += coverage * 45
    if (independentEvidence > 1) score += (independentEvidence - 1) * 14
    if (coverage === 1 && variant.tokens.length > 1) score += 30
    if (strongTitleExpression) score += variant.literal ? 90 : 70
    if (exactCode) score += 1000
    score *= variant.factor

    const candidate = {
      course: document.course,
      score: round(score),
      explanation: {
        variant: variant.literal ? 'literal' : 'synonym',
        queryTerms: details.map(termExplanation),
        matchedTerms: matched.map(termExplanation),
        missingImportantTerms: details
          .filter(({ fieldScore, queryFactor }) => fieldScore === 0 && queryFactor === 1)
          .map(termExplanation),
        totalInformativeMass: round(totalMass),
        coveredInformativeMass: round(coveredMass),
        informativeCoverage: round(coverage),
        absoluteScore: round(score),
        evidence: { exactCode, strongTitleExpression, discriminantTitleTerm, independentEvidence },
        minimumEvidence,
      },
    }
    if (!best || candidate.score > best.score) best = candidate
  }
  return best ?? { course: document.course, score: 0, explanation: null }
}

function scoreToken(document, token, acronym, corpus) {
  const fields = document.fields
    .filter((field) => acronym ? field.rawTokens.includes(acronym) : field.tokens.includes(token))
    .map(({ field, weight }) => ({ field, weight }))
  const idf = getIdf(token, corpus)
  const queryFactor = intentionFactor(token)
  return { token, fields, fieldScore: fields.reduce((sum, field) => sum + field.weight, 0), idf, queryFactor, mass: idf * queryFactor }
}

function intentionFactor(token) {
  return /(?:er|ir|re)$/.test(token) && token.length > 4 ? 0.35 : 1
}

function termExplanation({ token, idf, queryFactor, fields = [] }) {
  return { token, idf: round(idf), queryFactor, mass: round(idf * queryFactor), fields }
}

function withDecision(result, decision, threshold) {
  const reason = decision === 'ACCEPTE'
    ? 'preuve minimale et seuils absolu/relatif atteints'
    : result.explanation.minimumEvidence
      ? 'score sous le seuil absolu/relatif'
      : 'preuve lexicale minimale insuffisante'
  return { ...result, explanation: { ...result.explanation, appliedThreshold: round(threshold), decision, reason } }
}

function thresholds(bestScore) {
  return {
    absolute: ABSOLUTE_SCORE_THRESHOLD,
    relativeFactor: RELATIVE_SCORE_THRESHOLD,
    relative: round(bestScore * RELATIVE_SCORE_THRESHOLD),
    applied: round(Math.max(ABSOLUTE_SCORE_THRESHOLD, bestScore * RELATIVE_SCORE_THRESHOLD)),
    minimumCoverage: GLOBAL_COVERAGE_THRESHOLD,
    highIdf: HIGH_IDF_THRESHOLD,
  }
}

function getIdf(token, corpus) {
  return Math.log((corpus.size + 1) / ((corpus.documentFrequency.get(token) ?? 0) + 1)) + 1
}

function readField(course, field) {
  const value = course[field]
  return Array.isArray(value) ? value.join(' ') : value
}

function tokenizeCaseSensitive(value) {
  return String(value ?? '').normalize('NFD').replace(/\p{M}/gu, '')
    .split(/[^\p{L}\p{N}]+/gu).filter(Boolean)
}

function normalizeToken(token) {
  if (token.length <= 3) return token
  if (token.endsWith('aux') && token.length > 5) return `${token.slice(0, -3)}al`
  if (token.endsWith('s') && token.length > 4) return token.slice(0, -1)
  return token
}

function compareResults(left, right) {
  return right.score - left.score || frenchCollator.compare(left.course.titleRaw ?? '', right.course.titleRaw ?? '')
}

function round(value) {
  return Math.round(value * 100) / 100
}
