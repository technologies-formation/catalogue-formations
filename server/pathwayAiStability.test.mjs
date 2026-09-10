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
