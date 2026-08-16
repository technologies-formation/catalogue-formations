import assert from 'node:assert/strict'
import test from 'node:test'
import { fullCatalogueCourses } from '../data/fullCatalogueCourses.js'
import { officialCourseSamples } from '../data/officialCourseSamples.js'
import { getFilteredOfficialCourses } from './officialCourseSelection.js'

const expectedCodes = officialCourseSamples.map((course) => course.code)

const selectionCases = [
  [
    'PAT + DIP',
    'PAT',
    'DIP',
    ['DIP-002', 'SEM1098', 'SEM0735', 'SEM1080', 'SEM0518'],
  ],
  [
    'PE + DIP',
    'PE',
    'DIP',
    [
      'DIP-002',
      'SEM1098',
      'S2-590',
      'CO-01683',
      'SEM-10904',
      'SEM0735',
      'SEM1080',
      'SEM0518',
      'CO-01660',
      'EP-520',
      'SEM-P1575',
      'CO-01686',
    ],
  ],
  [
    'PAT + POLICE',
    'PAT',
    'POLICE',
    ['FP173', 'SEM1098', 'FP203', 'SEM0735', 'SEM1080', 'SEM0518'],
  ],
  [
    'PEN + OCD',
    'PEN',
    'OCD',
    [
      'OCD425',
      'SEM1098',
      'FP203',
      'SEM0735',
      'SEM1080',
      'SEM0518',
      'OCD175',
      'OCD207',
    ],
  ],
  [
    'MAG + PJ',
    'MAG',
    'PJ',
    ['PJ-0028', 'SEM1098', 'SEM0735', 'SEM1080', 'SEM0518', 'PJ-0026'],
  ],
  [
    'PAT + OCE',
    'PAT',
    'OCE',
    ['SEM1098', 'FP203', 'SEM0735', 'SEM1080', 'SEM0518'],
  ],
]

for (const [name, personnelCategory, entity, expectedCodes] of selectionCases) {
  test(`la sélection officielle retourne les cours attendus pour ${name}`, () => {
    const courses = getFilteredOfficialCourses(officialCourseSamples, {
      personnelCategory,
      entity,
    })

    assert.deepEqual(
      courses.map((course) => course.code),
      expectedCodes,
    )
  })
}

test('la sélection officielle retourne les vingt-quatre formations sans filtre', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples)

  assert.deepEqual(
    courses.map((course) => course.code),
    expectedCodes,
  )
})

test('la catégorie PAT seule sélectionne toutes les entités compatibles', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    personnelCategory: 'PAT',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    [
      'DIP-002',
      'FP173',
      'OCD151',
      'PJ-1001',
      'SEM1098',
      'FP203',
      'SEM0735',
      'SEM1080',
      'SEM0518',
      'OCD207',
      'PJ-0001',
    ],
  )
})

test('l’entité DIP seule inclut les ciblages DIP et transversaux', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    entity: 'DIP',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    [
      'DIP-002',
      'SEM1098',
      'S2-590',
      'CO-01683',
      'SEM-10904',
      'SEM0735',
      'SEM1080',
      'SEM0518',
      'CO-01660',
      'EP-520',
      'SEM-P1575',
      'CO-01686',
    ],
  )
})

test('un organisateur seul filtre sur sa valeur officielle brute', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    organizingEntity: 'Centre Formation Police et Métiers Sécurité',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['FP173', 'FP203', 'FP007', 'FP020'],
  )
})

test('la recherche ignore la casse et les espaces autour de la saisie', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: '  fp  ',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['FP173', 'FP203', 'FP007', 'FP020'],
  )
})

test('la recherche utilise l’intitulé officiel', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: '  mOoDlE  ',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['SEM-10904'],
  )
})

test('la recherche trouve le nouveau cours sur l’éthique', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: 'éthique',
  })

  assert.ok(courses.some((course) => course.code === 'SEM0735'))
})

test('la recherche sans accent trouve le nouveau cours sur l’éthique', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: 'ethique',
  })

  assert.ok(courses.some((course) => course.code === 'SEM0735'))
})

test('la recherche par code continue de fonctionner', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: '  sem0735  ',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['SEM0735'],
  )
})

test('la recherche trouve le nouveau cours sur l’intelligence artificielle', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: 'intelligence artificielle',
  })

  assert.ok(courses.some((course) => course.code === 'SEM-P1575'))
})

test('un domaine seul filtre sur sa valeur officielle brute', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    domain: 'Mathématiques',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['S2-590'],
  )
})

