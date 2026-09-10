import assert from 'node:assert/strict'
import test from 'node:test'
import {
  PathwayInputError,
  isPathwayAssistantEnabled,
  validatePathwayInput,
} from './pathwayAssistant.mjs'

test('l assistant de parcours est désactivé par défaut', () => {
  assert.equal(isPathwayAssistantEnabled({}), false)
})

test('l assistant exige une activation explicite', () => {
  assert.equal(isPathwayAssistantEnabled({ ASSISTANT_PARCOURS_ENABLED: 'true' }), true)
  assert.equal(isPathwayAssistantEnabled({ ASSISTANT_PARCOURS_ENABLED: 'TRUE' }), false)
  assert.equal(isPathwayAssistantEnabled({ ASSISTANT_PARCOURS_ENABLED: '1' }), false)
})

test('le profil exige le rôle et l objectif', () => {
  assert.throws(
    () => validatePathwayInput({ objective: 'Progresser en IA' }),
    (error) => error instanceof PathwayInputError && error.status === 400,
  )
  assert.throws(
    () => validatePathwayInput({ role: 'Chef de projet' }),
    (error) => error instanceof PathwayInputError && error.status === 400,
  )
})

test('le profil est normalisé et conserve les contraintes utiles', () => {
  assert.deepEqual(
    validatePathwayInput({
      role: '  Chef de projet IT ',
      objective: ' Progresser en IA générative ',
      existingSkills: ' SQL et Power BI ',
      timeAvailable: ' 5 jours ',
      constraints: ' Sans devenir développeur ',
    }),
    {
      role: 'Chef de projet IT',
      objective: 'Progresser en IA générative',
      existingSkills: 'SQL et Power BI',
      timeAvailable: '5 jours',
      constraints: 'Sans devenir développeur',
    },
  )
})

test('les champs facultatifs vides sont omis', () => {
  assert.deepEqual(
    validatePathwayInput({
      role: 'Analyste',
      objective: 'Mieux visualiser les données',
      constraints: '   ',
    }),
    {
      role: 'Analyste',
      objective: 'Mieux visualiser les données',
    },
  )
})

test('les types invalides et les valeurs trop longues sont refusés', () => {
  assert.throws(
    () => validatePathwayInput({ role: 42, objective: 'Apprendre' }),
    (error) => error instanceof PathwayInputError && error.status === 400,
  )
  assert.throws(
    () => validatePathwayInput({ role: 'Analyste', objective: 'x'.repeat(1_001) }),
    (error) => error instanceof PathwayInputError && error.status === 422,
  )
})
