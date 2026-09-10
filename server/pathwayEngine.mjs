const MODEL = 'gpt-5.6-luna'
const MAX_CANDIDATES = 30
const MAX_RECALL_CANDIDATES = 12
const MAX_STEPS = 8
const MAX_OPTIONAL_STEPS = 4
const HOURS_PER_DAY = 8

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
    ['Catégorie de personnel', profile.personnelCategory],
    ['Entité', profile.entity],
    ['Situation managériale', profile.managerStatus],
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

function textOf(value) {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return ''
  return JSON.stringify(value)
}

function normalized(value) {
  return textOf(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const RECALL_STOP_WORDS = new Set([
  'avec', 'cette', 'dans', 'devenir', 'disponible', 'formation', 'formations',
  'pour', 'progressif', 'service', 'suivre', 'cette', 'annee', 'personnel',
  'apprendre', 'objectif', 'objectifs', 'equipe',
])

function recallTokens(value) {
  return [...new Set(normalized(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !RECALL_STOP_WORDS.has(token)))]
}

function deterministicRecall(profile, detailedByCode) {
  const need = normalized(Object.values(profile).join(' '))
  const tokens = recallTokens(need)
  const asksCockpits = /cockpit|sirh/.test(need)
  const isNewManager = /nouveau manager|nouvelle manage|premiere fois.*(?:equipe|responsabilite)|prise de fonction/.test(need)

  return [...detailedByCode.entries()]
    .map(([code, detail]) => {
      const title = normalized(detail?.title)
      const domain = normalized(detail?.domain)
      const theme = normalized(detail?.theme)
      const audience = normalized([detail?.public, detail?.targetAudience].join(' '))
      const searchable = normalized([
        detail?.title,
        detail?.domain,
        detail?.theme,
        detail?.objectives,
        detail?.content,
        detail?.prerequisites,
      ].join(' '))
      let score = 0

      for (const token of tokens) {
        if (title.includes(token)) score += 4
        else if (domain.includes(token) || theme.includes(token)) score += 2
        else if (searchable.includes(token)) score += 1
      }

      if (asksCockpits && title.includes('cockpit')) score += 12
      if (asksCockpits && theme.includes('sirh')) score += 6
      if (isNewManager && /nouveaux managers|nouvelles et nouveaux managers/.test(audience)) score += 12
      if (isNewManager && theme.includes('prise de fonction')) score += 6

      return { code, score }
    })
    .filter(({ score }) => score >= 4)
    .sort((a, b) => b.score - a.score || a.code.localeCompare(b.code, 'fr'))
    .slice(0, MAX_RECALL_CANDIDATES)
    .map(({ code }) => code)
}

function isPatGenerativeAiProfile(profile) {
  const need = normalized(Object.values(profile).join(' '))
  const isPat = normalized(profile.personnelCategory) === 'pat' || /personnel administratif|chef de projet/.test(need)
  const asksGenerativeAi = /intelligence artificielle generative|\bia generative\b|chatgpt|prompt/.test(need)

  return isPat && asksGenerativeAi
}

function institutionalAnchorCodes(profile, officialCodes) {
  if (!isPatGenerativeAiProfile(profile)) return []

  const official = new Set(officialCodes)
  return ['TRT3004H', 'SEM1246'].filter((code) => official.has(code))
}

function isAiRelevantInformationalCourse(course, detail) {
  return /intelligence artificielle|\bia\b|numerique|prompt|automatis|multimodal/
    .test(normalized([
      course?.officialData?.titleRaw,
      course?.officialData?.domainRaw,
      course?.officialData?.themeRaw,
      detail?.objectives,
      detail?.content,
    ].join(' ')))
}

function referencedPrerequisites(codes, detailedByCode, officialCodes) {
  const official = new Set(officialCodes)
  const found = []

  for (const code of codes) {
    const detail = detailedByCode.get(code)
    const value = textOf(detail?.prerequisites).toUpperCase()

    for (const reference of value.match(/[A-Z][A-Z0-9-]*\d[A-Z0-9-]*/g) ?? []) {
      if (reference !== code && official.has(reference) && !found.includes(reference)) {
        found.push(reference)
      }
    }
  }

  return found
}

function durationHours(detail) {
  const value = normalized(detail?.duration)
  if (!value) return null

  const hours = value.match(/(\d+(?:[.,]\d+)?)\s*(?:h|heure)/)
  if (hours) return Number(hours[1].replace(',', '.'))

  const halfDays = value.match(/(\d+(?:[.,]\d+)?)\s*demi[- ]?jour/)
  if (halfDays) return Number(halfDays[1].replace(',', '.')) * (HOURS_PER_DAY / 2)

  const days = value.match(/(\d+(?:[.,]\d+)?)\s*jour/)
  if (days) return Number(days[1].replace(',', '.')) * HOURS_PER_DAY

  return null
}

function timeBudgetHours(value) {
  const text = normalized(value)
  const hours = text.match(/(?:maximum|max(?:imum)?|au plus|plafond de)?\s*(\d+(?:[.,]\d+)?)\s*(?:h|heure)/)
  if (hours) return Number(hours[1].replace(',', '.'))

  const days = text.match(/(?:maximum|max(?:imum)?|au plus|plafond de)?\s*(\d+(?:[.,]\d+)?)\s*jour/)
  if (days) return Number(days[1].replace(',', '.')) * HOURS_PER_DAY

  return null
}

function audienceCompatibility(profile, course) {
  const profileValue = normalized(Object.values(profile).join(' '))
  const publicValue = normalized([
    course.officialData?.publicRaw,
    course.officialData?.targetAudienceRaw,
  ].join(' '))

  if (!publicValue) return 'eligible'

  const profileIsTeacher = /enseignant|enseignement|\bpe\b/.test(profileValue)
  const profileIsDip = /\bdip\b/.test(profileValue)
  const profileIsPolice = /police|\bpu police\b/.test(profileValue)
  const profileIsPrison = /prison|penitentiaire|detention|\bocd\b/.test(profileValue)
  const profileIsJudiciary = /pouvoir judiciaire|\bpj\b/.test(profileValue)
  const profileIsManager = /manager|management|responsabilite d.?une equipe|encadrement/.test(profileValue)

  const educatorAudience = /enseignant|enseignement|corps enseignant|maitres? adjoints?|coordinateurs?.*pedagog|personnel pedagogique|\bes ?ii\b/.test(publicValue)
  if (educatorAudience && !profileIsTeacher) return 'incompatible'
  if (/\bdip\b/.test(publicValue) && !profileIsDip) return 'incompatible'
  if (/police/.test(publicValue) && !profileIsPolice) return 'incompatible'
  if (/prison|penitentiaire|detention|\bocd\b/.test(publicValue) && !profileIsPrison) return 'incompatible'
  if (/pouvoir judiciaire|\bpj\b/.test(publicValue) && !profileIsJudiciary) return 'incompatible'
  if (/reservee? aux (?:nouvelles? et nouveaux )?managers|nouveaux managers/.test(publicValue) && !profileIsManager) return 'incompatible'
  if (/tout public|toute personne/.test(publicValue)) return 'eligible'

  return 'eligible'
}

function isNewManagerProfile(profile) {
  return /nouveau manager|nouvelle manage|premiere fois.*(?:equipe|responsabilite)/
    .test(normalized(Object.values(profile).join(' ')))
}

function isNewManagerCourse(course) {
  return /reservee? aux nouvelles? et nouveaux managers|reservee? aux nouveaux managers/
    .test(normalized(course?.officialData?.targetAudienceRaw))
}

function publicCourse(course, detail) {
  return {
    code: course.code,
    title: course.officialData?.titleRaw ?? '',
    domain: course.officialData?.domainRaw ?? '',
    theme: course.officialData?.themeRaw ?? '',
    public: course.officialData?.publicRaw ?? '',
    targetAudience: course.officialData?.targetAudienceRaw ?? '',
    duration: textOf(detail?.duration),
    durationHours: durationHours(detail),
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
  const recalledCodes = deterministicRecall(profile, detailedByCode)
  const anchorCodes = institutionalAnchorCodes(profile, officialCodes)
  const initialCodes = [...new Set([...anchorCodes, ...recalledCodes, ...(firstResult.codes ?? [])])]
    .filter((code) => officialCodes.includes(code))
    .slice(0, MAX_CANDIDATES)
  const prerequisiteCodes = referencedPrerequisites(
    initialCodes,
    detailedByCode,
    officialCodes,
  )
  const candidateCodes = [...new Set([...prerequisiteCodes, ...initialCodes])]
    .slice(0, MAX_CANDIDATES)
  const cost1 = usageCost(first.usage)

  if (candidateCodes.length === 0) {
    return {
      mode: 'pathway-two-pass',
      abstain: true,
      interpretedGoal: firstResult.interpretedGoal,
      summary: 'Aucun parcours fiable ne peut être construit avec le catalogue actuel.',
      steps: [],
      recommendedSteps: [],
      optionalSteps: [],
      informationalCourses: [],
      durationSummary: {
        budgetHours: timeBudgetHours(profile.timeAvailable),
        recommendedHours: 0,
        verified: true,
        durationsKnown: true,
        budgetVerified: timeBudgetHours(profile.timeAvailable) !== null,
      },
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
- classe les cours dans recommendedSteps, optionalSteps ou informationalCourses, sans doublon ;
- recommendedSteps contient de 1 à ${MAX_STEPS} étapes directement utiles et accessibles au profil ;
- optionalSteps contient les compléments utiles mais moins prioritaires ou hors du temps disponible ;
- informationalCourses contient les cours pertinents mais réservés à un autre public ; ne les recommande jamais comme accessibles ;
- un profil qui se déclare nouveau manager est compatible avec une formation réservée aux nouvelles et nouveaux managers ;
- tiens compte des acquis pour éviter les formations manifestement redondantes ;
- respecte strictement le temps disponible lorsque les durées sont connues ;
- place les prérequis avant les approfondissements ;
- privilégie les formations directement liées au métier et aux outils demandés avant les compétences transversales ;
- ne remplis pas artificiellement le parcours si peu de formations conviennent ;
- le résumé décrit uniquement le parcours recommandé ; il ne présente jamais les cours informatifs comme des étapes du parcours ;
- n'indique aucun total de durée dans le résumé : le serveur le calcule après ta réponse ;
- ne commente pas dans gaps la vérification arithmétique des durées : le serveur s'en charge ;
- n'affirme jamais qu'un cours est absent du catalogue complet : tu ne vois qu'une sélection de fiches autorisées ;
- explique brièvement la valeur de chaque étape ;
- si aucun parcours cohérent n'est possible, abstain vaut true et recommendedSteps est vide ;
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
              recommendedSteps: {
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
              optionalSteps: {
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
              informationalCourses: {
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
            required: ['abstain', 'summary', 'recommendedSteps', 'optionalSteps', 'informationalCourses', 'gaps'],
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
  const recommendedSteps = []
  const optionalSteps = []
  const informationalCourses = []
  const budgetHours = timeBudgetHours(profile.timeAvailable)
  let recommendedHours = 0
  let allRecommendedDurationsKnown = true

  function add(items, destination) {
    for (const { code, rationale } of items ?? []) {
      const course = courseByCode.get(code)

      if (!course || !candidateCodes.includes(code) || seen.has(code)) {
        continue
      }

      seen.add(code)
      const detail = detailedByCode.get(code)
      const item = {
        position: destination.length + 1,
        rationale,
        course: publicCourse(course, detail),
      }

      const compatibility = audienceCompatibility(profile, course)
      if (compatibility === 'incompatible') {
        item.position = informationalCourses.length + 1
        informationalCourses.push(item)
        continue
      }

      if (destination === informationalCourses) {
        item.position = optionalSteps.length + 1
        optionalSteps.push(item)
        continue
      }

      const hours = item.course.durationHours
      if (destination === recommendedSteps && budgetHours !== null) {
        if (hours === null) {
          allRecommendedDurationsKnown = false
        } else if (recommendedHours + hours > budgetHours) {
          item.position = optionalSteps.length + 1
          optionalSteps.push(item)
          continue
        } else {
          recommendedHours += hours
        }
      } else if (destination === recommendedSteps && hours !== null) {
        recommendedHours += hours
      } else if (destination === recommendedSteps) {
        allRecommendedDurationsKnown = false
      }

      destination.push(item)
    }
  }

  if (!plan.abstain) {
    add(plan.recommendedSteps ?? plan.steps, recommendedSteps)
    add(plan.informationalCourses, informationalCourses)
    add(plan.optionalSteps, optionalSteps)
  }

  if (budgetHours !== null && isNewManagerProfile(profile)) {
    const remainingOptions = []

    for (const item of optionalSteps) {
      const hours = item.course.durationHours
      const fitsBudget = hours !== null && recommendedHours + hours <= budgetHours

      if (
        recommendedSteps.length < MAX_STEPS &&
        fitsBudget &&
        isNewManagerCourse(courseByCode.get(item.course.code))
      ) {
        recommendedHours += hours
        recommendedSteps.push(item)
      } else {
        remainingOptions.push(item)
      }
    }

    optionalSteps.splice(0, optionalSteps.length, ...remainingOptions)
  }

  if (isPatGenerativeAiProfile(profile)) {
    const anchorRationales = new Map([
      ['TRT3004H', 'Acquérir un socle de culture numérique et comprendre les usages, les limites et les conditions de déploiement de l’IA dans une organisation.'],
      ['SEM1246', 'Développer l’esprit critique nécessaire pour vérifier les résultats de l’IA générative, repérer les biais et sécuriser son usage professionnel.'],
    ])
    const anchors = []
    const otherItems = [...recommendedSteps, ...optionalSteps]

    for (const code of anchorCodes) {
      const course = courseByCode.get(code)
      if (!course || audienceCompatibility(profile, course) === 'incompatible') continue

      const existing = otherItems.find((item) => item.course.code === code)
      const detail = detailedByCode.get(code)
      anchors.push(existing
        ? { ...existing, rationale: anchorRationales.get(code) }
        : {
            position: anchors.length + 1,
            rationale: anchorRationales.get(code),
            course: publicCourse(course, detail),
          })
    }

    if (anchors.length > 0) {
      const anchorSet = new Set(anchors.map((item) => item.course.code))
      const displaced = recommendedSteps.filter((item) => !anchorSet.has(item.course.code))
      recommendedSteps.splice(0, recommendedSteps.length, ...anchors)
      optionalSteps.splice(
        0,
        optionalSteps.length,
        ...displaced,
        ...optionalSteps.filter((item) => !anchorSet.has(item.course.code)),
      )
      informationalCourses.splice(
        0,
        informationalCourses.length,
        ...informationalCourses.filter((item) => !anchorSet.has(item.course.code)),
      )
      recommendedHours = anchors.reduce(
        (total, item) => total + (item.course.durationHours ?? 0),
        0,
      )
      allRecommendedDurationsKnown = anchors.every((item) => item.course.durationHours !== null)
    }

    const relevantInformation = informationalCourses.filter((item) =>
      isAiRelevantInformationalCourse(
        courseByCode.get(item.course.code),
        detailedByCode.get(item.course.code),
      ))
    informationalCourses.splice(0, informationalCourses.length, ...relevantInformation)
  }

  recommendedSteps.forEach((item, index) => { item.position = index + 1 })
  optionalSteps.forEach((item, index) => { item.position = index + 1 })
  informationalCourses.forEach((item, index) => { item.position = index + 1 })

  optionalSteps.splice(MAX_OPTIONAL_STEPS)

  const abstain = Boolean(plan.abstain || recommendedSteps.length === 0)

  return {
    mode: 'pathway-two-pass',
    abstain,
    interpretedGoal: firstResult.interpretedGoal,
    summary: plan.summary,
    steps: abstain ? [] : recommendedSteps,
    recommendedSteps: abstain ? [] : recommendedSteps,
    optionalSteps,
    informationalCourses,
    durationSummary: {
      budgetHours,
      recommendedHours,
      verified: budgetHours !== null && allRecommendedDurationsKnown,
      durationsKnown: allRecommendedDurationsKnown,
      budgetVerified: budgetHours !== null && allRecommendedDurationsKnown,
    },
    gaps: (plan.gaps ?? []).filter((gap) => typeof gap === 'string' && gap.trim()),
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
