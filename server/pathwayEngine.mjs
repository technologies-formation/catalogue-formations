import { scopeCatalogue } from './trainingScope.mjs'
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
    ['Environnement professionnel', profile.professionalEnvironment],
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

// Les explications sont destinées à la personne, les provenances structurées restent intactes.
function learnerExplanation(value) {
  return textOf(value).replace(/\b(deliveryMode|sourceField|evidence|catalogue-default)\b/g, term => ({
    deliveryMode: 'la modalité du cours', sourceField: 'l’origine de cette indication',
    evidence: 'la mention relevée', 'catalogue-default': 'la règle de lecture du catalogue',
  })[term])
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
      let matchedTokens = 0

      for (const token of tokens) {
        if (title.includes(token)) {
          score += 4
          matchedTokens += 1
        } else if (domain.includes(token) || theme.includes(token)) {
          score += 2
          matchedTokens += 1
        } else if (searchable.includes(token)) {
          score += 1
          matchedTokens += 1
        }
      }
      if (matchedTokens >= 2) score += 2

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

function requestedCockpitCodes(profile, detailedByCode) {
  const objective = normalized(profile.objective)
  if (!/\bcockpits?\b/.test(objective) || /(?:sans|exclure|pas de)\s+(?:les?\s+)?cockpits?/.test(objective)) return []
  const specific = [...objective.matchAll(/cockpits?\s+(rh|paie|formation)\b/g)].map(match => match[1])
  return [...detailedByCode.entries()].filter(([, detail]) => {
    const title = normalized(detail?.title ?? detail?.officialData?.titleRaw)
    return /\bcockpits?\b/.test(title) && (!specific.length || specific.some(topic => title.includes(topic)))
  }).map(([code]) => code).slice(0, 4)
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

function newManagerCandidateCodes(profile, officialCodes) {
  if (!isNewManagerProfile(profile)) return []

  const official = new Set(officialCodes)
  return ['SEM1174'].filter((code) => official.has(code))
}

function rationaleWithAccessCheck(rationale, detail) {
  // Une condition publiée est un point à confirmer, pas une inscription présumée.
  const prerequisites = normalized(detail?.prerequisites)
  if (!/\binscrite?\b.*\bprogramme\b/.test(prerequisites)) return rationale
  return `${rationale} Si votre inscription n’est pas déjà confirmée : êtes-vous inscrit ou inscrite au programme requis par cette fiche ? En cas de doute, vérifiez ce point avec vos RH.`
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
  const publicLabel = normalized(course.officialData?.publicRaw)
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
  const managerProfileValue = normalized([
    profile.managerStatus,
    profile.managerialSituation,
    profile.role,
  ].join(' '))
  const profileIsManager =
    /manager|responsable d.?une equipe|responsabilite d.?une equipe|encadrement/.test(managerProfileValue)

  const educatorAudience = /enseignant|enseignement|corps enseignant|maitres? adjoints?|coordinateurs?.*pedagog|personnel pedagogique|\bes ?ii\b/.test(publicValue)
  if (educatorAudience && !profileIsTeacher) return 'incompatible'
  if (/\bdip\b/.test(publicValue) && !profileIsDip) return 'incompatible'
  if (/police/.test(publicValue) && !profileIsPolice) return 'incompatible'
  if (/prison|penitentiaire|detention|\bocd\b/.test(publicValue) && !profileIsPrison) return 'incompatible'
  if (/pouvoir judiciaire|\bpj\b/.test(publicValue) && !profileIsJudiciary) return 'incompatible'
  if (/reservee? aux (?:nouvelles? et nouveaux )?managers|nouveaux managers/.test(publicValue) && !profileIsManager) return 'incompatible'
  if (/^managers?$/.test(publicLabel) && !profileIsManager) return 'incompatible'
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

// Règle métier transitoire : le présentiel par défaut est une hypothèse,
// distincte d’une modalité explicitement annoncée dans le titre ou le descriptif.
function courseDeliveryMode(course, detail) {
  const title = course?.officialData?.titleRaw ?? ''
  const titleText = normalized(title)
  const patterns = [
    ['online', /(?:^|[|:/()–—-])\s*(?:(?:formation|cours|module)\s+(?:autonome\s+)?)?(?:e[- ]?learning|en ligne|a distance|classe virtuelle)\s*(?=$|[|:/()–—-])/],
    ['in_person', /(?:^|[|:/()–—-])\s*(?:en presentiel|presentiel)\s*(?=$|[|:/()–—-])/],
    ['hybrid', /(?:^|[|:/()–—-])\s*(?:hybride|blended learning)\s*(?=$|[|:/()–—-])/],
  ]
  const evidence = patterns.filter(([,expression])=>expression.test(titleText))
    .map(([value])=>({value,sourceField:'titleRaw',evidence:title}))
  let mentionsMode = /e[- ]?learning|en ligne|a distance|classe virtuelle|presentiel|hybride|blended learning/.test(titleText)
  for (const field of ['generalInformation','content','objectives','additionalInformation']) {
    const value = textOf(detail?.[field])
    // Les objectifs d’un cours sur la conception de e-learning ne décrivent pas sa modalité.
    for (const sentence of value.split(/[.!?;\n]+/)) {
      const text = normalized(sentence)
      if (!/e[- ]?learning|en ligne|a distance|classe virtuelle|presentiel|hybride|blended learning/.test(text)) continue
      mentionsMode = true
      if (/\b(?:pas|sans|aucun|non)\b/.test(text)) continue
      const declaration = /\bmodalite\b|\bformat\b|\bformation (?:est |se deroule |se suit |dispensee |proposee |suivie |entierement )|cours (?:est |se deroule |dispense |propose |suivi )|suivre (?:ce|cette|la|le) (?:cours|formation)|module (?:est |dispense |propose |suivi )/.test(text)
      if (!declaration) continue
      for (const [mode,expression] of [
        ['online',/e[- ]?learning|en ligne|a distance|classe virtuelle/],
        ['in_person',/presentiel/],
        ['hybrid',/hybride|blended learning/],
      ]) if(expression.test(text)) evidence.push({value:mode,sourceField:field,evidence:sentence.trim().slice(0,2000)})
    }
  }
  const modes = new Set(evidence.map(item=>item.value))
  if (modes.size===1) return evidence[0]
  if (modes.size>1 || mentionsMode) return {value:'unknown',sourceField:null,evidence:null}
  return {value:'in_person',sourceField:'catalogue-default',evidence:null}
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
    deliveryMode: courseDeliveryMode(course, detail),
    sessionAvailability: detail?.sessionAvailability ?? { hasOpenSession: null, hasScheduledSession: null, observedOn: null, source: null },
    catalogueOffers: course.catalogueOffers ?? [],
    organizingEntity: course.organizingEntity ?? course.officialData?.organizingEntityRaw ?? '',
    sourceUrl: course.sourceUrl ?? '',
  }
}

function isServerManagedGap(gap) {
  const value = normalized(gap)
  const discussesDuration =
    /duree|temps disponible|budget|plafond|depassement|repere.*(?:jour|heure)|depasse.*(?:jour|heure|temps)/.test(value)
  const discussesAdministrativeAccess =
    /acces exact|conditions? d.?acces|accessibilite.*(?:profil|statut)|(?:public|profil|statut).*(?:confirmer|verification|verifier)|inscription.*(?:confirmer|verification|verifier)/.test(value)

  return discussesDuration || discussesAdministrativeAccess
}

function officeCourseInfo(course, detail) {
  const title = normalized(course?.officialData?.titleRaw ?? detail?.title)
  const domain = normalized(course?.officialData?.domainRaw ?? detail?.domain)
  const theme = normalized(course?.officialData?.themeRaw ?? detail?.theme)

  return {
    title,
    theme,
    isOffice: /logiciels? bureautiques?/.test(domain),
    isFoundation: /\bbase\b|fondamentaux?|debutants?/.test(title),
    isBroadElearning:
      /e[- ]?learning|formation en ligne/.test(title) &&
      /fondamentaux?|perfectionnement|tous niveaux|debutants?/.test(title),
  }
}

function requestedOfficeTheme(profile, candidateCodes, courseByCode, detailedByCode) {
  const objective = normalized(profile.objective)
  if (!objective) return null

  const themes = [...new Set(candidateCodes.map((code) => {
    const info = officeCourseInfo(courseByCode.get(code), detailedByCode.get(code))
    return info.isOffice ? info.theme : ''
  }).filter(Boolean))]

  return themes
    .sort((a, b) => b.length - a.length)
    .find((theme) => objective.includes(theme) || theme
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4)
      .some((token) => objective.includes(token))) ?? null
}

function hasOfficeSpecialization(profile, theme, candidateCodes, courseByCode, detailedByCode) {
  if (normalized(profile.existingSkills)) return true

  const objective = normalized(profile.objective)
  const ignored = new Set([
    ...theme.split(/[^a-z0-9]+/),
    'base', 'fondamental', 'fondamentaux', 'perfectionnement', 'utiliser',
    'apprendre', 'maitriser', 'formation', 'former', 'veux', 'souhaite',
    'logiciel', 'office', 'microsoft', 'e-learning', 'learning',
  ])
  const specializationTokens = new Set()

  for (const code of candidateCodes) {
    const info = officeCourseInfo(courseByCode.get(code), detailedByCode.get(code))
    if (!info.isOffice || info.theme !== theme || info.isFoundation || info.isBroadElearning) continue
    for (const token of info.title.split(/[^a-z0-9]+/)) {
      if (token.length >= 5 && !ignored.has(token) && !/^20\d\d$/.test(token)) {
        specializationTokens.add(token)
      }
    }
  }

  return [...specializationTokens].some((token) => objective.includes(token))
}

function stabilizeGeneralOfficePathway(
  profile,
  candidateCodes,
  courseByCode,
  detailedByCode,
  recommendedSteps,
  optionalSteps,
) {
  const theme = requestedOfficeTheme(profile, candidateCodes, courseByCode, detailedByCode)
  if (!theme || hasOfficeSpecialization(profile, theme, candidateCodes, courseByCode, detailedByCode)) {
    return null
  }

  const matchingCodes = candidateCodes.filter((code) => {
    const info = officeCourseInfo(courseByCode.get(code), detailedByCode.get(code))
    return info.isOffice && info.theme === theme
  })
  const foundationCode = matchingCodes.find((code) =>
    officeCourseInfo(courseByCode.get(code), detailedByCode.get(code)).isFoundation &&
    !officeCourseInfo(courseByCode.get(code), detailedByCode.get(code)).isBroadElearning)
  const elearningCode = matchingCodes.find((code) =>
    officeCourseInfo(courseByCode.get(code), detailedByCode.get(code)).isBroadElearning)
  const need = normalized([profile.objective, profile.constraints].join(' '))
  const wantsElearning = /e[- ]?learning|distanciel|en ligne|autonomie/.test(need)
  const primaryCode = wantsElearning ? (elearningCode ?? foundationCode) : (foundationCode ?? elearningCode)

  if (!primaryCode) return null
  const primaryIsOnline = courseDeliveryMode(courseByCode.get(primaryCode), detailedByCode.get(primaryCode)).value === 'online'

  const all = [...recommendedSteps, ...optionalSteps]
  const byCode = new Map(all.map((item) => [item.course.code, item]))
  function itemFor(code, rationale) {
    const existing = byCode.get(code)
    if (existing) return { ...existing, rationale }
    const course = courseByCode.get(code)
    if (!course || audienceCompatibility(profile, course) === 'incompatible') return null
    return {
      position: 1,
      rationale,
      course: publicCourse(course, detailedByCode.get(code)),
    }
  }

  const primary = itemFor(
    primaryCode,
    wantsElearning && primaryIsOnline
      ? 'Parcours général en autonomie couvrant les fondamentaux jusqu’aux fonctions avancées.'
      : 'Socle adapté à un besoin général lorsque le niveau initial et les usages spécialisés ne sont pas précisés.',
  )
  if (!primary) return null

  const alternativeCode = primaryCode === elearningCode ? foundationCode : elearningCode
  const alternative = alternativeCode
    ? itemFor(
        alternativeCode,
        primaryCode === elearningCode
          ? 'Autre formule pour acquérir les bases ; modalité à vérifier sur la fiche officielle.'
          : 'Alternative e-learning en autonomie couvrant les fondamentaux jusqu’au perfectionnement.',
      )
    : null
  const matchingSet = new Set(matchingCodes)
  const displaced = recommendedSteps.filter((item) =>
    matchingSet.has(item.course.code) &&
    item.course.code !== primaryCode &&
    item.course.code !== alternativeCode)
  const unrelated = recommendedSteps.filter((item) => !matchingSet.has(item.course.code))
  const remainingOptions = optionalSteps.filter((item) =>
    item.course.code !== primaryCode && item.course.code !== alternativeCode)

  recommendedSteps.splice(0, recommendedSteps.length, primary, ...unrelated)
  optionalSteps.splice(
    0,
    optionalSteps.length,
    ...[alternative, ...displaced, ...remainingOptions].filter(Boolean),
  )

  return wantsElearning && primaryIsOnline
    ? `${primary.course.title} constitue le parcours général recommandé en autonomie. Les autres modules sont proposés comme compléments ou alternatives selon les besoins ; leur modalité reste à vérifier sur les fiches officielles.`
    : `Commencer par ${primary.course.title}. Les niveaux avancés et les autres modalités sont proposés comme compléments ou alternatives selon les besoins.`
}

function officeAnchorCodes(profile, officialCodes, courseByCode, detailedByCode) {
  const theme = requestedOfficeTheme(
    profile,
    officialCodes,
    courseByCode,
    detailedByCode,
  )
  if (!theme) return []

  const matchingCodes = officialCodes.filter((code) => {
    const info = officeCourseInfo(courseByCode.get(code), detailedByCode.get(code))
    return info.isOffice && info.theme === theme
  })
  const foundationCode = matchingCodes.find((code) => {
    const info = officeCourseInfo(courseByCode.get(code), detailedByCode.get(code))
    return info.isFoundation && !info.isBroadElearning
  })
  const elearningCode = matchingCodes.find((code) =>
    officeCourseInfo(courseByCode.get(code), detailedByCode.get(code)).isBroadElearning)

  return [foundationCode, elearningCode].filter(Boolean)
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

  catalogue = scopeCatalogue(catalogue, profile)
  if(!catalogue.officialCodes.length)return {ok:true,abstain:true,summary:'Aucun cours ne correspond au périmètre de recherche choisi.',recommendedSteps:[],optionalSteps:[],informationalCourses:[],gaps:['Vous pouvez élargir les offres ou les entités de formation dans Ma demande.']}
  const {
    ultraCompactCatalogue,
    officialCodes,
    detailedByCode,
    courseByCode,
  } = catalogue
  const need = profileText(profile)
  const primaryCodes = requestedCockpitCodes(profile, detailedByCode)

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
L'objectif reste prioritaire : un outil mentionné dans les acquis, par exemple un niveau débutant avec Excel, ne remplace pas un besoin explicite portant sur un cockpit métier. Conserve les cours directement liés au besoin initial parmi les candidats, même si une préparation bureautique est utile.
Sélectionne uniquement des formations susceptibles de former un ensemble cohérent.
La proximité de mots génériques ne suffit pas : vérifie le sujet et le contexte professionnel de chaque formation par rapport à l'objectif.
Une différence de version d'un même logiciel ne suffit pas à exclure un cours : conserve les versions proches potentiellement pertinentes pour les compétences demandées, sauf contrainte explicite imposant une version exacte. N'affirme pas pour autant leur équivalence technique.
L'objectif interprété reformule les compétences à acquérir et les acquis, sans conclure à l'absence d'une formation dans le catalogue complet.
Dès cette première passe, le temps disponible est un repère de planification : ne filtre pas les candidats selon leur durée et n'écris jamais que le parcours doit tenir dans ce temps. N'impose ni réduction de l'objectif ni étalement déjà accepté.
Les prérequis déjà maîtrisés n'imposent pas de suivre à nouveau un cours de base. Si la maîtrise n'est pas établie, garde les candidats utiles et fais expliciter cette vérification, sans déduire que la remise à niveau entière est nécessaire.
Une absence de préférence de modalité n’est pas une contrainte à satisfaire : une modalité de cours inconnue ne constitue pas une incompatibilité avec cette absence de préférence. Ne présente jamais l’absence de préférence comme un obstacle ou une compatibilité impossible à établir.
Ne transforme jamais une modalité mentionnée dans le catalogue en préférence de la personne. Seul le profil fait foi ; une contrainte absente ou « Aucune » ne signifie pas une préférence pour une modalité.
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
  const managerCandidateCodes = newManagerCandidateCodes(profile, officialCodes)
  const officeFoundationCodes = officeAnchorCodes(
    profile,
    officialCodes,
    courseByCode,
    detailedByCode,
  )
  const initialCodes = [...new Set([
    ...primaryCodes,
    ...anchorCodes,
    ...managerCandidateCodes,
    ...officeFoundationCodes,
    ...recalledCodes,
    ...(firstResult.codes ?? []),
  ])]
    .filter((code) => officialCodes.includes(code))
    .slice(0, MAX_CANDIDATES)
  const prerequisiteCodes = referencedPrerequisites(
    initialCodes,
    detailedByCode,
    officialCodes,
  )
  const candidateCodes = [...new Set([...primaryCodes, ...prerequisiteCodes, ...initialCodes])]
    .slice(0, MAX_CANDIDATES)
  const cost1 = usageCost(first.usage)

  if (candidateCodes.length === 0) {
    return {
      mode: 'pathway-two-pass',
      abstain: true,
      interpretedGoal: learnerExplanation(firstResult.interpretedGoal),
      summary: 'Aucun parcours suffisamment pertinent n’a été identifié dans cette recherche.',
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
        withinBudget: timeBudgetHours(profile.timeAvailable) !== null ? true : null,
        excessHours: timeBudgetHours(profile.timeAvailable) !== null ? 0 : null,
      },
      gaps: ['Aucune formation suffisamment pertinente n a été identifiée.'],
      usage: { pass1: cost1, pass2: null, total: cost1 },
    }
  }

  const detailedCandidates = candidateCodes
    .map((code) => {
      const detail = detailedByCode.get(code)
      if (!detail) return null
      // Les disponibilités sont ajoutées au résultat par le serveur, sans influencer la sélection IA.
      const { sessionAvailability: _availability, ...description } = detail
      return { ...description, deliveryMode: courseDeliveryMode(courseByCode.get(code), detail) }
    })
    .filter(Boolean)

  const second = await callOpenAI(
    {
      model: MODEL,
      reasoning: { effort: 'none' },
      store: false,
      max_output_tokens: 1_200,
      instructions:
        `Tu construis un parcours pertinent, progressif et ordonné à partir des seules fiches autorisées.
Règles impératives :
- utilise uniquement les codes fournis ;
- l'objectif du PROFIL prime sur l'objectif interprété : ne remplace jamais une demande sur un outil métier nommé par le logiciel cité dans les acquis. Une préparation Excel peut accompagner une demande Cockpit, elle ne la remplace pas ;
- examine explicitement les ateliers Cockpit candidats lorsque le besoin les nomme. Si le type de cockpit ou les droits sont inconnus, conserve les pistes pertinentes sous réserve avec une question de clarification, sans promettre leur accessibilité ni leur adéquation à la conception de nouveaux tableaux ;
- évalue séparément la pertinence pour l'objectif et la compatibilité du public : un cours accessible n'est pas nécessairement utile au besoin ;
- omets les formations hors sujet de toutes les rubriques, y compris informationalCourses ; un mot commun comme projet, suivi, travail ou communication ne suffit pas si le contenu concerne une autre activité professionnelle ;
- classe les cours dans recommendedSteps, optionalSteps ou informationalCourses, sans doublon ;
- recommendedSteps contient de 1 à ${MAX_STEPS} étapes directement utiles et accessibles au profil ;
- optionalSteps contient les compléments utiles mais moins prioritaires ainsi que les alternatives de modalité ou de version qui ne doivent pas être cumulées avec le parcours principal ;
- informationalCourses contient les cours pertinents mais réservés à un autre public ; ne les recommande jamais comme accessibles ;
- informationalCourses ne sert pas à lister toutes les formations écartées : conserve uniquement celles dont les compétences enseignées répondent concrètement à l'objectif malgré la différence de public ; cette rubrique peut rester vide ;
- chaque complément ou alternative doit apporter une compétence ou un choix utile au besoin ; une offre propre à une autre institution ou activité n'est pas une alternative sur la seule proximité de son intitulé ;
- un profil qui se déclare nouveau manager est compatible avec une formation réservée aux nouvelles et nouveaux managers ;
- tiens compte des acquis pour éviter les formations manifestement redondantes ;
- la présence d'un cours parmi les candidats ne constitue ni une recommandation ni une preuve d'accès ; notamment, ne recommande pas PACIFIC (SEM1174) sur le seul statut de nouveau manager : évalue son contenu par rapport à l'objectif ; il peut rester facultatif ou être omis ;
- si une fiche exige une inscription à un programme ou un prérequis, ne déduis pas qu'il est satisfait du seul métier ou statut de la personne ; signale la condition et pose une question de clarification utile dans la justification si le profil ne permet pas de trancher ;
- n'invente ni critère d'accès ni information administrative non publiée dans les fiches ; une condition non confirmée doit rester à vérifier avec la personne, puis avec les RH si nécessaire ;
- pour la modalité de chaque formation, utilise exclusivement deliveryMode ajouté par le serveur aux fiches autorisées ; son origine figure dans evidence et sourceField ;
- dans les textes destinés à la personne, n'affiche jamais les noms techniques deliveryMode, sourceField, evidence ou catalogue-default ; explique simplement « présentiel présumé en l'absence d'une mention de modalité » lorsque c'est le cas ;
- si deliveryMode.sourceField vaut catalogue-default, indique « présentiel présumé » : c'est la règle métier transitoire en l'absence de mention de modalité dans le titre ou le descriptif, pas une preuve issue d'un futur indicateur SIRH ; cette hypothèse reste à vérifier sur la fiche ;
- si deliveryMode.value vaut unknown, indique que les mentions de modalité sont ambiguës ou contradictoires ; ne tranche pas à la place du serveur ;
- la préférence du profil est connue même lorsque la modalité du cours est inconnue : dis que sa compatibilité ne peut pas être établie, jamais que la préférence de la personne est invérifiable ; une modalité présumée n'est pas une confirmation de compatibilité ;
- si la modalité connue diffère de la préférence demandée, signale explicitement cet écart et présente la proposition comme une piste à comparer ; ne prétends pas que la préférence est satisfaite ;
- une modalité hybride ne garantit pas un suivi entièrement en ligne ou entièrement en présentiel ; indique que les conditions sont à vérifier ;
- si plusieurs formations couvrent essentiellement le même besoin, ne les présente pas comme des étapes cumulatives : choisis la meilleure pour recommendedSteps et place, si elle apporte un vrai choix de modalité, la meilleure autre option dans optionalSteps avec une justification explicite d'alternative ;
- une préférence exprimée pour l'e-learning, le distanciel, le présentiel, l'hybride ou l'autonomie départage les formations de pertinence comparable lorsque la fiche la confirme ; elle ne prime pas sur le besoin précis, les acquis et la complémentarité des étapes ;
- distingue une préférence souple d'une exigence exclusive : « en ligne de préférence, présentiel accepté » autorise des pistes de modalités différentes ou à vérifier, sans prétendre qu'elles sont en ligne ; ne transforme pas une préférence souple en filtre d'exclusion ;
- pour un besoin ciblé avec des acquis déjà déclarés, privilégie les modules qui développent les compétences manquantes ; un e-learning généraliste couvrant les bases jusqu'au perfectionnement peut constituer une alternative au parcours ciblé, pas une étape à ajouter automatiquement ;
- avant de cumuler un socle généraliste et un module spécialisé, vérifie dans les fiches que chacun apporte un apprentissage nécessaire non déjà couvert ; si les contenus se recouvrent, présente deux voies à comparer dans les justifications, avec l'alternative dans optionalSteps, jamais un cumul par défaut ;
- n'écarte pas systématiquement le e-learning : il peut rester principal si sa couverture du besoin et son niveau sont les mieux adaptés, ou si la personne exige une formation exclusivement en ligne ;
- distingue la modalité de la formation de la préférence de la personne : un titre contenant E-LEARNING décrit le cours, jamais une préférence du profil ;
- attribue une préférence à la personne uniquement si elle est explicitement exprimée dans le PROFIL ; une contrainte absente, vide, « Aucune » ou « sans préférence » ne constitue pas une préférence de modalité ;
- lorsqu’aucune préférence de modalité n’est exprimée (y compris « Indifférent » ou « Aucune préférence de modalité »), ne formule aucune réserve de compatibilité liée à cette absence de préférence ; si la modalité du cours est inconnue, indique seulement « modalité à vérifier sur la fiche officielle », sans présenter ce manque comme un obstacle au choix ;
- une formation en e-learning reste autorisée sans préférence exprimée si elle répond à l'objectif ; justifie alors son utilité et décris sa modalité sans prétendre qu'elle a été demandée ;
- applique cette fidélité au profil au résumé, à l'objectif interprété, à toutes les justifications et aux limites ; ne reprends pas une préférence inventée par l'OBJECTIF INTERPRÉTÉ si elle n'apparaît pas dans le PROFIL ;
- ne déduis pas qu'une version de logiciel plus récente convient nécessairement mieux ; une différence de version ne suffit pas non plus à exclure un cours ;
- pour un même logiciel, une version proche peut figurer dans recommendedSteps si le contenu de la fiche répond aux compétences demandées ; précise la version du cours et les différences à vérifier, sans garantir une équivalence technique ;
- si la personne indique une version et que celle du cours est différente, signale explicitement dans sa justification les deux versions : « Ce cours porte sur [version du cours] ; vous avez indiqué [version demandée]. Les différences sont à vérifier. » ; conserve cette possibilité si le contenu reste pertinent, sans inventer de différences techniques ;
- si la personne impose explicitement une version exacte ou une fonctionnalité propre à cette version, respecte cette contrainte ; une simple mention de Word 2016 ne suffit pas à rendre toute autre version incompatible ;
- n'ajoute pas deux versions d'un même contenu comme étapes cumulatives : présente la meilleure réponse au besoin, puis une autre version en alternative seulement si elle apporte un choix utile ;
- pour un objectif général et des acquis non précisés, construis un parcours minimal : recommande d'abord le socle et classe les niveaux avancés ou usages spécialisés dans optionalSteps ;
- considère le temps disponible comme un repère de planification, jamais comme un motif pour retirer ou déclasser une étape directement nécessaire ;
- recommande le parcours qui répond précisément au besoin même si sa durée totale dépasse le temps disponible ; n'ajoute pas de cours redondants pour autant ;
- une disponibilité de deux heures ne suffit pas à supprimer un socle nécessaire à une personne débutante : conserve les apprentissages utiles et laisse le serveur afficher l'écart ; ce repère pourra être reconsidéré avec la personne et sa hiérarchie ;
- ne réduis pas silencieusement l'objectif et ne suppose pas qu'un étalement dans le temps a été accepté ;
- place les prérequis avant les approfondissements lorsqu'une formation préalable est réellement nécessaire ; « avoir suivi le cours de base OU maîtriser les contenus » ne rend pas ce cours obligatoire ;
- ne recommande pas un cours de base de plusieurs jours dans le seul but de vérifier des acquis : si les acquis requis ne sont pas établis, indique la question précise à clarifier et présente la remise à niveau comme conditionnelle dans optionalSteps, sans affirmer l'accès au module avancé ;
- distingue les compétences explicitement acquises, celles qui restent inconnues et celles qui sont explicitement absentes ; une simple pratique de Word ne prouve ni la maîtrise complète du socle ni la nécessité de tout reprendre ;
- privilégie les formations directement liées au métier et aux outils demandés avant les compétences transversales ;
- ne remplis pas artificiellement le parcours si peu de formations conviennent ;
- le résumé décrit uniquement le parcours recommandé ; il ne présente jamais les cours informatifs comme des étapes du parcours ;
- n'indique aucun total de durée dans le résumé : le serveur le calcule après ta réponse ;
- ne commente pas dans gaps la vérification arithmétique des durées : le serveur s'en charge ;
- gaps décrit uniquement les compétences ou objectifs professionnels que les fiches fournies ne couvrent pas ;
- ne mentionne jamais dans gaps la durée, le temps disponible, le budget, le public, l'accès ou les conditions d'inscription : le serveur les contrôle et les affiche séparément ;
- dans summary, les justifications et gaps, limite les constats d'absence aux fiches examinées ou à cette recherche ; ne les étends jamais au catalogue complet ;
- l'OBJECTIF INTERPRÉTÉ est une reformulation du besoin, pas une preuve de couverture du catalogue ; n'en reprends pas une affirmation d'absence globale ;
- explique brièvement la valeur de chaque étape ;
- pour chaque cours, renseigne relevance avec level direct, partial ou support et une courte reason fondée sur l'objectif, le contenu et les acquis. direct = réponse directe au besoin établi ; partial = couverture partielle ou besoin à clarifier ; support = compétence en appui. Ce n'est ni un pourcentage, ni un indicateur d'accès ou de modalité ;
- si le type de cockpit (RH, Paie, Formation) reste inconnu, utilise partial et pose la question dans reason ; ne présente pas RH comme le choix confirmé ;
- si Excel n'est qu'un appui à une demande Cockpit et que les acquis Excel sont inconnus, place-le dans optionalSteps avec relevance support, sous réserve du besoin de remise à niveau ;
- si aucun parcours cohérent n'est possible, abstain vaut true et recommendedSteps est vide ;
- indique honnêtement dans gaps les compétences que les fiches examinées ne permettent pas de couvrir.`,
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
                    relevance: {type:'object',properties:{level:{type:'string',enum:['direct','partial','support']},reason:{type:'string'}},required:['level','reason'],additionalProperties:false},
                  },
                  required: ['code', 'rationale', 'relevance'],
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
                    relevance: {type:'object',properties:{level:{type:'string',enum:['direct','partial','support']},reason:{type:'string'}},required:['level','reason'],additionalProperties:false},
                  },
                  required: ['code', 'rationale', 'relevance'],
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
                    relevance: {type:'object',properties:{level:{type:'string',enum:['direct','partial','support']},reason:{type:'string'}},required:['level','reason'],additionalProperties:false},
                  },
                  required: ['code', 'rationale', 'relevance'],
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
    for (const { code, rationale, relevance } of items ?? []) {
      const course = courseByCode.get(code)

      if (!course || !candidateCodes.includes(code) || seen.has(code)) {
        continue
      }

      const detail = detailedByCode.get(code)
      const item = {
        position: destination.length + 1,
        rationale: learnerExplanation(rationaleWithAccessCheck(rationale, detail)),
        ...(relevance&&['direct','partial','support'].includes(relevance.level)&&typeof relevance.reason==='string'&&relevance.reason.trim()?{relevance:{level:relevance.level,reason:learnerExplanation(relevance.reason).slice(0,1000)}}:{}),
        course: publicCourse(course, detail),
      }

      const compatibility = audienceCompatibility(profile, course)
      if (compatibility === 'incompatible') {
        seen.add(code)
        item.position = informationalCourses.length + 1
        informationalCourses.push(item)
        continue
      }

      if (destination === informationalCourses) {
        // L'absence de restriction détectée n'établit ni l'accès ni la pertinence.
        // Conserver seulement la récupération déjà prévue pour les nouveaux managers.
        if (!primaryCodes.includes(code) && (!isNewManagerProfile(profile) || !isNewManagerCourse(course))) continue

        seen.add(code)
        item.position = optionalSteps.length + 1
        optionalSteps.push(item)
        continue
      }

      seen.add(code)
      const hours = item.course.durationHours
      if (destination === recommendedSteps) {
        if (hours === null) allRecommendedDurationsKnown = false
        else recommendedHours += hours
      }

      destination.push(item)
    }
  }

  if (!plan.abstain) {
    add(plan.recommendedSteps ?? plan.steps, recommendedSteps)
    add(plan.informationalCourses, informationalCourses)
    add(plan.optionalSteps, optionalSteps)
  }

  const stabilizedOfficeSummary = !plan.abstain
    ? stabilizeGeneralOfficePathway(
        profile,
        candidateCodes,
        courseByCode,
        detailedByCode,
        recommendedSteps,
        optionalSteps,
      )
    : null

  if (budgetHours !== null && isNewManagerProfile(profile)) {
    const remainingOptions = []

    for (const item of optionalSteps) {
      const hours = item.course.durationHours
      const fitsBudget = hours !== null && recommendedHours + hours <= budgetHours

      if (
        recommendedSteps.length < MAX_STEPS &&
        fitsBudget &&
        !managerCandidateCodes.includes(item.course.code) &&
        isNewManagerCourse(courseByCode.get(item.course.code))
      ) {
        if (hours === null) allRecommendedDurationsKnown = false
        else recommendedHours += hours
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

  // Une piste portant le nom du besoin initial ne disparaît pas silencieusement
  // derrière les cours préparatoires. Aucun accès ni prérequis n'est supposé.
  let conditionalPrimary = false
  if (!plan.abstain && (profile.trainingOffers?.trim() || profile.trainingOrganizers?.trim())) {
    const retained = new Set([...recommendedSteps, ...optionalSteps, ...informationalCourses].map(item => item.course.code))
    const recovered = []
    for (const code of primaryCodes) {
      if (retained.has(code)) continue
      const course = courseByCode.get(code), detail = detailedByCode.get(code)
      if (!course || !candidateCodes.includes(code)) continue
      const item = {position: 0, rationale: rationaleWithAccessCheck('Piste liée à votre demande initiale sur les cockpits. Vérifiez que ce cours concerne le cockpit et l’usage recherchés, ainsi que vos droits d’accès et les prérequis. Il ne garantit pas de couvrir la création de nouveaux tableaux.', detail), course: publicCourse(course, detail)}
      if (audienceCompatibility(profile, course) === 'incompatible') informationalCourses.push(item)
      else recovered.push(item)
      conditionalPrimary = true
    }
    optionalSteps.unshift(...recovered)
  }

  recommendedHours = 0
  allRecommendedDurationsKnown = true
  for (const item of recommendedSteps) {
    const hours = item.course.durationHours
    if (hours === null) allRecommendedDurationsKnown = false
    else recommendedHours += hours
  }

  recommendedSteps.forEach((item, index) => { item.position = index + 1 })
  optionalSteps.forEach((item, index) => { item.position = index + 1 })
  informationalCourses.forEach((item, index) => { item.position = index + 1 })

  optionalSteps.splice(MAX_OPTIONAL_STEPS)

  const abstain = Boolean(plan.abstain || recommendedSteps.length === 0)

  return {
    mode: 'pathway-two-pass',
    abstain,
    interpretedGoal: learnerExplanation(primaryCodes.length ? 'Besoin initial : '+profile.objective+'. '+firstResult.interpretedGoal : firstResult.interpretedGoal),
    summary: learnerExplanation((stabilizedOfficeSummary ?? plan.summary)+(conditionalPrimary ? ' Des pistes Cockpit liées au besoin initial sont également présentées sous réserve : le cockpit visé, les usages couverts et les conditions d’accès restent à confirmer.' : '')),
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
      withinBudget: budgetHours !== null && allRecommendedDurationsKnown
        ? recommendedHours <= budgetHours
        : null,
      excessHours: budgetHours !== null && allRecommendedDurationsKnown
        ? Math.max(0, recommendedHours - budgetHours)
        : null,
    },
    gaps: (plan.gaps ?? [])
      .filter((gap) => typeof gap === 'string' && gap.trim())
      .filter((gap) => !isServerManagedGap(gap))
      .filter((gap) => {
        const describesRecommendedPath =
          /parcours recommand|en retenant|formations? retenues?|étapes? recommand/i.test(gap)

        if (!describesRecommendedPath) return true

        const recommendedCodes = new Set(recommendedSteps.map((item) => item.course.code))
        const mentionedCourseCodes =
          (gap.match(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*\b/g) ?? [])
            .filter((code) => courseByCode.has(code))

        return mentionedCourseCodes.every((code) => recommendedCodes.has(code))
      }).map(learnerExplanation),
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
