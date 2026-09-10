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

test('déplace hors parcours les formations qui dépassent un plafond de durée vérifiable', async () => {
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
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { role: 'Analyste', objective: 'Progresser en IA', timeAvailable: 'maximum 1 jour' },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.recommendedSteps.map(({ course }) => course.code), ['AI-BASE'])
  assert.deepEqual(result.optionalSteps.map(({ course }) => course.code), ['AI-PRACTICE'])
  assert.deepEqual(result.durationSummary, {
    budgetHours: 8,
    recommendedHours: 8,
    verified: true,
  })
})
