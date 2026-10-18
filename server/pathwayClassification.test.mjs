import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPathwayWithLuna } from './pathwayEngine.mjs'

function catalogue() {
  const courses = [
    { code: 'FOUNDATION', title: 'Coordonner un projet', audience: 'Tout public' },
    { code: 'UNCONFIRMED', title: 'Atelier de ressources pédagogiques', audience: '' },
    { code: 'ALTERNATIVE', title: 'Communiquer dans un projet', audience: 'Tout public' },
    { code: 'RESTRICTED', title: 'Coordonner un projet', audience: 'Personnel enseignant' },
  ].map(({ code, title, audience }) => ({
    code,
    title,
    duration: '1 jour',
    officialData: { titleRaw: title, publicRaw: audience },
  }))
  return {
    ultraCompactCatalogue: courses.map(({ code, title }) => [code, title]),
    officialCodes: courses.map(({ code }) => code),
    courseByCode: new Map(courses.map(course => [course.code, course])),
    detailedByCode: new Map(courses.map(course => [course.code, course])),
  }
}

async function build(plan, profile = {}) {
  const data = catalogue()
  const replies = [
    { interpretedGoal: 'Coordonner des projets', codes: data.officialCodes },
    {
      abstain: false,
      summary: 'Parcours projet',
      recommendedSteps: [{ code: 'FOUNDATION', rationale: 'Acquérir le socle projet.' }],
      optionalSteps: [],
      informationalCourses: [],
      gaps: [],
      ...plan,
    },
  ]
  const requests = []
  const result = await buildPathwayWithLuna(
    { personnelCategory: 'PAT', role: 'Collaborateur administratif', objective: 'Coordonner des projets', ...profile },
    {
      catalogue: data,
      apiKey: 'test-key',
      fetchImpl: async (_url, options) => {
        requests.push(JSON.parse(options.body))
        return {
          ok: true,
          json: async () => ({
            output: [{ content: [{ type: 'output_text', text: JSON.stringify(replies.shift()) }] }],
            usage: {},
          }),
        }
      },
    },
  )
  assert.equal(requests.length, 2)
  return { result, requests }
}

test('un public absent ou ouvert ne transforme pas un cours informatif en complément', async () => {
  const { result } = await build({
    informationalCourses: [
      { code: 'UNCONFIRMED', rationale: 'Contexte pédagogique distinct du besoin.' },
      { code: 'ALTERNATIVE', rationale: 'Accès non établi par le modèle.' },
    ],
  })

  assert.deepEqual(result.optionalSteps, [])
  assert.deepEqual(result.informationalCourses, [])
  assert.deepEqual(result.recommendedSteps.map(item => item.course.code), ['FOUNDATION'])
})

test('un cours informatif non reclassé ne masque pas un complément explicitement sélectionné', async () => {
  const rationale = 'Alternative pour travailler la communication au sein du projet.'
  const { result } = await build({
    informationalCourses: [{ code: 'ALTERNATIVE', rationale: 'Public à vérifier.' }],
    optionalSteps: [{ code: 'ALTERNATIVE', rationale }],
  })

  assert.deepEqual(result.optionalSteps.map(item => item.course.code), ['ALTERNATIVE'])
  assert.equal(result.optionalSteps[0].rationale, rationale)
  assert.deepEqual(result.informationalCourses, [])
})

test('conserve les compléments explicitement retenus et les cours pertinents à public différent', async () => {
  const rationale = 'Même méthode de coordination, formation réservée aux enseignants.'
  const { result } = await build({
    optionalSteps: [{ code: 'ALTERNATIVE', rationale: 'Approfondir la communication du projet.' }],
    informationalCourses: [{ code: 'RESTRICTED', rationale }],
  })

  assert.deepEqual(result.optionalSteps.map(item => item.course.code), ['ALTERNATIVE'])
  assert.deepEqual(result.informationalCourses.map(item => item.course.code), ['RESTRICTED'])
  assert.equal(result.informationalCourses[0].rationale, rationale)
})

test('le classement des annexes ne modifie ni le socle ni le calcul du dépassement', async () => {
  const { result } = await build({
    informationalCourses: [{ code: 'UNCONFIRMED', rationale: 'Autre contexte.' }],
    optionalSteps: [{ code: 'ALTERNATIVE', rationale: 'Approfondissement utile.' }],
  }, { timeAvailable: 'maximum 4 heures' })

  assert.equal(result.durationSummary.recommendedHours, 8)
  assert.equal(result.durationSummary.budgetHours, 4)
  assert.equal(result.durationSummary.excessHours, 4)
  assert.deepEqual(result.optionalSteps.map(item => item.course.code), ['ALTERNATIVE'])
})
