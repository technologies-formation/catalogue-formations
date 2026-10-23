# Fidélité des justifications aux préférences du profil

## Constat

Un essai privé a renvoyé une justification attribuant une préférence pour l’e-learning à un profil dont les contraintes étaient « Aucune ». La présence de E-LEARNING dans le titre du cours ne permet pas d’attribuer cette préférence à la personne. Cela ne rend pas, à lui seul, le cours non pertinent.

## Correction préparée

Les consignes des deux passes du moteur distinguent désormais les caractéristiques des formations et les préférences explicitement exprimées dans le profil. Une contrainte absente, vide, « Aucune » ou « sans préférence » ne constitue pas une préférence de modalité. Les justifications doivent expliquer l’utilité du cours sans inventer une demande. Une préférence effectivement exprimée garde son rôle dans le classement. La deuxième passe doit se référer au profil plutôt que reprendre une préférence ajoutée par l’objectif interprété.

Le questionnaire, les règles d’accès, les quotas et les données du catalogue ne sont pas modifiés. Aucun filtre général ne supprime les formations en e-learning.

## Portée de la vérification

Cinq cas de régression contrôlent le contrat des requêtes envoyées au modèle avec un transport injecté : contraintes absentes, vides, « Aucune », « sans préférence » et « E-learning uniquement ». Le cours reste sélectionnable et le profil est transmis sans ajout de préférence.

Ces tests sont des contrôles de développement, pas une mesure indépendante ni une preuve d’obéissance du modèle réel. Aucun appel OpenAI payant n’est effectué. La correction reste sur une branche dédiée ; son déploiement sur le backend et une éventuelle génération réelle nécessitent une étape distincte.
