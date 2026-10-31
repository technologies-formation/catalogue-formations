import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPathwayWithLuna } from './pathwayEngine.mjs'

function response(output) {
  return {
    ok: true,
    async json() {
      return {
        output: [{ content: [{ type: 'output_text', text: JSON.stringify(output) }] }],
        usage: {},
      }
    },
  }
}

for (const destination of ['omitted', 'optionalSteps', 'recommendedSteps']) {
  test(`PACIFIC reste candidat sans ajout ni promotion automatiques : ${destination}`, async () => {
    const courses = [
      { code: 'SEM1192', title: 'Socle managérial synthétique', duration: '2 jours',
        officialData: { titleRaw: 'Socle managérial synthétique', publicRaw: 'Manager' } },
      { code: 'SEM1174', title: 'Pacific : Leadership et gestion d’équipe', duration: '8 heures',
        prerequisites: 'Être inscrite ou inscrit dans le programme des nouvelles et nouveaux managers.',
        officialData: { titleRaw: 'Pacific : Leadership et gestion d’équipe', publicRaw: 'Manager',
          targetAudienceRaw: 'Formation réservée aux nouvelles et nouveaux managers' } },
    ]
    const catalogue = {
      officialCodes: courses.map(c => c.code), ultraCompactCatalogue: courses.map(c => [c.code, c.title]),
      detailedByCode: new Map(courses.map(c => [c.code, c])), courseByCode: new Map(courses.map(c => [c.code, c])),
    }
    const plan = { abstain: false, summary: 'Socle sélectionné selon le besoin.',
      recommendedSteps: [{ code: 'SEM1192', rationale: 'Socle pertinent.' }], optionalSteps: [], informationalCourses: [], gaps: [] }
    if (destination !== 'omitted') plan[destination].push({ code: 'SEM1174', rationale: 'Travailler le feedback.' })
    const replies = [response({ interpretedGoal: 'Conduire mes entretiens', codes: ['SEM1192'] }), response(plan)]
    const requests = []
    const result = await buildPathwayWithLuna({ personnelCategory: 'PAT', managerStatus: 'Nouveau manager',
      objective: 'Conduire mes entretiens de feedback', timeAvailable: '5 jours' },
    { catalogue, apiKey: 'fake-key', fetchImpl: async (_url, options) => {
      requests.push(JSON.parse(options.body)); return replies.shift()
    } })
    assert.match(requests[1].input, /SEM1174/)
    assert.match(requests[1].instructions, /ne recommande pas PACIFIC.*seul statut de nouveau manager/)
    const all = [...result.recommendedSteps, ...result.optionalSteps, ...result.informationalCourses]
    if (destination === 'omitted') {
      assert.equal(all.some(item => item.course.code === 'SEM1174'), false)
      assert.equal(result.durationSummary.recommendedHours, 16)
    } else {
      const selected = result[destination].find(item => item.course.code === 'SEM1174')
      assert.ok(selected)
      assert.match(selected.rationale, /êtes-vous inscrit ou inscrite au programme requis/)
      assert.match(selected.rationale, /vérifiez ce point avec vos RH/)
      assert.equal(all.filter(item => item.course.code === 'SEM1174').length, 1)
      assert.equal(result.durationSummary.recommendedHours, destination === 'recommendedSteps' ? 24 : 16)
    }
  })
}

test('aucune inscription à un programme n’est inventée quand la fiche n’en indique pas', async () => {
  const course = { code: 'SYNTHETIC', title: 'Leadership synthétique', officialData: { titleRaw: 'Leadership synthétique', publicRaw: 'Tout public' } }
  const catalogue = { officialCodes: [course.code], ultraCompactCatalogue: [[course.code, course.title]],
    detailedByCode: new Map([[course.code, course]]), courseByCode: new Map([[course.code, course]]) }
  const replies = [response({ interpretedGoal: 'Progresser en leadership', codes: [course.code] }),
    response({ abstain: false, summary: 'Socle.', recommendedSteps: [{ code: course.code, rationale: 'Progresser en leadership.' }],
      optionalSteps: [], informationalCourses: [], gaps: [] })]
  const result = await buildPathwayWithLuna({ objective: 'Progresser en leadership' },
    { catalogue, apiKey: 'fake-key', fetchImpl: async () => replies.shift() })
  assert.equal(result.recommendedSteps[0].rationale, 'Progresser en leadership.')
})

