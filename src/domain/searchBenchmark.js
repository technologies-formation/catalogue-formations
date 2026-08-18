export const SEARCH_BENCHMARK = Object.freeze([
  benchmark('excel', 'A', ['TRT1005', 'TRT1007', 'TRT1009'], ['TRT3000E', 'S2-ORFO303']),
  benchmark('conflit', 'A', ['SEM1199', 'SEM1229E', 'EO-015'], ['EP-095MDAS', 'EP-101MDAS']),
  benchmark('stress', 'A', ['S2-620', 'SEM1117', 'OCD428'], ['CO-01653'], ['EP-1046']),
  benchmark('intelligence artificielle', 'A', ['SEM-P1575', 'SEM-P1579', 'SEM-10349'], ['SEM1246', 'S2-435']),
  benchmark('tableur', 'B', ['TRT3000E', 'SEM-10204'], ['TRT1005', 'TRT1009']),
  benchmark('prise de parole', 'B', ['SEM1108'], ['SEM1122', 'SEM1099'], ['S2-202']),
  benchmark('parler devant un groupe', 'C', ['SEM1108'], ['SEM1122', 'SEM1099'], ['S2-202']),
  benchmark('sécurité informatique', 'B', ['PJ-0068'], ['PJ-0042', 'PJ-0080']),
  benchmark('IA', 'B', ['SEM-10349', 'SEM-10350', 'SEM-P1575'], ['SEM1246', 'SEM-4009']),
  benchmark('SI', 'B', ['PJ-0068', 'PJ-0042', 'PJ-0080']),
  benchmark('RH', 'B', ['TRT382', 'TRT450'], ['PJ-0105', 'PJ-0001']),
  benchmark('gérer un conflit', 'A', ['SEM1199', 'SEM1229E', 'EO-015'], ['EP-095MDAS']),
  benchmark('gérer les conflits', 'A', ['EP-095MDAS', 'EP-101MDAS', 'SEM1199'], ['SEM1229E', 'EO-015']),
  benchmark('manager', 'A', ['SEM1174', 'SEM1217', 'SEM0052'], ['PJ-1055', 'SEM1232E']),
  benchmark('management', 'A', ['FP089', 'SEM1089', 'PJ-1055'], ['SEM1174', 'SEM1185']),
  benchmark('collaborateur', 'A', ['DIP-002', 'PJ-1095'], ['PJ-0001', 'PJ-0105']),
  benchmark('collaborateurs', 'A', ['DIP-002', 'PJ-1095'], ['PJ-0001', 'PJ-0105']),
  benchmark('nouvel employé', 'B', ['DIP-002', 'PJ-0001', 'PJ-0105'], ['EO-003EPP']),
  benchmark('nouvelle collaboratrice', 'B', ['DIP-002', 'PJ-0001', 'PJ-0105'], ['EO-003EPP']),
  benchmark('débuter dans l’administration', 'C', ['DIP-002', 'SEM0487'], ['PJ-1001', 'PJ-0001']),
  benchmark('apprendre à manager', 'C', ['SEM1174', 'PJ-1055'], ['FP089', 'SEM1232E', 'SEM1217']),
  benchmark('mieux communiquer avec mon équipe', 'C', ['PJ-1095', 'SEM1098'], ['SEM1177', 'SEM0518']),
  benchmark('faire une présentation', 'B', ['SEM1099', 'SEM-10256'], ['SEM1108']),
  benchmark('ethique', 'A', ['SEM0735', 'FP191']),
  benchmark('éthique', 'A', ['SEM0735', 'FP191']),
  benchmark('securite', 'A', [], ['PJ-0068', 'OCD383', 'EP-007MA']),
  benchmark('sécurité', 'A', [], ['PJ-0068', 'OCD383', 'EP-007MA'], ['SEM-10346', 'S2-EPS13']),
  benchmark('communication', 'B', [], ['SEM1098', 'PJ-1095', 'SEM0518', 'OCD425'], ['OMP-005TSA']),
  benchmark('numérique', 'B', [], ['TRT3004H', 'TRT3016E', 'SEM-P1575'], ['SEM-10416', 'SEM-P1525']),
  benchmark('formation de base', 'B', [], ['PJ-1001', 'FP021', 'FP103'], ['FP273', 'FP104']),
  benchmark('équipe', 'B', [], ['SEM1177', 'SEM1174', 'SEM1232E', 'SEM1217'], ['SEM1076']),
  benchmark('charge mentale', 'A', ['SEM1214'], ['OCD428']),
  benchmark('cybersécurité', 'B', ['PJ-0068'], ['PJ-0042', 'PJ-0080']),
  benchmark('FP173', 'A', ['FP173']),
  benchmark('SEM1108', 'A', ['SEM1108']),
  benchmark('TRT1005', 'A', ['TRT1005']),
])

