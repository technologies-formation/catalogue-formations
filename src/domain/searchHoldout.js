// Vérité terrain constituée avant toute exécution de V0 ou V1 sur ces requêtes.
export const SEARCH_HOLDOUT = Object.freeze([
  holdout('mieux rédiger mes courriels', ['SEM1033'], ['SEM0707', 'SEM1172'], ['SEM1113']),
  holdout('animer une réunion efficacement', ['SEM1184', 'EP-017MA'], ['SEM1217']),
  holdout('maîtriser PowerPoint', ['TRT1013', 'TRT1014', 'TRT3002E'], [], ['SEM-10256']),
  holdout(
    'protéger mes données personnelles',
    ['SEM-10330'],
    ['SEM-10658', 'SEM-10353'],
    ['PJ-0068'],
  ),
  holdout(
    'accueillir un nouveau collègue',
    ['DIP-002', 'PJ-0001', 'PJ-0105'],
    ['EO-003EPP'],
  ),
  holdout('mieux organiser mon temps', ['SEM0872', 'SEM1233E'], ['PJ-0053']),
  holdout('travailler efficacement à distance', [], ['SEM1184'], ['SEM1215']),
  holdout('accompagner une transformation', ['SEM1196'], ['FP243', 'SEM0857'], ['TRT3004H']),
  holdout(
    'faire face à une personne difficile',
    ['SEM1155', 'SEM1095'],
    ['SEM1225E'],
    ['OCD426'],
  ),
  holdout('renforcer mon leadership', ['SEM1174'], ['PJ-1055', 'SEM0857', 'SEM1177']),
  holdout('comprendre le fonctionnement de l’État de Genève', ['SEM0487'], ['DIP-002'], ['SEM0735']),
  holdout('améliorer mon orthographe', ['SEM1172'], ['SEM-10754'], ['EP-1057']),
  holdout('créer des graphiques', ['TRT1008'], ['TRT1009', 'TRT3000E'], ['PJ-0054']),
  holdout('exploiter et analyser des données', ['TRT1009'], ['TRT3000E', 'S2-ORFO303'], ['TRT1005']),
  holdout('réussir une négociation', ['SEM1149'], ['SEM1200', 'EO-015'], ['SEM1037']),
  holdout(
    "prévenir l'épuisement professionnel",
    ['S2-620', 'OCD374'],
    ['SEM1117', 'CO-01709'],
    ['SEM1198'],
  ),
  holdout(
    "utiliser l'intelligence artificielle au travail",
    ['S2-552', 'S2-553'],
    ['SEM-P1575', 'TRT3004H'],
    ['SEM1246'],
  ),
  holdout(
    'renforcer la coopération dans mon équipe',
    ['SEM1230E', 'SEM1177'],
    ['SEM1171', 'EP-739'],
    ['EP-971'],
  ),
])

function holdout(query, essential, relevant = [], discussable = []) {
  return Object.freeze({
    query,
    essential: Object.freeze(essential),
    relevant: Object.freeze(relevant),
    discussable: Object.freeze(discussable),
  })
}
