# Dates d’ouverture des inscriptions

Le champ optionnel `scheduledOpeningDates` contient des dates ISO (`AAAA-MM-JJ`) triées et uniques, extraites uniquement de la colonne **Ouverture** des lignes de sessions portant le pictogramme officiel `icon_timer.png`. Il ne contient ni les dates de début de formation ni des dates produites par le modèle. Une date ambiguë, impossible ou sans colonne identifiée est ignorée. Les années sur deux chiffres sont interprétées dans le siècle 2000–2099, conformément aux sessions actuelles ; une évolution du format officiel nécessitera une revue de ce choix.

Le prochain import produit ce champ ; les snapshots déjà publiés restent valides. Le différentiel métier signale les changements de dates par valeur. La validation avant promotion refuse les dates mal formées, les doublons et les listes non triées. Les anciens snapshots ne sont pas réécrits pour inventer des dates.

Le backend ajoute ces dates à `course.sessionAvailability` seulement pour une fiche collectée avec succès, un indicateur d’ouverture programmée et des dates postérieures au relevé. La provenance reste `official-session-icons` et `observedOn` indique le relevé. Ces métadonnées ne sont pas envoyées au modèle chargé de justifier le parcours. Les deux indicateurs ouvert/programmé restent indépendants.

L’Assistant affiche la prochaine date non passée : « Ouverture des inscriptions prévue le … ». Sans date exploitable, il conserve « Ouverture programmée signalée ». Le relevé n’est pas une garantie de disponibilité actuelle ni de places restantes. Une date passée ne signifie pas automatiquement que les inscriptions sont ouvertes. Le PDF et les synthèses envoyées reprennent les mêmes métadonnées ; une ancienne recherche sauvegardée sans date conserve son affichage antérieur, sans nouvelle génération IA.

## Mise en service

1. Intégrer l’extraction et ses validations dans le flux d’import du catalogue.
2. Produire, vérifier et publier un nouveau snapshot par le flux habituel, sans lancer de génération IA.
3. Mettre à jour `server/catalogueState.mjs` du backend et les modules d’affichage/validation/PDF de l’Assistant ; préserver les réglages privés de collecte, de mail et les quotas.
4. Vérifier les dates sur une fiche officielle et contrôler le passage des métadonnées sans appel au modèle. Les données anciennes sans ce champ doivent continuer à fonctionner.

Aucun accès à HR Access ni extraction de données privées de session n’est ajouté. Aucun nouveau champ du SIRH à venir n’est supposé.
