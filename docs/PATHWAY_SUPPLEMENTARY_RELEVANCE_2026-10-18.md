# Parcours : pertinence des propositions annexes

## Besoin et périmètre du 18 octobre 2026

Un essai fonctionnel fourni par l'utilisateur décrit un PAT chargé du suivi de
projets, avec un objectif de gestion de projet, d'organisation et de communication.
Le socle recommandé paraît cohérent, mais les annexes comprennent une séance de
relais pédagogiques, des cours centrés sur les élèves et une offre propre au
Pouvoir judiciaire dont le contexte d'accès n'est pas établi pour ce profil.

Décision : corriger le classement des compléments et renforcer l'exigence de
pertinence dans toutes les rubriques. Le dépassement d'heures n'est pas prioritaire :
le calcul, son affichage et les règles existantes de budget-temps sont conservés.
Aucune liste de codes à exclure ni dictionnaire spécifique à ce seul exemple
n'est introduit. L'avatar n'est pas modifié par ce correctif.

## Défaut reproduit

Dans `server/pathwayEngine.mjs`, un cours renvoyé dans `informationalCourses`
était automatiquement déplacé dans `optionalSteps` dès que le contrôle serveur
ne détectait pas un public incompatible. Une justification générique affirmant
sa pertinence remplaçait alors le texte du modèle.

Un public absent ou « Tout public » ne prouve pas la pertinence du contenu. Le
contrôle du public n'est pas non plus une confirmation administrative d'inscription.
Le classement automatique pouvait donc fabriquer un complément à partir d'une
simple absence de restriction détectée.

## Correction

- Les deux passes du parcours demandent de vérifier le sujet et le contexte du
  besoin, au-delà de mots génériques communs.
- Le plan final distingue explicitement pertinence et compatibilité du public.
  Les cours hors sujet doivent être omis de toutes les rubriques. La rubrique
  informative peut rester vide ; elle n'est pas la liste de tous les cours écartés.
- Un cours uniquement informatif sans incompatibilité détectée n'est plus promu
  automatiquement en complément. Il est omis, sans inventer de justification.
- La récupération existante d'une formation explicitement réservée aux nouveaux
  managers, pour un profil nouveau manager compatible, est conservée avec sa
  justification originale. Les autres stabilisations déjà présentes restent en place.
- Un cours omis à cette étape ne bloque pas, par la déduplication, sa sélection
  explicite ultérieure comme complément. Le texte justifiant ce complément reste intact.
- Les cours retenus par le modèle mais incompatibles avec le profil restent dans
  les informations ; ce reclassement protège l'accès, sans prouver leur pertinence.

Le modèle, les deux appels existants, les schémas de réponse et l'API publique
ne changent pas. La recherche classique et `/api/search` ne sont pas modifiées.

## Vérification

Les nouveaux tests synthétiques reproduisent trois échecs avant correction :
promotion de cours à public vide/ouvert, écrasement d'une justification explicite
par la déduplication et présence d'un complément non sélectionné. Ils passent après
correction. Un autre cas protège la conservation des compléments explicitement
retenus et des informations pertinentes à public différent.

Contrôles locaux : **356 tests réussis**, aucun échec ou test ignoré ; lint et
builds standard et `self-hosted` réussis ; `git diff --check` réussi. Les tests injectent des réponses
et transports simulés : aucun appel OpenAI n'est effectué. La suite conserve les
cas Word, Excel, PowerPoint, nouveaux managers, publics institutionnels et dépassements.

Ces tests vérifient le classement serveur et ses régressions. Ils ne démontrent pas
que Luna ne produira plus de cours hors sujet. Le renforcement des consignes exige
encore un contrôle fonctionnel réel après déploiement du backend, sur le cas observé
et sur d'autres profils et objectifs. Le cas utilisé pour ce correctif est un cas de
développement/régression, pas un benchmark indépendant. Les résultats historiques
officiels ne sont pas modifiés et ne mesurent pas ce correctif.

## Mise en service et suite

La publication sur GitHub ou Pages ne met pas à jour le runtime Node Infomaniak.
Appliquer la procédure existante de sauvegarde et de déploiement du backend décrite
dans `GUIDE_REPRISE.md`, puis vérifier la révision réellement exécutée et le health.
Ne pas présenter ce correctif comme actif en production sans ces preuves.

Le contrôle fonctionnel réel devra vérifier : pertinence des annexes, justification
conservée, distinction entre contexte institutionnel et accès, absence de régression
sur les parcours utiles. Relever les tokens et le coût si des appels réels sont faits.

Après ce contrôle, revenir à la branche avatar `feat/avatar-interactive-local` :
aligner hors ligne le lecteur de référentiels et le questionnaire sur le contrat
du catalogue avant de préparer un raccordement réel. L'activation de l'adaptateur
reste une étape distincte ; aucun moteur ou catalogue n'est à recréer.
