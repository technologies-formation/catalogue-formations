import officialCatalogueSnapshot from '../src/data/officialCatalogueSnapshot.json' with {
  type: 'json',
}
import { fullCatalogueCourses } from '../src/data/fullCatalogueCourses.js'
import { searchCourseCandidates } from '../src/domain/courseSearch.js'

const MODEL = 'gpt-5.6-luna'
const LOCAL_RECALL_LIMIT = 40

const PRICE = {
  input: 0.20,
  cachedInput: 0.02,
  cacheWrite: 0.25,
  output: 1.20,
}

const ultraCompactCatalogue = fullCatalogueCourses.map((course) => ({
  code: course.code,
  title: course.officialData?.titleRaw ?? '',
  domain: course.officialData?.domainRaw ?? '',
  theme: course.officialData?.themeRaw ?? '',
  public: course.officialData?.publicRaw ?? '',
  targetAudience: course.officialData?.targetAudienceRaw ?? '',
}))

const officialCodes = ultraCompactCatalogue.map(({ code }) => code)

const detailedByCode = new Map(
  officialCatalogueSnapshot.map((course) => [
    course.code,
    {
      code: course.code,
      title: clean(course.titleRaw),
      organizingEntity: clean(course.organizingEntityRaw),
      domain: clean(course.domainRaw),
      theme: clean(course.themeRaw),
      public: clean(course.publicRaw),
      targetAudience: clean(course.targetAudienceRaw),
      duration: clean(course.durationRaw),
      generalInformation: clean(course.generalInformationRaw),
      objectives: clean(course.objectivesRaw),
      content: clean(course.contentRaw),
      prerequisites: clean(course.prerequisitesRaw),
      additionalInformation: clean(course.additionalInformationRaw),
    },
  ]),
)

const courseByCode = new Map(
  fullCatalogueCourses.map((course) => [course.code, course]),
)

function clean(value) {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(' | ')

  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractText(response) {
  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === 'output_text')
    .map((item) => item.text)
    .join('')
}

function usageCost(usage = {}) {
  const input = usage.input_tokens ?? 0
  const output = usage.output_tokens ?? 0
  const details = usage.input_tokens_details ?? {}

  const cached = details.cached_tokens ?? 0
  const written = details.cache_write_tokens ?? 0
  const uncached = Math.max(0, input - cached - written)

  const cost =
    (uncached / 1_000_000) * PRICE.input +
    (cached / 1_000_000) * PRICE.cachedInput +
    (written / 1_000_000) * PRICE.cacheWrite +
    (output / 1_000_000) * PRICE.output

  return {
    input,
    output,
    cached,
    written,
    uncached,
    cost,
  }
}

async function callOpenAI(body) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `Erreur OpenAI HTTP ${response.status}`,
    )
  }

  return data
}

