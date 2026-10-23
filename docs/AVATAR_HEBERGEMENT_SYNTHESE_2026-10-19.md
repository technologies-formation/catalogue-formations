# Complément au guide de reprise — Hébergement de l’avatar distant

Synthèse initiale : 19 octobre 2026. Mise à jour : 23 octobre 2026.

À lire avec le [guide de reprise](../GUIDE_REPRISE.md). Cette synthèse conserve uniquement les décisions et les résultats généraux du projet ; les détails privés d’exploitation n’y figurent pas.

## Décision d’hébergement

L’hébergement séparé de l’avatar a été retenu et mis en place. Il permet de faire évoluer et redémarrer son interface indépendamment du catalogue. Le code du catalogue n’a pas été modifié pour ce déploiement.

Le constat du 19 octobre demeure historique : l’offre existante ne permettait pas d’ajouter une seconde application Node.js. L’intégration de l’avatar dans le même processus que le catalogue n’a pas été retenue.

Pour les générations réelles, l’avatar continuera d’utiliser le moteur existant du catalogue. La séparation de l’hébergement ne supprime pas cette dépendance.

## Jalon validé le 22 octobre

Le pilote distant reste exclusivement en simulation. L’utilisateur a vérifié l’accès authentifié, le questionnaire, l’affichage d’un résultat fictif et la restauration du brouillon après rechargement.

Le défaut du récapitulatif vide lors du passage d’une petite à une grande fenêtre a été corrigé et contrôlé sur le site. Le contrôle HTTPS a été adapté, puis vérifié sur l’hébergement. Le compteur des simulations a été conservé après les mises à jour et redémarrages.

La révision avatar `043df13a2f8c29a52fe397d0b0cfdc865b99647c` a passé 121 tests locaux. Les contrôles sur appareil mobile physique et réseau institutionnel restent à effectuer ; les essais réalisés ne constituent pas une validation générale du moteur.

## Étape prévue au 22 octobre — réalisée le 23 octobre

Réutiliser le raccordement déjà éprouvé lors du premier essai réel local pour préparer le futur essai distant, puis le tester avec un faux moteur. Le mode réel distant n’était pas activé à cette date.

Une seule tentative payante avec profil fictif, sans relance automatique et avec relevé de consommation, sera soumise à un GO distinct avant activation.

Aucun achat supplémentaire ni appel payant n’est autorisé par cette mise à jour documentaire.

Coût OpenAI API du déploiement et des validations en simulation : 0 token / 0 $.

## Jalon du 23 octobre : deux essais réels distants terminés

Le raccordement réel a été préparé dans l’avatar à la révision `2836b886a1722ea213121d0433c803c0c4368bda` : 126 tests locaux et contrôles GitHub du service et du navigateur réussis. Chaque session réelle dispose d’un compteur distinct, limité à une tentative totale ; une erreur ne permet pas de relance automatique. Les comptes rendus privés et les compteurs ont été vérifiés par l’utilisateur.

| Essai de développement | Entrée | Sortie | Coût renvoyé par le backend |
| --- | ---: | ---: | ---: |
| Premier essai distant, avant correction | 90 040 | 412 | 0,0230041 USD |
| Vérification après correction | 92 629 | 443 | 0,02368855 USD |
| Total des deux essais distants | 182 669 | 855 | 0,04669265 USD |

Le premier essai a révélé une préférence e-learning inventée alors que les contraintes étaient « Aucune ». Les consignes du moteur CATALOGUE ont été corrigées par `3c8df53f6c80a71f30d89c94b6027875b831205d`, avec 361 tests, lint et build réussis. Le fichier corrigé a été installé, son empreinte vérifiée, le backend redémarré et le health contrôlé. Le backend décrivait alors 1 064 formations et un snapshot du 23 octobre, sans erreur de synchronisation. La révision des données du catalogue ne désigne pas la révision de tous les modules exécutés.

Le défaut n’est pas réapparu dans le second cas : aucune préférence de modalité attribuée au profil ; Outlook présenté comme une alternative. Ce contrôle porte sur un cas de développement, pas une validation générale ni un benchmark indépendant. Voir la [note sur la fidélité aux préférences](PATHWAY_PREFERENCE_ATTRIBUTION_2026-10-23.md).

Après chaque essai, l’avatar a été remis en simulation. Le dernier redémarrage indique simulation uniquement et contrôle HTTPS réussi. Les deux sessions réelles sont consommées à 1/1 et leurs rapports sont conservés. Aucun autre appel payant ni réinitialisation de compteur n’est autorisé par ce jalon.

## Priorité décidée pour la suite

L’utilisateur souhaite d’abord revoir l’interface de l’avatar avec l’assistant, qu’il trouve perfectible. Commencer par examiner l’interface actuelle et recueillir les améliorations souhaitées, puis proposer une évolution avant modification. Aucun changement d’interface n’a encore été décidé ni réalisé à ce jalon.

Les vérifications sur téléphone physique et réseau institutionnel, les essais sur d’autres profils avec budget explicite, puis les décisions d’accès, de quotas et de mise en service durable restent à traiter après cette revue. Le catalogue conserve le moteur ; l’avatar conserve son hébergement et son interface distincts.

La présente mise à jour est documentaire uniquement : coût OpenAI API 0 token / 0 $.
