import assert from 'node:assert/strict'
import test from 'node:test'
import { officialCourseSamples } from '../src/data/officialCourseSamples.js'
import {
  auditGeneratedText,
  buildReferenceMonitoringLines,
  hasContactDetails,
  monitorValidatedReferences,
  parseCourseDetail,
  parseSessionFlags,
} from './importOfficialCatalogue.mjs'

test('détecte les coordonnées dans les sections descriptives', () => {
  assert.equal(hasContactDetails('Contact : formation@example.ch'), true)
  assert.equal(hasContactDetails('Contact : 079 123 45 67'), true)
  assert.equal(hasContactDetails('Contact : +41 791 23 45 67'), true)
})

test('conserve la suppression d’une section descriptive contenant un téléphone', () => {
  const parsed = parseCourseDetail(page(`
    <div><p><b>Généralités</b></p><p class="pComment">Contact : 079 123 45 67</p></div>
  `))
  assert.equal(parsed.generalInformationRaw, null)
  assert.deepEqual(parsed.suppressedContactSections, [
    { field: 'generalInformationRaw', sourceLabel: 'Généralités' },
  ])
})

test('l’audit final bloque les coordonnées résiduelles dans tout champ généré', () => {
  assert.deepEqual(auditGeneratedText('{"organizer":"formation@example.ch"}', ''), ['adresse électronique'])
  assert.deepEqual(auditGeneratedText('{"otherField":"079 123 45 67"}', ''), ['numéro de téléphone'])
  assert.deepEqual(auditGeneratedText('', 'Téléphone : 0041 791 23 45 67'), ['numéro de téléphone'])
})

test('l’audit final accepte les valeurs numériques métier non téléphoniques', () => {
  for (const value of [
    'Année 2026',
    'Durée 90 minutes',
    'Code SEM1108',
    'Catalogue 1057 formations',
    'Version 1.2',
    'Identifiant 123456',
  ]) {
    assert.deepEqual(auditGeneratedText(`{"value":"${value}"}`, ''), [], value)
  }
})

test('un artefact sans donnée de contact conserve un audit vide', () => {
  assert.deepEqual(auditGeneratedText('{"title":"Formation continue"}', 'Rapport valide'), [])
})

const referenceFields = [
  'titleRaw',
  'organizingEntityRaw',
  'publicRaw',
  'targetAudienceRaw',
  'domainRaw',
]

function reference(code = 'REF-001', overrides = {}) {
  return {
    code,
    officialData: {
      titleRaw: 'Titre de référence',
      organizingEntityRaw: 'Entité de référence',
      publicRaw: 'Public de référence',
      targetAudienceRaw: 'Public visé de référence',
      domainRaw: 'Domaine de référence',
      ...overrides,
    },
  }
}

function candidateFromReference(sample, overrides = {}) {
  return {
    code: sample.code,
    ...Object.fromEntries(referenceFields.map((field) => [field, sample.officialData[field]])),
    ...overrides,
  }
}

function monitor(overrides = {}, sample = reference()) {
  return monitorValidatedReferences([sample], [candidateFromReference(sample, overrides)])
}

function page(sessionContent = '', outsideImages = '') {
  return `
    <html><body>
      ${outsideImages}
      <h1>COURS TEST-001 - Cours de test</h1>
      <h3>Cours de test</h3>
      ${sessionContent}
    </body></html>
  `
}

function sessions(...images) {
  return `
    <h3>Liste des sessions</h3>
    <div><table><tr><th>Statut</th></tr>
      ${images.map((image) => `<tr><td>${image}</td></td></tr>`).join('')}
    </table></div>
  `
}

const image = (source) => `<img src="${source}" width="24" height="24">`

const cases = [
  ['vert uniquement', [image('./images/icon_vert.png')], true, false],
  ['horloge uniquement', [image('./images/icon_timer.png')], false, true],
  ['vert et horloge', [image('./images/icon_vert.png'), image('./images/icon_timer.png')], true, true],
  ['plusieurs verts', [image('icon_vert.png'), image('../icon_vert.png')], true, false],
  ['plusieurs horloges', [image('icon_timer.png'), image('../icon_timer.png')], false, true],
  ['rouge uniquement', [image('./images/icon_rouge.png')], false, false],
  ['aucun statut reconnu', [image('./images/autre.png')], false, false],
  ['ordre inversé', [image('./images/icon_timer.png'), image('./images/icon_vert.png')], true, true],
  ['src relatif', [image('../../assets/icon_vert.png')], true, false],
  ['casse différente', [image('./images/ICON_VERT.PNG'), image('./images/Icon_Timer.PnG')], true, true],
  ['paramètres et fragment', [image('./images/icon_vert.png?v=2'), image('./images/icon_timer.png#current')], true, true],
]

for (const [name, images, hasOpenSession, hasScheduledSession] of cases) {
  test(`extrait les sessions : ${name}`, () => {
    assert.deepEqual(parseSessionFlags(page(sessions(...images))), {
      hasOpenSession,
      hasScheduledSession,
    })
  })
}

