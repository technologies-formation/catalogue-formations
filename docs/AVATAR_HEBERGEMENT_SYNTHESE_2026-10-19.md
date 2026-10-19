# Complément au guide de reprise — Hébergement de l’avatar distant

Date : 19 octobre 2026.

À lire avec le [guide de reprise](../GUIDE_REPRISE.md). Cette synthèse complète le point de reprise relatif à l’hébergement distant ; les constats historiques du guide conservent leur date.

## Constat

Lors de la vérification dans le Manager Infomaniak, l’ajout d’un second site Node.js était désactivé, avec le message « Vous avez déjà créé un site Node.js dans votre hébergement ». Le nombre de sites Web disponibles ne garantit donc pas la possibilité d’ajouter une seconde application Node.js dans l’offre actuelle.

## Orientation retenue pour la suite de l’étude

Privilégier un hébergement séparé pour l’avatar afin de préserver la stabilité du catalogue. Ses déploiements et redémarrages seraient ainsi indépendants de ceux du catalogue.

L’intégration au serveur existant reste une alternative technique, mais ferait partager aux deux applications le même processus, ses ressources et ses redémarrages. Elle n’est pas retenue comme option privilégiée.

L’avatar continuerait d’utiliser le moteur du catalogue pour les générations réelles : un hébergement distinct ne supprime pas cette dépendance ni la charge des appels sur le moteur. Les accès, quotas et limites devront être cadrés avant activation.

## Prochain jalon proposé

Vérifier l’offre d’hébergement séparé, son devis exact et ses conditions, puis soumettre le choix à validation avant tout achat. Prévoir un premier déploiement distant privé en simulation avant tout nouvel essai réel.

Aucun achat, changement de production ou nouvel appel payant n’est autorisé par la seule publication de cette synthèse. Cette mise à jour est uniquement documentaire et ne modifie aucun code applicatif.

Coût OpenAI API de cette publication : 0 token / 0 $.
