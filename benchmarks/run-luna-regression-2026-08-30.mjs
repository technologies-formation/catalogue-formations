import fs from 'node:fs'
import { searchWithLuna } from '../server/llmSearch.mjs'

const benchmarkPath =
  'benchmarks/search-benchmark-independent-final-2026-08-29.json'
const outputPath =
  'reports/llm-regression-catalogue-2026-08-30.json'

const benchmark = JSON.parse(fs.readFileSync(benchmarkPath, 'utf8'))

const obsoleteCases = new Map([
  [
    'NEW-NL-005',
    'TRT3016E retirée du catalogue officiel dans le snapshot du 2026-08-28',
  ],
])

const report = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  : {
      benchmark: benchmark.name,
      benchmarkPath,
      runAt: new Date().toISOString(),
      model: 'gpt-5.6-luna',
      runType: 'regression',
      catalogueSnapshotDate: '2026-08-28',
      catalogueSize: 1060,
      cases: [],
    }

delete report.summary

const completedIds = new Set(report.cases.map(({ id }) => id))
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let lastSearchEndedAt = 0

async function pacedSearch(query) {
  if (lastSearchEndedAt) {
    const elapsed = Date.now() - lastSearchEndedAt
    const remaining = 35000 - elapsed

    if (remaining > 0) {
      console.log(`⏳ Régulation API : attente de ${Math.ceil(remaining / 1000)} s`)
      await sleep(remaining)
    }
  }

  while (true) {
    try {
      const result = await searchWithLuna(query)
      lastSearchEndedAt = Date.now()
      return result
    } catch (error) {
      const message = String(error?.message ?? error)
      const match = message.match(/try again in ([\d.]+)s/i)

      if (!match) throw error

      const waitSeconds = Math.ceil(Number(match[1]) + 5)
      console.log(`⏳ Limite OpenAI atteinte : nouvelle tentative dans ${waitSeconds} s`)
      await sleep(waitSeconds * 1000)
    }
  }
}

for (const [index, testCase] of benchmark.cases.entries()) {
  if (obsoleteCases.has(testCase.id)) {
    console.log(
      `[${index + 1}/${benchmark.cases.length}] ${testCase.id} obsolète — ${obsoleteCases.get(testCase.id)}`,
    )
    continue
  }

  if (completedIds.has(testCase.id)) {
    console.log(`[${index + 1}/${benchmark.cases.length}] ${testCase.id} déjà enregistré — ignoré`)
    continue
  }

  console.log(`\n[${index + 1}/${benchmark.cases.length}] ${testCase.id}`)
  console.log(testCase.query)

  const result = await pacedSearch(testCase.query)

  const returnedCodes = result.codes ?? []
  const ranks = Object.fromEntries(
    testCase.expectedRelevantCodes.map((code) => [
      code,
      returnedCodes.indexOf(code) >= 0 ? returnedCodes.indexOf(code) + 1 : null,
    ]),
  )

  const expectedFound = Object.values(ranks).every(
    (rank) => rank !== null && rank <= testCase.expectedTopK,
  )

  const success = testCase.expectedExactAbstention
    ? result.abstain === true && returnedCodes.length === 0
    : expectedFound

  const row = {
    id: testCase.id,
    segment: testCase.segment,
    query: testCase.query,
    expectedRelevantCodes: testCase.expectedRelevantCodes,
    expectedTopK: testCase.expectedTopK,
    expectedExactAbstention: testCase.expectedExactAbstention,
    success,
    ranks,
    returnedCodes,
    recommendedCodes: result.recommendedCodes ?? [],
    complementaryCodes: result.complementaryCodes ?? [],
    relatedCodes: result.relatedCodes ?? [],
    abstain: result.abstain ?? false,
    reason: result.reason ?? null,
    usage: result.usage?.total ?? {},
  }

  report.cases.push(row)
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n')

  console.log(
    `${success ? '✅' : '❌'} retourné: ${returnedCodes.join(', ') || 'ABSTENTION'}`,
  )
  console.log(
    `Coût: $${Number(row.usage.cost ?? 0).toFixed(6)}`,
  )
}

const segments = {}

for (const row of report.cases) {
  segments[row.segment] ??= { total: 0, succeeded: 0 }
  segments[row.segment].total++
  if (row.success) segments[row.segment].succeeded++
}

const usage = report.cases.reduce(
  (total, row) => {
    total.input += row.usage.input ?? 0
    total.output += row.usage.output ?? 0
    total.cached += row.usage.cached ?? 0
    total.written += row.usage.written ?? 0
    total.cost += row.usage.cost ?? 0
    return total
  },
  { input: 0, output: 0, cached: 0, written: 0, cost: 0 },
)

report.summary = {
  benchmarkTotal: benchmark.cases.length,
  obsolete: obsoleteCases.size,
  total: report.cases.length,
  succeeded: report.cases.filter((row) => row.success).length,
  failed: report.cases.filter((row) => !row.success).length,
  segments,
  usage,
}

fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n')

console.log('\n===== RESULTAT REGRESSION =====')
console.log(
  `Benchmark historique : ${benchmark.cases.length} cas | obsolètes : ${obsoleteCases.size} | évaluables : ${report.summary.total}`,
)
console.log(
  `${report.summary.succeeded}/${report.summary.total} = ${(
    (report.summary.succeeded / report.summary.total) *
    100
  ).toFixed(1)} %`,
)

for (const [segment, value] of Object.entries(segments)) {
  console.log(`${segment}: ${value.succeeded}/${value.total}`)
}

console.log('\n===== ECHECS =====')
for (const row of report.cases.filter((row) => !row.success)) {
  console.log(
    `${row.id} | attendu=${row.expectedRelevantCodes.join(', ') || 'ABSTENTION'} | retourné=${row.returnedCodes.join(', ') || 'ABSTENTION'}`,
  )
}

console.log('\n===== USAGE OPENAI =====')
console.log(`Input    : ${usage.input}`)
console.log(`Output   : ${usage.output}`)
console.log(`Cached   : ${usage.cached}`)
console.log(`Written  : ${usage.written}`)
console.log(`Coût USD : $${usage.cost.toFixed(6)}`)
console.log(`Rapport  : ${outputPath}`)
