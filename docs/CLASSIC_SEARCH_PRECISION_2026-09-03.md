# Recherche classique : expressions génériques

Correction préparée à partir du commit déployé `4aafdc8`, sur le catalogue
2026-09-03 (1 065 formations). Aucun appel OpenAI pendant la validation.

## Problème constaté

« Je voudrais savoir utiliser Excel » renvoyait cinq résultats, notamment des
cours de podcasts et Moodle : la seule expression « savoir utiliser » dans leurs
objectifs pouvait suffire comme preuve. « Utiliser Excel » ne renvoyait rien.

## Correction limitée

- Dans la recherche classique seulement, retirer l'amorce `utiliser` ou
  `savoir utiliser` après la normalisation existante, si un sujet suit.
  Le reste de la demande est conservé, y compris ses qualificatifs.
- Une séquence des objectifs constituée uniquement de `savoir`, `utiliser`,
  `etre`, `capable` ne suffit plus comme preuve. Les expressions métier
  comme « tableaux de bord » restent utilisables.
- Aucun changement des seuils, des champs, du dictionnaire partagé, des
  prompts ni du classement Luna. Le rappel Luna ne passe pas par ces règles.

## Vérification locale avant/après

| Requête | Avant | Après |
| --- | ---: | ---: |
| je voudrais savoir utiliser Excel | 5 | 10 |
| utiliser Excel | 0 | 10 |
| je voudrais savoir utiliser Photoshop | 5 | 0 |
| utiliser Excel en Python | 0 | 0 |
| je voudrais savoir faire des présentation | 0 | 0 |
| présentation orale | 1 | 1 |
| prise de parole | 1 | 1 |
| je voudrais savoir conduire une réunion | 2 | 2 |
| je voudrais savoir faire des tableaux croisés dynamiques | 2 | 2 |
| je voudrais savoir faire de la chirurgie cardiaque | 0 | 0 |

Pour Excel, le Top 3 devient Excel 2016 Fondamentaux au perfectionnement,
Excel 365 Analyse de données et Excel 365 Base. Le nombre de résultats seul
ne mesure pas la pertinence. L'absence de résultat Photoshop ne prouve pas
l'absence de toute offre connexe dans le catalogue.

Les résultats complets du rappel Luna (ordre, scores et indicateurs) sont
identiques avant/après sur ces dix requêtes. Deux tests ciblés couvrent le
sujet explicite, un sujet absent, un qualificatif non satisfait et la
conservation des expressions métier dans les objectifs.

Ces cas sont des vérifications de développement, pas un benchmark indépendant.
Les corpus et scores historiques ne sont pas modifiés. Les formulations
ambiguës sur les présentations et la prise en compte générale des restrictions
restent des limites ; cette correction ne prétend pas résoudre le langage naturel.
