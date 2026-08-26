# Décision MiniLM — 26 août 2026

## Objectif

Évaluer la dernière approche non-LLM sur le benchmark figé de 30 requêtes :
MiniLM SAME et MiniLM ENRICHED, avec et sans seuil d'abstention 0.60.

## Résultats

| Variante | Score |
|---|---:|
| V1.2 actuelle | 5/30 |
| MiniLM SAME brut | 10/30 |
| MiniLM SAME seuil 0.60 | 6/30 |
| MiniLM ENRICHED brut | 9/30 |
| MiniLM ENRICHED seuil 0.60 | 7/30 |

### ENRICHED avec seuil 0.60

- natural_positive : 1/14
- context_restriction : 1/6
- multi_intent : 0/5
- abstention : 5/5

## Décision

**STOP des expérimentations MiniLM / moteurs vectoriels classiques.**

Le meilleur score observé est MiniLM SAME brut à 10/30.

L'enrichissement des fiches ne produit pas d'amélioration :
9/30 en brut.

L'ajout d'un seuil permet de retrouver les abstentions mais dégrade fortement
la récupération des requêtes naturelles et multi-intentions.

La prochaine étape est donc une expérimentation LLM contrainte par le catalogue officiel.
