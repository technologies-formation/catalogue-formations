import assert from 'node:assert/strict'
import test from 'node:test'
import { searchCourses } from './courseSearch.js'

const courses = [
  course('FP173', 'Formation métier spécialisée'),
  course('EXCEL-BASE', 'Excel : les bases'),
  course('EXCEL-PUBLIC', 'Analyser des données', {
    targetAudienceRaw: 'Personnes utilisant régulièrement Excel',
  }),
  course('IA-01', "L'intelligence artificielle au travail", {
    themeRaw: 'IA et outils numériques',
  }),
  course('SI-01', 'Sécurité des SI'),
  course('PAROLE-01', 'Prise de parole en public'),
  course('POWERPOINT-01', 'Maîtriser PowerPoint'),
  course('CYBER-01', 'Sécurité informatique'),
  course('ETHIQUE-01', 'Éthique et déontologie'),
  course('ACCUEIL-01', 'Accueil des nouveaux collaborateurs'),
  course('APPLICATION-01', 'Développer une application web'),
]

test('une recherche vide conserve le catalogue et son ordre', () => {
  assert.equal(searchCourses(courses, ''), courses)
  assert.equal(searchCourses(courses, '   '), courses)
})

test('un code exact est classé en premier', () => {
  assert.equal(searchCourses(courses, 'FP173')[0].code, 'FP173')
})

test('les accents et les pluriels simples sont normalisés', () => {
  assert.equal(searchCourses(courses, 'ethique')[0].code, 'ETHIQUE-01')
  assert.equal(searchCourses(courses, 'collaborateur')[0].code, 'ACCUEIL-01')
})

test('les acronymes IA et SI conservent leur casse métier', () => {
  assert.equal(searchCourses(courses, 'IA')[0].code, 'IA-01')
  assert.equal(searchCourses(courses, 'SI')[0].code, 'SI-01')
})

test('le dictionnaire limité couvre tableur et cybersécurité', () => {
  assert.equal(searchCourses(courses, 'tableur')[0].code, 'EXCEL-BASE')
  assert.equal(searchCourses(courses, 'cybersécurité')[0].code, 'CYBER-01')
})

test('prise de parole et PowerPoint retrouvent les titres attendus', () => {
  assert.equal(searchCourses(courses, 'prise de parole')[0].code, 'PAROLE-01')
  assert.equal(
    searchCourses(courses, 'maîtriser PowerPoint')[0].code,
    'POWERPOINT-01',
  )
})

test('un terme important absent permet au moteur de s’abstenir', () => {
  assert.deepEqual(searchCourses(courses, 'développer une application en Python'), [])
})

test('le titre pèse davantage que le public visé dans le classement', () => {
  assert.deepEqual(
    searchCourses(courses, 'excel').slice(0, 2).map(({ code }) => code),
    ['EXCEL-BASE', 'EXCEL-PUBLIC'],
  )
})

test('le moteur lit les champs sous course.officialData', () => {
  const result = searchCourses(courses, 'outils numériques')
  assert.equal(result[0].code, 'IA-01')
})

function course(code, titleRaw, officialData = {}) {
  return {
    code,
    catalogueOffers: officialData.catalogueOffers ?? ['Offre de test'],
    officialData: {
      titleRaw,
      domainRaw: officialData.domainRaw ?? 'Domaine de test',
      themeRaw: officialData.themeRaw ?? 'Thème de test',
      publicRaw: officialData.publicRaw ?? 'Tout public',
      targetAudienceRaw: officialData.targetAudienceRaw ?? '',
    },
  }
}
