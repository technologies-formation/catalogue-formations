# Décision LLM — 27 août 2026

## Résultats

| Approche | Score |
|---|---:|
| V1.2 | 5/30 |
| Meilleur MiniLM | 10/30 |
| GPT-5.6 Luna + présélection MiniLM | 26/30 |

## Architecture retenue

Architecture LLM en deux passes :

1. GPT-5.6 Luna examine les 1 058 formations en version ultra-compacte.
2. Il présélectionne une liste de candidats.
3. Les fiches détaillées de ces candidats sont analysées dans une seconde passe.
4. La seconde passe classe les formations ou s'abstient.
5. Les codes retournés sont strictement contraints aux codes officiels.

MiniLM n'est plus utilisé comme filtre obligatoire d'entrée.

## Validations

- Les formations précédemment éliminées par MiniLM ont été retrouvées :
  - TRT1014 : rang 8
  - TRT1010 : rang 3
  - SEM-P1575 : rang 2
- L'abstention difficile sur l'automatisation administrative complète est correcte.
- Coût observé :
  - environ 0,0036 USD avec cache chaud ;
  - environ 0,0209 USD lors d'une réécriture importante du cache.

## Décision

**GO pour l'architecture LLM en deux passes.**

Le benchmark actuel de 30 requêtes est désormais consommé et ne devra plus
servir de benchmark final indépendant.

La prochaine étape est de constituer un nouveau benchmark indépendant.
