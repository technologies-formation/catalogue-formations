# Fidélité des justifications aux préférences du profil

## Constat

Un essai privé a renvoyé une justification attribuant une préférence pour l’e-learning à un profil dont les contraintes étaient « Aucune ». La présence de E-LEARNING dans le titre du cours ne permet pas d’attribuer cette préférence à la personne. Cela ne rend pas, à lui seul, le cours non pertinent.

## Correction préparée

Les consignes des deux passes du moteur distinguent désormais les caractéristiques des formations et les préférences explicitement exprimées dans le profil. Une contrainte absente, vide, « Aucune » ou « sans préférence » ne constitue pas une préférence de modalité. Les justifications doivent expliquer l’utilité du cours sans inventer une demande. Une préférence effectivement exprimée garde son rôle dans le classement. La deuxième passe doit se référer au profil plutôt que reprendre une préférence ajoutée par l’objectif interprété.

Le questionnaire, les règles d’accès, les quotas et les données du catalogue ne sont pas modifiés. Aucun filtre général ne supprime les formations en e-learning.

## Portée de la vérification

Cinq cas de régression contrôlent le contrat des requêtes envoyées au modèle avec un transport injecté : contraintes absentes, vides, « Aucune », « sans préférence » et « E-learning uniquement ». Le cours reste sélectionnable et le profil est transmis sans ajout de préférence.

Ces tests sont des contrôles de développement, pas une mesure indépendante ni une preuve d’obéissance du modèle réel. Aucun appel OpenAI payant n’est effectué. Ce paragraphe décrit les contrôles de préparation sans moteur ; la mise en service et le contrôle réel ultérieurs sont consignés ci-dessous.

## Mise en service et contrôle réel du 23 octobre

La correction `3c8df53f6c80a71f30d89c94b6027875b831205d` a été intégrée à main. Le workflow Pages `39920379754` a réussi. Le module du moteur a ensuite été sauvegardé et remplacé séparément sur Infomaniak : empreinte et syntaxe contrôlées, redémarrage confirmé par les journaux, health public OK. Cette intervention ne constitue pas une mise à jour globale du runtime serveur.

Un nouvel essai fictif administratif, avec contraintes « Aucune », a consommé une tentative unique : 92 629 tokens d’entrée, 443 de sortie et 0,02368855 USD renvoyés par le backend. La réponse n’a pas attribué de préférence e-learning ; Outlook figurait parmi les alternatives. Rapport et compteur 1/1 ont été vérifiés. Ce résultat valide ce cas de développement seulement ; il ne garantit pas toutes les générations futures.

L’avatar a été remis en simulation et le contrôle HTTPS a réussi. Aucun autre essai payant n’est autorisé par cette note. La priorité suivante est une revue de l’interface avec l’utilisateur avant les autres étapes de validation et d’ouverture durable.
