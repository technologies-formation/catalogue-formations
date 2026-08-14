import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import officialCatalogueSnapshot from '../src/data/officialCatalogueSnapshot.json' with {
  type: 'json',
}
import { fullCatalogueCourses } from '../src/data/fullCatalogueCourses.js'

const EXPECTED = { total: 1078, validated: 22, needsReview: 1056 }
const reportPath = fileURLToPath(
  new URL('../reports/targeting-analysis-v1.3.md', import.meta.url),
)

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

function explicitMatches(text, patterns) {
  return patterns.filter(([, pattern]) => pattern.test(text)).map(([id]) => id)
}

function contextualEntities(course) {
  const offerEntities = course.catalogueOffers.flatMap((offer) =>
    explicitMatches(offer, offerEntityPatterns),
  )
  const organizer = normalize(course.officialData.organizingEntityRaw)
  const organizerEntities = explicitMatches(organizer, [
    ['OCD', /\bOCD\b/i],
    ['POLICE', /Police|CFPS|S[ée]curit[ée]/i],
    ['PJ', /Pouvoir judiciaire/i],
    ['DIP', /\bDIP\b|enseignement|[ée]coles-m[ée]dias/i],
    ['OPE', /\bOPE\b|Office du personnel/i],
    ['OCE', /\bOCE\b/i],
  ])
  return unique([...offerEntities, ...organizerEntities])
}

function classify(course) {
  const publicText = normalize(course.officialData.publicRaw)
  const audienceText = normalize(course.officialData.targetAudienceRaw)
  const explicitText = `${publicText}\n${audienceText}`
  const categories = explicitMatches(explicitText, categoryPatterns)
  const entities = explicitMatches(explicitText, entityPatterns)
  const transversal = transversalPatterns.some((pattern) => pattern.test(explicitText))
  const contextEntities = contextualEntities(course)
  const contradictions =
    entities.length > 0 &&
    contextEntities.length > 0 &&
    entities.some((entity) => !contextEntities.includes(entity))

  let group
  let reason
  let proposedTargets = []

  const coupledAmbiguity = categories.length > 1 && entities.length > 1

  if (
    categories.length > 0 &&
    (entities.length > 0 || transversal) &&
    !contradictions &&
    !coupledAmbiguity
  ) {
    group = 'A'
    proposedTargets = categories.flatMap((category) =>
      transversal
        ? [{ category, entity: null }]
        : entities.map((entity) => ({ category, entity })),
    )
    reason = transversal
      ? 'Catégorie explicite et absence de restriction institutionnelle explicitement formulée.'
      : 'Catégorie et périmètre institutionnel explicitement présents dans Public ou Public visé.'
  } else if (categories.length === 0 && entities.length > 0 && !contradictions) {
    group = 'B'
    reason = 'Périmètre institutionnel explicite, mais aucune catégorie autorisée n’est déterminable avec certitude.'
  } else if (categories.length > 0) {
    group = 'C'
    reason = coupledAmbiguity
      ? 'Plusieurs catégories et plusieurs entités sont explicites, mais leurs couples exacts ne sont pas démontrés.'
      : contradictions
      ? 'Catégorie explicite, mais le contexte institutionnel paraît contradictoire.'
      : 'Catégorie explicite, mais périmètre institutionnel ou transversalité non démontré.'
  } else {
    group = 'D'
    reason = contradictions
      ? 'Informations explicites et contexte institutionnel contradictoires.'
      : 'Informations insuffisantes, génériques ou uniquement contextuelles.'
  }

  const prudentBecauseContextOnly =
    group !== 'A' && entities.length === 0 && contextEntities.length > 0

  return {
    ...course,
    publicText,
    audienceText,
    categories,
    entities,
    contextEntities,
    transversal,
    contradictions,
    prudentBecauseContextOnly,
    group,
    reason,
    proposedTargets,
  }
}

