import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPathwayWithLuna } from './pathwayEngine.mjs'

function response(output, usage = {}) {
  return {
    ok: true,
    async json() {
      return {
        output: [{ content: [{ type: 'output_text', text: JSON.stringify(output) }] }],
        usage,
      }
    },
  }
}

function fixture() {
  const courses = [
    {
      code: 'AI-BASE',
      officialData: {
        titleRaw: 'Découvrir l intelligence artificielle générative',
        domainRaw: 'Numérique',
      },
      sourceUrl: 'https://example.test/ai-base',
    },
    {
      code: 'AI-PRACTICE',
      officialData: {
        titleRaw: 'Pratiquer l intelligence artificielle',
        domainRaw: 'Numérique',
      },
      sourceUrl: 'https://example.test/ai-practice',
    },
  ]
  return {
    ultraCompactCatalogue: courses.map(({ code, officialData }) => [
      code,
      officialData.titleRaw,
    ]),
    officialCodes: courses.map(({ code }) => code),
    detailedByCode: new Map(courses.map((course) => [course.code, course])),
    courseByCode: new Map(courses.map((course) => [course.code, course])),
  }
}

function officeFixture(theme, courses) {
  const prepared = courses.map(({ code, title, prerequisites = '' }) => ({
    code,
    title,
    theme,
    prerequisites,
    officialData: {
      titleRaw: title,
      domainRaw: 'LOGICIELS BUREAUTIQUES',
      themeRaw: theme,
      publicRaw: 'Tout public',
    },
    sourceUrl: `https://example.test/${code}`,
  }))

  return {
    ultraCompactCatalogue: prepared.map(({ code, title }) => [code, title]),
    officialCodes: prepared.map(({ code }) => code),
    detailedByCode: new Map(prepared.map((course) => [course.code, course])),
    courseByCode: new Map(prepared.map((course) => [course.code, course])),
  }
}

test('construit un parcours ordonné uniquement avec les formations autorisées', async () => {
  const replies = [
    response(
      {
        interpretedGoal: 'Progresser en IA générative sans coder',
        codes: ['AI-BASE', 'AI-PRACTICE'],
      },
      { input_tokens: 100, output_tokens: 20 },
    ),
    response(
      {
        abstain: false,
        summary: 'Un parcours progressif en deux étapes.',
        steps: [
          { code: 'AI-BASE', rationale: 'Acquérir les bases.' },
          { code: 'AI-PRACTICE', rationale: 'Passer à la pratique.' },
        ],
        gaps: [],
      },
      { input_tokens: 50, output_tokens: 30 },
    ),
  ]
  const requests = []
  const fetchImpl = async (_url, options) => {
    requests.push(JSON.parse(options.body))
    return replies.shift()
  }

  const result = await buildPathwayWithLuna(
    {
      role: 'Chef de projet IT',
      objective: 'Progresser en IA générative',
      existingSkills: 'SQL et Power BI',
      timeAvailable: '5 jours',
      constraints: 'Sans devenir développeur',
    },
    { catalogue: fixture(), apiKey: 'test-key', fetchImpl },
  )

  assert.equal(requests.length, 2)
  assert.equal(requests[0].model, 'gpt-5.6-luna')
  assert.equal(requests[0].store, false)
  assert.match(requests[1].instructions, /alternatives de modalité ou de version/)
  assert.match(requests[1].instructions, /e-learning, le distanciel, le présentiel/)
  assert.match(requests[1].instructions, /ne les présente pas comme des étapes cumulatives/)
  assert.match(requests[1].instructions, /objectif général et des acquis non précisés/)
  assert.equal(result.abstain, false)
  assert.deepEqual(
    result.steps.map(({ position, course }) => [position, course.code]),
    [[1, 'AI-BASE'], [2, 'AI-PRACTICE']],
  )
  assert.equal(result.usage.total.input, 150)
})

test('s abstient après la première passe quand aucun candidat n est trouvé', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    return response({ interpretedGoal: 'Apprendre le japonais', codes: [] })
  }

  const result = await buildPathwayWithLuna(
    { role: 'Analyste', objective: 'Apprendre le japonais' },
    { catalogue: fixture(), apiKey: 'test-key', fetchImpl },
  )

  assert.equal(calls, 1)
  assert.equal(result.abstain, true)
  assert.deepEqual(result.steps, [])
  assert.equal(result.usage.pass2, null)
})

