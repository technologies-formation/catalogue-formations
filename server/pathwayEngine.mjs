const MODEL = 'gpt-5.6-luna'
const MAX_CANDIDATES = 30
const MAX_STEPS = 5

const PRICE = {
  input: 0.20,
  cachedInput: 0.02,
  cacheWrite: 0.25,
  output: 1.20,
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

  return {
    input,
    output,
    cached,
    written,
    uncached,
    cost:
      (uncached / 1_000_000) * PRICE.input +
      (cached / 1_000_000) * PRICE.cachedInput +
      (written / 1_000_000) * PRICE.cacheWrite +
      (output / 1_000_000) * PRICE.output,
  }
}

async function callOpenAI(body, { fetchImpl, apiKey, timeoutMs }) {
  const response = await fetchImpl('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message ?? `Erreur OpenAI HTTP ${response.status}`)
  }

  return data
}

function profileText(profile) {
  return [
    ['Fonction ou situation', profile.role],
    ['Objectif professionnel', profile.objective],
    ['Compétences déjà acquises', profile.existingSkills],
    ['Temps disponible', profile.timeAvailable],
    ['Contraintes', profile.constraints],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label} : ${value}`)
    .join('\n')
}

function publicCourse(course) {
  return {
    code: course.code,
    title: course.officialData?.titleRaw ?? '',
    domain: course.officialData?.domainRaw ?? '',
    theme: course.officialData?.themeRaw ?? '',
    public: course.officialData?.publicRaw ?? '',
    targetAudience: course.officialData?.targetAudienceRaw ?? '',
    catalogueOffers: course.catalogueOffers ?? [],
    sourceUrl: course.sourceUrl ?? '',
  }
}

export async function buildPathwayWithLuna(
  profile,
  {
    catalogue,
    apiKey = process.env.OPENAI_API_KEY,
    fetchImpl = fetch,
    timeoutMs = 90_000,
  },
) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY absente côté serveur')
  }

  const {
    ultraCompactCatalogue,
    officialCodes,
    detailedByCode,
    courseByCode,
  } = catalogue
  const need = profileText(profile)

  const first = await callOpenAI(
    {
      model: MODEL,
      reasoning: { effort: 'none' },
      store: false,
      max_output_tokens: 700,
      prompt_cache_key: 'catalogue-ege-pathway-ultracompact-v1',
      instructions:
        `Tu prépares un parcours de formation à partir du catalogue officiel.
Interprète l'objectif professionnel, les acquis, le temps disponible et les contraintes.
Sélectionne uniquement des formations susceptibles de former un ensemble cohérent.
N'invente jamais de code. Retourne au maximum ${MAX_CANDIDATES} codes.`,
      input: `CATALOGUE OFFICIEL :\n${JSON.stringify(ultraCompactCatalogue)}\n\nPROFIL :\n${need}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'pathway_candidate_selection',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              interpretedGoal: { type: 'string' },
              codes: {
                type: 'array',
                items: { type: 'string', enum: officialCodes },
                maxItems: MAX_CANDIDATES,
              },
            },
            required: ['interpretedGoal', 'codes'],
            additionalProperties: false,
          },
        },
      },
    },
    { fetchImpl, apiKey, timeoutMs },
  )
  const firstResult = JSON.parse(extractText(first))
  const candidateCodes = [...new Set(firstResult.codes ?? [])]
    .filter((code) => officialCodes.includes(code))
  const cost1 = usageCost(first.usage)

  if (candidateCodes.length === 0) {
    return {
      mode: 'pathway-two-pass',
      abstain: true,
      interpretedGoal: firstResult.interpretedGoal,
      summary: 'Aucun parcours fiable ne peut être construit avec le catalogue actuel.',
      steps: [],
      gaps: ['Aucune formation suffisamment pertinente n a été identifiée.'],
      usage: { pass1: cost1, pass2: null, total: cost1 },
    }
  }

  const detailedCandidates = candidateCodes
    .map((code) => detailedByCode.get(code))
    .filter(Boolean)

  const second = await callOpenAI(
    {
      model: MODEL,
      reasoning: { effort: 'none' },
      store: false,
      max_output_tokens: 1_200,
      instructions:
        `Tu construis un parcours court, réaliste et ordonné à partir des seules fiches autorisées.
Règles impératives :
- utilise uniquement les codes fournis ;
- propose de 1 à ${MAX_STEPS} étapes, sans doublon ;
- tiens compte des acquis pour éviter les formations manifestement redondantes ;
- respecte autant que possible le temps disponible et les contraintes ;
- place les prérequis avant les approfondissements ;
- explique brièvement la valeur de chaque étape ;
- si aucun parcours cohérent n'est possible, abstain vaut true et steps est vide ;
- indique honnêtement dans gaps ce que le catalogue ne couvre pas.`,
      input: `FICHES AUTORISÉES :\n${JSON.stringify(detailedCandidates)}\n\nPROFIL :\n${need}\n\nOBJECTIF INTERPRÉTÉ :\n${firstResult.interpretedGoal}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'pathway_plan',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              abstain: { type: 'boolean' },
              summary: { type: 'string' },
              steps: {
                type: 'array',
                maxItems: MAX_STEPS,
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', enum: candidateCodes },
                    rationale: { type: 'string' },
                  },
                  required: ['code', 'rationale'],
                  additionalProperties: false,
                },
              },
              gaps: {
                type: 'array',
                maxItems: 3,
                items: { type: 'string' },
              },
            },
            required: ['abstain', 'summary', 'steps', 'gaps'],
            additionalProperties: false,
          },
        },
      },
    },
    { fetchImpl, apiKey, timeoutMs },
  )
  const plan = JSON.parse(extractText(second))
  const cost2 = usageCost(second.usage)
  const seen = new Set()
  const steps = plan.abstain
    ? []
    : (plan.steps ?? []).flatMap(({ code, rationale }) => {
        const course = courseByCode.get(code)

        if (!course || !candidateCodes.includes(code) || seen.has(code)) {
          return []
        }

        seen.add(code)

        return [{
          position: seen.size,
          rationale,
          course: publicCourse(course),
        }]
      })

  const abstain = Boolean(plan.abstain || steps.length === 0)

  return {
    mode: 'pathway-two-pass',
    abstain,
    interpretedGoal: firstResult.interpretedGoal,
    summary: plan.summary,
    steps: abstain ? [] : steps,
    gaps: plan.gaps ?? [],
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
