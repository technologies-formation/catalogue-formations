import assert from 'node:assert/strict'
import test from 'node:test'
import { isCourseTargetingReady } from '../domain/courseNormalization.js'
import { evaluateCourseTargeting } from '../domain/courseTargeting.js'
import { officialCourseSamples } from './officialCourseSamples.js'

const expectedCodes = [
  'DIP-002',
  'FP173',
  'OCD151',
  'OCD425',
  'PJ-1001',
  'PJ-0028',
  'SEM1098',
  'S2-590',
  'CO-01683',
  'SEM-10904',
  'FP203',
  'SEM0735',
  'SEM1080',
  'SEM0518',
  'CO-01660',
  'EP-520',
  'SEM-P1575',
  'CO-01686',
  'FP007',
  'FP020',
  'OCD175',
  'OCD207',
  'PJ-0001',
  'PJ-0026',
]

const coursesByCode = new Map(
  officialCourseSamples.map((course) => [course.code, course]),
)

const expectedOfficialDisplayData = new Map([
  [
    'DIP-002',
    [
      "Séance d'accueil destinée aux nouvelles et nouveaux collaborateurs - DIP",
      "FONCTIONNEMENT DE L'ADMINISTRATION",
    ],
  ],
  ['FP173', ['Traversée de la Rade - Prérequis.', '01. FORMATION INITIALE Police']],
  ['OCD151', ['CAS Violences plurielles', 'Collaboration & auto-gestion']],
  ['OCD425', ['La communication au quotidien', 'Collaboration & auto-gestion']],
  [
    'PJ-1001',
    [
      "ERAJ - Formation de base en administration judiciaire Demande via un ticket ASI et inscription en ligne sur le site de l'ERAJ.",
      'FORMATION COLLABORATEURS',
    ],
  ],
  [
    'PJ-0028',
    ['Rédaction de décisions judiciaires - filière administrative', 'FORMATION MAGISTRATS'],
  ],
  ['SEM1098', ["Les clés d'une communication efficace", 'COMMUNIQUER ET TRANSMETTRE']],
  [
    'S2-590',
    ['Modéliser le réel : le dialogue entre mathématiques et physique', 'Mathématiques'],
  ],
  [
    'CO-01683',
    [
      "Suivi des élèves avec l'équipe enseignante, MPS et la direction (Maîtrise de classe, module 2)",
      'Profession enseignante',
    ],
  ],
  [
    'SEM-10904',
    [
      'CO-ESII / Moodle : Devenir autonome - créer des évaluations automatisées - niveau 1 / Formation autonome en ligne',
      'Médias, image, numérique',
    ],
  ],
  ['FP203', ['Formation pour évaluateurs - EC', '04. ÉVALUATIONS DE COMPÉTENCES Police']],
  [
    'SEM0735',
    ['Ethique et déontologie de la fonction publique', "FONCTIONNEMENT DE L'ADMINISTRATION"],
  ],
  ['SEM1080', ["Identifier et gérer les risques d'un projet", 'GESTION DE PROJET']],
  [
    'SEM0518',
    ['Prévenir les tensions dans ses relations par une bonne communication', 'TRAVAILLER ENSEMBLE'],
  ],
  [
    'CO-01660',
    [
      "Statues, musées, noms des rues : les controverses autour des traces mémorielles dans l'espace public",
      'Sciences humaines et sociales',
    ],
  ],
  [
    'EP-520',
    ["L'écriture au cycle élémentaire : du geste d'écriture à la production", 'Langues'],
  ],
  [
    'SEM-P1575',
    [
      "EP-OMP / Découvrir l'intelligence artificielle / Formation hybride / NOUVEAU",
      'Médias, image, numérique',
    ],
  ],
  [
    'CO-01686',
    [
      'Précarité, migration et scolarité des enfants à Genève : éclairages et ressources (DIAC)',
      'Profession enseignante',
    ],
  ],
  ['FP007', ['CCI - Cours tactique', '03. FORMATION DES CADRES Police']],
  ['FP020', ['Pilotage automobile', '02. FORMATION CONTINUE Police']],
  ['OCD175', ['Formation cantonale genevoise (FCG)', 'Introduction à la privation de liberté']],
  [
    'OCD207',
    ["BFFA - M1 : Animer des sessions de formation pour des groupes d'adultes (FFA CF-AF).", 'Formateurs'],
  ],
  [
    'PJ-0001',
    [
      'Accueil des nouveaux collaborateurs. La convocation est directement adressée aux collaboratrices et collaborateurs par RH-Formation',
      'FORMATION COLLABORATEURS',
    ],
  ],
  ['PJ-0026', ['Déontologie judiciaire', 'FORMATION MAGISTRATS']],
])

test('les vingt-quatre échantillons attendus sont présents avec des codes uniques', () => {
  assert.equal(officialCourseSamples.length, 24)
  assert.deepEqual(
    officialCourseSamples.map((course) => course.code),
    expectedCodes,
  )
  assert.equal(coursesByCode.size, officialCourseSamples.length)
})

