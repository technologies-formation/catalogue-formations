const SEARCH_FIELDS = [
  ['code', 100],
  ['titleRaw', 24],
  ['domainRaw', 10],
  ['themeRaw', 10],
  ['publicRaw', 5],
  ['targetAudienceRaw', 5],
  ['catalogueOffers', 5],
]

const RECALL_SEARCH_FIELDS = [
  ...SEARCH_FIELDS,
  ['objectivesRaw', 3],
  ['contentRaw', 2],
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
  'j', 'je', 'm', 'me', 'moi',
  'aimerais', 'ameliorer', 'apprendre', 'besoin', 'cherche', 'chercher',
  'formation', 'mieux', 'niveau', 'souhaite', 'souhaiter', 'souhaiterais',
  'veux', 'voudrais',
  'la', 'le', 'les', 'l', 'ma', 'mes', 'mon', 'nous', 'notre', 'nos',
  'par', 'pour', 'qu', 'que', 'qui',
  'sa', 'ses', 'son', 'sur', 'une', 'un', 'vous', 'votre', 'vos',
])
const OBJECTIVE_PHRASE_IGNORED_TOKENS = new Set([
  'dois', 'doit', 'devons', 'devez', 'doivent',
  'devrais', 'devrait', 'devrions', 'devriez', 'devraient',
  'peux', 'peut', 'pouvons', 'pouvez', 'peuvent',
  'pourrais', 'pourrait', 'pourrions', 'pourriez', 'pourraient',
])

// Ces verbes seuls ne désignent pas une compétence métier.
const GENERIC_OBJECTIVE_TOKENS = new Set(['savoir', 'utiliser', 'etre', 'capable'])

const CLASSIC_QUERY_TOKEN_EQUIVALENTS = new Map([
  ['conduire', 'conduite'],
])

const BEGINNER_QUERY_TOKENS = new Set([
  'debute',
  'debuter',
  'debutant',
  'debutante',
  'commence',
  'commencer',
])

const BEGINNER_QUERY_ALTERNATIVES = ['base', 'fondamental']

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

  const corpus = getCorpus(courses, SEARCH_FIELDS)
  const variants = buildQueryVariants(normalizedQuery, query)
    .map((variant) => {
      // Retirer seulement une amorce d'utilisation, en conservant le sujet
      // et tous les qualificatifs. Le rappel Luna ne passe pas ici.
      const prefixLength = variant.tokens[0] === 'utiliser'
        ? 1
        : variant.tokens[0] === 'savoir' && variant.tokens[1] === 'utiliser'
          ? 2
          : 0
      if (!prefixLength || variant.tokens.length <= prefixLength) return variant
      return { ...variant, tokens: variant.tokens.slice(prefixLength) }
    })
    .flatMap((variant) => {
      const equivalentTokens = variant.tokens.map(normalizeClassicQueryToken)
      const hasEquivalent = equivalentTokens.some(
        (token, index) => token !== variant.tokens[index],
      )

      if (!hasEquivalent) return [variant]

      return [
        variant,
        {
          ...variant,
          tokens: equivalentTokens,
          intentionTokens: variant.tokens,
          literal: false,
          factor: variant.factor * 0.95,
        },
      ]
    })
    .flatMap((variant) => {
      const beginnerIndex = variant.tokens.findIndex((token) =>
        BEGINNER_QUERY_TOKENS.has(token),
      )

      if (beginnerIndex < 0) return [variant]

      const intentionTokens = variant.intentionTokens ?? variant.tokens

      return [
        variant,
        ...BEGINNER_QUERY_ALTERNATIVES.map((alternative) => ({
          ...variant,
          tokens: variant.tokens.map((token, index) =>
            index === beginnerIndex ? alternative : token,
          ),
          intentionTokens,
          literal: false,
          factor: variant.factor * 0.95,
        })),
      ]
    })
  const candidates = corpus.documents
    .map((document) =>
      evaluateDocument(document, variants, normalizedQuery, corpus, true),
    )
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


export function searchCourseCandidates(courses, query, limit = 40) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []

  const corpus = getCorpus(courses, RECALL_SEARCH_FIELDS)
  const variants = buildQueryVariants(normalizedQuery, query)

  return corpus.documents
    .map((document) =>
      evaluateDocument(document, variants, normalizedQuery, corpus),
    )
    .filter(({ score }) => score > 0)
    .sort(compareResults)
    .slice(0, limit)
    .map(({ course, score, minimumEvidence }) => ({
      course,
      score,
      minimumEvidence,
    }))
}