test('stabilise le parcours IA générative PAT sur les deux fondations institutionnelles', async () => {
  const courses = [
    {
      code: 'TRT3004H',
      duration: '12 heures',
      officialData: {
        titleRaw: 'Transformation Numérique',
        domainRaw: 'NUMERIQUE A L ETAT',
        publicRaw: 'Tout public',
        targetAudienceRaw: 'Personnel de l Etat, prioritairement aux managers',
      },
      sourceUrl: 'https://example.test/TRT3004H',
    },
    {
      code: 'SEM1246',
      duration: '2 jours',
      officialData: {
        titleRaw: 'Renforcer son esprit critique à l ère de l IA',
        domainRaw: 'NUMERIQUE A L ETAT',
        publicRaw: 'Tout public',
      },
      sourceUrl: 'https://example.test/SEM1246',
    },
    {
      code: 'S2-TDAH',
      duration: '1 demi-journée',
      officialData: {
        titleRaw: 'Trouble du déficit d attention',
        domainRaw: 'Pédagogie',
        publicRaw: 'Enseignants du CO',
      },
      sourceUrl: 'https://example.test/S2-TDAH',
    },
  ]
  const catalogue = {
    ultraCompactCatalogue: courses.map((course) => [course.code, course.officialData.titleRaw]),
    officialCodes: courses.map((course) => course.code),
    detailedByCode: new Map(courses.map((course) => [course.code, course])),
    courseByCode: new Map(courses.map((course) => [course.code, course])),
  }
  const replies = [
    response({ interpretedGoal: 'Utiliser l IA générative', codes: ['S2-TDAH'] }),
    response({
      abstain: false,
      summary: 'Parcours IA',
      recommendedSteps: [],
      optionalSteps: [{ code: 'TRT3004H', rationale: 'Priorité manager' }],
      informationalCourses: [
        { code: 'SEM1246', rationale: 'À vérifier' },
        { code: 'S2-TDAH', rationale: 'Information' },
      ],
      gaps: ['', '  ', 'Pas de formation Power BI et IA.'],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      personnelCategory: 'PAT',
      role: 'Chef de projet IT',
      objective: 'Progresser sur l intelligence artificielle générative sans devenir développeur',
      existingSkills: 'SQL et Power BI',
      timeAvailable: 'Maximum 5 jours',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(
    result.recommendedSteps.map(({ course }) => course.code),
    ['TRT3004H', 'SEM1246'],
  )
  assert.equal(result.abstain, false)
  assert.equal(result.durationSummary.recommendedHours, 28)
  assert.deepEqual(result.informationalCourses, [])
  assert.deepEqual(result.gaps, ['Pas de formation Power BI et IA.'])
})

test('classe un public pédagogique comme informatif pour un PAT et limite les compléments', async () => {
  const courses = [
    {
      code: 'PAT-MAIN',
      duration: '1 heure',
      officialData: { titleRaw: 'Formation principale', publicRaw: 'Tout public' },
    },
    {
      code: 'EP-COORD',
      officialData: {
        titleRaw: 'Concevoir des ressources',
        publicRaw: 'Coordinateurs pédagogiques',
        targetAudienceRaw: 'Coordinateurs et coordinatrices pédagogiques',
      },
    },
    ...Array.from({ length: 6 }, (_, index) => ({
      code: `PAT-${index + 1}`,
      duration: '1 heure',
      officialData: { titleRaw: `Complément ${index + 1}`, publicRaw: 'Tout public' },
    })),
  ]
  const catalogue = {
    ultraCompactCatalogue: courses.map((course) => [course.code, course.officialData.titleRaw]),
    officialCodes: courses.map((course) => course.code),
    detailedByCode: new Map(courses.map((course) => [course.code, course])),
    courseByCode: new Map(courses.map((course) => [course.code, course])),
  }
  const replies = [
    response({ interpretedGoal: 'Compléments', codes: courses.map((course) => course.code) }),
    response({
      abstain: false,
      summary: 'Parcours',
      recommendedSteps: [{ code: 'PAT-MAIN', rationale: 'Principal' }],
      optionalSteps: courses.slice(1).map((course) => ({ code: course.code, rationale: 'Complément' })),
      informationalCourses: [],
      gaps: [],
    }),
  ]

  const result = await buildPathwayWithLuna(
    { personnelCategory: 'PAT', role: 'Analyste', objective: 'Développer mes compétences' },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(result.informationalCourses.map(({ course }) => course.code), ['EP-COORD'])
  assert.equal(result.optionalSteps.length, 4)
})

test('écarte une limite qui attribue au parcours recommandé des cours non retenus', async () => {
  const courses = [
    {
      code: 'SEM1192',
      duration: '4 demi-journées',
      officialData: { titleRaw: 'Apprendre la conduite stratégique', publicRaw: 'Manager' },
    },
    {
      code: 'SEM1174',
      duration: '8 heures',
      officialData: { titleRaw: 'Pacific : Leadership et gestion d équipe', publicRaw: 'Manager' },
    },
    {
      code: 'SEM1203',
      duration: '2 jours',
      officialData: { titleRaw: 'Les entretiens managériaux', publicRaw: 'Manager' },
    },
    {
      code: 'SEM0052',
      duration: '3 jours',
      officialData: { titleRaw: 'Manager : gérer les tensions', publicRaw: 'Manager' },
    },
  ]
  const catalogue = {
    ultraCompactCatalogue: courses.map((course) => [course.code, course.officialData.titleRaw]),
    officialCodes: courses.map((course) => course.code),
    detailedByCode: new Map(courses.map((course) => [course.code, course])),
    courseByCode: new Map(courses.map((course) => [course.code, course])),
  }
  const replies = [
    response({ interpretedGoal: 'Prendre une fonction managériale', codes: courses.map(({ code }) => code) }),
    response({
      abstain: false,
      summary: 'Parcours nouveau manager',
      recommendedSteps: [
        { code: 'SEM1192', rationale: 'Fondamentaux' },
      ],
      optionalSteps: [
        { code: 'SEM1174', rationale: 'Leadership' },
        { code: 'SEM1203', rationale: 'Entretiens' },
        { code: 'SEM0052', rationale: 'Tensions' },
      ],
      informationalCourses: [],
      gaps: [
        'Le catalogue ne propose pas de formation dédiée au travail à distance.',
        'Le parcours recommandé respecte la limite en retenant SEM1192, SEM1203 et SEM0052.',
      ],
    }),
  ]

  const result = await buildPathwayWithLuna(
    {
      personnelCategory: 'PAT',
      managerialSituation: 'Nouveau manager',
      role: 'Nouveau responsable d une équipe',
      objective: 'Prendre mes fonctions et conduire des entretiens difficiles',
      timeAvailable: 'Maximum 3 jours',
    },
    { catalogue, apiKey: 'test-key', fetchImpl: async () => replies.shift() },
  )

  assert.deepEqual(
    result.recommendedSteps.map(({ course }) => course.code),
    ['SEM1192'],
  )
  assert.ok(result.optionalSteps.some(({ course }) => course.code === 'SEM1174'))
  assert.deepEqual(result.gaps, [
    'Le catalogue ne propose pas de formation dédiée au travail à distance.',
  ])
})
