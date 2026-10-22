# Complément au guide de reprise — Hébergement de l’avatar distant

Synthèse initiale : 19 octobre 2026. Mise à jour : 22 octobre 2026.

À lire avec le [guide de reprise](../GUIDE_REPRISE.md). Cette synthèse conserve uniquement les décisions et les résultats généraux du projet ; les détails privés d’exploitation n’y figurent pas.

## Décision d’hébergement

L’hébergement séparé de l’avatar a été retenu et mis en place. Il permet de faire évoluer et redémarrer son interface indépendamment du catalogue. Le code du catalogue n’a pas été modifié pour ce déploiement.

Le constat du 19 octobre demeure historique : l’offre existante ne permettait pas d’ajouter une seconde application Node.js. L’intégration de l’avatar dans le même processus que le catalogue n’a pas été retenue.

Pour les générations réelles, l’avatar continuera d’utiliser le moteur existant du catalogue. La séparation de l’hébergement ne supprime pas cette dépendance.

## Jalon validé le 22 octobre

Le pilote distant reste exclusivement en simulation. L’utilisateur a vérifié l’accès authentifié, le questionnaire, l’affichage d’un résultat fictif et la restauration du brouillon après rechargement.

Le défaut du récapitulatif vide lors du passage d’une petite à une grande fenêtre a été corrigé et contrôlé sur le site. Le contrôle HTTPS a été adapté, puis vérifié sur l’hébergement. Le compteur des simulations a été conservé après les mises à jour et redémarrages.

La révision avatar `043df13a2f8c29a52fe397d0b0cfdc865b99647c` a passé 121 tests locaux. Les contrôles sur appareil mobile physique et réseau institutionnel restent à effectuer ; les essais réalisés ne constituent pas une validation générale du moteur.

## Prochaine étape

Réutiliser le raccordement déjà éprouvé lors du premier essai réel local pour préparer le futur essai distant, puis le tester avec un faux moteur. Le mode réel distant n’est pas activé.

Une seule tentative payante avec profil fictif, sans relance automatique et avec relevé de consommation, sera soumise à un GO distinct avant activation.

Aucun achat supplémentaire ni appel payant n’est autorisé par cette mise à jour documentaire.

Coût OpenAI API du déploiement et des validations en simulation : 0 token / 0 $.
