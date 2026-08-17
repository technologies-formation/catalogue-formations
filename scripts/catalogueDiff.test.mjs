import assert from 'node:assert/strict'
import test from 'node:test'
import { compareCatalogueSnapshots } from './catalogueDiff.mjs'

function course(code, overrides = {}) {
  return {
    code,
    sourceUrl: `https://example.test/${code}`,
    titleRaw: `Cours ${code}`,
    organizingEntityRaw: 'Entité',
    domainRaw: 'Domaine',
    themeRaw: 'Thème',
    publicRaw: 'Public',
    targetAudienceRaw: 'Public visé',
    hasOpenSession: false,
    hasScheduledSession: false,
    durationRaw: '1 Jour(s)',
    generalInformationRaw: null,
    objectivesRaw: 'Objectifs',
    contentRaw: 'Contenu',
    prerequisitesRaw: null,
    additionalInformationRaw: null,
    catalogueOffers: ['Offre A'],
    fetchStatus: 'ok',
    sourceSnapshotDate: '2026-08-13',
    ...overrides,
  }
}

function legacyCourse(code, overrides = {}) {
  const result = course(code, overrides)
  delete result.hasOpenSession
  delete result.hasScheduledSession
  return result
}

test('détecte les ajouts et suppressions et les trie par code', () => {
  const result = compareCatalogueSnapshots(
    [course('B'), course('A')],
    [course('C'), course('B')],
  )

  assert.deepEqual(result.added.map(({ code }) => code), ['C'])
  assert.deepEqual(result.removed.map(({ code }) => code), ['A'])
  assert.equal(result.summary.addedCourses, 1)
  assert.equal(result.summary.removedCourses, 1)
})

test('distingue les changements visibles des changements descriptifs longs', () => {
  const result = compareCatalogueSnapshots(
    [course('A')],
    [course('A', { titleRaw: 'Nouveau titre', objectivesRaw: 'Nouveaux objectifs' })],
  )
  const [modified] = result.modified

  assert.deepEqual(modified.visibleChanges, [
    { field: 'titleRaw', oldValue: 'Cours A', newValue: 'Nouveau titre' },
  ])
  assert.deepEqual(modified.longFields, ['objectivesRaw'])
  assert.equal(result.summary.modifiedCourses, 1)
})

test('ignore sourceSnapshotDate et fetchStatus dans le différentiel métier', () => {
  const result = compareCatalogueSnapshots(
    [course('A')],
    [course('A', { sourceSnapshotDate: '2026-08-16' })],
  )

  assert.deepEqual(result.modified, [])
  assert.equal(result.summary.technicalAnomalies, 0)
})

test('compare catalogueOffers comme un ensemble sans tenir compte de l’ordre', () => {
  const result = compareCatalogueSnapshots(
    [course('A', { catalogueOffers: ['Offre A', 'Offre B'] })],
    [course('A', { catalogueOffers: ['Offre B', 'Offre A'] })],
  )

  assert.deepEqual(result.modified, [])
  assert.deepEqual(result.offerChanges, [])
})

test('détaille les offres ajoutées et retirées', () => {
  const result = compareCatalogueSnapshots(
    [course('A', { catalogueOffers: ['Offre A', 'Offre B'] })],
    [course('A', { catalogueOffers: ['Offre B', 'Offre C'] })],
  )

  assert.deepEqual(result.offerChanges, [
    {
      code: 'A',
      titleRaw: 'Cours A',
      added: ['Offre C'],
      removed: ['Offre A'],
    },
  ])
  assert.equal(result.modified[0].offersChanged, true)
})

test('signale un catalogueOffers absent ou invalide', () => {
  const result = compareCatalogueSnapshots(
    [course('A')],
    [course('A', { catalogueOffers: null })],
  )

  assert.ok(
    result.technicalAnomalies.some(
      ({ code, detail }) => code === 'A' && detail.includes('catalogueOffers'),
    ),
  )
})

