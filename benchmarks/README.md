# Benchmarks de décision de recherche

## SEARCH-BENCHMARK-DECISION-2026-08-25

Le fichier `search-benchmark-decision-2026-08-25.json` fige les 30 jugements métier destinés à la prochaine comparaison des moteurs de recherche.

Règles impératives :

- ne jamais modifier une requête, un segment, un code attendu, un seuil `expectedTopK`, une abstention ou une note métier après la première exécution ;
- conserver le commit de référence et le snapshot catalogue indiqués dans les métadonnées lors de toute comparaison ;
- ne pas utiliser les corpus historiques consommés comme holdout final ;
- exclure de toute exécution les cinq cas de réserve préparés pendant la conception : ils ne figurent pas dans le JSON ;
- publier séparément toute correction de protocole rendue nécessaire après exécution, sans réécrire les jugements gelés.

Segments :

- `natural_positive` : une formation pertinente doit apparaître dans le Top 3 ;
- `multi_intent` : tous les codes attendus doivent apparaître dans le Top 10 ;
- `context_restriction` : le contexte ou le public fait partie du jugement et la référence doit apparaître dans le Top 3 ;
- `abstention` : aucune correspondance exacte ne doit être retournée ; les éventuels `relatedOnlyCodes` sont connexes mais ne satisfont pas le besoin.

Ce gel ne contient aucun résultat d’exécution et ne définit aucun réglage de moteur.