test('une page sans section Sessions produit deux flags false', () => {
  assert.deepEqual(parseSessionFlags(page()), {
    hasOpenSession: false,
    hasScheduledSession: false,
  })
})

test('ignore les images situées hors du tableau des sessions', () => {
  const html = page(
    sessions(image('./images/icon_rouge.png')),
    `${image('./images/icon_vert.png')}${image('./images/icon_timer.png')}`,
  )
  assert.deepEqual(parseSessionFlags(html), {
    hasOpenSession: false,
    hasScheduledSession: false,
  })
})

test('ne lit pas le tableau d\'une section suivant une liste de sessions sans tableau', () => {
  const html = page(`
    <h3>Liste des sessions</h3>
    <p>Aucune session</p>
    <h3>Autre section</h3>
    <table><tr><td>${image('./images/icon_vert.png')}</td></tr></table>
  `)
  assert.deepEqual(parseSessionFlags(html), {
    hasOpenSession: false,
    hasScheduledSession: false,
  })
})

test('parseCourseDetail expose toujours les deux booléens pour une fiche récupérée', () => {
  const parsed = parseCourseDetail(page(sessions(image('./images/icon_vert.png'))))
  assert.equal(parsed.detailCode, 'TEST-001')
  assert.equal(parsed.hasOpenSession, true)
  assert.equal(parsed.hasScheduledSession, false)
})

test('dérive automatiquement les vingt-quatre références de officialCourseSamples', () => {
  const snapshot = officialCourseSamples.map((sample) => candidateFromReference(sample))
  const result = monitorValidatedReferences(officialCourseSamples, snapshot)

  assert.equal(result.summary.checked, 24)
  assert.equal(result.summary.present, 24)
  assert.equal(result.summary.identical, 24)
  assert.deepEqual(result.differences, [])
})

test('une référence identique ne produit aucune alerte', () => {
  assert.deepEqual(monitor().differences, [])
})

for (const [name, overrides, field, category] of [
  ['public modifié', { publicRaw: 'Autre public' }, 'publicRaw', 'REVUE MÉTIER PRIORITAIRE'],
  ['public supprimé', { publicRaw: null }, 'publicRaw', 'REVUE MÉTIER PRIORITAIRE'],
  ['entité modifiée', { organizingEntityRaw: 'Autre entité' }, 'organizingEntityRaw', 'REVUE MÉTIER'],
  ['public visé modifié', { targetAudienceRaw: 'Autre public visé' }, 'targetAudienceRaw', 'INFORMATION À EXAMINER'],
  ['titre modifié', { titleRaw: 'Autre titre' }, 'titleRaw', 'ÉVOLUTION CONTEXTUELLE'],
  ['domaine modifié', { domainRaw: 'Autre domaine' }, 'domainRaw', 'ÉVOLUTION CONTEXTUELLE'],
]) {
  test(`${name} reçoit la classification informative attendue`, () => {
    assert.deepEqual(monitor(overrides).differences, [
      {
        code: 'REF-001',
        category,
        field,
        referenceValue: reference().officialData[field],
        currentValue: overrides[field],
      },
    ])
  })
}

test('null vers valeur est classé comme enrichissement', () => {
  const sample = reference('REF-NULL', { targetAudienceRaw: null })
  assert.equal(
    monitor({ targetAudienceRaw: 'Public nouvellement renseigné' }, sample).differences[0].category,
    'ENRICHISSEMENT',
  )
})

test('une référence absente est signalée sans être réinjectée', () => {
  const result = monitorValidatedReferences([reference()], [])
  assert.equal(result.summary.absent, 1)
  assert.deepEqual(result.differences, [
    {
      code: 'REF-001',
      category: 'RÉFÉRENCE ABSENTE',
      field: 'présence',
      referenceValue: 'présente',
      currentValue: 'absente',
    },
  ])
})

test('neutralise trim, espaces multiples et retours de ligne', () => {
  const result = monitor({
    titleRaw: '  Titre   de\n référence  ',
    organizingEntityRaw: 'Entité\r\n de   référence',
  })
  assert.deepEqual(result.differences, [])
})

test('classe une différence de casse comme purement typographique', () => {
  assert.equal(
    monitor({ titleRaw: 'TITRE DE RÉFÉRENCE' }).differences[0].category,
    'DIFFÉRENCE TYPOGRAPHIQUE',
  )
})

test('les divergences métier restent distinctes des anomalies techniques', () => {
  const result = monitor({ publicRaw: 'Autre public' })
  assert.equal(result.summary.businessReviewReferences, 1)
  assert.equal(Object.hasOwn(result.summary, 'technicalAnomalies'), false)
  assert.doesNotMatch(buildReferenceMonitoringLines(result).join('\n'), /anomalie technique/i)
})

test('le rapport de surveillance reste valide sans divergence', () => {
  const lines = buildReferenceMonitoringLines(monitor())
  assert.match(lines.join('\n'), /Références contrôlées \| 1/)
  assert.match(lines.join('\n'), /Références identiques \| 1/)
  assert.match(lines.join('\n'), /Aucun écart ni absence détecté/)
  assert.doesNotMatch(lines.join('\n'), /\| REF-001 \|/)
})