function getCorpus(courses, searchFields) {
  let cachedCorpora = corpusCache.get(courses)

  if (!cachedCorpora) {
    cachedCorpora = new Map()
    corpusCache.set(courses, cachedCorpora)
  }

  const cached = cachedCorpora.get(searchFields)
  if (cached) return cached

  const documents = courses.map((course) => ({
    course,
    objectiveTokens: tokenizeSearch(
      course.officialData?.objectivesRaw ?? '',
    ),
    fields: searchFields.map(([field, weight]) => {
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
  cachedCorpora.set(searchFields, corpus)
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

function evaluateDocument(
  document,
  variants,
  normalizedQuery,
  corpus,
  allowObjectivePhrase = false,
) {
  let best = null
  for (const variant of variants) {
    const details = variant.tokens.map((token, index) =>
      scoreToken(
        document,
        token,
        variant.acronym,
        corpus,
        variant.intentionTokens?.[index] ?? token,
      ),
    )
    const matched = details.filter(({ fieldScore }) => fieldScore > 0)
    const objectiveQueryTokens = allowObjectivePhrase
      ? variant.tokens.filter(
          (token) => !OBJECTIVE_PHRASE_IGNORED_TOKENS.has(token),
        )
      : []

    const objectivePhraseLength = allowObjectivePhrase
      ? longestContiguousMatch(objectiveQueryTokens, document.objectiveTokens)
      : 0

    if (matched.length === 0 && objectivePhraseLength < 2) continue

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
    // En recherche classique, une requête de plusieurs termes ne doit pas
    // être validée par un seul mot rare présent dans un titre.
    // Le rappel Luna conserve volontairement son comportement permissif.
    const sufficientLexicalEvidence =
      !allowObjectivePhrase ||
      variant.tokens.length === 1 ||
      matched.length >= 2

    const minimumEvidence =
      exactCode ||
      strongTitleExpression ||
      objectivePhraseLength >= 2 ||
      (sufficientLexicalEvidence &&
        ((discriminantTitleTerm &&
          (variant.tokens.length === 1 || coverage >= 0.4)) ||
          (discriminantTitleTerm &&
            matched.some(({ idf }) => idf >= VERY_HIGH_IDF_THRESHOLD) &&
            coverage >= 0.25) ||
          (independentEvidence >= 2 && coverage >= 0.3) ||
          coverage >= GLOBAL_COVERAGE_THRESHOLD))

    let score = matched.reduce(
      (sum, detail) => sum + detail.fieldScore * detail.mass,
      0,
    )
    score += coverage * 45
    if (independentEvidence > 1) score += (independentEvidence - 1) * 14
    if (coverage === 1 && variant.tokens.length > 1) score += 30
    if (strongTitleExpression) score += variant.literal ? 90 : 70
    if (objectivePhraseLength >= 2) {
      score += 70 + (objectivePhraseLength - 2) * 20
    }
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

function normalizeClassicQueryToken(token) {
  return CLASSIC_QUERY_TOKEN_EQUIVALENTS.get(token) ?? token
}

function longestContiguousMatch(queryTokens, targetTokens) {
  if (queryTokens.length < 2 || targetTokens.length < 2) return 0

  let longest = 0

  for (let queryStart = 0; queryStart < queryTokens.length; queryStart += 1) {
    for (let targetStart = 0; targetStart < targetTokens.length; targetStart += 1) {
      let length = 0

      while (
        queryStart + length < queryTokens.length &&
        targetStart + length < targetTokens.length &&
        queryTokens[queryStart + length] === targetTokens[targetStart + length]
      ) {
        length += 1
      }

      const hasSubject = queryTokens
        .slice(queryStart, queryStart + length)
        .some((token) => !GENERIC_OBJECTIVE_TOKENS.has(token))
      if (hasSubject && length > longest) longest = length
    }
  }

  return longest
}

function scoreToken(
  document,
  token,
  acronym,
  corpus,
  intentionToken = token,
) {
  const fields = document.fields
    .filter((field) =>
      acronym ? field.rawTokens.includes(acronym) : field.tokens.includes(token),
    )
    .map(({ field, weight }) => ({ field, weight }))
  const idf = getIdf(token, corpus)
  const queryFactor = intentionFactor(intentionToken)

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
  if (token.endsWith('eaux') && token.length > 5) return token.slice(0, -1)
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
