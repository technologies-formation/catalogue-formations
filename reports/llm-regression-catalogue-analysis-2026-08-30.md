# Analyse de la régression Luna — catalogue du 28.08.2026

## Résultat strict

- Benchmark historique : 40 cas
- Cas devenu obsolète : NEW-NL-005 (TRT3016E retirée du catalogue)
- Cas évaluables : 39
- Réussites : 34
- Échecs stricts : 5
- Score strict : 34/39 = 87,2 %
- Catalogue : 1 060 formations
- Snapshot : 2026-08-28
- SHA-256 du rapport brut :
  7d7cac09a49da781f98e660bb84635450e2516fa1201efce2abdf8834240de72

Le score strict est conservé sans correction a posteriori.

## Analyse qualitative des échecs

### NEW-MI-020 — Alternative fonctionnellement pertinente

Attendu : OCD423 + OCD025.

Luna retourne notamment OCD423 et OCD128.

OCD128 traite explicitement du stress, de la dépression, des tendances
suicidaires, de leur prévention et des stratégies de prise en charge.
OCD025 reste plus spécifique à la prévention du suicide, mais les deux
intentions de la requête sont fonctionnellement couvertes.

Qualification : alternative pertinente, pas de régression fonctionnelle
clairement démontrée.

### NEW-MI-022 — Evolution du catalogue

Attendu historique : EP-1044 + EP-998.

Luna retourne EP-1044 puis EP-1298ETB.

EP-1298ETB « Soutenir l'attention des élèves » est une nouvelle formation
du catalogue du 28.08.2026. Son objectif est de comprendre le fonctionnement
de l'attention et de s'approprier des outils concrets pour soutenir les élèves
dans leurs apprentissages.

Qualification : changement légitime lié à l'évolution du catalogue.

### NEW-MI-024 — Requête ambiguë / alternatives pertinentes

Attendu : S2-110 + CO-01706.

S2-110 est correctement retrouvé.

CO-01706 concerne spécifiquement la mise en voix pour le chant, la justesse
et la projection. La requête parle plus généralement de la voix, des prises
de parole et des productions des élèves.

SEM1122 et SEM1108 constituent donc des alternatives sémantiquement
défendables.

Qualification : échec strict, mais pas de régression fonctionnelle clairement
démontrée.

### NEW-MI-026 — Faiblesse réelle connue

Attendu : PJ-0098 + PJ-1101.

PJ-0098 est retrouvé, mais PJ-1101 ne l'est pas. Les formations proposées
sur la gestion des audiences sont connexes mais répondent moins directement
au besoin d'écoute et de communication avec les parties.

Ce cas était déjà en échec lors du benchmark indépendant.

Qualification : faiblesse réelle connue de la recherche multi-intention.

### NEW-CTX-029 — Equivalent fonctionnel

Attendu : PJ-1101.

Luna retourne PJ-1057.

PJ-1057 et PJ-1101 ont le même intitulé et le même objectif :
« Décoder les comportements de ses interlocuteurs pour ajuster sa
communication », avec un public cible pratiquement identique.

Qualification : équivalent fonctionnel / doublon du catalogue ; échec dû à
l'évaluation stricte par code.

## Conclusion

Le résultat officiel de régression demeure 34/39 (87,2 %).

L'analyse qualitative ne sert pas à recalculer ce score.

Sur les cinq échecs stricts :
- un correspond à une faiblesse réelle déjà connue ;
- un à un équivalent fonctionnel sous un autre code ;
- un à l'évolution du catalogue ;
- deux à des alternatives sémantiquement défendables.

Aucune nouvelle régression fonctionnelle claire n'est démontrée.

Décision recommandée : GO pour un pilote / préproduction, sans réglage de
Luna sur les requêtes désormais consommées. Les futurs ajustements devront
être fondés sur de nouvelles requêtes indépendantes ou sur les observations
du pilote.