export async function searchWithLuna(query) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY absente côté serveur')
  }

  const normalizedQuery = String(query ?? '').trim()

  if (!normalizedQuery) {
    throw new Error('La requête est vide')
  }

  /*
   * PASSE 1
   * Luna parcourt le catalogue ultra-compact et privilégie le rappel.
   */
  const first = await callOpenAI({
    model: MODEL,
    reasoning: {
      effort: 'none',
    },
    store: false,
    max_output_tokens: 600,

    prompt_cache_key: 'catalogue-ege-ultracompact-v2',

    instructions:
      `Tu effectues une première sélection dans le catalogue officiel.
Analyse toute la demande utilisateur.
Privilégie le RAPPEL : conserve les formations pouvant raisonnablement être pertinentes.
Tiens compte du contexte professionnel et du public lorsqu'ils sont exprimés.
Une demande peut comporter plusieurs intentions.
N'invente jamais de formation.
Retourne au maximum 40 codes, classés du plus pertinent au moins pertinent.`,

    input:
      `CATALOGUE OFFICIEL :
${JSON.stringify(ultraCompactCatalogue)}

REQUÊTE UTILISATEUR :
${normalizedQuery}`,

    text: {
      format: {
        type: 'json_schema',
        name: 'catalogue_candidate_selection',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            codes: {
              type: 'array',
              items: {
                type: 'string',
                enum: officialCodes,
              },
              maxItems: 40,
            },
          },
          required: ['codes'],
          additionalProperties: false,
        },
      },
    },
  })

  const firstResult = JSON.parse(extractText(first))

  /*
   * RAPPEL LEXICAL LOCAL
   */
  const localCodes = searchCourseCandidates(
    fullCatalogueCourses,
    normalizedQuery,
    LOCAL_RECALL_LIMIT,
  ).map(({ course }) => course.code)

  /*
   * UNION ET DEDUPLICATION
   */
  const candidateCodes = [
    ...new Set([
      ...(firstResult.codes ?? []),
      ...localCodes,
    ]),
  ]

  const detailedCandidates = candidateCodes
    .map((code) => detailedByCode.get(code))
    .filter(Boolean)

  const cost1 = usageCost(first.usage)

  if (candidateCodes.length === 0) {
    return {
      mode: 'llm-two-pass-plus-lexical',
      abstain: true,
      codes: [],
      recommendedCodes: [],
      complementaryCodes: [],
      reason: 'Aucune formation candidate suffisamment proche.',
      results: [],
      recommendedResults: [],
      complementaryResults: [],
      candidates: {
        luna: 0,
        local: localCodes.length,
        union: 0,
      },
      usage: {
        pass1: cost1,
        pass2: null,
        total: cost1,
      },
    }
  }

  /*
   * PASSE 2
   * Luna lit les fiches détaillées et décide.
   */
  const second = await callOpenAI({
    model: MODEL,
    reasoning: {
      effort: 'none',
    },
    store: false,
    max_output_tokens: 500,

    instructions:
      `Tu réalises la sélection finale de formations à partir des fiches détaillées.

Règles impératives :
- évalue la demande dans son ensemble ;
- les éléments CENTRAUX de la demande doivent être satisfaits ;
- une formation seulement voisine ou partiellement pertinente ne suffit pas ;
- distingue ce qu'une formation permet réellement d'acquérir de ce qu'elle évoque seulement comme sujet ;
- tiens compte du public et du contexte professionnel lorsqu'ils sont exprimés ;
- distingue deux niveaux de recommandation ;
- recommendedCodes contient de 1 à 3 formations répondant directement et substantiellement au besoin principal ;
- complementaryCodes contient de 0 à 3 formations utiles pour approfondir, poursuivre ou couvrir un besoin plus spécifique ;
- une formation complémentaire ne doit jamais compenser l'absence d'une formation principale réellement pertinente ;
- privilégie une formation principale unique lorsqu'elle couvre explicitement et substantiellement plusieurs dimensions centrales de la demande ;
- ne place jamais le même code dans les deux listes ;
- classe chaque liste du plus pertinent au moins pertinent ;
- si aucune formation ne répond suffisamment au besoin, abstain doit être true et les deux listes doivent être vides ;
- si abstain est false, recommendedCodes doit contenir au moins une formation ;
- complementaryCodes peut être vide lorsqu'aucun complément n'apporte de réelle valeur ;
- utilise exclusivement les codes autorisés.`,

    input:
      `FICHES DÉTAILLÉES DES CANDIDATS :
${JSON.stringify(detailedCandidates)}

REQUÊTE UTILISATEUR :
${normalizedQuery}`,

    text: {
      format: {
        type: 'json_schema',
        name: 'catalogue_final_selection',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            abstain: {
              type: 'boolean',
            },
            recommendedCodes: {
              type: 'array',
              items: {
                type: 'string',
                enum: candidateCodes,
              },
              maxItems: 3,
            },
            complementaryCodes: {
              type: 'array',
              items: {
                type: 'string',
                enum: candidateCodes,
              },
              maxItems: 3,
            },
            reason: {
              type: 'string',
            },
          },
          required: [
            'abstain',
            'recommendedCodes',
            'complementaryCodes',
            'reason',
          ],
          additionalProperties: false,
        },
      },
    },
  })

  const finalResult = JSON.parse(extractText(second))
  const cost2 = usageCost(second.usage)

  const recommendedCodes = finalResult.abstain
    ? []
    : [...new Set(finalResult.recommendedCodes ?? [])]

  const recommendedCodeSet = new Set(recommendedCodes)

  const complementaryCodes = finalResult.abstain
    ? []
    : [...new Set(finalResult.complementaryCodes ?? [])].filter(
        (code) => !recommendedCodeSet.has(code),
      )

  const finalCodes = [...recommendedCodes, ...complementaryCodes]

  const mapResults = (codes) =>
    codes
      .map((code) => courseByCode.get(code))
      .filter(Boolean)
      .map((course) => ({
        code: course.code,
        title: course.officialData?.titleRaw ?? '',
        domain: course.officialData?.domainRaw ?? '',
        theme: course.officialData?.themeRaw ?? '',
        public: course.officialData?.publicRaw ?? '',
        targetAudience: course.officialData?.targetAudienceRaw ?? '',
        catalogueOffers: course.catalogueOffers ?? [],
        sourceUrl: course.sourceUrl ?? '',
      }))

  const recommendedResults = mapResults(recommendedCodes)
  const complementaryResults = mapResults(complementaryCodes)
  const results = [...recommendedResults, ...complementaryResults]

  return {
    mode: 'llm-two-pass-plus-lexical',
    abstain: finalResult.abstain,
    codes: finalCodes,
    recommendedCodes,
    complementaryCodes,
    reason: finalResult.reason,
    results,
    recommendedResults,
    complementaryResults,

    candidates: {
      luna: firstResult.codes.length,
      local: localCodes.length,
      union: candidateCodes.length,
    },

    usage: {
      pass1: cost1,
      pass2: cost2,
      total: {
        input: cost1.input + cost2.input,
        output: cost1.output + cost2.output,
        cached: cost1.cached + cost2.cached,
        written: cost1.written + cost2.written,
        cost: cost1.cost + cost2.cost,
      },
    },
  }
}
