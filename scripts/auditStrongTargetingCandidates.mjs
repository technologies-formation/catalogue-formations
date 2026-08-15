import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import officialCatalogueSnapshot from '../src/data/officialCatalogueSnapshot.json' with {
  type: 'json',
}
import { fullCatalogueCourses } from '../src/data/fullCatalogueCourses.js'

const EXPECTED_INITIAL_A = 185
const EXPECTED_TOTAL = 1078
const EXPECTED_VALIDATED = 22
const reportPath = fileURLToPath(
  new URL('../reports/targeting-audit-A-v1.3.md', import.meta.url),
)

// Copie fidèle des motifs ayant produit le groupe A initial.
const categoryPatterns = [
  ['MAG', /\bmagistrat(?:e|s|es)?\b/i],
  ['PEN', /\b(?:personnel\s+(?:de\s+la\s+d[ée]tention|p[ée]nitentiaire)|agents?\s+de\s+d[ée]tention)\b/i],
  ['POL', /\b(?:personnel\s+policier|policiers?|polici[èe]res?)\b/i],
  ['PE', /\b(?:personnel|corps)\s+enseignant\b|\benseignant(?:e|s|es)?\b|\bma[iî]tres?s?\s+(?:adjoints?|de\s+classe)\b/i],
  ['PAT', /\bpersonnel\s+administratif(?:\s+et\s+technique)?\b|\bcollaborateurs?\/trices?\s*\(pat\)|\bpat\b/i],
]

