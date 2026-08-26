# Décision Typesense — 26 août 2026

## Objectif

Évaluer Typesense comme moteur de recherche lexical, sémantique et hybride sur le benchmark de décision figé de 30 requêtes.

## Résultats

| Variante | Score |
|---|---:|
| V1.2 actuelle | 5/30 |
| Typesense lexical brut | 0/30 |
| Typesense sémantique brut | 9/30 |
| Typesense hybride brut | 6/30 |
| Typesense sémantique avec seuil 0.40 | 6/30 |
| Typesense hybride alpha 0.80 + seuil 0.40 | 1/30 |

### Sémantique avec seuil 0.40

- natural_positive : 0/14
- context_restriction : 1/6
- multi_intent : 0/5
- abstention : 5/5

### Hybride calibré

- natural_positive : 0/14
- context_restriction : 1/6
- multi_intent : 0/5
- abstention : 0/5

## Décision

**STOP Typesense pour l'architecture testée.**

Le meilleur résultat Typesense brut est le sémantique à 9/30, mais l'ajout d'un seuil permettant de retrouver 5/5 abstentions fait chuter la capacité de récupération des requêtes positives.

L'hybride n'apporte pas d'amélioration suffisante.

La prochaine expérimentation porte donc sur la représentation sémantique elle-même : MiniLM avec contenu de formation enrichi, sans introduire un nouveau moteur de recherche.
