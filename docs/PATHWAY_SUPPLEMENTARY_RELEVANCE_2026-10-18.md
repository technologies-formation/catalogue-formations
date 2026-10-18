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
un contrôle fonctionnel réel après déploiement du backend. Le premier essai sur
le cas observé est consigné ci-dessous ; une vérification plus large sur d'autres
profils et objectifs reste distincte. Le cas utilisé pour ce correctif est un cas de
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


## Trace de mise en service et premier essai réel — 18 octobre 2026

Le fichier installé dans `/srv/customer/sites/api.a658yg-catalogue.ch` portait
avant intervention le SHA-256
`f366bbe98e5795943dd32792e4ad7b5b468c1acf6bf83e5407680a501bf68cbb`,
identique au fichier avant correctif.

Le seul `server/pathwayEngine.mjs` a été remplacé depuis la révision immuable
`55fadf016c7111354f36da38c743c1389614e7cb`. Le téléchargement, son empreinte,
la syntaxe Node et l'empreinte finale ont été contrôlés. Le fichier installé porte
`7303b13668742fdf5418ce9c08f901a8dba5b2ebd0d8375ad8ff863048d0b878`.
L'utilisateur a ensuite confirmé le redémarrage dans le Manager Infomaniak.

La sauvegarde de retour arrière est :
`/srv/customer/a658yg-pathway-20261018-nLJeKc/pathwayEngine.before.mjs`.
Pour restaurer, vérifier la présence et l'empreinte de cette sauvegarde, remettre
ce fichier à la place du moteur, redémarrer dans le Manager puis contrôler le health
et un scénario fonctionnel. Aucune suppression de cette sauvegarde n'est prévue.

Le contrôle public après redémarrage a retourné `ok=true`, clé OpenAI configurée,
parcours activé, synchronisation active, 1 050 formations, snapshot du 16 octobre
et `lastError=null`. Le champ `catalogue.commit` valait `55fadf0` : il désigne la
publication des données, pas la révision de tous les modules exécutés sur le serveur.
Cette intervention n'a déployé ni `server/searchApi.mjs` ni l'endpoint de référentiels.

Un appel réel à `POST /api/pathway` a repris le profil administratif fictif et le
besoin fourni par l'utilisateur. La réponse brute est versionnée dans
`reports/pathway-functional-check-2026-10-18.json`.

| Rubrique | Résultat de cet essai |
| --- | --- |
| Recommandations | `SEM0737`, `SEM0872`, `SEM1098` : projet, temps/priorités, communication |
| Compléments | `SEM1081`, `SEM1080`, `SEM0631` : pilotage, risques, comptes rendus |
| Informations | Aucune |
| Anciennes propositions parasites | Absentes dans cette réponse ; aucune exclusion par code n'a été codée |
| Durée | 56 h pour un repère de 40 h ; dépassement conservé et signalé |
| Entrée / sortie | 91 627 / 553 tokens |
| Cache lu / écrit | 0 / 91 621 tokens |
| Coût calculé par le backend | 0,02357005 USD |

L'appréciation de pertinence est qualitative et limitée à cette réponse. Il s'agit
d'un test fonctionnel de développement/régression, pas d'un benchmark indépendant.
Il ne prouve ni l'absence de toute future erreur ni le rendu navigateur. Aucun
nouveau réglage n'est fait après lecture de ce résultat. La prochaine phase est
la reprise de l'avatar et de son contrat de référentiels hors ligne.
