import assert from 'node:assert/strict'
import test from 'node:test'
import { parseCourseDetail, parseSessionFlags } from './importOfficialCatalogue.mjs'

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