test('signale les offres dupliquées, les codes dupliqués et les fiches indisponibles', () => {
  const result = compareCatalogueSnapshots(
    [course('A')],
    [
      course('A', { catalogueOffers: ['Offre A', 'Offre A'], fetchStatus: 'unavailable' }),
      course('A'),
    ],
  )

  assert.equal(result.technicalAnomalies.length, 3)
  assert.deepEqual(
    new Set(result.technicalAnomalies.map(({ type }) => type)),
    new Set(['doublon', 'fiche indisponible']),
  )
})

test('détecte les passages entre null et une valeur', () => {
  const result = compareCatalogueSnapshots(
    [course('A', { themeRaw: null, prerequisitesRaw: 'Prérequis' })],
    [course('A', { themeRaw: 'Thème', prerequisitesRaw: null })],
  )

  assert.deepEqual(result.modified[0].visibleChanges, [
    { field: 'themeRaw', oldValue: null, newValue: 'Thème' },
  ])
  assert.deepEqual(result.modified[0].longFields, ['prerequisitesRaw'])
})

test('traite les changements de flags de sessions comme des évolutions métier visibles', () => {
  const result = compareCatalogueSnapshots(
    [course('A', { hasOpenSession: false, hasScheduledSession: true })],
    [course('A', { hasOpenSession: true, hasScheduledSession: false })],
  )

  assert.deepEqual(result.modified[0].visibleChanges, [
    { field: 'hasOpenSession', oldValue: false, newValue: true },
    { field: 'hasScheduledSession', oldValue: true, newValue: false },
  ])
  assert.equal(result.summary.modifiedCourses, 1)
  assert.equal(result.summary.technicalAnomalies, 0)
})

test('initialise les flags Sessions quand ils sont absents de tout le snapshot officiel', () => {
  const result = compareCatalogueSnapshots(
    [legacyCourse('A'), legacyCourse('B'), legacyCourse('C'), legacyCourse('D')],
    [
      course('A', { hasOpenSession: true, hasScheduledSession: false }),
      course('B', { hasOpenSession: false, hasScheduledSession: true }),
      course('C', { hasOpenSession: true, hasScheduledSession: true }),
      course('D'),
    ],
  )

  assert.deepEqual(result.modified, [])
  assert.equal(result.summary.modifiedCourses, 0)
  assert.deepEqual(result.sessionFlagsInitialization, {
    openCourses: 2,
    scheduledCourses: 2,
    bothStatuses: 1,
    neitherStatus: 1,
  })
})

test('conserve les autres modifications métier pendant initialisation des flags Sessions', () => {
  const result = compareCatalogueSnapshots(
    [legacyCourse('A')],
    [course('A', { hasOpenSession: true, titleRaw: 'Titre modifié' })],
  )

  assert.equal(result.summary.modifiedCourses, 1)
  assert.deepEqual(result.modified[0].visibleChanges, [
    { field: 'titleRaw', oldValue: 'Cours A', newValue: 'Titre modifié' },
  ])
})

test('signale normalement false vers true après migration', () => {
  const result = compareCatalogueSnapshots(
    [course('A', { hasOpenSession: false })],
    [course('A', { hasOpenSession: true })],
  )

  assert.equal(result.sessionFlagsInitialization, null)
  assert.deepEqual(result.modified[0].visibleChanges, [
    { field: 'hasOpenSession', oldValue: false, newValue: true },
  ])
})

test('signale normalement true vers false après migration', () => {
  const result = compareCatalogueSnapshots(
    [course('A', { hasScheduledSession: true })],
    [course('A', { hasScheduledSession: false })],
  )

  assert.equal(result.sessionFlagsInitialization, null)
  assert.deepEqual(result.modified[0].visibleChanges, [
    { field: 'hasScheduledSession', oldValue: true, newValue: false },
  ])
})

test('une migration partielle du snapshot officiel est une anomalie et non une initialisation', () => {
  const result = compareCatalogueSnapshots(
    [legacyCourse('A'), course('B')],
    [course('A'), course('B')],
  )

  assert.equal(result.sessionFlagsInitialization, null)
  assert.ok(
    result.technicalAnomalies.some(({ detail }) => detail.includes('initialisation partielle')),
  )
})

test('refuse un snapshot qui n’est pas un tableau', () => {
  assert.throws(
    () => compareCatalogueSnapshots({}, []),
    /doit être un tableau de formations/,
  )
})