test('chaque échantillon possède la structure minimale attendue', () => {
  for (const course of officialCourseSamples) {
    assert.equal(typeof course.sourceUrl, 'string')
    assert.notEqual(course.sourceUrl.trim(), '')
    assert.ok(Object.hasOwn(course, 'officialData'))
    assert.ok(Object.hasOwn(course, 'normalizationStatus'))
    assert.ok(Object.hasOwn(course, 'targeting'))
    assert.ok(Object.hasOwn(course.officialData, 'titleRaw'))
    assert.ok(Object.hasOwn(course.officialData, 'domainRaw'))
    assert.ok(Object.hasOwn(course.officialData, 'organizingEntityRaw'))
    assert.ok(Object.hasOwn(course.officialData, 'publicRaw'))
    assert.ok(Object.hasOwn(course.officialData, 'targetAudienceRaw'))
  }
})

test('les intitulés et domaines officiels sont renseignés ou explicitement nuls', () => {
  for (const course of officialCourseSamples) {
    for (const key of ['titleRaw', 'domainRaw']) {
      const value = course.officialData[key]
      assert.ok(value === null || (typeof value === 'string' && value.trim() !== ''))
    }

    assert.deepEqual(
      [course.officialData.titleRaw, course.officialData.domainRaw],
      expectedOfficialDisplayData.get(course.code),
    )
  }
})

test('les métadonnées descriptives stabilisées correspondent au snapshot officiel', () => {
  assert.deepEqual(coursesByCode.get('OCD425').officialData, {
    titleRaw: 'La communication au quotidien',
    domainRaw: 'Collaboration & auto-gestion',
    organizingEntityRaw: "Centre de formation de l'OCD",
    publicRaw: 'Personnel Pénitentiaire',
    targetAudienceRaw:
      "Le personnel des établissements de privation de liberté, des autorités de probation, de placement et d'exécution qui mènent régulièrement des entretiens avec les détenu·e·s.",
  })

  assert.deepEqual(coursesByCode.get('PJ-0028').officialData, {
    titleRaw: 'Rédaction de décisions judiciaires - filière administrative',
    domainRaw: 'FORMATION MAGISTRATS',
    organizingEntityRaw: 'Secteur formation du Pouvoir judiciaire',
    publicRaw: 'Magistrats',
    targetAudienceRaw: 'Magistrats de la filière administrative',
  })

  assert.equal(
    coursesByCode.get('S2-590').officialData.organizingEntityRaw,
    "Direction générale de l'enseig. secondaire II",
  )
})

test('les ciblages explicitement validés conservent leur provenance', () => {
  for (const code of ['OCD425', 'PJ-0028']) {
    assert.equal(coursesByCode.get(code).targeting.targetingSource, 'explicit')
  }
})

test('la stabilisation descriptive ne modifie pas les ciblages validés', () => {
  const expectedTargeting = new Map([
    [
      'S2-590',
      {
        targets: [{ category: 'PE', entity: 'DIP' }],
        targetingSource: 'publicDetail',
      },
    ],
    [
      'OCD425',
      {
        targets: [{ category: 'PEN', entity: 'OCD' }],
        targetingSource: 'explicit',
      },
    ],
    [
      'PJ-0028',
      {
        targets: [{ category: 'MAG', entity: 'PJ' }],
        targetingSource: 'explicit',
      },
    ],
  ])

  for (const [code, targeting] of expectedTargeting) {
    const course = coursesByCode.get(code)
    assert.equal(course.normalizationStatus, 'validated')
    assert.deepEqual(course.targeting, targeting)
  }
})

test('les vingt-quatre échantillons sont validés et possèdent un ciblage prêt', () => {
  for (const course of officialCourseSamples) {
    assert.equal(course.normalizationStatus, 'validated')
    assert.equal(isCourseTargetingReady(course), true)
  }
})

test('les ciblages validés contiennent des couples catégorie-entité uniques', () => {
  for (const course of officialCourseSamples) {
    if (course.normalizationStatus !== 'validated') {
      continue
    }

    assert.ok(Array.isArray(course.targeting.targets))
    assert.ok(course.targeting.targets.length > 0)

    const targetKeys = course.targeting.targets.map((target) => {
      assert.equal(typeof target.category, 'string')
      assert.notEqual(target.category.trim(), '')
      assert.ok(Object.hasOwn(target, 'entity'))
      return `${target.category}:${String(target.entity)}`
    })

    assert.equal(new Set(targetKeys).size, targetKeys.length)
  }
})

test('FP203 possède un ciblage validé, prêt et explicitement approuvé', () => {
  const course = coursesByCode.get('FP203')

  assert.equal(course.normalizationStatus, 'validated')
  assert.equal(isCourseTargetingReady(course), true)
  assert.equal(course.targeting.targetingSource, 'explicit')
})

