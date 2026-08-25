import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fullCatalogueCourses } from '../src/data/fullCatalogueCourses.js'
import { searchCourses } from '../src/domain/courseSearch.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const benchmarkPath = path.join(
  here,
  'search-benchmark-decision-2026-08-25.json',
)
const resultsPath = path.join(
  here,
  'search-benchmark-decision-2026-08-25-v12-results.json',
)
const reportPath = path.join(
  here,
  'search-benchmark-decision-2026-08-25-v12-report.md',
)

const benchmark = JSON.parse(await fs.readFile(benchmarkPath, 'utf8'))

const cases = benchmark.cases.map((testCase) => {
  const returnedCourses = searchCourses(fullCatalogueCourses, testCase.query).map(
    (course, index) => ({
      rank: index + 1,
      code: course.code,
      title: course.officialData?.titleRaw ?? '',
    }),
  )
  const ranksByCode = Object.fromEntries(
    testCase.expectedRelevantCodes.map((code) => [
      code,
      returnedCourses.find(({ code: returnedCode }) => returnedCode === code)?.rank ?? null,
    ]),
  )
  const expectedFound = Object.values(ranksByCode).every(
    (rank) => rank !== null && rank <= testCase.expectedTopK,
  )
  const success = testCase.expectedExactAbstention
    ? returnedCourses.length === 0
    : expectedFound

  return {
    id: testCase.id,
    segment: testCase.segment,
    query: testCase.query,
    expectedRelevantCodes: testCase.expectedRelevantCodes,
    expectedTopK: testCase.expectedTopK,
    expectedExactAbstention: testCase.expectedExactAbstention,
    relatedOnlyCodes: testCase.relatedOnlyCodes ?? [],
    success,
    ranksByCode,
    returnedCount: returnedCourses.length,
    returnedCourses,
  }
})

const segments = Object.fromEntries(
  [...new Set(cases.map(({ segment }) => segment))].map((segment) => {
    const segmentCases = cases.filter((testCase) => testCase.segment === segment)
    return [
      segment,
      {
        total: segmentCases.length,
        succeeded: segmentCases.filter(({ success }) => success).length,
        failed: segmentCases.filter(({ success }) => !success).length,
      },
    ]
  }),
)

const results = {
  benchmarkId: benchmark.benchmarkId,
  engine: {
    name: 'V1.2 production',
    implementation: 'src/domain/courseSearch.js#searchCourses',
    modifiedForBenchmark: false,
  },
  referenceMainCommit: benchmark.metadata.referenceMainCommit,
  executedAt: new Date().toISOString(),
  summary: {
    total: cases.length,
    succeeded: cases.filter(({ success }) => success).length,
    failed: cases.filter(({ success }) => !success).length,
    segments,
  },
  cases,
}

await fs.writeFile(resultsPath, `${JSON.stringify(results, null, 2)}\n`)

const lines = [
  '# Benchmark de décision — V1.2',
  '',
  `Benchmark : \`${benchmark.benchmarkId}\`  `,
  'Moteur : `src/domain/courseSearch.js#searchCourses` sans modification ni réglage  ',
  `Exécution : ${results.executedAt}`,
  '',
  '## Synthèse',
  '',
  `- Cas réussis : **${results.summary.succeeded}/${results.summary.total}**`,
  `- Cas en échec : **${results.summary.failed}/${results.summary.total}**`,
  '',
  '## Résultats par catégorie',
  '',
  '| Catégorie | Réussis | Total |',
  '|---|---:|---:|',
  ...Object.entries(segments).map(
    ([segment, value]) => `| ${segment} | ${value.succeeded} | ${value.total} |`,
  ),
  '',
  '## Résultat des 30 questions',
  '',
  '| ID | Catégorie | Décision | Rang(s) attendu(s) | Résultats retournés |',
  '|---|---|---|---|---:|',
  ...cases.map((testCase) => {
    const ranks = testCase.expectedExactAbstention
      ? 'abstention exacte attendue'
      : Object.entries(testCase.ranksByCode)
          .map(([code, rank]) => `${code}: ${rank ?? 'absent'}`)
          .join(', ')
    return `| ${testCase.id} | ${testCase.segment} | ${testCase.success ? 'RÉUSSI' : 'ÉCHEC'} | ${ranks} | ${testCase.returnedCount} |`
  }),
  '',
  '## Questions en échec',
  '',
]

for (const testCase of cases.filter(({ success }) => !success)) {
  lines.push(`### ${testCase.id}`, '')
  lines.push(`> ${testCase.query}`, '')
  if (testCase.expectedExactAbstention) {
    lines.push(
      `Abstention exacte attendue, mais ${testCase.returnedCount} résultat(s) ont été retournés.`,
      '',
    )
  } else {
    lines.push(
      `Attendu dans le Top ${testCase.expectedTopK} : ${testCase.expectedRelevantCodes
        .map((code) => `\`${code}\``)
        .join(', ')}. Rangs obtenus : ${Object.entries(testCase.ranksByCode)
        .map(([code, rank]) => `\`${code}\` = ${rank ?? 'absent'}`)
        .join(', ')}.`,
      '',
    )
  }
  lines.push('Premiers résultats réellement obtenus :', '')
  if (testCase.returnedCourses.length === 0) {
    lines.push('- Aucun résultat.', '')
  } else {
    lines.push(
      ...testCase.returnedCourses
        .slice(0, 5)
        .map(({ rank, code, title }) => `${rank}. \`${code}\` — ${title}`),
      '',
    )
  }
}

await fs.writeFile(reportPath, `${lines.join('\n')}\n`)

console.log(
  JSON.stringify(
    {
      resultsPath,
      reportPath,
      summary: results.summary,
      failedIds: cases.filter(({ success }) => !success).map(({ id }) => id),
    },
    null,
    2,
  ),
)