function countBy(items, getter) {
  const counts = new Map()
  for (const item of items) {
    const value = getter(item) || '(non renseigné)'
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'))
}

function topFormulations(items, field, limit = 12) {
  const groups = new Map()
  for (const course of items) {
    const raw = normalize(course.officialData[field]) || '(non renseigné)'
    const key = searchable(raw)
    const entry = groups.get(key) ?? { raw, courses: [] }
    entry.courses.push(course)
    groups.set(key, entry)
  }
  return [...groups.values()]
    .sort((a, b) => b.courses.length - a.courses.length || a.raw.localeCompare(b.raw, 'fr'))
    .slice(0, limit)
}

function md(value) {
  return normalize(value || '—').replaceAll('|', '\\|')
}

function excerpt(value, max = 180) {
  const text = md(value)
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`
}

function percentage(part, total) {
  return `${((part / total) * 100).toFixed(1).replace('.', ',')} %`
}

function groupCounts(items) {
  return Object.fromEntries(['A', 'B', 'C', 'D'].map((group) => [group, items.filter((item) => item.group === group).length]))
}

function formulationTable(items, field, limit = 12) {
  const rows = topFormulations(items, field, limit).map(({ raw, courses }) => {
    const offers = unique(courses.flatMap((course) => course.catalogueOffers)).slice(0, 4)
    const suggestions = unique(courses.flatMap((course) => [...course.categories, ...course.entities]))
    const groups = groupCounts(courses)
    return `| ${excerpt(raw)} | ${courses.length} | ${md(offers.join(' ; '))} | ${md(courses.slice(0, 5).map((course) => course.code).join(', '))} | ${md(suggestions.join(', ') || 'aucune')} | A:${groups.A} B:${groups.B} C:${groups.C} D:${groups.D} |`
  })
  return [
    '| Formulation officielle regroupée | Nombre | Offres (extrait) | Codes (extrait) | Indices explicites | Répartition |',
    '| --- | ---: | --- | --- | --- | --- |',
    ...rows,
  ].join('\n')
}

function examples(items, count = 5) {
  return items
    .slice()
    .sort((a, b) => a.code.localeCompare(b.code, 'fr'))
    .slice(0, count)
    .map((course) => `${course.code} (${course.group})`)
    .join(', ') || '—'
}

function referenceSection(validated) {
  const rows = validated.map((course) => {
    const targets = course.targeting.targets
      .map(({ category, entity }) => `${category} + ${entity ?? 'sans restriction institutionnelle'}`)
      .join(' ; ')
    return `| ${course.code} | ${excerpt(course.officialData.publicRaw, 90)} | ${excerpt(course.officialData.targetAudienceRaw, 120)} | ${md(targets)} |`
  })
  return [
    '| Code | Public | Public visé | Ciblage validé de référence |',
    '| --- | --- | --- | --- |',
    ...rows,
  ].join('\n')
}

function offerSection(offer, allCourses, analyzed) {
  const all = allCourses.filter((course) => course.catalogueOffers.includes(offer))
  const review = analyzed.filter((course) => course.catalogueOffers.includes(offer))
  const counts = groupCounts(review)
  const organizers = countBy(review, (course) => normalize(course.officialData.organizingEntityRaw))
    .slice(0, 8)
    .map(([value, count]) => `${value} (${count})`)
    .join(' ; ')
  return `### ${offer}

- Formations uniques : ${all.length}
- Déjà validées : ${all.filter((course) => course.normalizationStatus === 'validated').length}
- needsReview : ${review.length}
- Répartition : A ${counts.A} · B ${counts.B} · C ${counts.C} · D ${counts.D}
- Organisateurs rencontrés : ${organizers || '—'}
- Exemples représentatifs : ${examples(review, 8)}

Public les plus fréquents :

${formulationTable(review, 'publicRaw', 5)}

Publics visés les plus fréquents :

${formulationTable(review, 'targetAudienceRaw', 5)}
`
}

function manualSampleSection(sample) {
  return sample.map((course) => {
    const proposal = course.proposedTargets.length > 0
      ? course.proposedTargets.map(({ category, entity }) => `${category} + ${entity ?? 'entity:null'}`).join(' ; ')
      : 'Aucune proposition suffisamment étayée'
    return `### ${course.code} — groupe ${course.group}

- Titre : ${md(course.officialData.titleRaw)}
- Offre(s) : ${md(course.catalogueOffers.join(' ; '))}
- Organisateur : ${md(course.officialData.organizingEntityRaw)}
- Public : ${md(course.officialData.publicRaw)}
- Public visé : ${md(course.officialData.targetAudienceRaw)}
- Justification : ${course.reason}
- Proposition à examiner : ${proposal}
`
  }).join('\n')
}

const snapshotByCode = new Map(officialCatalogueSnapshot.map((course) => [course.code, course]))
const uniqueCodes = new Set(fullCatalogueCourses.map((course) => course.code))
const validated = fullCatalogueCourses.filter((course) => course.normalizationStatus === 'validated')
const needsReview = fullCatalogueCourses.filter((course) => course.normalizationStatus === 'needsReview')

const controls = {
  total: fullCatalogueCourses.length,
  uniqueCodes: uniqueCodes.size,
  validated: validated.length,
  needsReview: needsReview.length,
}

for (const [key, expected] of Object.entries({
  total: EXPECTED.total,
  uniqueCodes: EXPECTED.total,
  validated: EXPECTED.validated,
  needsReview: EXPECTED.needsReview,
})) {
  if (controls[key] !== expected) {
    throw new Error(`Contrôle ${key} en échec : ${controls[key]} au lieu de ${expected}`)
  }
}

const analyzed = needsReview.map((course) => {
  const raw = snapshotByCode.get(course.code)
  if (!raw) throw new Error(`Formation absente du snapshot : ${course.code}`)
  return classify({ ...course, themeRaw: raw.themeRaw })
})

const counts = groupCounts(analyzed)
if (Object.values(counts).reduce((sum, count) => sum + count, 0) !== EXPECTED.needsReview) {
  throw new Error('Contrôle A + B + C + D en échec')
}

const allOffers = unique(fullCatalogueCourses.flatMap((course) => course.catalogueOffers))
const multiOffer = analyzed.filter((course) => course.catalogueOffers.length > 1)
const allPublic = analyzed.filter((course) => /\btout\s+public\b/i.test(`${course.publicText} ${course.audienceText}`))
const contradictions = analyzed.filter((course) => course.contradictions)
const prudentContextOnly = analyzed.filter((course) => course.prudentBecauseContextOnly)
const potentialValidated = validated.length + counts.A
const manualSample = [
  ...analyzed.filter((course) => course.group === 'A').slice(0, 10),
  ...analyzed.filter((course) => course.group === 'B').slice(0, 7),
  ...analyzed.filter((course) => course.group === 'C').slice(0, 5),
  ...analyzed.filter((course) => course.group === 'D').slice(0, 8),
]

const ruleFamilies = [
  ['R1 — Catégorie et institution explicites', counts.A, examples(analyzed.filter((course) => course.group === 'A')), 'Faible à modéré : polysémie et coordination de plusieurs publics.', 'Validation humaine de chaque couple proposé.'],
  ['R2 — Plusieurs catégories explicites', analyzed.filter((course) => course.categories.length > 1).length, examples(analyzed.filter((course) => course.categories.length > 1)), 'Modéré : le texte peut décrire des publics secondaires.', 'Confirmer que chaque catégorie constitue une éligibilité.'],
  ['R3 — Institution explicite, catégorie ambiguë', counts.B, examples(analyzed.filter((course) => course.group === 'B')), 'Élevé sans information complémentaire.', 'Déterminer la catégorie métier auprès de l’entité.'],
  ['R4 — Catégorie explicite, périmètre ambigu', counts.C, examples(analyzed.filter((course) => course.group === 'C')), 'Élevé : entity:null ne peut pas signifier « inconnue ».', 'Confirmer l’entité ou la transversalité.'],
  ['R5 — Tout public contextualisé', allPublic.length, examples(allPublic), 'Élevé si « Tout public » est isolé de son contexte.', 'Lire conjointement Public, Public visé et restrictions explicites.'],
  ['R6 — Multi-offres', multiOffer.length, examples(multiOffer, 10), 'Élevé si les offres sont transformées en targets.', 'Établir les populations via les champs explicites, pas via les offres seules.'],
]

const report = `# Analyse du ciblage métier V1.3

> Rapport exploratoire généré à partir du snapshot officiel et de la projection applicative. Aucun ciblage ni statut de normalisation n’est modifié. Les groupes A à D sont des catégories d’analyse soumises à validation humaine.

## Synthèse

- Catalogue total : **${controls.total}**
- Codes uniques : **${controls.uniqueCodes}**
- Ciblages validés existants : **${controls.validated}**
- Formations needsReview analysées : **${controls.needsReview}**
- Groupe A — évidence forte : **${counts.A}** (${percentage(counts.A, controls.needsReview)})
- Groupe B — institution forte, catégorie ambiguë : **${counts.B}**
- Groupe C — catégorie forte, périmètre ambigu : **${counts.C}**
- Groupe D — information insuffisante ou ambiguë : **${counts.D}**
- Contrôle A + B + C + D : **${counts.A + counts.B + counts.C + counts.D}**
- Cas volontairement maintenus dans un groupe prudent car offre/organisateur seuls ne prouvent pas le périmètre : **${prudentContextOnly.length}**

Si tous les cas A étaient ultérieurement validés humainement, la couverture passerait de **${validated.length}/${controls.total} (${percentage(validated.length, controls.total)})** à **${potentialValidated}/${controls.total} (${percentage(potentialValidated, controls.total)})**. Il s’agit d’une estimation d’analyse, pas d’un ciblage validé.

## Méthode et garde-fous

- Seuls Public et Public visé établissent une catégorie ou un périmètre pour le groupe A.
- Les offres et l’organisateur servent exclusivement de contexte, de contrôle et de détection de contradictions.
- Aucun préfixe de code ne produit de catégorie ou d’entité.
- entity:null n’est proposé que lorsqu’une absence de restriction institutionnelle est explicitement formulée.
- « Tout public », « Manager », « Spécifique » et les champs absents ne constituent pas seuls une preuve.
- En cas d’hésitation, le groupe le plus prudent est retenu.

## Références validées existantes

${referenceSection(validated)}

Ces 22 fiches illustrent PAT, PE, POL, PEN, MAG, les ciblages multiples et les cas transversaux. Elles servent de comparaison et non de règle généralisée.

## Analyse par offre

${allOffers.map((offer) => offerSection(offer, fullCatalogueCourses, analyzed)).join('\n')}

## Formulations de Public les plus fréquentes

${formulationTable(analyzed, 'publicRaw', 20)}

## Formulations de Public visé les plus fréquentes

${formulationTable(analyzed, 'targetAudienceRaw', 20)}

## Cas « Tout public »

- Formations concernées : **${allPublic.length}**
- Répartition : A ${groupCounts(allPublic).A} · B ${groupCounts(allPublic).B} · C ${groupCounts(allPublic).C} · D ${groupCounts(allPublic).D}
- Offres concernées : ${md(unique(allPublic.flatMap((course) => course.catalogueOffers)).join(' ; '))}
- Organisateurs : ${md(countBy(allPublic, (course) => normalize(course.officialData.organizingEntityRaw)).slice(0, 15).map(([value, count]) => `${value} (${count})`).join(' ; '))}
- Exemples : ${examples(allPublic, 15)}

« Tout public » n’est jamais transformé automatiquement en toutes catégories avec entity:null. Les cas sans catégorie et périmètre explicites restent prudents.

## Cas contradictoires

- Nombre détecté : **${contradictions.length}**

| Code | Groupe | Institution explicite | Contexte offre/organisateur | Public | Public visé |
| --- | --- | --- | --- | --- | --- |
${contradictions.slice(0, 100).map((course) => `| ${course.code} | ${course.group} | ${md(course.entities.join(', '))} | ${md(course.contextEntities.join(', '))} | ${excerpt(course.publicText, 100)} | ${excerpt(course.audienceText, 130)} |`).join('\n') || '| — | — | — | — | Aucun cas détecté | — |'}

Ces cas ne sont pas tranchés automatiquement. Le repérage signale une divergence entre les champs explicites et le contexte, sans déclarer lequel est correct.

## Formations multi-offres

- Formations needsReview multi-offres analysées : **${multiOffer.length}**
- Répartition : A ${groupCounts(multiOffer).A} · B ${groupCounts(multiOffer).B} · C ${groupCounts(multiOffer).C} · D ${groupCounts(multiOffer).D}

Exemples représentatifs :

| Code | Nombre d’offres | Offres | Public | Public visé | Groupe | Lecture prudente |
| --- | ---: | --- | --- | --- | --- | --- |
${multiOffer.slice(0, 10).map((course) => `| ${course.code} | ${course.catalogueOffers.length} | ${md(course.catalogueOffers.join(' ; '))} | ${excerpt(course.publicText, 100)} | ${excerpt(course.audienceText, 130)} | ${course.group} | ${course.reason} |`).join('\n')}

Plusieurs offres sont traitées comme plusieurs portes d’entrée possibles vers une même formation, jamais comme plusieurs targets automatiques.

## Familles de règles candidates

| Famille | Nombre potentiel | Exemples | Risque d’erreur | Validation nécessaire |
| --- | ---: | --- | --- | --- |
${ruleFamilies.map(([name, count, sample, risk, validation]) => `| ${name} | ${count} | ${sample} | ${risk} | ${validation} |`).join('\n')}

Ces familles décrivent un futur travail de validation. Elles ne sont pas codées comme règles applicatives.

## Échantillon manuel de ${manualSample.length} formations

Répartition demandée : ${groupCounts(manualSample).A} A, ${groupCounts(manualSample).B} B, ${groupCounts(manualSample).C} C, ${groupCounts(manualSample).D} D.

${manualSampleSection(manualSample)}

## Conclusion analytique

Sans inventer de règle métier et uniquement à partir des informations explicites, **${counts.A} des ${controls.needsReview} formations needsReview (${percentage(counts.A, controls.needsReview)})** semblent pouvoir faire l’objet d’une proposition de ciblage avec une évidence forte. **${counts.B + counts.C + counts.D}** restent en B, C ou D.

Cette estimation doit être relue métier avant toute modification de targeting ou normalizationStatus.
`

await writeFile(reportPath, report, 'utf8')

console.log(JSON.stringify({
  ...controls,
  groups: counts,
  groupAAmongNeedsReview: percentage(counts.A, controls.needsReview),
  potentialCoverage: percentage(potentialValidated, controls.total),
  prudentContextOnly: prudentContextOnly.length,
  contradictions: contradictions.length,
  multiOfferNeedsReview: multiOffer.length,
  allPublic: allPublic.length,
  offers: allOffers.length,
  manualSample: manualSample.length,
  reportPath,
}, null, 2))