const targetingCases = [
  ['PAT + DIP correspond à DIP-002', 'DIP-002', 'PAT', 'DIP', true],
  ['PE + DIP correspond à DIP-002', 'DIP-002', 'PE', 'DIP', true],
  ['PAT + PJ ne correspond pas à DIP-002', 'DIP-002', 'PAT', 'PJ', false],
  ['POL + POLICE correspond à FP173', 'FP173', 'POL', 'POLICE', true],
  ['PAT + POLICE correspond à FP173', 'FP173', 'PAT', 'POLICE', true],
  ['PAT + DIP ne correspond pas à FP173', 'FP173', 'PAT', 'DIP', false],
  ['PAT + OCD correspond à OCD151', 'OCD151', 'PAT', 'OCD', true],
  ['PEN + OCD correspond à OCD425', 'OCD425', 'PEN', 'OCD', true],
  ['PAT + PJ correspond à PJ-1001', 'PJ-1001', 'PAT', 'PJ', true],
  ['MAG + PJ correspond à PJ-0028', 'PJ-0028', 'MAG', 'PJ', true],
  ['PAT + DIP correspond à SEM1098', 'SEM1098', 'PAT', 'DIP', true],
  ['POL + POLICE correspond à SEM1098', 'SEM1098', 'POL', 'POLICE', true],
  ['MAG + PJ correspond à SEM1098', 'SEM1098', 'MAG', 'PJ', true],
  ['PE + DIP correspond à S2-590', 'S2-590', 'PE', 'DIP', true],
  ['PAT + DIP ne correspond pas à S2-590', 'S2-590', 'PAT', 'DIP', false],
  ['PE + DIP correspond à CO-01683', 'CO-01683', 'PE', 'DIP', true],
  ['PAT + DIP ne correspond pas à CO-01683', 'CO-01683', 'PAT', 'DIP', false],
  ['PE + DIP correspond à SEM-10904', 'SEM-10904', 'PE', 'DIP', true],
  [
    'PAT + DIP ne correspond pas à SEM-10904',
    'SEM-10904',
    'PAT',
    'DIP',
    false,
  ],
  ['POL + POLICE correspond à FP203', 'FP203', 'POL', 'POLICE', true],
  ['PAT + POLICE correspond à FP203', 'FP203', 'PAT', 'POLICE', true],
  ['PAT + OCD correspond à FP203', 'FP203', 'PAT', 'OCD', true],
  ['PEN + OCD correspond à FP203', 'FP203', 'PEN', 'OCD', true],
  ['PAT + OCE correspond à FP203', 'FP203', 'PAT', 'OCE', true],
  ['POL + OCD ne correspond pas à FP203', 'FP203', 'POL', 'OCD', false],
  [
    'PEN + POLICE ne correspond pas à FP203',
    'FP203',
    'PEN',
    'POLICE',
    false,
  ],
  ['PEN + OCE ne correspond pas à FP203', 'FP203', 'PEN', 'OCE', false],
  ['PE + OCE ne correspond pas à FP203', 'FP203', 'PE', 'OCE', false],
  ['PAT + DIP correspond à SEM0735', 'SEM0735', 'PAT', 'DIP', true],
  ['MAG + PJ correspond à SEM1080', 'SEM1080', 'MAG', 'PJ', true],
  ['POL + POLICE correspond à SEM0518', 'SEM0518', 'POL', 'POLICE', true],
  ['PE + DIP correspond à CO-01660', 'CO-01660', 'PE', 'DIP', true],
  ['PE + DIP correspond à EP-520', 'EP-520', 'PE', 'DIP', true],
  ['PE + DIP correspond à SEM-P1575', 'SEM-P1575', 'PE', 'DIP', true],
  ['PE + DIP correspond à CO-01686', 'CO-01686', 'PE', 'DIP', true],
  ['POL + POLICE correspond à FP007', 'FP007', 'POL', 'POLICE', true],
  ['POL + POLICE correspond à FP020', 'FP020', 'POL', 'POLICE', true],
  ['PEN + OCD correspond à OCD175', 'OCD175', 'PEN', 'OCD', true],
  ['PEN + OCD correspond à OCD207', 'OCD207', 'PEN', 'OCD', true],
  ['PAT + OCD correspond à OCD207', 'OCD207', 'PAT', 'OCD', true],
  ['PAT + PJ correspond à PJ-0001', 'PJ-0001', 'PAT', 'PJ', true],
  ['MAG + PJ correspond à PJ-0026', 'PJ-0026', 'MAG', 'PJ', true],
]

for (const [name, code, personnelCategory, entity, matches] of targetingCases) {
  test(name, () => {
    const course = coursesByCode.get(code)
    const decision = evaluateCourseTargeting(course.targeting, {
      personnelCategory,
      entity,
    })

    assert.equal(decision.matches, matches)
  })
}
