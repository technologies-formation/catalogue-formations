import assert from 'node:assert/strict'
import test from 'node:test'
import { isCourseTargetingReady } from './courseNormalization.js'

test('une formation validée avec un ciblage institutionnel est prête', () => {
  const course = {
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PAT', entity: 'OCD' }],
      targetingSource: 'public',
    },
  }

  assert.equal(isCourseTargetingReady(course), true)
})

test('une formation validée sans restriction d’entité est prête', () => {
  const course = {
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'PAT', entity: null },
        { category: 'PE', entity: null },
      ],
      targetingSource: 'publicDetail',
    },
  }

  assert.equal(isCourseTargetingReady(course), true)
})

test('une fiche à revoir sans ciblage n’est pas prête', () => {
  const course = {
    normalizationStatus: 'needsReview',
    targeting: null,
  }

  assert.equal(isCourseTargetingReady(course), false)
})

test('un statut validé sans ciblage n’est pas prêt', () => {
  const course = {
    normalizationStatus: 'validated',
    targeting: null,
  }

  assert.equal(isCourseTargetingReady(course), false)
})

test('un statut validé sans propriété de ciblage n’est pas prêt', () => {
  const course = {
    normalizationStatus: 'validated',
  }

  assert.equal(isCourseTargetingReady(course), false)
})

test('un ciblage présent sans validation acquise n’est pas prêt', () => {
  const course = {
    normalizationStatus: 'needsReview',
    targeting: {
      targets: [{ category: 'PAT', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  }

  assert.equal(isCourseTargetingReady(course), false)
})