test('le domaine se cumule avec la catégorie avec un ET logique', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    personnelCategory: 'PAT',
    domain: '01. FORMATION INITIALE Police',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['FP173'],
  )
})

test('le domaine GESTION DE PROJET retourne SEM1080', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    domain: 'GESTION DE PROJET',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['SEM1080'],
  )
})

test('le domaine Langues retourne EP-520', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    domain: 'Langues',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['EP-520'],
  )
})

const newTargetingSelectionCases = [
  ['POL + POLICE', 'POL', 'POLICE', ['FP007', 'FP020']],
  ['PEN + OCD', 'PEN', 'OCD', ['OCD175', 'OCD207']],
  ['PAT + OCD', 'PAT', 'OCD', ['OCD207']],
  ['PAT + PJ', 'PAT', 'PJ', ['PJ-0001']],
  ['MAG + PJ', 'MAG', 'PJ', ['PJ-0026']],
]

for (const [name, personnelCategory, entity, newCodes] of newTargetingSelectionCases) {
  test(`la sélection ${name} inclut les nouveaux cours attendus`, () => {
    const courseCodes = getFilteredOfficialCourses(officialCourseSamples, {
      personnelCategory,
      entity,
    }).map((course) => course.code)

    for (const code of newCodes) {
      assert.ok(courseCodes.includes(code))
    }
  })
}

test('les filtres actifs se cumulent avec un ET logique', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: 'FP',
    personnelCategory: 'PAT',
    entity: 'POLICE',
    organizingEntity: 'Centre Formation Police et Métiers Sécurité',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    ['FP173', 'FP203'],
  )
})

test('les valeurs neutres de réinitialisation retournent les vingt-quatre formations', () => {
  const courses = getFilteredOfficialCourses(officialCourseSamples, {
    search: '',
    personnelCategory: '',
    entity: '',
    domain: '',
    organizingEntity: '',
  })

  assert.deepEqual(
    courses.map((course) => course.code),
    expectedCodes,
  )
})

test('le catalogue complet retourne toutes ses formations uniques sans filtre', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses)

  assert.ok(fullCatalogueCourses.length > 0)
  assert.equal(courses.length, fullCatalogueCourses.length)
  assert.equal(
    new Set(courses.map((course) => course.code)).size,
    fullCatalogueCourses.length,
  )
})

test('une formation à revoir reste trouvable par son code', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: '  ocd371  ',
  })

  assert.deepEqual(courses.map((course) => course.code), ['OCD371'])
  assert.equal(courses[0].normalizationStatus, 'needsReview')
})

test('une formation à revoir reste trouvable par son intitulé', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: 'execution des sanctions penales',
  })

  assert.ok(courses.some((course) => course.code === 'OCD371'))
})

test('une formation à revoir reste sélectionnable par son organisateur', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    organizingEntity: "Centre de formation de l'OCD",
  })

  assert.ok(courses.some((course) => course.code === 'OCD371'))
})

test('une formation à revoir reste sélectionnable par son domaine', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    domain: 'Collaboration & auto-gestion',
  })

  assert.ok(courses.some((course) => course.code === 'OCD371'))
})

test('une catégorie exclut les formations à revoir sans ciblage', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: 'OCD371',
    personnelCategory: 'PEN',
  })

  assert.deepEqual(courses, [])
})

test('une appartenance exclut les formations à revoir sans ciblage', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: 'OCD371',
    entity: 'OCD',
  })

  assert.deepEqual(courses, [])
})

test('catégorie et appartenance doivent correspondre dans un même couple', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: 'FP203',
    personnelCategory: 'PEN',
    entity: 'POLICE',
  })

  assert.deepEqual(courses, [])
})

test('un ciblage validé compatible reste sélectionnable', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: 'FP203',
    personnelCategory: 'PEN',
    entity: 'OCD',
  })

  assert.deepEqual(courses.map((course) => course.code), ['FP203'])
})

test('une formation rattachée à cinq offres reste un résultat unique', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: 'SEM-10204',
  })

  assert.equal(courses.length, 1)
  assert.equal(courses[0].catalogueOffers.length, 5)
})

test('la réinitialisation retourne toutes les formations du catalogue complet', () => {
  const courses = getFilteredOfficialCourses(fullCatalogueCourses, {
    search: '',
    personnelCategory: '',
    entity: '',
    domain: '',
    organizingEntity: '',
  })

  assert.equal(courses.length, fullCatalogueCourses.length)
})