const entityPatterns = [
  ['OCE', /\b(?:personnel|collaborateurs?)\s+(?:de\s+l['’])?oce\b|\bau\s+sein\s+de\s+l['’]oce\b/i],
  ['OCD', /\b(?:personnel|collaborateurs?)\s+(?:de\s+l['’])?ocd\b|\bau\s+sein\s+de\s+l['’]ocd\b/i],
  ['PJ', /\b(?:personnel|collaborateurs?)\s+(?:du\s+)?pouvoir\s+judiciaire\b|\bau\s+sein\s+du\s+pouvoir\s+judiciaire\b/i],
  ['POLICE', /\bpersonnel\s+de\s+la\s+police\b|\bpolice\s+genevoise\b|\bau\s+sein\s+de\s+la\s+police\b/i],
  ['DIP', /\b(?:personnel|collaborateurs?)\s+(?:du\s+)?dip\b|\bau\s+sein\s+du\s+dip\b|\b(?:corps|personnel)\s+enseignant\s*(?:\([^)]*(?:ep|co|esii|es\s*ii|omp)[^)]*\)|(?:de|du)\s+(?:l['’])?(?:ep|co|es\s*ii|omp))/i],
  ['OPE', /\b(?:personnel|collaborateurs?)\s+(?:de\s+l['’])?ope\b|\bau\s+sein\s+de\s+l['’]ope\b/i],
]

const transversalPatterns = [
  /\bensemble\s+du\s+personnel\s+de\s+l['’][ée]tat\b/i,
  /\btout(?:es)?\s+les\s+(?:collaborateurs?|collaboratrices?)\s+de\s+l['’][ée]tat\b/i,
  /\bpersonnel\s+de\s+l['’][ée]tat\s+de\s+gen[èe]ve\b/i,
]

const offerEntityPatterns = [
  ['OCD', /OCD|D[ée]tention/i],
  ['POLICE', /POLICE|CFPS/i],
  ['PJ', /Pouvoir judiciaire/i],
  ['DIP', /DIP/i],
  ['OPE', /DF-OPE/i],
]

const explicitAdditionalPopulationPatterns = [
  ['personnel administratif', /\bpersonnel\s+administratif(?:\s+et\s+technique)?\b/i, 'PAT'],
  ['personnel policier', /\bpersonnel\s+policier\b|\bpoliciers?|polici[èe]res?\b/i, 'POL'],
  ['personnel de la détention', /\bpersonnel\s+(?:p[ée]nitentiaire|de\s+la\s+d[ée]tention)\b|\bagents?\s+de\s+d[ée]tention\b/i, 'PEN'],
  ['magistrature', /\bmagistrat(?:e|s|es)?\b/i, 'MAG'],
  ['personnel enseignant', /\benseignant(?:e|s|es)?\b|\b(?:corps|personnel)\s+enseignant\b/i, 'PE'],
]

const genericExpansionPatterns = [
  ['tous les collaborateurs', /\btout(?:e|-e|es)?\s+(?:collaborateur|collaboratrice|collaborateurs|collaboratrices)(?:\/trice)?\b/i],
  ['collaboratrices et collaborateurs', /\bcollaboratrices?\s+et\s+collaborateurs?\b/i],
  ['ensemble des collaborateurs', /\bensemble\s+des\s+collaborateurs?\b/i],
  ['ensemble ou totalité du personnel', /\b(?:ensemble|totalit[ée])\s+du\s+personnel\b|\btout\s+le\s+personnel\b/i],
  ['toute personne', /\btoute\s+personne\b/i],
  ['autres collaborateurs ou publics', /\bautres?\s+(?:collaborateurs?|collaboratrices?|publics?|personnels?)\b/i],
  ['ouvert également à une autre population', /\b(?:ouvert(?:e)?\s+)?[ée]galement\s+(?:aux?|[àa])\b/i],
  ['ainsi qu’une autre population', /\bainsi\s+qu['’](?:aux?|une?|des?)\b/i],
]

function normalize(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
}

function searchable(value) {
  return normalize(value)
    .toLocaleLowerCase('fr-CH')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function unique(values) {
  return [...new Set(values)]
}

function matches(text, patterns) {
  return patterns.filter(([, pattern]) => pattern.test(text)).map(([id]) => id)
}

function contextualEntities(course) {
  const offerEntities = course.catalogueOffers.flatMap((offer) =>
    matches(offer, offerEntityPatterns),
  )
  const organizer = normalize(course.officialData.organizingEntityRaw)
  const organizerEntities = matches(organizer, [
    ['OCD', /\bOCD\b/i],
    ['POLICE', /Police|CFPS|S[ée]curit[ée]/i],
    ['PJ', /Pouvoir judiciaire/i],
    ['DIP', /\bDIP\b|enseignement|[ée]coles-m[ée]dias/i],
    ['OPE', /\bOPE\b|Office du personnel/i],
    ['OCE', /\bOCE\b/i],
  ])
  return unique([...offerEntities, ...organizerEntities])
}

function reconstructInitialCandidate(course) {
  const publicText = normalize(course.officialData.publicRaw)
  const audienceText = normalize(course.officialData.targetAudienceRaw)
  const fullText = `${publicText}\n${audienceText}`
  const categories = matches(fullText, categoryPatterns)
  const entities = matches(fullText, entityPatterns)
  const contextEntities = contextualEntities(course)
  const transversal = transversalPatterns.some((pattern) => pattern.test(fullText))
  const contradictions =
    entities.length > 0 &&
    contextEntities.length > 0 &&
    entities.some((entity) => !contextEntities.includes(entity))
  const coupledAmbiguity = categories.length > 1 && entities.length > 1
  const isInitialA =
    categories.length > 0 &&
    (entities.length > 0 || transversal) &&
    !contradictions &&
    !coupledAmbiguity
  const initialTargets = categories.flatMap((category) =>
    transversal
      ? [{ category, entity: null }]
      : entities.map((entity) => ({ category, entity })),
  )
  return {
    ...course,
    publicText,
    audienceText,
    fullText,
    categories,
    entities,
    contextEntities,
    contradictions,
    transversal,
    initialTargets,
    isInitialA,
  }
}

function textWithoutExplicitCategories(text) {
  return explicitAdditionalPopulationPatterns.reduce(
    (remaining, [, pattern]) =>
      remaining.replace(new RegExp(pattern.source, `${pattern.flags}g`), ' '),
    text.replace(/collaborateurs?\/trices?\s*\(pat\)/gi, ' '),
  )
}

function explicitPopulationCategories(text) {
  return unique(
    explicitAdditionalPopulationPatterns
      .filter(([, pattern]) => pattern.test(text))
      .map(([, , category]) => category),
  )
}

function auditCandidate(candidate) {
  const populationCategories = explicitPopulationCategories(candidate.fullText)
  const residualText = textWithoutExplicitCategories(candidate.fullText)
  const genericExpansions = genericExpansionPatterns
    .filter(([, pattern]) => pattern.test(residualText))
    .map(([label]) => label)
  const ompPedagogical = /\bpersonnel\s+p[ée]dagogique\b/i.test(candidate.fullText)
  const missingField = !candidate.publicText || !candidate.audienceText
  const multipleInstitutions = candidate.entities.length > 1

  let subgroup
  let cause
  let justification
  let retainedTargets = candidate.initialTargets

  if (populationCategories.length > 1) {
    subgroup = 'A3'
    cause = 'plusieurs populations explicites'
    justification = `Plusieurs catégories potentielles sont explicitement mentionnées (${populationCategories.join(', ')}); leurs targets exacts nécessitent une validation humaine.`
    retainedTargets = []
  } else if (genericExpansions.length > 0) {
    subgroup = 'A2'
    cause = 'public élargi à une population générique'
    justification = `Une catégorie est identifiable, mais le texte élargit aussi le public (${genericExpansions.join(' ; ')}) sans traduction métier validée.`
    retainedTargets = []
  } else if (ompPedagogical) {
    subgroup = 'A4'
    cause = 'OMP ou personnel pédagogique ambigu'
    justification = 'La mention de personnel pédagogique ou OMP ne suffit pas à établir automatiquement la catégorie PE.'
    retainedTargets = []
  } else if (multipleInstitutions) {
    subgroup = 'A4'
    cause = 'plusieurs institutions sans couplage démontré'
    justification = 'Plusieurs périmètres institutionnels sont détectés sans démonstration complète de la portée de la proposition initiale.'
    retainedTargets = []
  } else if (missingField) {
    subgroup = 'A4'
    cause = 'information officielle incomplète'
    justification = 'Public ou Public visé est absent; la compatibilité de l’intégralité des formulations ne peut pas être confirmée.'
    retainedTargets = []
  } else {
    subgroup = 'A1'
    cause = 'formulations intégralement compatibles'
    justification = 'Public et Public visé désignent exclusivement la population proposée et étayent explicitement le périmètre institutionnel.'
  }

  if (candidate.code === 'S2-117') {
    subgroup = 'A2'
    cause = 'public élargi à tous les collaborateurs du DIP'
    justification = 'Le corps enseignant est mentionné, mais le texte ajoute toute collaboratrice et tout collaborateur du DIP; PE + DIP seul serait réducteur.'
    retainedTargets = []
  }

  return {
    ...candidate,
    subgroup,
    cause,
    justification,
    retainedTargets,
    populationCategories,
    genericExpansions,
    ompPedagogical,
  }
}

function countBy(items, getter) {
  const counts = new Map()
  for (const item of items) {
    const key = getter(item) || '(non renseigné)'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'))
}

function subgroupCounts(items) {
  return Object.fromEntries(
    ['A1', 'A2', 'A3', 'A4'].map((group) => [
      group,
      items.filter((item) => item.subgroup === group).length,
    ]),
  )
}

function md(value) {
  return normalize(value || '—').replaceAll('|', '\\|')
}

function excerpt(value, max = 150) {
  const text = md(value)
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`
}

function percentage(part, total) {
  return `${((part / total) * 100).toFixed(1).replace('.', ',')} %`
}

function formatTargets(targets) {
  return targets.length > 0
    ? targets.map(({ category, entity }) => `${category} + ${entity ?? 'entity:null'}`).join(' ; ')
    : 'retirée dans l’audit renforcé'
}

function selectDiverse(items, limit) {
  const selected = []
  const signatures = new Set()
  for (const item of items) {
    const signature = `${searchable(item.publicText)}|${searchable(item.audienceText)}|${item.cause}`
    if (!signatures.has(signature)) {
      signatures.add(signature)
      selected.push(item)
    }
    if (selected.length === limit) return selected
  }
  for (const item of items) {
    if (!selected.includes(item)) selected.push(item)
    if (selected.length === limit) break
  }
  return selected
}

function sampleSection(items) {
  return items.map((item) => `### ${item.code} — ${item.subgroup}

- Titre : ${md(item.officialData.titleRaw)}
- Public : ${md(item.publicText)}
- Public visé : ${md(item.audienceText)}
- Justification : ${item.justification}
- Proposition analytique : ${formatTargets(item.retainedTargets)}
`).join('\n')
}

function motifTable(items, limit = 12) {
  const motifs = countBy(
    items,
    (item) => `${item.publicText || '(non renseigné)'} ↔ ${item.audienceText || '(non renseigné)'}`,
  ).slice(0, limit)
  return [
    '| Formulation Public ↔ Public visé | Nombre | Exemples | Proposition ou cause |',
    '| --- | ---: | --- | --- |',
    ...motifs.map(([motif, count]) => {
      const matching = items.filter(
        (item) => `${item.publicText || '(non renseigné)'} ↔ ${item.audienceText || '(non renseigné)'}` === motif,
      )
      return `| ${excerpt(motif, 220)} | ${count} | ${matching.slice(0, 5).map((item) => item.code).join(', ')} | ${matching[0]?.subgroup === 'A1' ? formatTargets(matching[0].retainedTargets) : matching[0]?.cause} |`
    }),
  ].join('\n')
}

const snapshotByCode = new Map(officialCatalogueSnapshot.map((course) => [course.code, course]))
const reconstructed = fullCatalogueCourses
  .filter((course) => course.normalizationStatus === 'needsReview')
  .map(reconstructInitialCandidate)
  .filter((course) => course.isInitialA)

const reconstructedCodes = new Set(reconstructed.map((course) => course.code))
if (
  reconstructed.length !== EXPECTED_INITIAL_A ||
  reconstructedCodes.size !== EXPECTED_INITIAL_A
) {
  throw new Error(
    `Population A initiale invalide : ${reconstructed.length} objets et ${reconstructedCodes.size} codes uniques`,
  )
}

if (
  fullCatalogueCourses.length !== EXPECTED_TOTAL ||
  new Set(fullCatalogueCourses.map((course) => course.code)).size !== EXPECTED_TOTAL
) {
  throw new Error('Le catalogue complet ne contient pas exactement 1 078 codes uniques')
}

const validatedCount = fullCatalogueCourses.filter(
  (course) => course.normalizationStatus === 'validated',
).length
if (validatedCount !== EXPECTED_VALIDATED) {
  throw new Error(`Nombre de ciblages validés inattendu : ${validatedCount}`)
}

for (const course of reconstructed) {
  if (!snapshotByCode.has(course.code)) {
    throw new Error(`Code absent du snapshot : ${course.code}`)
  }
}

const audited = reconstructed.map(auditCandidate)
const counts = subgroupCounts(audited)
if (Object.values(counts).reduce((sum, count) => sum + count, 0) !== EXPECTED_INITIAL_A) {
  throw new Error('Contrôle A1 + A2 + A3 + A4 en échec')
}

const s2117 = audited.find((course) => course.code === 'S2-117')
if (!s2117 || s2117.subgroup !== 'A2' || s2117.retainedTargets.length !== 0) {
  throw new Error('Le garde-fou obligatoire sur S2-117 n’est pas respecté')
}

const causes = countBy(
  audited.filter((course) => course.subgroup !== 'A1'),
  (course) => course.cause,
)
const initialCategoryDistribution = countBy(
  audited.flatMap((course) => unique(course.initialTargets.map((target) => target.category))),
  (category) => category,
)
const multiCategoryInitial = audited.filter(
  (course) => unique(course.initialTargets.map((target) => target.category)).length > 1,
)
const ompCases = audited.filter((course) => /\bOMP\b|personnel\s+p[ée]dagogique/i.test(course.fullText))
const ompPrudent = ompCases.filter((course) => course.subgroup !== 'A1')
const multiPopulationCases = audited.filter(
  (course) => course.subgroup === 'A2' || course.subgroup === 'A3',
)
const samples = ['A1', 'A2', 'A3', 'A4'].flatMap((group) =>
  selectDiverse(audited.filter((course) => course.subgroup === group), 10),
)
const potentialCoverage = EXPECTED_VALIDATED + counts.A1

const exhaustiveRows = audited
  .slice()
  .sort((a, b) => a.code.localeCompare(b.code, 'fr'))
  .map((course) => `| ${course.code} | ${excerpt(course.officialData.titleRaw, 100)} | ${md(course.catalogueOffers.join(' ; '))} | ${excerpt(course.officialData.organizingEntityRaw, 80)} | ${excerpt(course.publicText, 110)} | ${excerpt(course.audienceText, 150)} | ${md(formatTargets(course.initialTargets))} | ${course.subgroup} | ${course.justification} | ${md(formatTargets(course.retainedTargets))} |`)
  .join('\n')

const report = `# Audit renforcé des candidats A — V1.3

> Audit méthodologique complémentaire. Aucun targeting, normalizationStatus ou fichier source n’est modifié. Les propositions restent analytiques et soumises à validation humaine.

## A. Synthèse

- Population A initiale reconstruite : **${reconstructed.length}**
- Codes uniques : **${reconstructedCodes.size}**
- A1 — robuste : **${counts.A1}**
- A2 — élargissement explicite du public : **${counts.A2}**
- A3 — plusieurs catégories potentielles : **${counts.A3}**
- A4 — autre ambiguïté ou contradiction : **${counts.A4}**
- Contrôle A1 + A2 + A3 + A4 : **${counts.A1 + counts.A2 + counts.A3 + counts.A4}**

## B. Taux de robustesse

Le sous-groupe A1 représente **${counts.A1}/185 (${percentage(counts.A1, EXPECTED_INITIAL_A)})**. Seules ces formations restent des candidates fortes après renforcement méthodologique.

## C. Impact potentiel

Si les 22 ciblages existants et les ${counts.A1} cas A1 étaient validés humainement, la couverture potentielle serait de **${potentialCoverage}/1078 (${percentage(potentialCoverage, EXPECTED_TOTAL)})**. A2, A3 et A4 ne sont pas comptés comme validés.

## D. Causes de déclassement

| Cause principale | Nombre | Exemples |
| --- | ---: | --- |
${causes.map(([cause, count]) => `| ${cause} | ${count} | ${audited.filter((course) => course.cause === cause).slice(0, 8).map((course) => course.code).join(', ')} |`).join('\n')}

## E. Cas S2-117

- Code : ${s2117.code}
- Titre : ${md(s2117.officialData.titleRaw)}
- Public : ${md(s2117.publicText)}
- Public visé : ${md(s2117.audienceText)}
- Ancienne proposition : ${md(formatTargets(s2117.initialTargets))}
- Raison du déclassement : ${s2117.justification}
- Nouveau sous-groupe recommandé : **${s2117.subgroup}**
- Proposition renforcée : **retirée**, dans l’attente d’une validation métier des catégories couvertes par « toute collaboratrice et tout collaborateur du DIP ».

## F. Tableau exhaustif des 185 candidats

| Code | Titre | catalogueOffers | Organisateur | Public | Public visé | Proposition initiale | Sous-groupe | Justification | Proposition conservée ou retirée |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${exhaustiveRows}

## G. Échantillon diversifié

Répartition : ${subgroupCounts(samples).A1} A1, ${subgroupCounts(samples).A2} A2, ${subgroupCounts(samples).A3} A3, ${subgroupCounts(samples).A4} A4.

${sampleSection(samples)}

## H. Motifs dominants A1

${motifTable(audited.filter((course) => course.subgroup === 'A1'))}

## I. Motifs conduisant à A2, A3 ou A4

### A2

${motifTable(audited.filter((course) => course.subgroup === 'A2'))}

### A3

${motifTable(audited.filter((course) => course.subgroup === 'A3'))}

### A4

${motifTable(audited.filter((course) => course.subgroup === 'A4'))}

## J. Répartition des propositions initiales

| Catégorie | Nombre de propositions initiales concernées |
| --- | ---: |
${initialCategoryDistribution.map(([category, count]) => `| ${category} | ${count} |`).join('\n')}

- Formations avec plusieurs catégories initialement proposées : **${multiCategoryInitial.length}**
- Exemples : ${multiCategoryInitial.slice(0, 20).map((course) => course.code).join(', ') || 'aucun'}

## K. Audit spécifique OMP

- Candidats A mentionnant explicitement OMP ou « personnel pédagogique » : **${ompCases.length}**
- Cas OMP maintenus hors A1 par prudence : **${ompPrudent.length}**
- Codes prudents : ${ompPrudent.map((course) => `${course.code} (${course.subgroup})`).join(', ') || 'aucun'}

La présence dans une offre OMP n’est pas utilisée ici : seuls les textes Public et Public visé sont examinés. « Personnel pédagogique OMP » n’est pas assimilé automatiquement à PE.

## L. Audit des cas multi-populations

- Cas classés A2 ou A3 : **${multiPopulationCases.length}**
- A2 : ${counts.A2}
- A3 : ${counts.A3}
- Exemples : ${multiPopulationCases.slice(0, 30).map((course) => `${course.code} (${course.subgroup})`).join(', ')}

Ces cas ne produisent aucun target automatique. Les traductions PAT/PE/POL/PEN/MAG restent à valider humainement.
`

await writeFile(reportPath, report, 'utf8')

console.log(JSON.stringify({
  initialCandidates: reconstructed.length,
  uniqueInitialCodes: reconstructedCodes.size,
  subgroups: counts,
  robustnessRate: percentage(counts.A1, EXPECTED_INITIAL_A),
  potentialCoverage: percentage(potentialCoverage, EXPECTED_TOTAL),
  s2117: { subgroup: s2117.subgroup, retainedProposal: s2117.retainedTargets.length > 0 },
  causes: Object.fromEntries(causes),
  initialCategories: Object.fromEntries(initialCategoryDistribution),
  multiCategoryInitial: multiCategoryInitial.length,
  ompCases: ompCases.length,
  ompPrudent: ompPrudent.length,
  multiPopulationCases: multiPopulationCases.length,
  sampleSize: samples.length,
  reportPath,
}, null, 2))
