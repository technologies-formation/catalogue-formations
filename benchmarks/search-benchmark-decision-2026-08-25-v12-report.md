# Benchmark de décision — V1.2

Benchmark : `SEARCH-BENCHMARK-DECISION-2026-08-25`  
Moteur : `src/domain/courseSearch.js#searchCourses` sans modification ni réglage  
Exécution : 2026-08-25T08:51:40.750Z

## Synthèse

- Cas réussis : **5/30**
- Cas en échec : **25/30**

## Résultats par catégorie

| Catégorie | Réussis | Total |
|---|---:|---:|
| natural_positive | 0 | 14 |
| context_restriction | 1 | 6 |
| multi_intent | 0 | 5 |
| abstention | 4 | 5 |

## Résultat des 30 questions

| ID | Catégorie | Décision | Rang(s) attendu(s) | Résultats retournés |
|---|---|---|---|---:|
| SEM-NL-001 | natural_positive | ÉCHEC | TRT1009: absent | 0 |
| SEM-NL-002 | natural_positive | ÉCHEC | TRT1009: absent | 0 |
| SEM-NL-003 | natural_positive | ÉCHEC | SEM1237: absent | 0 |
| SEM-NL-004 | natural_positive | ÉCHEC | SEM1245: absent | 0 |
| SEM-NL-005 | natural_positive | ÉCHEC | SEM0733: absent | 0 |
| SEM-NL-006 | natural_positive | ÉCHEC | SEM1129E: absent | 0 |
| SEM-NL-007 | natural_positive | ÉCHEC | SEM1235: absent | 0 |
| SEM-NL-008 | natural_positive | ÉCHEC | SEM0746: absent | 0 |
| SEM-NL-009 | natural_positive | ÉCHEC | SEM1247: absent | 0 |
| SEM-NL-010 | natural_positive | ÉCHEC | SEM1213: absent | 0 |
| SEM-NL-011 | natural_positive | ÉCHEC | SEM1203: absent | 0 |
| SEM-NL-012 | natural_positive | ÉCHEC | SEM1040: absent | 0 |
| SEM-NL-013 | natural_positive | ÉCHEC | TRT051: absent | 0 |
| SEM-NL-014 | context_restriction | ÉCHEC | SFIN-001: absent | 0 |
| SEM-NL-015 | natural_positive | ÉCHEC | SEM1216: absent | 0 |
| SEM-MI-016 | multi_intent | ÉCHEC | TRT1009: absent, TRT1008: absent | 0 |
| SEM-MI-017 | multi_intent | ÉCHEC | TRT1014: absent, SEM1108: absent | 0 |
| SEM-MI-018 | multi_intent | ÉCHEC | SEM0737: absent, SEM1080: absent | 0 |
| SEM-MI-019 | multi_intent | ÉCHEC | SEM1200: absent, SEM1203: absent | 2 |
| SEM-MI-020 | multi_intent | ÉCHEC | TRT1010: absent, SEM1246: absent | 0 |
| SEM-CTX-021 | context_restriction | ÉCHEC | SEM-P1575: absent | 1 |
| SEM-CTX-022 | context_restriction | ÉCHEC | S2-433: absent | 0 |
| SEM-CTX-023 | context_restriction | RÉUSSI | EP-570: 1 | 1 |
| SEM-CTX-024 | context_restriction | ÉCHEC | OCD424: absent | 0 |
| SEM-CTX-025 | context_restriction | ÉCHEC | SEM0056: absent | 1 |
| SEM-ABS-026 | abstention | RÉUSSI | abstention exacte attendue | 0 |
| SEM-ABS-027 | abstention | RÉUSSI | abstention exacte attendue | 0 |
| SEM-ABS-028 | abstention | RÉUSSI | abstention exacte attendue | 0 |
| SEM-ABS-029 | abstention | RÉUSSI | abstention exacte attendue | 0 |
| SEM-ABS-030 | abstention | ÉCHEC | abstention exacte attendue | 1 |

## Questions en échec

### SEM-NL-001

> J’ai beaucoup de chiffres à suivre dans mon activité et je voudrais que mon collaborateur puisse en tirer rapidement les informations importantes pour m’aider à prendre des décisions.

Attendu dans le Top 3 : `TRT1009`. Rangs obtenus : `TRT1009` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-002

> Je dois comparer plusieurs hypothèses et voir rapidement l’impact de différents scénarios à partir de mes données.

Attendu dans le Top 3 : `TRT1009`. Rangs obtenus : `TRT1009` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-003

> Quand un dossier devient complexe, j’ai besoin d’une méthode pour distinguer les faits, prendre du recul et construire une vue d’ensemble avant de décider.

Attendu dans le Top 3 : `SEM1237`. Rangs obtenus : `SEM1237` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-004

> Je rédige des messages destinés à des publics très différents et je voudrais éviter les formulations qui excluent ou renforcent des stéréotypes.

Attendu dans le Top 3 : `SEM1245`. Rangs obtenus : `SEM1245` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-005

> Après plusieurs heures à mon bureau, j’ai mal au dos et aux épaules ; je voudrais régler mon poste et adopter de meilleures habitudes.

Attendu dans le Top 3 : `SEM0733`. Rangs obtenus : `SEM0733` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-006

> Je saisis des écritures pour l’État et je dois comprendre la structure des comptes harmonisés utilisée par les collectivités publiques.

Attendu dans le Top 3 : `SEM1129E`. Rangs obtenus : `SEM1129E` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-007

> Notre service accumule des dossiers papier et numériques ; je dois savoir lesquels conserver, combien de temps et comment organiser leur archivage.

