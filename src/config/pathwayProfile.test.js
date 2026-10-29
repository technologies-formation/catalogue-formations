import assert from 'node:assert/strict'
import test from 'node:test'
import { entities } from './entities.js'
import { personnelCategories } from './personnelCategories.js'
import { createEmptyPathwayProfile, pathwayProfile, pathwayProfileFields } from './pathwayProfile.js'
import { PathwayInputError, validatePathwayInput } from '../../server/pathwayAssistant.mjs'

test('le parcours conserve ses cinq valeurs et libelles historiques sans conversion du ciblage', () => {
  assert.deepEqual(pathwayProfileFields.personnelCategory.options, [
    { value: 'PAT', label: 'Personnel administratif et technique' },
    { value: 'PE', label: 'Personnel enseignant' },
    { value: 'PU Police', label: 'Personnel en uniforme — Police' },
    { value: 'PU Prison', label: 'Personnel en uniforme — Prison' },
    { value: 'PJ', label: 'Personnel du Pouvoir judiciaire' },
  ])
  assert.deepEqual(personnelCategories.map(({ id }) => id), ['PAT', 'PE', 'POL', 'PEN', 'MAG', 'AUTRES'])
  assert.equal(pathwayProfile.scope, 'pathway')
})

test('statuts historiques et suggestions d entites : une seule definition, saisie libre preservee', () => {
  assert.deepEqual(pathwayProfileFields.managerStatus.options.map(({ value }) => value), [
    'Nouveau manager', 'Manager expérimenté', 'Manager, expérience non précisée', 'Sans responsabilité managériale',
  ])
  assert.deepEqual(pathwayProfileFields.entity.suggestions, entities.map(({ id, label }) => ({ value: id, label })))
  assert.equal(pathwayProfileFields.entity.allowCustom, true)
  assert.equal(pathwayProfile.apiValidation.enforceOptions, false)
})

test('profil vide independant et referentiel protege contre les mutations', () => {
  const first = createEmptyPathwayProfile()
  const second = createEmptyPathwayProfile()
  assert.deepEqual(Object.keys(first), ['personnelCategory', 'entity', 'managerStatus', 'role', 'objective', 'existingSkills', 'timeAvailable', 'constraints'])
  assert.ok(Object.values(first).every(value => value === ''))
  first.role = 'Analyste'
  assert.equal(second.role, '')
  assert.throws(() => { pathwayProfileFields.personnelCategory.options[0].value = 'AUTRE' }, TypeError)
  assert.throws(() => { pathwayProfileFields.entity.suggestions.push({ value: 'NOUVEAU' }) }, TypeError)
})

test('obligations formulaire/API et maxima restent distincts et inchanges', () => {
  assert.deepEqual(Object.entries(pathwayProfileFields).filter(([, field]) => field.requiredInApi).map(([name]) => name), ['role', 'objective'])
  assert.deepEqual(Object.entries(pathwayProfileFields).filter(([, field]) => field.requiredInForm).map(([name]) => name), ['personnelCategory', 'role', 'objective'])
  assert.deepEqual(Object.fromEntries(Object.entries(pathwayProfileFields).map(([name, field]) => [name, field.maxLength])), {
    personnelCategory: 80, entity: 120, managerStatus: 120, role: 300, objective: 1000,
    existingSkills: 1000, timeAvailable: 300, constraints: 1000,
  })
})

test('non regression HTTP : aucune enumeration ou longueur minimale ajoutee', () => {
  const input = { role: ' x ', objective: ' y ', personnelCategory: 'Categorie libre', entity: 'Service hors referentiel', managerStatus: 'Situation libre', unknown: 'ignore' }
  assert.deepEqual(validatePathwayInput(input), {
    personnelCategory: 'Categorie libre', entity: 'Service hors referentiel', managerStatus: 'Situation libre', role: 'x', objective: 'y',
  })
  assert.deepEqual(validatePathwayInput({ role: 'x', objective: 'y', entity: null, managerStatus: ' ', personnelCategory: null }), { role: 'x', objective: 'y' })
  for (const field of ['role', 'objective']) {
    for (const value of [undefined, null, '', '   ']) {
      assert.throws(() => validatePathwayInput({ role: 'x', objective: 'y', [field]: value }), error => error instanceof PathwayInputError && error.status === 400)
    }
  }
})

test('validation HTTP : les huit maxima apres trim et les erreurs historiques sont conserves', () => {
  for (const [name, field] of Object.entries(pathwayProfileFields)) {
    const accepted = { role: 'x', objective: 'y', [name]: ' ' + 'x'.repeat(field.maxLength) + ' ' }
    assert.equal(validatePathwayInput(accepted)[name].length, field.maxLength)
    assert.throws(() => validatePathwayInput({ ...accepted, [name]: 'x'.repeat(field.maxLength + 1) }), error => error.status === 422 && error.message === `Le champ ${name} dépasse ${field.maxLength} caractères`)
    assert.throws(() => validatePathwayInput({ ...accepted, [name]: 42 }), error => error.status === 400 && error.message === `Le champ ${name} doit être une chaîne de caractères`)
  }
})