const MANIFEST_FALSE_POSITIVES = Object.freeze({
  stress: ['EP-1046'],
  IA: ['OCD373', 'OCD001', 'FP089', 'EP-519', 'OMP-108', 'OMP-109'],
  SI: ['EP-045WEB', 'SEM1220', 'SEM1212', 'FP119', 'CO-01677'],
})

function benchmark(query, level, essential, relevant = [], discussable = []) {
  return Object.freeze({
    query,
    level,
    essential: Object.freeze(essential),
    relevant: Object.freeze(relevant),
    discussable: Object.freeze(discussable),
  })
}

export function evaluateSearchBenchmark(courses, search) {
  const measurements = SEARCH_BENCHMARK.map((entry) =>
    evaluateQuery(entry, search(courses, entry.query)),
  )

  return {
    global: aggregateMeasurements(measurements),
    byLevel: Object.fromEntries(
      ['A', 'B', 'C'].map((level) => [
        level,
        aggregateMeasurements(measurements.filter((item) => item.level === level)),
      ]),
    ),
    measurements,
  }
}

function evaluateQuery(entry, results) {
  const codes = results.map(({ course, code }) => course?.code ?? code)
  const top5 = codes.slice(0, 5)
  const top10 = codes.slice(0, 10)
  const useful = new Set([...entry.essential, ...entry.relevant])
  const firstEssentialIndex = codes.findIndex((code) => entry.essential.includes(code))

  return {
    ...entry,
    resultCount: codes.length,
    zeroResult: codes.length === 0,
    essentialRecallAt10:
      entry.essential.length === 0
        ? null
        : top10.filter((code) => entry.essential.includes(code)).length / entry.essential.length,
    strictPrecisionAt5: top5.filter((code) => entry.essential.includes(code)).length / Math.max(1, top5.length),
    usefulPrecisionAt5: top5.filter((code) => useful.has(code)).length / Math.max(1, top5.length),
    manifestFalsePositives: top10.filter((code) =>
      (MANIFEST_FALSE_POSITIVES[entry.query] ?? []).includes(code),
    ).length,
    firstEssentialRank:
      entry.essential.length === 0
        ? null
        : firstEssentialIndex === -1 || firstEssentialIndex >= 10
          ? 11
          : firstEssentialIndex + 1,
    top10,
  }
}

function aggregateMeasurements(measurements) {
  const withEssential = measurements.filter((item) => item.essentialRecallAt10 !== null)
  const withFirstEssential = measurements.filter((item) => item.firstEssentialRank !== null)
  return {
    queryCount: measurements.length,
    zeroResultRate: average(measurements.map((item) => Number(item.zeroResult))),
    essentialRecallAt10: average(withEssential.map((item) => item.essentialRecallAt10)),
    strictPrecisionAt5: average(measurements.map((item) => item.strictPrecisionAt5)),
    usefulPrecisionAt5: average(measurements.map((item) => item.usefulPrecisionAt5)),
    manifestFalsePositives: measurements.reduce(
      (total, item) => total + item.manifestFalsePositives,
      0,
    ),
    meanFirstEssentialRank: average(withFirstEssential.map((item) => item.firstEssentialRank)),
  }
}

function average(values) {
  return values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length
}