Attendu dans le Top 3 : `SEM1235`. Rangs obtenus : `SEM1235` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-008

> Un journaliste va m’interroger au nom de mon service et je veux apprendre à répondre clairement sans perdre la maîtrise du message.

Attendu dans le Top 3 : `SEM0746`. Rangs obtenus : `SEM0746` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-009

> En tant que manager, une collègue me signale un traitement discriminatoire au travail et je dois savoir reconnaître la situation, réagir et l’orienter correctement.

Attendu dans le Top 3 : `SEM1247`. Rangs obtenus : `SEM1247` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-010

> Je ne vois plus très bien ce qui donne du sens à mon travail et je cherche à retrouver des sources de motivation durables dans mon activité.

Attendu dans le Top 3 : `SEM1213`. Rangs obtenus : `SEM1213` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-011

> Je dois préparer et mener des entretiens avec mes collaboratrices et collaborateurs, y compris lorsque la discussion est délicate.

Attendu dans le Top 3 : `SEM1203`. Rangs obtenus : `SEM1203` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-012

> J’ai trop d’idées et d’informations dispersées ; je voudrais une méthode visuelle pour les structurer et faire apparaître les liens.

Attendu dans le Top 3 : `SEM1040`. Rangs obtenus : `SEM1040` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-013

> Je dois produire des cartes professionnelles à partir de données géographiques et apprendre à organiser les couches, les symboles et les mises en page.

Attendu dans le Top 3 : `TRT051`. Rangs obtenus : `TRT051` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-014

> Je travaille dans l’administration du DIP et certaines factures adressées par notre service restent impayées ; je dois savoir quelles relances et démarches entreprendre pour recouvrer les montants dus.

Attendu dans le Top 3 : `SFIN-001`. Rangs obtenus : `SFIN-001` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-NL-015

> Je reçois de longs rapports à parcourir et je voudrais en repérer plus vite la structure, les arguments et les informations essentielles sans perdre en compréhension.

Attendu dans le Top 3 : `SEM1216`. Rangs obtenus : `SEM1216` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-MI-016

> Je veux apprendre à analyser mes chiffres puis à les présenter de façon claire et visuelle à ma hiérarchie.

Attendu dans le Top 10 : `TRT1009`, `TRT1008`. Rangs obtenus : `TRT1009` = absent, `TRT1008` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-MI-017

> Je dois améliorer mes supports de présentation mais aussi être plus convaincant quand je les présente devant un groupe.

Attendu dans le Top 10 : `TRT1014`, `SEM1108`. Rangs obtenus : `TRT1014` = absent, `SEM1108` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-MI-018

> Je débute dans la gestion de projet et je dois aussi apprendre à identifier les risques avant qu’ils ne deviennent des problèmes.

Attendu dans le Top 10 : `SEM0737`, `SEM1080`. Rangs obtenus : `SEM0737` = absent, `SEM1080` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-MI-019

> Comme manager, je dois mieux négocier avec mon équipe et mieux conduire les entretiens individuels.

Attendu dans le Top 10 : `SEM1200`, `SEM1203`. Rangs obtenus : `SEM1200` = absent, `SEM1203` = absent.

Premiers résultats réellement obtenus :

1. `SEM1113` — De quoi je m'e-mail ! Comment mieux maîtriser sa boîte de réception et gagner en efficacité
2. `SEM1166` — L'intelligence émotionnelle au service de la conduite d'équipe

### SEM-MI-020

> Je voudrais automatiser certaines tâches répétitives dans mes tableaux tout en comprenant ce que l’intelligence artificielle peut réellement faire ou non.

Attendu dans le Top 10 : `TRT1010`, `SEM1246`. Rangs obtenus : `TRT1010` = absent, `SEM1246` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-CTX-021

> Je suis enseignant au primaire et je voudrais découvrir comment utiliser l’IA pour préparer ou adapter des contenus pédagogiques.

Attendu dans le Top 3 : `SEM-P1575`. Rangs obtenus : `SEM-P1575` = absent.

Premiers résultats réellement obtenus :

1. `SEM1113` — De quoi je m'e-mail ! Comment mieux maîtriser sa boîte de réception et gagner en efficacité

### SEM-CTX-022

> J’enseigne la chimie au secondaire et je dois évaluer les dangers d’une expérience avant de faire travailler mes élèves au laboratoire.

Attendu dans le Top 3 : `S2-433`. Rangs obtenus : `S2-433` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-CTX-024

> Je travaille en détention et je dois mieux comprendre comment les appartenances culturelles et religieuses peuvent influencer la vie quotidienne des personnes incarcérées.

Attendu dans le Top 3 : `OCD424`. Rangs obtenus : `OCD424` = absent.

Premiers résultats réellement obtenus :

- Aucun résultat.

### SEM-CTX-025

> Dans mon travail je dois prendre ou revoir des décisions administratives et je voudrais mieux maîtriser le raisonnement juridique qui les encadre.

Attendu dans le Top 3 : `SEM0056`. Rangs obtenus : `SEM0056` = absent.

Premiers résultats réellement obtenus :

1. `SEM1113` — De quoi je m'e-mail ! Comment mieux maîtriser sa boîte de réception et gagner en efficacité

### SEM-ABS-030

> Je cherche une formation pour utiliser une IA autonome afin d’automatiser complètement le traitement des dossiers administratifs de mon service.

Abstention exacte attendue, mais 1 résultat(s) ont été retournés.

Premiers résultats réellement obtenus :

1. `SEM-10204` — EP-CO-ESII-OMP / Traitement de texte et tableur : utiliser les styles / Formation autonome en ligne

