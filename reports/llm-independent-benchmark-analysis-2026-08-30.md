# Benchmark indépendant final Luna — Analyse du 30 août 2026

## Résultat officiel

Le benchmark indépendant final comporte **40 requêtes**, dont les réponses attendues ont été définies avant le premier appel à GPT-5.6 Luna.

Le jeu a été gelé, versionné et tagué avant exécution.

**Résultat strict : 37/40 = 92,5 %.**

| Segment | Résultat |
| --- | ---: |
| Natural positive | 18/18 — 100 % |
| Multi-intent | 6/8 — 75 % |
| Context restriction | 6/7 — 85,7 % |
| Abstention | 7/7 — 100 % |

Le score de 37/40 reste la référence officielle et reproductible.

## Revue qualitative des trois échecs stricts

### NEW-MI-023 — Robotique + évaluation de jeunes autistes

Attendu : `OMP-110` + `OMP-009TSA`.

Luna a retrouvé `OMP-110`, puis plusieurs formations TSA différentes de `OMP-009TSA`.

La formulation utilisait le terme générique « jeunes », alors que les formations concernées distinguent notamment enfants du primaire, adolescents et adultes.

**Lecture : attendu trop restrictif / cas ambigu sur l'âge. Aucun défaut fonctionnel majeur identifié.**

### NEW-CTX-029 — Communication en audience pour un magistrat

Attendu : `PJ-1101`.

Luna a classé `PJ-1057` en première position.

`PJ-1057` et `PJ-1101` ont le même intitulé et le même objectif de communication en audience. `PJ-1057` cible spécifiquement les magistrats.

**Lecture : alternative fonctionnellement équivalente. Faux négatif du scoring strict.**

### NEW-MI-026 — Pièces à conviction + communication en audience

Attendu : `PJ-0098` + `PJ-1101`.

Luna a notamment retourné `PJ-0103` et `PJ-1057`.

`PJ-0103` couvre la gestion des pièces à conviction, DM-Web et myABI et ajoute des opérations de saisie, transmission et réception. `PJ-1057` couvre la communication en audience et est fonctionnellement équivalent à `PJ-1101`.

**Lecture : les deux intentions sont couvertes par des alternatives pertinentes. Faux négatif du scoring strict.**

## Conclusion métier

La revue qualitative ne justifie pas de modifier Luna pour tenter d'obtenir artificiellement les codes initialement attendus.

Le benchmark montre notamment :

- **18/18** sur les demandes naturelles ;
- **7/7** sur l'abstention hors catalogue ;
- un comportement globalement solide sur les restrictions de contexte ;
- une marge d'amélioration théorique sur les multi-intentions, mais sans défaut majeur identifié dans les deux écarts examinés.

Décision : **GO vers la préparation d'un pilote / d'un déploiement sécurisé**, sans tuning supplémentaire de Luna sur la base de ce benchmark.

Le benchmark est désormais **consommé**. Il reste utilisable comme test de régression, mais toute future version modifiée du moteur devra être mesurée objectivement avec un nouveau jeu indépendant.

## Coût OpenAI

- Input : **4 071 094 tokens**
- Output : **7 182 tokens**
- Cache lu : **349 580 tokens**
- Cache écrit : **3 721 274 tokens**
- Coût total : **0,945976 USD**
- Coût moyen : environ **0,02365 USD par recherche**

## Traçabilité

- Benchmark gelé : `search-benchmark-independent-final-2026-08-29`
- Résultat brut : commit `e0af8a4`
- Tag résultat : `search-luna-independent-result-2026-08-30`
- SHA-256 du rapport brut : `cb376b3ca244f0f2b37a84f9d325d6e3aa4190fd72429817f6f0cd510776b889`
- Rapport brut : `reports/llm-independent-benchmark-2026-08-30.json`