test('déduplique les étapes retournées par le modèle', async () => {
  const replies = [
    response({
      interpretedGoal: 'Progresser en IA',
      codes: ['AI-BASE', 'AI-PRACTICE'],
    }),
    response({
      abstain: false,
      summary: 'Parcours',
      steps: [
        { code: 'AI-BASE', rationale: 'Bases' },
        { code: 'AI-BASE', rationale: 'Doublon' },
      ],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { role: 'Analyste', objective: 'Progresser en IA' },
    {
      catalogue: fixture(),
      apiKey: 'test-key',
      fetchImpl: async () => replies.shift(),
    },
  )

  assert.deepEqual(result.steps.map(({ course }) => course.code), ['AI-BASE'])
})

test('stabilise un besoin Word général et conserve le e-learning comme alternative', async () => {
  const catalogue = officeFixture('WORD', [
    { code: 'WORD-BASE', title: 'Word 365 Base' },
    { code: 'WORD-ADVANCED', title: 'Word 365 Mise en forme avancée' },
    { code: 'WORD-LONG', title: 'Word 365 Longs documents' },
    { code: 'WORD-ONLINE', title: 'Word 2016 : Fondamentaux au perfectionnement | E-LEARNING' },
  ])
  const replies = [
    response({
      interpretedGoal: 'Utiliser Word',
      codes: catalogue.officialCodes,
    }),
    response({
      abstain: false,
      summary: 'Parcours trop large retourné par le modèle.',
      recommendedSteps: [
        { code: 'WORD-BASE', rationale: 'Base' },
        { code: 'WORD-ADVANCED', rationale: 'Avancé' },
        { code: 'WORD-LONG', rationale: 'Longs documents' },
      ],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { personnelCategory: 'PAT', role: 'Chef de projet', objective: 'Je veux utiliser Word' },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.recommendedSteps.map(({ course }) => course.code), ['WORD-BASE'])
  assert.deepEqual(
    result.optionalSteps.map(({ course }) => course.code),
    ['WORD-ONLINE', 'WORD-ADVANCED', 'WORD-LONG'],
  )
  assert.match(result.summary, /Commencer par Word 365 Base/)
})

test('privilégie le e-learning pour un besoin Excel général en autonomie', async () => {
  const catalogue = officeFixture('EXCEL', [
    { code: 'EXCEL-BASE', title: 'Excel 365 Base' },
    { code: 'EXCEL-PIVOT', title: 'Excel 365 Tableaux croisés dynamiques' },
    { code: 'EXCEL-ONLINE', title: 'Excel 2016 : Fondamentaux au perfectionnement | E-LEARNING' },
  ])
  const replies = [
    response({ interpretedGoal: 'Apprendre Excel en autonomie', codes: catalogue.officialCodes }),
    response({
      abstain: false,
      summary: 'Parcours Excel.',
      recommendedSteps: [
        { code: 'EXCEL-BASE', rationale: 'Base' },
        { code: 'EXCEL-PIVOT', rationale: 'Approfondissement' },
      ],
      optionalSteps: [{ code: 'EXCEL-ONLINE', rationale: 'En ligne' }],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      personnelCategory: 'PAT',
      role: 'Assistante administrative',
      objective: 'Je veux apprendre Excel',
      constraints: 'Je préfère un e-learning en autonomie',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.recommendedSteps.map(({ course }) => course.code), ['EXCEL-ONLINE'])
  assert.deepEqual(
    result.optionalSteps.map(({ course }) => course.code),
    ['EXCEL-BASE', 'EXCEL-PIVOT'],
  )
})

test('préserve un parcours PowerPoint spécialisé', async () => {
  const catalogue = officeFixture('POWERPOINT', [
    { code: 'PPT-BASE', title: 'PowerPoint 365 Base' },
    { code: 'PPT-MEDIA', title: 'PowerPoint 365 Multimédia et animations' },
    { code: 'PPT-ONLINE', title: 'PowerPoint 2016 : Fondamentaux au perfectionnement | E-LEARNING' },
  ])
  const replies = [
    response({ interpretedGoal: 'Créer des animations PowerPoint', codes: catalogue.officialCodes }),
    response({
      abstain: false,
      summary: 'Parcours spécialisé.',
      recommendedSteps: [
        { code: 'PPT-BASE', rationale: 'Prérequis' },
        { code: 'PPT-MEDIA', rationale: 'Répond au besoin' },
      ],
      optionalSteps: [{ code: 'PPT-ONLINE', rationale: 'Alternative' }],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { objective: 'Je veux créer des animations avec PowerPoint' },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(
    result.recommendedSteps.map(({ course }) => course.code),
    ['PPT-BASE', 'PPT-MEDIA'],
  )
  assert.equal(result.summary, 'Parcours spécialisé.')
})

test('refuse de démarrer sans clé API', async () => {
  await assert.rejects(
    buildPathwayWithLuna(
      { role: 'Analyste', objective: 'Progresser' },
      { catalogue: fixture(), apiKey: '' },
    ),
    /OPENAI_API_KEY absente/,
  )
})

test('déplace une formation réservée aux enseignants vers les cours informatifs', async () => {
  const catalogue = fixture()
  const teacherCourse = catalogue.courseByCode.get('AI-PRACTICE')
  teacherCourse.officialData.publicRaw = 'Personnel enseignant du DIP'
  teacherCourse.officialData.targetAudienceRaw = 'Corps enseignant de l ES II'
  const replies = [
    response({ interpretedGoal: 'Progresser en IA', codes: ['AI-BASE', 'AI-PRACTICE'] }),
    response({
      abstain: false,
      summary: 'Parcours',
      recommendedSteps: [
        { code: 'AI-BASE', rationale: 'Bases' },
        { code: 'AI-PRACTICE', rationale: 'Pratique' },
      ],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      personnelCategory: 'PAT',
      role: 'Chef de projet IT',
      objective: 'Progresser en IA',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.recommendedSteps.map(({ course }) => course.code), ['AI-BASE'])
  assert.deepEqual(result.informationalCourses.map(({ course }) => course.code), ['AI-PRACTICE'])
  assert.equal(result.steps, result.recommendedSteps)
})

test('déplace un cours public Manager vers les informations pour un profil non manager', async () => {
  const catalogue = fixture()
  const managerCourse = catalogue.courseByCode.get('AI-PRACTICE')
  managerCourse.officialData.publicRaw = 'Manager'
  const replies = [
    response({ interpretedGoal: 'Animer une activité à distance', codes: ['AI-BASE', 'AI-PRACTICE'] }),
    response({
      abstain: false,
      summary: 'Parcours',
      recommendedSteps: [
        { code: 'AI-BASE', rationale: 'Socle' },
        { code: 'AI-PRACTICE', rationale: 'Animation à distance' },
      ],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      personnelCategory: 'PAT',
      managerStatus: 'Non précisé',
      role: 'Formateur occasionnel',
      objective: 'Animer une activité à distance',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.recommendedSteps.map(({ course }) => course.code), ['AI-BASE'])
  assert.deepEqual(result.informationalCourses.map(({ course }) => course.code), ['AI-PRACTICE'])
})

test('rappelle une fiche qui couvre plusieurs termes du besoin sans imposer son code', async () => {
  const catalogue = fixture()
  const presentationCourse = {
    code: 'PRESENTATION',
    title: 'Présentations professionnelles',
    objectives: 'Maintenir l attention du public',
    officialData: {
      titleRaw: 'Présentations professionnelles',
      publicRaw: 'Tout public',
    },
    sourceUrl: 'https://example.test/presentation',
  }
  catalogue.ultraCompactCatalogue.push([
    presentationCourse.code,
    presentationCourse.officialData.titleRaw,
  ])
  catalogue.officialCodes.push(presentationCourse.code)
  catalogue.detailedByCode.set(presentationCourse.code, presentationCourse)
  catalogue.courseByCode.set(presentationCourse.code, presentationCourse)
  const requests = []
  const replies = [
    response({ interpretedGoal: 'Maintenir l attention', codes: ['AI-BASE'] }),
    response({
      abstain: false,
      summary: 'Parcours',
      recommendedSteps: [{ code: 'PRESENTATION', rationale: 'Répond au besoin' }],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [],
    }),
  ]
  const fetchImpl = async (_url, options) => {
    requests.push(JSON.parse(options.body))
    return replies.shift()
  }

  const result = await buildPathwayWithLuna(
    {
      personnelCategory: 'PAT',
      role: 'Formateur occasionnel',
      objective: 'Maintenir l attention',
    },
    { catalogue, apiKey: 'test-key', fetchImpl },
  )

  assert.match(requests[1].input, /PRESENTATION/)
  assert.deepEqual(
    result.recommendedSteps.map(({ course }) => course.code),
    ['PRESENTATION'],
  )
})

test('signale un dépassement sans déclasser les formations recommandées', async () => {
  const catalogue = fixture()
  catalogue.detailedByCode.get('AI-BASE').duration = '1 jour'
  catalogue.detailedByCode.get('AI-PRACTICE').duration = '8 heures'
  const replies = [
    response({ interpretedGoal: 'Progresser en IA', codes: ['AI-BASE', 'AI-PRACTICE'] }),
    response({
      abstain: false,
      summary: 'Parcours',
      recommendedSteps: [
        { code: 'AI-BASE', rationale: 'Bases' },
        { code: 'AI-PRACTICE', rationale: 'Pratique' },
      ],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [
        'Aucun cours ne traite spécifiquement l évaluation des acquis.',
        'Le parcours recommandé dépasse le repère de quatre jours disponibles.',
        'L accès exact des formations tout public doit être confirmé lors de l inscription.',
      ],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { role: 'Analyste', objective: 'Progresser en IA', timeAvailable: 'maximum 1 jour' },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.recommendedSteps.map(({ course }) => course.code), ['AI-BASE', 'AI-PRACTICE'])
  assert.deepEqual(result.optionalSteps, [])
  assert.deepEqual(result.durationSummary, {
    budgetHours: 8,
    recommendedHours: 16,
    verified: true,
    durationsKnown: true,
    budgetVerified: true,
    withinBudget: false,
    excessHours: 8,
  })
  assert.deepEqual(result.gaps, [
    'Aucun cours ne traite spécifiquement l évaluation des acquis.',
  ])
})

test('complète les candidats Luna avec les cours Cockpit demandés explicitement', async () => {
  const courses = [
    { code: 'TRT452', title: 'Cockpit Formation', theme: 'SIRH' },
    { code: 'TRT450', title: 'Cockpit RH', theme: 'SIRH' },
    { code: 'TRT451', title: 'Cockpit Paie', theme: 'SIRH' },
  ].map(({ code, title, theme }) => ({
    code,
    title,
    theme,
    officialData: { titleRaw: title, themeRaw: theme, publicRaw: 'Tout public' },
  }))
  const catalogue = {
    ultraCompactCatalogue: courses.map(({ code, title }) => [code, title]),
    officialCodes: courses.map(({ code }) => code),
    detailedByCode: new Map(courses.map((course) => [course.code, course])),
    courseByCode: new Map(courses.map((course) => [course.code, course])),
  }
  const replies = [
    response({ interpretedGoal: 'Maîtriser les Cockpits SIRH', codes: ['TRT452'] }),
    response({
      abstain: false,
      summary: 'Parcours Cockpit',
      recommendedSteps: [
        { code: 'TRT452', rationale: 'Formation' },
        { code: 'TRT450', rationale: 'RH' },
        { code: 'TRT451', rationale: 'Paie' },
      ],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { role: 'Analyste OPE', objective: 'Utiliser les différents Cockpits SIRH' },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(
    result.recommendedSteps.map(({ course }) => course.code),
    ['TRT452', 'TRT450', 'TRT451'],
  )
})

test('ne classe pas comme inaccessible un cours réservé aux nouveaux managers pour un nouveau manager', async () => {
  const catalogue = fixture()
  const managerCourse = catalogue.courseByCode.get('AI-PRACTICE')
  managerCourse.officialData.publicRaw = 'Manager'
  managerCourse.officialData.targetAudienceRaw = 'Formation réservée aux nouvelles et nouveaux managers'
  managerCourse.title = managerCourse.officialData.titleRaw
  managerCourse.targetAudience = managerCourse.officialData.targetAudienceRaw
  const replies = [
    response({ interpretedGoal: 'Prendre une fonction managériale', codes: ['AI-BASE', 'AI-PRACTICE'] }),
    response({
      abstain: false,
      summary: 'Parcours manager',
      recommendedSteps: [{ code: 'AI-BASE', rationale: 'Base' }],
      optionalSteps: [],
      informationalCourses: [{ code: 'AI-PRACTICE', rationale: 'À confirmer' }],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      managerStatus: 'Nouveau manager',
      role: 'Responsable d équipe',
      objective: 'Prendre mes fonctions',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.informationalCourses, [])
  assert.deepEqual(result.optionalSteps.map(({ course }) => course.code), ['AI-PRACTICE'])
  assert.equal(
    result.optionalSteps[0].rationale,
    'Formation pertinente pour votre profil, proposée comme complément au parcours recommandé ; vérifiez les éventuelles conditions d’inscription dans la fiche officielle.',
  )
})

test('une restriction institutionnelle explicite prime sur la mention tout public', async () => {
  const catalogue = fixture()
  const policeCourse = catalogue.courseByCode.get('AI-PRACTICE')
  policeCourse.officialData.publicRaw = 'Tout public'
  policeCourse.officialData.targetAudienceRaw = 'Policiers, policières et personnel administratif de la police'
  const replies = [
    response({ interpretedGoal: 'Prendre une fonction managériale', codes: ['AI-BASE', 'AI-PRACTICE'] }),
    response({
      abstain: false,
      summary: 'Parcours manager',
      recommendedSteps: [
        { code: 'AI-BASE', rationale: 'Base' },
        { code: 'AI-PRACTICE', rationale: 'Police' },
      ],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { personnelCategory: 'PAT', entity: 'OPE', role: 'Manager', objective: 'Prendre mes fonctions' },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.recommendedSteps.map(({ course }) => course.code), ['AI-BASE'])
  assert.deepEqual(result.informationalCourses.map(({ course }) => course.code), ['AI-PRACTICE'])
})

test('stabilise un module nouveau manager qui tient exactement dans le budget restant', async () => {
  const catalogue = fixture()
  const baseCourse = catalogue.courseByCode.get('AI-BASE')
  const managerCourse = catalogue.courseByCode.get('AI-PRACTICE')
  baseCourse.duration = '4 demi-journées'
  managerCourse.duration = '8 heures'
  managerCourse.officialData.publicRaw = 'Manager'
  managerCourse.officialData.targetAudienceRaw = 'Formation réservée aux nouvelles et nouveaux managers'
  const replies = [
    response({ interpretedGoal: 'Prendre une fonction managériale', codes: ['AI-BASE', 'AI-PRACTICE'] }),
    response({
      abstain: false,
      summary: 'Parcours manager',
      recommendedSteps: [{ code: 'AI-BASE', rationale: 'Prérequis' }],
      optionalSteps: [],
      informationalCourses: [{ code: 'AI-PRACTICE', rationale: 'Leadership' }],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      managerStatus: 'Nouveau manager',
      role: 'Première responsabilité d une équipe',
      objective: 'Prendre mes fonctions',
      timeAvailable: 'Maximum 3 jours',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(
    result.recommendedSteps.map(({ course }) => course.code),
    ['AI-BASE', 'AI-PRACTICE'],
  )
  assert.deepEqual(result.optionalSteps, [])
  assert.equal(result.durationSummary.recommendedHours, 24)
})

test('ne promeut pas tous les compléments nouveau manager quand le parcours dépasse déjà le budget', async () => {
  const catalogue = fixture()
  const baseCourse = catalogue.courseByCode.get('AI-BASE')
  const managerCourse = catalogue.courseByCode.get('AI-PRACTICE')
  baseCourse.duration = '2 jours'
  managerCourse.duration = '2 jours'
  managerCourse.officialData.publicRaw = 'Manager'
  managerCourse.officialData.targetAudienceRaw = 'Formation réservée aux nouvelles et nouveaux managers'
  const replies = [
    response({ interpretedGoal: 'Prendre une fonction managériale', codes: ['AI-BASE', 'AI-PRACTICE'] }),
    response({
      abstain: false,
      summary: 'Parcours manager',
      recommendedSteps: [{ code: 'AI-BASE', rationale: 'Indispensable' }],
      optionalSteps: [{ code: 'AI-PRACTICE', rationale: 'Approfondissement' }],
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      managerStatus: 'Nouveau manager',
      role: 'Première responsabilité d une équipe',
      objective: 'Prendre mes fonctions',
      timeAvailable: 'Maximum 1 jour',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(
    result.recommendedSteps.map(({ course }) => course.code),
    ['AI-BASE'],
  )
  assert.deepEqual(
    result.optionalSteps.map(({ course }) => course.code),
    ['AI-PRACTICE'],
  )
  assert.equal(result.durationSummary.recommendedHours, 16)
  assert.equal(result.durationSummary.excessHours, 8)
})
