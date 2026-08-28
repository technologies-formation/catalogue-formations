# Décision – Augmentation du rappel LLM
Date : 28.08.2026

## Référence indépendante

Benchmark final indépendant :
- GPT-5.6 Luna deux passes : 26/30 (86,7 %)
- Natural positive : 13/14
- Multi-intent : 2/5
- Context restriction : 6/6
- Abstention : 5/5
- Coût total : 0,6270 USD
- Coût moyen : 0,0209 USD/recherche

Ce benchmark est consommé et ne doit plus être utilisé comme validation indépendante après les adaptations décrites ci-dessous.

## Diagnostic

La principale faiblesse identifiée concerne le rappel de la première passe.

Architecture initiale :
- Luna passe 1 sur 1 058 formations ultra-compactes
- maximum 40 candidats
- Luna passe 2 sur les fiches détaillées

Plusieurs formations pertinentes étaient absentes de la première passe.

## Augmentation de rappel retenue

Réutilisation du moteur lexical local existant :
- ajout de objectivesRaw avec poids 3
- ajout de contentRaw avec poids 2
- fonction searchCourseCandidates()
- complément local Top 40
- union avec les candidats Luna

Résultat de couverture sur les 25 cas positifs consommés :
- Luna seule : 26/30 codes attendus
- Luna + rappel lexical Top 40 : 29/30
- cas entièrement couverts : 22/25 → 24/25
- taille moyenne de l'union : 48,7 candidats
- Top 60 et Top 80 n'apportent aucun gain supplémentaire

## Passe 2 V2

La consigne Luna a été précisée :
- privilégier une formation unique lorsqu'elle couvre substantiellement plusieurs dimensions centrales du besoin
- ne pas empiler inutilement plusieurs formations partielles

Résultats de développement sur les quatre anciens échecs :
- FINAL-NL-008 : EP-081EVEN désormais présent dans la réponse, rang 4
- FINAL-MI-015 : succès
- FINAL-MI-018 : alternatives Luna maintenues ; référence métier à considérer avec prudence
- FINAL-MI-019 : alternatives plausibles ; cas ambigu

Décision : arrêt du tuning sur ce benchmark afin d'éviter le sur-ajustement.

## Architecture candidate retenue

1. Luna passe 1 : catalogue complet ultra-compact, maximum 40 candidats
2. Rappel lexical local : Top 40
3. Union et déduplication des candidats
4. Luna passe 2 sur les fiches détaillées
5. Maximum 5 résultats ou abstention explicite

MiniLM et Typesense ne sont pas utilisés comme filtre obligatoire.

## Coût du dernier test de développement

- Tokens entrée : 98 350
- Tokens sortie : 574
- Tokens écrits cache : 98 338
- Coût estimé : 0,0253 USD
