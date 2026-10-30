# Guide de reprise — A658-YG — Catalogue de formations — Projet n°2

> Complément du 30 octobre 2026 : l’état courant de l’Assistant séparé est centralisé dans [Assistant formation — référence avant pilote](https://github.com/technologies-formation/a658-yg-avatar/blob/fix/dialogue-course-relevance-2026-10-30/GUIDE_REPRISE.md). L’Assistant `13fd45b` est confirmé installé ; le cas RH/absences + DF-OPE sans entité DIP-SEM est vérifié par l’opérateur ; quatre accès sont préparés et zéro testeur activé. Ce complément documentaire ne modifie ni les modules Catalogue ni ses fichiers statiques et ne prouve pas une nouvelle installation du backend. Les constats datés ci-dessous restent historiques.

> **Synthèse de reprise vérifiée dans GitHub le 18 octobre 2026**
>
> - Révision de `main` examinée : `bbc7ed98138c998684bdab350b898b0dc4b56666`,
>   centralisation des référentiels du parcours.
> - Le [workflow Pages de cette révision](https://github.com/technologies-formation/catalogue-formations/actions/runs/39108545058)
>   est terminé avec succès : tests, lint, build, publication et contrôle de disponibilité.
> - Le rapport d'import versionné décrit **1 050 formations**, snapshot du **16 octobre 2026**,
>   intégré par `3efb6c40ec8c42229ccb30611d489aeb9f25fbd1`.
>   Ce volume décrit le dépôt examiné, pas une nouvelle mesure du backend public.
> - La variante de même origine Infomaniak et son usage sur le Wi-Fi institutionnel
>   sont documentés au jalon du 7 octobre. Le correctif du parcours a été installé
>   sur Infomaniak et contrôlé par un essai API réel le 18 octobre ; voir
>   [la trace du déploiement](docs/PATHWAY_SUPPLEMENTARY_RELEVANCE_2026-10-18.md).
>   Aucun nouvel essai du réseau institutionnel ni contrôle visuel n'a été effectué.
> - `GET /api/profile-references` est désormais versionné sur `main`.
>   Le déploiement Pages réussi ne prouve pas sa disponibilité sur le backend Node.
>   Sa disponibilité Infomaniak est vérifiée le 18 octobre à 15:38 UTC : contrat v1,
>   huit champs, 200/304, prévol 204 et refus d'origine non autorisée 403.
>   Le raccordement réel de l'avatar reste à réaliser.
>
> Les constats de production et les résultats historiques ci-dessous conservent leurs dates.
> Une publication GitHub, un déploiement Pages et un déploiement du backend sont des états distincts.

> Synchronisation optionnelle du catalogue backend : préparée le 02.09.2026,
> désactivée par défaut et documentée dans
> [la procédure et les limites](docs/BACKEND_CATALOGUE_SYNC.md).
> Le contrôle historique du 7 octobre décrit une synchronisation réussie en production ;
> son état actuel doit être confirmé par `/api/health`, notamment `syncEnabled`,
> `lastSuccessAt` et `lastError`.

Ce document est la référence technique et opérationnelle pour reprendre le projet après une interruption.

> **Dernier jalon utilisateur — 19 octobre 2026 :** après validation du simulateur,
> le premier parcours réel a été reçu depuis le pilote privé HTTPS local sur le PC.
> Une tentative sur une consommée, 91 448 tokens d’entrée, 525 de sortie et
> 0,0234917 USD renvoyés par le backend. Deux étapes recommandées cohérentes pour
> le cas fictif administratif ; voir « Premier parcours réel reçu depuis l’avatar privé ».
> Aucun second appel ou déploiement distant autorisé à ce jalon. Les constats
> antérieurs conservent leur date et leur périmètre.

> **Jalon historique validé au 12 septembre 2026**
>
> Le projet dispose désormais :
> - d'une recherche classique locale avec facettes ;
> - d'une recherche enrichie par GPT-5.6 Luna en deux passes ;
> - d'un rappel lexical local Top 40 ;
> - d'un backend Node sécurisé pour les appels OpenAI ;
> - d'un assistant de construction de parcours fondé exclusivement sur le catalogue officiel.
>
> Jalon initial V1 de l'assistant de parcours :
> - commit : `266837ffa9a2b9e3a33ba000cf393897d4fb42ad` ;
> - tag : `pathway-assistant-v1-2026-09-12` ;
> - tests : **329/329 réussis** ;
> - lint et build de production : réussis ;
> - validation fonctionnelle et visuelle sur GitHub Pages : effectuée.
>
> Le jalon fonctionnel Codespaces `search-llm-codespaces-v1-2026-08-29` et le benchmark indépendant final Luna du 30 août 2026 restent des références historiques. Le benchmark a obtenu **37/40 (92,5 %)** et est désormais consommé : il peut servir de test de régression, mais pas de nouveau benchmark indépendant après un futur réglage.
>
> Le frontend statique est publié sur GitHub Pages. Luna et l'assistant de parcours utilisent un backend sécurisé séparé déployé sur Infomaniak. La clé `OPENAI_API_KEY` reste exclusivement côté serveur et ne doit jamais être exposée dans le navigateur.

## Vue d'ensemble A658-YG et point de reprise

Le périmètre opérationnel examiné le 18 octobre 2026 comprend deux dépôts.
Le catalogue conserve le moteur, les règles métier et les données officielles ;
l'avatar prépare une nouvelle interaction avec ces services. Il n'est pas un second moteur.

| Élément | Source et révision examinées | État établi | Limite du constat |
| --- | --- | --- | --- |
| Catalogue, recherche classique, Luna et parcours | [catalogue-formations](https://github.com/technologies-formation/catalogue-formations), `main` à `bbc7ed9` | Code versionné ; tests, lint et build du workflow Pages réussis le 18 octobre | Le fichier du moteur de parcours a été contrôlé et remplacé le 18 octobre ; aucune révision globale du runtime n'est attestée |
| Données du catalogue | `reports/catalogue-import-report.md`, commit `3efb6c4` | Snapshot du 16 octobre, 1 050 formations | La date d'un workflow réussi n'est pas nécessairement celle d'un nouveau snapshot |
| Hébergement de même origine | Section Infomaniak de ce guide, jalon `8a247c0` du 7 octobre | Déploiement et essai institutionnel consignés à cette date | Les domaines personnalisés et le réseau doivent être retestés comme prévu |
| Référentiels du profil | `src/config/pathwayProfile.js`, `server/profileReferences.mjs`, contrat HTTP v1 | Centralisés dans le catalogue depuis `bbc7ed9` | Endpoint Infomaniak vérifié le 18 octobre ; aucun consommateur avatar raccordé au moteur |
| Avatar publié | [a658-yg-avatar](https://github.com/technologies-formation/a658-yg-avatar), `main` à `07a9e0990b9daf1bd515a008f8cbe9045877e45b` | Questionnaire V5 de démonstration, sans connexion Luna ni backend de production | La publication ne prouve pas une génération réelle de formations |
| Avatar en préparation | Branche `feat/avatar-interactive-local`, code `4a5d834ac665e555f520206c737a90f5cc4cc87a`, bilan `930a5ac9378684577d2854789918ee3e6f993a27` | Page et serveur privés en simulation HTTPS locale ; 99 tests et Chromium réussis | Branche non fusionnée ; aucun compte réel ou certificat installé sur le PC, aucun déploiement Infomaniak ou moteur activé |

Les révisions ci-dessus sont des repères datés. Relire les têtes distantes avant
tout travail ; ne pas supposer qu'une branche portant un nom fonctionnel reste
non intégrée. Par exemple, `feat/pathway-profile-references` et `main` du catalogue
pointent déjà vers le même commit `bbc7ed9` lors de cette reprise.

### Carte des fichiers à consulter

| Besoin | Source principale |
| --- | --- |
| Interface et facettes | `src/App.jsx`, `src/domain/courseSearch.js` |
| Assistant de parcours visible | `src/components/PathwayAssistant.jsx`, `src/services/pathwayAssistantApi.js` |
| Validation HTTP et moteur de parcours | `server/pathwayAssistant.mjs`, `server/pathwayEngine.mjs` |
| Recherche IA en deux passes | `server/llmSearch.mjs`, `src/services/catalogueSearchApi.js` |
| Serveur, CORS et configuration | `server/searchApi.mjs`, `server/cors.mjs`, `server/config.mjs` |
| Catalogue actif et synchronisation | `server/catalogueRuntime.mjs`, `server/catalogueState.mjs`, `server/catalogueStore.mjs`, `docs/BACKEND_CATALOGUE_SYNC.md` |
| Import, promotion et publication des données | `scripts/importOfficialCatalogue.mjs`, `scripts/promoteOfficialCatalogue.mjs`, `scripts/preparePublishedCatalogue.mjs` |
| Profil du parcours et contrat de lecture | `src/config/pathwayProfile.js`, `src/config/entities.js`, `docs/PROFILE_REFERENCES.md` |
| Ciblages métier internes, distincts du profil | `src/config/personnelCategories.js`, `src/config/profileRules.js`, `src/data/officialCourseSamples.js` |
| Avatar public | `index.html` dans le dépôt avatar, branche `main` |
| Dernier essai local de l'avatar | `experimental-service/ESSAI_INTERACTIF_LOCAL.md`, `local-demo.mjs`, `pathway-adapter.mjs` sur `feat/avatar-interactive-local` |

### Avatar : réalisé, préparé et restant à faire

La version publiée de l'avatar propose un questionnaire sur la catégorie de personnel,
le type de besoin, la fonction, l'objectif, les compétences, le temps disponible et
les contraintes. Elle construit un aperçu local de demande ; aucun résultat de
formation n'est inventé et aucun appel au moteur n'est effectué. La page indique
également l'absence de connexion à MOS Chorus.

Sur la branche d'essai, le [mode interactif local et ses limites](https://github.com/technologies-formation/a658-yg-avatar/blob/b11508ecc08a0934ff219c981f0697ecfe18b2f5/experimental-service/ESSAI_INTERACTIF_LOCAL.md)
sont documentés. `local-demo.mjs` sert la page sur `127.0.0.1:8799` et transmet
les demandes à `/local/validate`, avec un secret gardé côté serveur et des quotas
persistants de simulation. Le service initial `server.mjs` expose séparément
`POST /test/request`. Aucun de ces deux chemins n'appelle Luna.

L'adaptateur `pathway-adapter.mjs` prépare un futur appel serveur à
`POST /api/pathway`. Il est désactivé par défaut, sans URL de production par défaut,
et n'est importé ni par le simulateur ni par la page. Il conserve les rubriques du
moteur historique et contrôle notamment les liens officiels, les erreurs HTTP,
l'annulation et le délai. Sa présence et ses tests ne constituent pas un raccordement réel.

Deux preuves CI sont distinctes :

- Sur `main` avatar, le [workflow du commit `07a9e09`](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/38263936763)
  a réussi, mais sa commande ne lance que `server.test.mjs`. La présence de
  `avatar-e2e.test.mjs` dans ce commit ne prouve donc pas son exécution par ce workflow.
- Sur la branche interactive, le [workflow du commit `3141233`](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39054049714)
  a réussi et lance `node --test experimental-service/*.test.mjs`.
  Cela valide des simulations et transports injectés, pas une communication avec le moteur public.

La branche `test/avatar-local-e2e` à `291e4f1` diverge de `main`
d'un commit de chaque côté. Ne pas la fusionner automatiquement : comparer son
unique test avec celui déjà présent sur `main` et dans la branche interactive.
Aucune proposition de fusion avatar ouverte n'a été trouvée au contrôle du 18 octobre.

Le [plan d'environnement d'essai](https://github.com/technologies-formation/a658-yg-avatar/blob/07a9e0990b9daf1bd515a008f8cbe9045877e45b/experimental-service/PLAN_ENVIRONNEMENT_TEST.md)
conserve la distinction entre essai local et accès distant. Aucun hébergement
expérimental distant, raccordement à la production ou appel OpenAI ne découle
de la présente mise à jour documentaire.

### Référentiels avatar : alignement réalisé et écarts restants

Le [jalon avatar du 18 octobre](https://github.com/technologies-formation/a658-yg-avatar/blob/b11508ecc08a0934ff219c981f0697ecfe18b2f5/experimental-service/REFERENTIELS_PARCOURS.md)
est publié sur la branche interactive au commit `b11508ecc08a0934ff219c981f0697ecfe18b2f5`.
Le [workflow associé](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39133645836)
réussit avec les 52 tests. La révision de départ `3141233` reste un repère historique.

Le lecteur `experimental-service/profile-references.mjs` consomme le contrat v1
sans seconde liste de catégories métier. Il contrôle le format, la révision et
l'ETag, les réponses 200/304, la taille du flux, les délais et les réponses obsolètes.
Un échec conserve le cache mais bloque son usage pour une soumission réelle.
Les propriétés additives sont tolérées ; une version majeure inconnue est refusée.

Le mode local peut recevoir un document généré par `buildProfileReferences()`
dans le dépôt catalogue, hors ligne et hors Git. Le questionnaire utilise alors
les huit champs et les contraintes de ce document. L'entité reste libre, les
options des sélecteurs sont contrôlées côté formulaire, et les minimums locaux
de 2 caractères pour la fonction et 10 pour l'objectif ne sont plus imposés dans
ce mode. La simulation historique sans document reste séparée et n'alimente pas
l'adaptateur de parcours.

L'adaptateur désactivé exige désormais un lecteur de référentiel et la révision
du profil confirmé ; les anciennes listes d'autorisation manuelles sont remplacées.
Il revalide avant le POST et refuse toute différence de révision. Il conserve les
protections de destination, d'annulation, de délai et de contrôle des résultats.
Il n'est toujours importé ni par la page ni par le serveur de simulation.

| Sujet | État après alignement hors ligne | Reste à faire avant raccordement réel |
| --- | --- | --- |
| Contrat et nomenclatures | Huit champs consommés ; entité libre, choix et limites issus du document | Vérifier la version réellement servie par l'hébergement |
| Référentiel HTTP | Lecteur testé et service Infomaniak vérifié : 200/304, prévol 204, origine refusée 403 ; contrat vivant accepté par le lecteur avatar | Cadrer le chargement serveur de l’avatar et vérifier son futur hébergement et le réseau institutionnel |
| Brouillon et confirmation | Brouillon de session restauré ; actualisation sans perte des codes, valeurs retirées signalées et confirmation explicite en simulation | Cadrer le chargement serveur et la confirmation avant raccordement réel |
| Interface | DOM de test et Chromium réel sur le runner GitHub ; captures ordinateur/mobile examinées | Compléter ultérieurement les essais sur appareils physiques et réseau institutionnel |
| Délai parcours | Session serveur : délai explicite obligatoire, maximum 210 s ; adaptateur isolé : défaut historique de 10 s ; référentiel borné séparément | Vérifier les limites du navigateur et des proxies avant essai réel ; 200 s proposé pour le POST, non déployé |
| Activation | Session préparée sans route ni import actif ; configuration, quotas et concurrence testés hors ligne | Choisir hébergement et accès privés, budget et plafonds d’essai ; activer uniquement le périmètre validé |

Les essais restent des contrôles techniques et de régression. Le contrôle croisé
avec le vrai générateur du catalogue a accepté la révision
`68da05c1b2668874873373762cd10897b6cd26e31422c9c300ecedab5845a60d` :
c'est un constat daté, pas une constante métier à conserver dans le client.
Le contrôle navigateur a ensuite réussi dans la CI GitHub au commit `9670b6f` :
[exécution 39140642621](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39140642621),
Chromium 151.0.7922.34. Les quatre captures initiales/finales ont été examinées
en formats 1280 × 900 et 390 × 844 : aucun débordement horizontal ni problème
bloquant observé. Questionnaire, champs facultatifs, entité libre, correction sans
envoi automatique et actualisation explicite sont contrôlés. Trois requêtes de
simulation et un quota de trois, aucune erreur navigateur, aucune requête externe.
Ce contrôle ne couvre pas Safari, les appareils physiques ni le clavier tactile.
Les preuves sont dans l'artefact `avatar-browser-simulation` (rétention 14 jours) ;
le bilan est consigné sur la branche au commit `b19078f`. Le moteur réel reste
déconnecté. Coût OpenAI API de ce jalon avatar : 0 token / 0 $.

### Vérification Infomaniak du référentiel — 18 octobre, 15:38 UTC

Le relevé SSH fourni par l'utilisateur confirme les SHA-256 attendus des cinq
modules du référentiel (`searchApi`, `cors`, `pathwayAssistant`, `profileReferences`,
`pathwayProfile`), de la dépendance `entities` et du moteur corrigé `pathwayEngine`.
Les modules sont donc déjà présents : aucun remplacement ni redémarrage
supplémentaire n'a été effectué lors de ce contrôle. Leur date d'installation
n'est pas déduite du relevé ; l'opération ciblée antérieure ne concernait que le moteur.

Contrôles directs sur `https://api.a658yg-catalogue.ch` :

- `GET /api/profile-references` : 200, schéma v1 et huit champs ; document accepté
  par le lecteur avatar et identique au générateur du catalogue.
- Révision et ETag : `68da05c1b2668874873373762cd10897b6cd26e31422c9c300ecedab5845a60d`.
- GET conditionnel depuis l'origine Pages autorisée : 304, origine autorisée
  renvoyée, ETag exposé et `If-None-Match` autorisé.
- Prévol OPTIONS depuis cette origine : 204 ; origine `https://example.invalid` : 403.
- `/api/health` : `ok=true`, synchronisation active, 1 050 formations,
  snapshot du 16 octobre et `lastError=null`.

Ce sont des vérifications HTTP publiques et de compatibilité, sans appel OpenAI
(0 token / 0 $). Elles ne prouvent ni l'accès sur le réseau institutionnel ni le
raccordement réel de l'avatar, qui reste désactivé. Le flux de renouvellement des choix, de conservation du brouillon et de confirmation
a ensuite été implémenté en simulation dans l'avatar ; voir le jalon suivant.
La session serveur a ensuite été préparée sans activation ; voir le jalon ci-dessous.
Son exposition HTTP, son hébergement et son premier essai réel restent à cadrer séparément.

### Avatar : brouillon, choix actualisés et confirmation — 18 octobre

La branche existante `feat/avatar-interactive-local` contient le flux de simulation
au jalon de code `045a0c48b5ca77831a0c6316f64de09fe8071dc7`, après l'implémentation
`7ffff5473bc55fd876d0bd5f3595773a527a468d` et les ajustements de lisibilité.

- Après la dernière réponse, **Confirmer le profil et simuler** est nécessaire.
  Une correction, une actualisation ou un rechargement ne lance aucune simulation.
- Le brouillon est restauré depuis `sessionStorage` dans le même onglet et la même
  origine locale : réponses sous leurs codes, étape et saisie en cours. Ni résultat,
  ni confirmation, ni jeton ne sont sauvegardés. Recommencer efface le brouillon.
  Une correction non enregistrée n'est pas restaurée. Si le stockage est indisponible,
  le formulaire reste utilisable et le signale.
- **Actualiser les choix** conserve le profil et relit le fichier explicitement
  configuré côté serveur local. Un nouveau libellé conserve la valeur du code ;
  un choix retiré ou une limite réduite marque la réponse **À revérifier** et bloque
  la confirmation jusqu'à correction. Une entité libre reste conservée.
- La révision courante est relue avant chaque simulation : un changement (409),
  une indisponibilité (503) ou une confirmation manquante sont refusés avant quota.
  Les quotas ne sont pas réinitialisés par une actualisation. Les réponses tardives
  d'un profil corrigé sont ignorées. Le booléen de confirmation n'est pas une
  authentification ni une activation du moteur réel.
- La zone de saisie est masquée pendant la vérification du profil, les consignes
  répétées sont remplacées et le récapitulatif mobile garde la fin de l'échange visible.

Les [60 tests Node](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39142566897)
et le [contrôle Chromium](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39142566949)
réussissent au commit `045a0c4`. Les sept captures ordinateur/mobile ont été
examinées (1280 × 900 et 390 × 844) : pas de problème bloquant observé. Cinq
simulations explicitement confirmées, quota de cinq, aucune erreur navigateur,
aucune requête externe et aucun débordement horizontal. Les captures sont dans
l'artefact `avatar-browser-simulation`, rétention de 14 jours. Ce contrôle ne couvre
pas Safari, les appareils physiques, le clavier tactile ou le réseau institutionnel.
Le [bilan avatar](https://github.com/technologies-formation/a658-yg-avatar/blob/7e63dee55f3f45c0865ac1d1ed0e88307a6cfd60/experimental-service/REFERENTIELS_PARCOURS.md)
est consigné au commit `7e63dee55f3f45c0865ac1d1ed0e88307a6cfd60`.

Ces contrôles sont fonctionnels simulés et de régression ; ils ne constituent
pas un benchmark indépendant du moteur. Le serveur local n'appelle toujours pas Infomaniak ; l'adaptateur
réel reste désactivé et non importé. La branche publique `main` de l'avatar reste
au jalon `07a9e09`. Coût OpenAI API : 0 token / 0 $.

### Préparation du raccordement serveur — 18 octobre

La branche avatar contient la [préparation serveur](https://github.com/technologies-formation/a658-yg-avatar/blob/11796dd23cb16484860bc5a0eb3ddeba3c7764f8/experimental-service/PLAN_ENVIRONNEMENT_TEST.md)
au commit `11796dd23cb16484860bc5a0eb3ddeba3c7764f8`. Le nouveau
`experimental-service/pathway-session.mjs` réutilise le lecteur, l'adaptateur et
le compteur existants. Désactivé par défaut, il ne fournit aucune route HTTP,
commande de lancement, lecture d'environnement ou destination implicite. Il
n'est importé ni par l'interface ni par les serveurs de simulation.

La préparation exige une même origine HTTPS explicitement autorisée pour les deux
endpoints, une seule session dans une seule instance, un fichier privé absolu
persistant, des quotas et un délai choisis explicitement. Elle fige le profil avant
la lecture réseau, revalide le référentiel, puis réserve une tentative avant le POST.
Révision modifiée, profil invalide, stockage indisponible, concurrence et identifiant
déjà tenté dans cette instance bloquent l'envoi. Le compteur et l'arrêt persistent ;
la détection des identifiants ne persiste pas au redémarrage. Pas de relance automatique
ni de remboursement d'une tentative en erreur ou au résultat incertain.

Le moteur catalogue utilise jusqu'à deux passes de 90 secondes : le défaut de
10 secondes de l'adaptateur isolé ne suffit pas à décider le délai d'un raccordement.
La session exige un délai explicite ; le maximum de l'adaptateur passe à 210 secondes.
200 secondes pour le POST est une proposition à valider avec le navigateur, le serveur
et les proxies ; aucune limite de proxy réelle n'est attestée par ce choix. Le moteur
Infomaniak n'a pas été modifié. L'expiration côté consommateur ne garantit pas l'arrêt
des appels OpenAI déjà engagés dans le backend.

L'adaptateur borne aussi le JSON reçu (256 Kio par défaut, maximum 1 Mio), refuse les
redirections, contrôle UTF-8, type MIME, catégories, liens officiels, durées et mesures
de consommation. Il conserve les données acceptées sans recomposer les recommandations.
Un contrôle croisé hors ligne a accepté sans modification la réponse déjà enregistrée
dans `reports/pathway-functional-check-2026-10-18.json`. Ce n'est pas un nouvel appel
réel ni un benchmark indépendant.

Les [72 tests Node de la CI](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39144470141)
passent comme en local : neuf nouveaux cas de session et trois cas supplémentaires
d'adaptateur couvrent ces protections. L'interface est inchangée par cette préparation.
Le [workflow Chromium](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39144470134)
réussit aussi en régression sur le même commit ; le contrôle visuel détaillé des
sept captures reste celui du jalon `045a0c4` documenté plus haut.
Coût OpenAI API : 0 token / 0 $.

**Suite prévue à ce jalon historique :** préparer l'exposition privée et l'affichage
des résultats. Cette préparation est réalisée au jalon suivant. Avant un premier essai réel,
fixer le cas fictif, l'accès, l'environnement, le nombre maximal de tentatives, le
suivi de coût et les délais de bout en bout. Les quotas de tentatives ne sont pas
un plafond en USD et ne couvrent pas les autres consommateurs du backend partagé.
Aucune clé OpenAI n'ira dans le navigateur. Le raccordement de recherche Luna et la
publication de l'avatar connecté restent des périmètres distincts.

### Avatar : affichage et frontière d’accès privé — 18 octobre, reprise après rangement du PC

Le code est publié sur la branche d’essai existante au commit
`d838d06894b49cfe21ba104849e6cf23f379caa5`, avec le
[bilan détaillé](https://github.com/technologies-formation/a658-yg-avatar/blob/e292965d41948de026714da78ee1b3a73557f152/experimental-service/AFFICHAGE_ACCES_PRIVE.md).
La branche publique `main` de l’avatar reste inchangée.

- Le rendu conserve les rubriques du moteur, les justifications, durées, publics,
  liens officiels, limites, résultats vides et mesures de consommation disponibles.
  Le contrôle de résultat est partagé avec l’adaptateur. Les textes ne sont pas
  interprétés comme du HTML ; les liens dangereux sont refusés.
- La simulation locale peut recevoir un aperçu **explicitement configuré**, signalé
  comme données de test ne répondant pas au profil. Il apparaît après confirmation
  d’un parcours et disparaît lors d’une modification ou actualisation. Ni la page
  publique ni la commande locale habituelle ne chargent un aperçu par défaut.
- `private-pathway-handler.mjs` prépare l’accès privé mais n’écoute aucun port et
  n’est importé par aucun serveur démarrable. Désactivé par défaut, il exige une
  origine HTTPS, une identité vérifiée par une intégration serveur et une session
  explicite. Aucun système de connexion n’est installé et aucun hébergement choisi.
- Les deux routes préparées (non exposées) sont `GET /private/profile-references`
  et `POST /private/pathway`. Une confirmation aléatoire générée côté serveur est
  liée à l’identité/révision, expire après cinq minutes et ne sert qu’une fois ;
  32 confirmations au maximum restent en attente par instance. Aucun jeton partagé
  n’est ajouté au navigateur. Les quotas persistants restent ceux de la session.
  Ni CORS ouvert, ni cache des profils/résultats, ni relance automatique.

Les [84 tests Node de la CI](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39156186306)
passent comme en local. Le [contrôle Chromium](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39156186284)
réussit sur ordinateur/mobile (1280 × 900 et 390 × 844), avec cinq simulations,
aucune erreur navigateur, aucune requête distante et aucun débordement horizontal.
Neuf captures sont produites ; quatre captures du résultat et de l’état final ont
été examinées, sans problème bloquant observé. Artefact `avatar-browser-simulation`,
rétention 14 jours. Ce sont des essais fonctionnels simulés et de régression,
pas un benchmark indépendant ni une validation d’authentification ou de moteur réels.
Safari, appareils physiques, clavier tactile et réseau institutionnel ne sont pas couverts.
Coût OpenAI API : 0 token / 0 $. Le quota de travail Codex est distinct de ce coût API.

**Suite prévue à ce jalon historique :** choisir l’hébergement et son contrôle
d’identité privé, puis préparer les échanges du navigateur (référentiel, confirmation, délais longs,
erreurs et brouillon conservé). Avant tout premier appel réel : cas fictif,
plafond de tentatives, suivi de coût, délais des proxies et autorisation dédiée.
Aucun déploiement Infomaniak ni appel au moteur réel n’a eu lieu pendant ce jalon.

#### Emplacement local de l’avatar sur le PC

Le 18 octobre 2026, l’utilisateur a copié `C:\Users\yanng\a658-yg-avatar` vers :

```text
C:\Users\yanng\OneDrive\Documents\Projets-ChatGPT-Codex\a658-yg-avatar
```

Les quatre éléments `.git`, `.github`, `experimental-service` et `index.html`
sont visibles à destination. L’ouverture de la démonstration depuis cette nouvelle
adresse a été confirmée par capture. L’utilisateur a ensuite confirmé la mise à la
Corbeille de l’ancien dossier ; la consigne était de ne pas vider la Corbeille.
Lors du seul déplacement, l’intégrité, la branche et la synchronisation n’avaient
pas été vérifiées. Le contrôle Windows ultérieur décrit ci-dessous confirme la
branche, l’avance rapide jusqu’à `930a5ac`, un contrôle de connectivité sans erreur
et les 99 tests réussis ; la présence des modules ajoutés ensuite reste à confirmer.
Adapter les anciens raccourcis/commandes lors de leur prochaine utilisation.
Les dossiers d’outils `.codex`, `.copilot`, `.local`, `.vscode` et `.vscode-shared`
restent dans le profil Windows ; ne pas les déplacer avec le code du projet.
Les documents de sauvegarde restent dans leur dossier existant sous `Projets-ChatGPT-Codex`.

### Avatar : accès individuel du pilote — 18 octobre, après contrôle du Manager

Le code est préparé sur `feat/avatar-interactive-local` au commit
`fcaab9d030e541e1cd9f3113c0368e13ebdfb03b`. La
[comparaison et les limites](https://github.com/technologies-formation/a658-yg-avatar/blob/90cffabf7384a3d96fd5a2f2208777e8f7e39713/experimental-service/ACCES_PILOTE.md)
sont conservées dans le dépôt avatar.

**Constat vérifié par les captures de l’utilisateur :** dans « Hébergement Web 2 »,
l’option « Protection des dossiers » est grisée et son infobulle indique
« Vous n’avez aucun site », alors que le site Node.js est listé. Cette protection
n’est pas utilisable dans la configuration observée ; ne pas la présenter comme
une protection active de l’avatar ni généraliser à toutes les offres Infomaniak.

**Choix pour la préparation du petit pilote :** identifiants HTTP Basic individuels
sous HTTPS, vérifiés côté serveur avant l’accès aux référentiels et parcours. Aucun
service externe ni nouvelle dépendance ajouté. L’accès institutionnel/OIDC reste
une option à cadrer pour une population élargie ; aucun fournisseur ni compte de
service n’est établi ici. Le site d’essai Infomaniak distinct du catalogue reste
privilégié, mais sa disponibilité et son coût éventuel ne sont pas vérifiés :
aucun site ni domaine créé, aucun achat ni déploiement effectué.

`pilot-auth.mjs` prépare les enregistrements salés scrypt et l’authentification ;
`pilot-private.mjs` les assemble avec la frontière privée existante. Les deux sont
désactivés par défaut, sans serveur démarré, lecture d’environnement ou fichier
implicite. Aucun compte réel n’est créé. Le navigateur utilisera son dialogue
standard ; aucun mot de passe réel ou jeton partagé n’est inclus dans la page.
L’adaptateur ne transmet pas les identifiants au backend catalogue.

L’activation demande des comptes individuels explicites (10 au maximum), une limite
globale de vérifications et une attestation du transport HTTPS. Ne pas faire
confiance au seul `X-Forwarded-Proto` : l’intégration doit établir le proxy de
confiance et l’absence de contournement direct. Le coût scrypt (32 Mio environ)
est à mesurer sur l’hébergement. Une seule vérification lourde à la fois ; demandes
identiques en cours mutualisées, autres demandes refusées sans file d’attente.
Les mauvais comptes, formats invalides, succès tardifs après révocation et erreurs
du contrôle TLS sont refusés. Les réponses, profils et mots de passe ne sont pas
mis en cache par ce module. Les succès consomment aussi le plafond de vérifications.

**Limites à conserver :** HTTP Basic dépend entièrement de HTTPS et ne fournit ni
MFA ni déconnexion universelle immédiate du navigateur. La révocation serveur fait
foi. Révocations et limites d’authentification sont en mémoire ; pour une révocation
durable, retirer le compte de la future configuration privée et recharger le
processus. Le quota de parcours reste persistant et distinct. Une attaque peut
épuiser la limite globale et gêner les testeurs. Ce contrôle côté application
remplace pour ce pilote l’hypothèse initiale d’un proxy d’identité extérieur au
processus ; il ne remplace pas l’isolation, TLS ni le débit en périphérie.

Les [93 tests Node](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39157868026)
passent localement et dans la CI. Le [contrôle Chromium HTTPS](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39157868062)
réussit aussi, et le rapport JSON de l’artefact a été relu : TLS local réel,
anonyme 401, authentifié 200, doublon 409, révoqué 401 et arrêté 503 ; un seul
parcours simulé pour cet essai d’accès. Le certificat auto-signé est accepté
uniquement dans le test local ; ne jamais reprendre ce réglage en déploiement.
La régression de l’interface passe avec cinq simulations, sans erreur navigateur,
requête distante ou débordement horizontal sur ordinateur/mobile. Les captures
ne sont pas réexaminées à ce jalon ; le dernier examen visuel détaillé reste celui
du jalon précédent. Artefact `avatar-browser-simulation`, rétention 14 jours.
Ces essais ne prouvent ni le fonctionnement du proxy Infomaniak, ni le réseau
institutionnel, ni une authentification ou connexion au moteur réelles.
Coût OpenAI API : 0 token / 0 $. Le quota Codex est distinct.

**Suite prévue à ce jalon historique :** préparer le serveur d’essai et les échanges
du navigateur sur une même origine, en simulation, avec page/modules/API protégés.
Cette réalisation est consignée au jalon suivant. Avant
activation distante : capacité et coût éventuel de l’offre Infomaniak, TLS et
proxy attestés, provisionnement/révocation hors dépôt, persistance, testeurs,
plafonds et délais. Le premier appel réel reste une autorisation distincte.
La démonstration publique `main` de l’avatar et le catalogue restent inchangés.

### Avatar : page et serveur privés en simulation — 18 octobre, reprise du soir

La branche d’essai contient la page privée et le serveur local au commit
`4a5d834ac665e555f520206c737a90f5cc4cc87a` (assemblage initial `f563ffc`).
Ils réutilisent le questionnaire,
l’accès individuel et l’affichage existants. Le
[mode d’emploi et ses limites](https://github.com/technologies-formation/a658-yg-avatar/blob/930a5ac9378684577d2854789918ee3e6f993a27/experimental-service/SERVEUR_PRIVE_SIMULATION.md)
conserve la procédure, les fichiers privés attendus et les contrôles.

- `pilot-server.mjs` sert page, modules autorisés et API sur une même origine HTTPS
  locale ; toutes ces ressources exigent l’identification. Aucun fichier de
  configuration, compte, secret, dépôt Git ou répertoire arbitraire n’est exposé.
- La page reprend les huit champs du contrat et propose seulement un parcours.
  Brouillon restauré, actualisation des choix sans perte des réponses, confirmation
  explicite et invalidation/annulation des réponses tardives sont conservés.
  Après erreur ou quota, aucun succès ni nouvelle demande automatique n’est annoncé.
- `pilot-simulation.mjs` ne charge ni la session ni l’adaptateur du moteur réel.
  Il fige le profil, relit le contrat local, valide, compte une simulation dans
  un fichier persistant et renvoie un aperçu de test explicitement configuré.
  Cet aperçu ne répond pas au profil et l’affichage le signale. La recherche Luna
  n’est pas activée dans cette page privée.
- Le lanceur exige une activation explicite et une configuration privée absolue :
  compte(s) avec empreinte scrypt, contrat, aperçu, compteur, clé/certificat TLS,
  quotas, limites d’authentification et instance unique. Il n’écoute que
  `127.0.0.1` ; aucune origine distante ni confiance implicite dans un proxy.
  Aucun fichier privé, compte réel ou certificat de confiance n’a été installé
  sur le PC de l’utilisateur ni sur Infomaniak.
- L’arrêt persiste le blocage du compteur : une simple relance ne réouvre pas
  une session arrêtée. Ne pas effacer un compteur sans décision explicite.

Les [99 tests Node](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39164462051)
réussissent localement et dans la CI. Le [contrôle Chromium](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39164462058)
réussit aussi et son rapport JSON a été relu : trois simulations privées acceptées,
une tentative refusée au quota, brouillon restauré, choix actualisé et aucun envoi
automatique au rechargement. Aucune erreur navigateur, requête distante ou
débordement horizontal à 1280 × 900 et 390 × 844. Le statut de réponse reste
visible et le récapitulatif mobile se replie après une réponse pour libérer l’espace.
Les cinq captures privées sont dans `avatar-browser-simulation`, rétention 14 jours ;
les trois captures finales du résultat ordinateur/mobile et du quota mobile ont
été examinées, sans problème bloquant observé. Les contrôles HTTPS d’accès et le
questionnaire simulé précédent passent aussi en régression. Pas de validation
Safari, appareils physiques, clavier tactile, certificat sur le PC, Infomaniak
ou réseau institutionnel. Aucun compte, certificat ou secret réel utilisé.
Aucun appel au moteur réel ni OpenAI : 0 token / 0 $. Quota Codex distinct.

**Prochaine étape :** préparer un essai utilisateur local avec compte, certificat
et configuration hors dépôt, ou vérifier la capacité et les coûts d’un site
Infomaniak distinct avant un déploiement séparé. Le serveur actuel est un lanceur
HTTPS local, pas une configuration compatible implicitement avec le proxy Infomaniak.
La connexion au moteur réel et le premier appel payant gardent leur validation dédiée.
La démonstration publique avatar, le catalogue et l’hébergement restent inchangés.

### Premier essai sur le PC Windows — 18 octobre, fin de soirée

Retours fournis par l’utilisateur : Node.js `v24.19.0`, Git installé et OpenSSL
présent dans `C:\Program Files\Git\usr\bin\openssl.exe`. Le dépôt déplacé
était au commit `3141233` sur `feat/avatar-interactive-local`, sans modification.
Le pull a récupéré les commits puis terminé en avance rapide jusqu’à `930a5ac`.
Pendant son nettoyage automatique, Git a demandé de retenter des suppressions de
dossiers `.git/objects/...` ; l’utilisateur a répondu `n` et la mise à jour a abouti.
La cause exacte n’est pas établie ; OneDrive est une hypothèse. Ne supprimer aucun
objet Git manuellement. Le `git fsck --connectivity-only` suivant ne signale aucune
erreur et le working tree reste propre. Ce contrôle est une vérification de
connectivité, pas une preuve exhaustive de chaque aspect du stockage.

Les **99 tests passent sur Windows**, aucun échec ni test ignoré, d’après le retour
complet fourni par l’utilisateur. OpenSSL est ajouté au PATH de cette session
PowerShell seulement ; aucune installation ou configuration globale n’est modifiée.
Ces essais restent hors ligne et n’appellent ni le moteur réel ni OpenAI.

Le module `setup-local-pilot.mjs`, préparé au commit
`df37a2da305ed61948b3e3524e40726a7d594fc6`, automatise la suite : création d’une
session privée distincte sous `%LOCALAPPDATA%\A658-YG\pilote-prive`, compte
aléatoire et empreinte scrypt, certificat HTTPS local non-CA valable 24 h et
configuration de cinq simulations. Les droits Windows du nouveau dossier sont
limités à l’utilisateur courant, SYSTEM et aux administrateurs. Un unique GET
public récupère le contrat de profil ; aucune destination de parcours réel n’est
configurée. Les données d’aperçu sont synthétiques et sans faux lien officiel ni
montant de consommation de test. Aucun certificat de confiance Windows n’est ajouté.

Les [contrôles CI](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39166441339)
du commit `c4054ec465fa2f5ddf27facd36056afed7ed4016` réussissent : 103 tests sous
Linux et les quatre nouveaux tests de mise en place sous Windows/Node 24. Le
[bilan de mise en place](https://github.com/technologies-formation/a658-yg-avatar/blob/995195a56bd0b687980ae359dcbacfdf308cb1f7/experimental-service/SERVEUR_PRIVE_SIMULATION.md)
conserve les preuves et les limites. Le premier test Windows a refusé le répertoire
temporaire du runner, extérieur au profil local ; le test a été corrigé pour
respecter la restriction. Aucun assouplissement du stockage privé n’est introduit.
Ce résultat ne confirme pas encore le provisionnement ou le GET public depuis le PC.

Le mot de passe est conservé uniquement dans `ACCES_LOCAL_PRIVE.txt`, dans le
nouveau dossier privé ; ne jamais en demander le contenu dans le chat. Le terminal
retourne seulement les chemins et n’affiche pas le mot de passe. Le script ne lance
pas le serveur. Un certificat auto-signé de test peut provoquer un avertissement
du navigateur sur l’adresse locale ; ne pas désactiver globalement la validation TLS.
Le provisionnement sur le PC reste **à confirmer** par le retour de cette commande :

```powershell
git -c gc.auto=0 -c maintenance.auto=false pull --ff-only
if ($LASTEXITCODE -eq 0) {
    node .\experimental-service\setup-local-pilot.mjs 'C:\Program Files\Git\usr\bin\openssl.exe'
}
```

Les deux options Git désactivent le nettoyage automatique pour ce pull seulement,
sans enregistrer de réglage dans le dépôt ou le profil. Chaque mise en place génère
une session distincte ; ne pas répéter la commande si elle est encore en cours.
**Prochaine étape concrète :** attendre les chemins de configuration et d’accès,
puis lancer le serveur local et effectuer un parcours fictif. Ne pas considérer un
compte, un certificat ou un serveur comme présents sur le PC sans le retour utilisateur.
Coût OpenAI API de la préparation : 0 token / 0 $. Quota Codex distinct.

### Validation du pilote privé sur le PC Windows — 19 octobre 2026

Le [bilan de cet essai](https://github.com/technologies-formation/a658-yg-avatar/blob/a2b4e2f82498f7e37b10a94eae8fe89f39bcea8a/experimental-service/SERVEUR_PRIVE_SIMULATION.md)
est versionné sur la branche interactive ; la mise à jour ne modifie que la documentation.

Le retour PowerShell confirme l’avance rapide de `930a5ac` à `995195a`, puis la
réussite de `setup-local-pilot.mjs` avec OpenSSL fourni par Git. Une session privée
a été créée sous `%LOCALAPPDATA%\A658-YG\pilote-prive`, hors dépôt et hors OneDrive.
Le lancement explicite de `pilot-server.mjs` confirme l’écoute HTTPS locale sur
`127.0.0.1:8799`. La préparation utilise le GET public des référentiels ; ce succès
ne constitue pas un appel au générateur de parcours.

L’utilisateur a ouvert `https://127.0.0.1:8799/private/`, accepté l’exception du
certificat auto-signé pour cette adresse locale et utilisé les identifiants du
fichier privé sur son PC. Aucun secret n’a été communiqué dans le chat ni versionné.
Aucun certificat de confiance Windows n’a été installé. L’ouverture initiale depuis
un lien a produit « Origine refusée » ; la saisie directe dans la barre d’adresse
a permis l’accès. Un contexte de navigation intersite est une hypothèse, pas un
diagnostic confirmé ; aucune protection d’origine n’a été assouplie.

Les captures examinées confirment :

- un questionnaire fictif complété, puis une confirmation explicite ;
- le résultat synthétique avec « Tentatives : 1/5 » ;
- après Ctrl+R, les réponses restaurées, le résultat retiré et une nouvelle
  confirmation demandée ;
- après cette seconde confirmation, « Tentatives : 2/5 ». Le rechargement n’a
  donc pas réservé de tentative supplémentaire dans cette séquence.

Ce contrôle est une validation fonctionnelle manuelle sur le poste, en complément
des 103 tests Linux et des quatre tests de mise en place Windows du jalon précédent.
Ce n’est ni un nouveau benchmark, ni une validation de pertinence métier : les
formations et durées de l’aperçu sont fixes, indépendantes du profil saisi.
Il ne prouve pas le fonctionnement sur le réseau institutionnel, un accès distant
ou un parcours réel. Coût OpenAI API : **0 token / 0 $** ; quota Codex distinct.

**Prochain jalon proposé : un premier parcours réel privé depuis le PC.**
Réutiliser la page, l’authentification, l’adaptateur et la session existants, avec
un mode réel explicite séparé du simulateur. Préparer et tester hors ligne le
lanceur avant toute activation. Conserver un état de quota privé distinct : ne pas
convertir ni remettre à zéro les cinq simulations de cette session. Aucun nouveau
site Infomaniak, déploiement public ou changement du moteur n’est requis par cette
proposition ; un accès distant demeure un périmètre séparé.

Avant le premier POST payant, obtenir l’accord explicite sur :

- un cas fictif de personnel administratif, sans données personnelles, objectif
  « Mieux organiser mes tâches administratives et mes priorités au quotidien » ;
- **une seule tentative réelle**, sans relance automatique ni nouvel essai après
  erreur ou expiration ;
- un délai client proposé de 200 secondes, dont la compatibilité reste à vérifier ;
- le relevé des tokens et du coût renvoyés par le moteur lorsqu’ils sont disponibles.

Le coût historique du contrôle du 18 octobre (0,02357005 USD) est un repère observé,
pas un devis ni un plafond. Un quota d’une tentative ne garantit pas un plafond
en dollars ; aucun montant ne doit être annoncé comme garanti. Un timeout client
ne garantit pas l’arrêt d’un traitement déjà engagé dans le backend.
À ce jalon documentaire, aucun lanceur réel n’a été ajouté ou activé et aucun
POST réel n’a été exécuté. Le serveur de simulation peut rester ouvert ; son arrêt
persiste un blocage de la session, il ne faut pas effacer le compteur pour le contourner.

### Préparation du premier parcours réel privé — 19 octobre 2026

L’utilisateur a validé explicitement le périmètre proposé : préparer et tester le
raccordement privé local, puis effectuer **une seule tentative réelle** avec un
profil fictif, sans relance automatique et avec relevé du coût. Cet accord est acquis ;
ne pas redemander un GO pour les étapes techniques de ce même essai.

Le code est publié sur `feat/avatar-interactive-local` au commit
`6b1dc30e7b95f7186a77d661ae393fc05c24a2d6`. La
[procédure du parcours réel privé](https://github.com/technologies-formation/a658-yg-avatar/blob/b22a2501705394e37485bdcac40b53c3a6db6783/experimental-service/ESSAI_REEL_PRIVE.md)
donne le profil et les commandes. Le lanceur `pilot-real-server.mjs` réutilise
les accès et le certificat locaux existants mais exige une activation explicite.
Il écoute sur `https://127.0.0.1:8800/private/`, séparément du simulateur sur 8799.
Il ne crée aucun hébergement et ne modifie ni le backend catalogue ni l’avatar public.

Le GET du référentiel et le POST du parcours sont transmis par le serveur local
aux routes connues de `https://api.a658yg-catalogue.ch`. Les identifiants locaux ne
sont jamais transmis au backend. Les contrôles d’identité, d’origine, de confirmation
et de révision sont conservés. Le délai POST est de 200 s, celui de la page de 210 s.
La compatibilité effective avec le proxy reste à constater lors de l’essai.

Le compteur privé `real-one-attempt-quotas.json`, dans la session existante, est
limité à un essai, distinct des simulations et conservé au redémarrage. Ne jamais
l’effacer, le réinitialiser ou créer une autre session pour répéter ce premier test.
Après succès, `real-one-attempt-report.json` conserve date, quota, codes des cours
et consommation renvoyée, sans profil ni secret. Un échec d’écriture du rapport ne
déclenche aucune relance et ne retire pas le résultat affiché. Une erreur/expiration
après réservation conserve la tentative ; son coût peut alors rester inconnu.

Les **108 tests Node passent localement**, tous avec transports moteur simulés.
Les [tests GitHub](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39227459028)
réussissent au commit `5be853a46bfa327aff78cbd78411c452087797e0` : 108 tests Linux
et neuf tests Windows/Node 24. Le
[contrôle Chromium](https://github.com/technologies-formation/a658-yg-avatar/actions/runs/39227458793)
réussit aussi, avec un transport moteur injecté exclusivement : un POST fictif
accepté, second essai refusé, brouillon restauré sans POST au rechargement,
aucune erreur navigateur, requête externe ou débordement horizontal aux formats
1280 × 900 et 390 × 844. Le simulateur privé antérieur passe en régression.
Rapport JSON et captures du résultat ordinateur, du brouillon mobile restauré et
du quota mobile examinés sans problème bloquant observé. Artefact
`avatar-browser-simulation`, rétention 14 jours. Le premier contrôle lisait le texte
visible dans le récapitulatif mobile replié ; la vérification a été corrigée pour
lire la donnée DOM, sans modifier ou assouplir le produit. Aucun contrôle n’a utilisé
le moteur réel. Safari, appareils mobiles physiques et réseau institutionnel non couverts.

**Point exact de reprise à la préparation :** le serveur réel n’est pas encore
lancé sur le PC, aucune tentative réelle n’est effectuée. Utiliser une nouvelle
fenêtre PowerShell sans arrêter le simulateur, récupérer le code et lancer le mode
réel avec le chemin de la configuration privée de la session déjà créée. Ouvrir
l’adresse 8800 directement, reprendre les mêmes identifiants et saisir le profil
fictif documenté. Le brouillon du port 8799 ne se transfère pas sur cette autre origine.
Après le seul clic de confirmation, attendre puis relever résultat, tokens et coût.
Coût OpenAI API de la préparation : **0 token / 0 $**. La validation métier du
résultat réel et sa consommation restent à constater par le retour utilisateur.

### Premier parcours réel reçu depuis l’avatar privé — 19 octobre 2026

**Jalon fonctionnel confirmé sur le PC utilisateur.** Le retour PowerShell atteste
la mise à jour jusqu’à `b22a250`, puis l’écoute locale sur le port 8800. Les captures
montrent le pilote réel, la génération après confirmation et le résultat avec
**Tentatives : 1/1**. Le texte intégral du résultat a ensuite été fourni dans le chat.
Le profil fictif est celui prévu : collaborateur administratif PAT, sans responsabilité
managériale, entité vide, objectif d’organisation des tâches et priorités au quotidien,
bases bureautiques, cinq jours disponibles, présentiel de préférence.

| Constat | Résultat reçu |
| --- | --- |
| Étapes recommandées | SEM0872 — Gestion du temps et des priorités ; TRT1011 — Outlook 365 Base |
| Compléments | SEM1113 — De quoi je m’e-mail? ; TRT1012 — Outlook 365 Avancé ; SEM1040 — Mindmap ; SEM1235 — GIDA |
| Durée affichée | 40 h disponibles ; 20 h recommandées ; 0 h de dépassement |
| Tokens renvoyés par le moteur | **91 448 en entrée ; 525 en sortie** |
| Coût calculé par le backend | **0,0234917 USD** pour ce seul essai |

La lecture qualitative du résultat fourni est cohérente pour ce cas : gestion du
temps en socle, application dans Outlook, compléments reliés à l’objectif et
alternatives expliquées. Outlook Avancé est conditionné à la maîtrise préalable
des bases ; le cours sur les e-mails est proposé en complément ciblé ou à la place
d’Outlook Base plutôt qu’en cumul systématique. Les 20 h ne comprennent pas tous
les compléments. Aucun ancien cours pédagogique ou judiciaire sans lien avec le
profil n’apparaît dans cette réponse. Les modalités, prérequis et possibilités
d’inscription restent à vérifier pour une utilisation réelle.

Ce constat valide un flux de bout en bout sur le PC et une cohérence qualitative
sur un cas, sans constituer un benchmark indépendant, une validation générale du
moteur, du réseau institutionnel ou d’un avatar distant. Le rapport JSON privé
n’a pas été lu séparément ; la preuve du résultat et du coût est la capture puis
le texte utilisateur, sans secret. La préparation avait coûté 0 token / 0 $ ; ce
premier appel réel est bien payant et sa consommation doit rester distincte.

**Point de reprise actuel :** essai unique consommé, aucun nouvel appel autorisé.
Ne pas effacer le compteur ni créer une nouvelle session pour répéter le test.
Le mode réel sur le PC utilise le port 8800 et la configuration privée existante ;
le simulateur demeure distinct sur 8799. Aucun déploiement distant de l’avatar,
fusion dans son `main` ou modification du moteur backend n’a eu lieu par cet essai.
Choisir le prochain périmètre avant une nouvelle dépense ou un déploiement.

### Prochain point de reprise

Ordre de travail confirmé avec l'utilisateur le 18 octobre 2026 :

1. **Fiabiliser les propositions annexes du parcours.** Le correctif documenté dans
   [Pertinence des propositions annexes](docs/PATHWAY_SUPPLEMENTARY_RELEVANCE_2026-10-18.md)
   supprime la promotion automatique d'un cours informatif en complément sur la seule
   absence de restriction détectée. Les consignes des deux passes exigent aussi la
   pertinence du sujet et du contexte. Les 356 tests, le lint et les deux builds
   passent localement, avec des transports simulés et sans appel OpenAI.
2. **Mise en service et premier contrôle réel effectués le 18 octobre.** Le seul
   fichier `server/pathwayEngine.mjs` issu de `55fadf0` a été sauvegardé puis remplacé
   sur Infomaniak, son SHA-256 vérifié et l'application redémarrée par l'utilisateur.
   Le health répond `ok=true`, synchronisation active et `lastError=null`.
   Le cas administratif observé a été rejoué via l'API : trois étapes principales,
   trois compléments cohérents et aucun cours informatif. Les anciennes propositions
   pédagogiques/judiciaires n'apparaissent plus dans cet essai. C'est un contrôle
   fonctionnel ciblé, pas une garantie générale ni une validation visuelle du navigateur.
   Le coût calculé par le backend est de 0,02357005 USD pour 91 627 tokens d'entrée
   et 553 de sortie. La réponse brute est conservée dans
   `reports/pathway-functional-check-2026-10-18.json`.
   Les autres fichiers Node, dont l'endpoint de référentiels, n'ont pas été déployés
   par cette opération. Le commit du catalogue renvoyé par le health n'est pas une
   preuve de la révision globale du code serveur.
3. **Avatar : alignement hors ligne réalisé le 18 octobre.** La branche existante
   `feat/avatar-interactive-local` contient le lecteur de référentiels et le mode
   de questionnaire à huit champs au commit `b11508ecc08a0934ff219c981f0697ecfe18b2f5`.
   Les 52 tests passent localement et dans la CI ; le contrôle croisé avec le
   document généré par le catalogue est compatible. Le contrôle Chromium sur
   ordinateur/mobile a ensuite réussi dans la CI ; les captures ont été examinées
   et le bilan documenté au commit `b19078f`.
   La démonstration publique sur `main` reste au jalon `07a9e09` ; l'adaptateur
   n'est pas connecté. Le relevé SSH et les contrôles HTTP ultérieurs confirment
   le référentiel déjà opérationnel sur Infomaniak ; voir le bilan ci-dessus.
   Le brouillon, l'actualisation et la confirmation ont ensuite été implémentés
   en simulation ; le cadrage du raccordement réel reste à réaliser.

Le dépassement d'heures n'est pas prioritaire et sa gestion reste inchangée.
**Renommage de l’hébergement effectué le 19 octobre 2026.** L’utilisateur a
enregistré le nom identifiant « A658-YG », « Catalogue et Avatar » à la place de
« Hébergement Web 2 ». La capture après sauvegarde confirme le nouveau libellé
dans le titre, le fil d’Ariane et la navigation du Manager. Ce point de suivi est
clos. Cette opération porte sur le nom de l’hébergement ; elle ne constitue pas
la création ou le déploiement d’un site avatar distant.

La vérification d’un site Node.js séparé pour le pilote distant est en cours.
La vue d’ensemble montrée le 19 octobre comporte « Ajouter un site » et un compteur
de sites 1/21. Ce compteur général ne confirme pas à lui seul la possibilité d’une
seconde application Node.js ni son prix. Examiner l’assistant d’ajout avant toute
création ou modification d’offre. Aucun nouveau site ou achat n’est constaté.

Le nettoyage éventuel d'Infomaniak est un sujet séparé : aucun inventaire précis
des éléments à supprimer ni décision de suppression n'a été retrouvé. Ne pas
assimiler les noms d'anciennes releases ou sauvegardes à une autorisation de les
effacer. Ce nettoyage ne doit pas être confondu avec le correctif du parcours.

Pour la phase avatar :

1. Relire les deux dépôts et la branche interactive, puis comparer les révisions
   aux repères ci-dessus et inspecter les éventuels changements intervenus depuis.
2. Le mode référencé conserve le brouillon après rechargement, actualise les
   choix sans perdre les réponses et exige une confirmation explicite en simulation.
   La page, le serveur HTTPS local, le rendu et l’accès individuel du petit pilote
   sont réalisés en simulation. L’essai utilisateur local est confirmé le 19 octobre,
   jusqu’à deux simulations avec restauration du brouillon entre les deux.
   Préparer le jalon réel privé décrit ci-dessus après accord sur son périmètre,
   ou vérifier l’hébergement distinct avant tout déploiement distant. Le moteur
   reste déconnecté et son premier appel nécessite une validation dédiée.
3. **Référentiel Infomaniak vérifié et opérationnel.** Les empreintes des cinq
   modules concernés, de leur dépendance `entities` et du moteur corrigé sont
   conformes ; les contrôles HTTP publics passent sans appel IA. Aucun remplacement
   supplémentaire n'est nécessaire à ce jalon. Préserver le moteur et le fichier
   privé de configuration. Le réseau institutionnel reste à vérifier séparément.
4. Avant tout essai réel, vérifier séparément le code effectivement déployé sur
   Infomaniak, la disponibilité HTTP du référentiel, les origines autorisées,
   le réseau institutionnel et le périmètre d'activation approuvé.

Ce point de reprise ne préjuge pas du choix d'un hébergement ni d'une date
d'industrialisation. Le suivi des usages, des coûts et de la stabilité du pilote
reste à consolider, comme indiqué dans les jalons antérieurs.

### Méthode et décisions à conserver

- Examiner les sources et les choix antérieurs avant toute nouvelle approche.
  Conserver les résultats officiels et distinguer fait vérifié, hypothèse et projet.
- En cas d'écart, privilégier la décision explicite récente de l'utilisateur, puis
  l'état réel vérifié, le guide de reprise récent et la documentation technique.
  Les présentations et souvenirs de conversation restent des sources secondaires.
- Présenter le périmètre avant une action importante ; si une validation préalable
  est demandée, attendre le GO, qui couvre uniquement ce périmètre.
- Favoriser l'évolution de l'existant, les opérations directes par les outils et
  des demandes simples à l'utilisateur. Ne pas lui déléguer une interprétation
  technique que le copilote peut prendre en charge.
- Typesense et MiniLM restent abandonnés pour l'architecture évaluée. Les mesures
  historiques et leurs limites sont détaillées plus bas ; ne pas réutiliser les
  corpus consommés comme nouvelle preuve indépendante.
- BMAD reste une piste d'amélioration conservée, sans installation ni remplacement
  automatique de la méthode actuelle. Un éventuel essai doit être cadré séparément,
  sur une branche dédiée et comparé au bénéfice et à la complexité de l'existant.
- Ne jamais présenter un commit, un test, un push ou un déploiement comme réussi
  sans preuve. Ne pas exposer de secret ; relever les tokens et le coût de tout
  appel API du projet lorsqu'ils sont disponibles.

#### Fonctionnement convenu : autonomie encadrée par jalons

Accord explicite de l'utilisateur le **18 octobre 2026**, à conserver lors d'une
reprise après perte des conversations. Ce nom décrit notre fonctionnement de
collaboration ; il ne désigne pas une méthode officielle ni une installation de BMAD.

Au début d'une nouvelle phase, le copilote propose : **« On avance en autonomie
encadrée par jalons ? Voici le périmètre que je prends en charge… »** Il précise
l'objectif, les actions prévues, les limites et les vérifications attendues.
Il recueille l'accord si ce périmètre n'est pas déjà autorisé. Un accord ou un GO
déjà donné reste valable pour la phase annoncée ; ne pas le redemander à chaque étape.

Dans ce périmètre, le copilote consulte les sources, réalise les actions techniques,
effectue les contrôles utiles, corrige les problèmes rencontrés et met à jour la
documentation. Il avance sans multiplier les questions ou les manipulations manuelles,
avec des points d'avancement courts : acquis, incertitudes et prochaine étape.
L'utilisateur pilote les objectifs et les décisions qui engagent la suite.

Si une décision manque, si une action dépasse le périmètre autorisé ou nécessite
l'accès personnel de l'utilisateur, le copilote revient vers lui en expliquant le
point précis à trancher. L'autonomie n'autorise pas implicitement une suppression,
une dépense ou un déploiement qui n'était pas compris dans l'accord.

À chaque jalon, distinguer ce qui est réalisé, testé, publié dans GitHub, déployé
et encore prévu. Conserver les preuves, les limites et le prochain point de reprise
dans ce guide afin de pouvoir continuer sans dépendre de l'historique des chats.
La copie conservée sur le PC doit être réactualisée à partir du guide versionné,
en gardant l'ancienne copie comme archive ; sa mise à jour locale ne peut pas être
déduite d'une mise à jour GitHub et reste à confirmer par l'utilisateur.

Les pièces de contexte fournies lors de cette reprise sont le comparatif des
trois projets du 1er septembre, l'historique technique du 12 septembre,
la valorisation économique du 13 septembre et les instructions permanentes.
Elles ne sont pas ajoutées au dépôt par cette mise à jour. Leurs dates et leurs
estimations ne décrivent pas automatiquement l'état actuel ; ne pas inventer
leur disponibilité lors d'une future conversation. Pour travailler sur un support
absent du dépôt ou de la conversation, demander la pièce correspondante.

## État de référence

- Projet : Catalogue de formations — Projet n°2, indépendant du Projet n°1.
- Branche principale du dépôt : `main`.
- Dépôt distant : [github.com/technologies-formation/catalogue-formations](https://github.com/technologies-formation/catalogue-formations).
- URL publique du frontend : [technologies-formation.github.io/catalogue-formations](https://technologies-formation.github.io/catalogue-formations/).
- URL publique du backend Luna et de l'assistant de parcours : `https://api.a658yg-catalogue.ch`.
- Snapshot versionné examiné le 18 octobre 2026 : 1 050 formations, daté du 16 octobre, selon `reports/catalogue-import-report.md`.
- Volumes historiques : 1 058 formations au 13 septembre ; 1 073 au contrôle du 7 octobre. Ces constats datés ne décrivent pas nécessairement le catalogue servi aujourd'hui.
- Pour la démonstration sur le réseau institutionnel, l'adresse documentée au 7 octobre reste `https://endch4cfkas.preview.hosting-ik.com`. Le domaine cible `https://catalogue.a658yg-catalogue.ch` doit être retesté sur ce réseau début novembre, comme prévu dans la section consacrée à Infomaniak.

### Jalon historique — Assistant de parcours V1

L'état stable de référence au 12 septembre 2026 est identifié par :

- tag Git : `pathway-assistant-v1-2026-09-12` ;
- commit : `266837ffa9a2b9e3a33ba000cf393897d4fb42ad` ;
- branche de référence : `main`.

Ce jalon comprend notamment :

- la recherche classique du catalogue et ses facettes ;
- la recherche enrichie avec GPT-5.6 Luna ;
- l'assistant de construction d'un parcours de formation ;
- la sélection et l'ordonnancement des formations par l'IA à partir du catalogue officiel ;
- la prise en compte de la catégorie de personnel, de l'entité, de la situation managériale, de la fonction, de l'objectif, des compétences, du temps disponible et des contraintes ;
- la distinction entre formations recommandées, compléments éventuels et formations proposées pour information ;
- le respect des restrictions de public et des limites connues du catalogue ;
- la prise en compte indicative du budget-temps sans suppression automatique d'une formation pertinente ;
- la validation explicite des champs obligatoires ;
- un état de chargement visible pendant la construction du parcours ;
- une interface différenciant clairement la recherche directe et le parcours guidé ;
- une identité visuelle propre à l'assistant de parcours ;
- une aide générale masquée par défaut et accessible depuis le bouton `Aide`.

Le correctif de référence maintenant les limites du parcours dans le périmètre réel du catalogue correspond au commit `f6ddda1`.

La validation du jalon comprend :

- 329 tests automatisés réussis ;
- aucune erreur ni aucun avertissement de lint ;
- un build Vite de production réussi ;
- une validation visuelle du frontend publié sur GitHub Pages ;
- une validation fonctionnelle des champs obligatoires, de l'état de chargement, de la génération des résultats et des actions de modification ou de fermeture.

### Évolution validée — Compléments et alternatives de format

L'évolution déployée en production le 13 septembre 2026 est identifiée par :

- commit de référence : `02b4612dd569f275830d88ca0ad3bb038ff69efa` ;
- branche de référence : `main` ;
- ancienne branche de travail : `feat/training-format-alternatives` ;
- backend Infomaniak et frontend GitHub Pages alignés sur cette révision.

Cette évolution harmonise la recherche IA et l'assistant de parcours :

- elle distingue les étapes nécessaires des compléments et des alternatives ;
- elle tient compte des préférences de modalité : e-learning, autonomie, présentiel ou hybride ;
- elle tient compte de la version du logiciel lorsqu'elle est précisée ;
- elle évite de cumuler automatiquement une formation généraliste et des modules couvrant le même socle ;
- elle fonctionne de manière générique pour Word, Excel, PowerPoint et les autres domaines présentant des offres comparables ;
- elle conserve les approfondissements spécialisés dans la rubrique `Compléments ou alternatives` lorsque le besoin ne les rend pas indispensables.

Cas de référence validés :

- besoin Word général : `TRT1015 — Word 365 Base` reste la recommandation principale et `TRT3003E` apparaît comme alternative e-learning ;
- besoin Word avec préférence e-learning en autonomie : `TRT3003E — Word 2016 : Fondamentaux au perfectionnement | E-LEARNING` devient la recommandation principale et Word 365 Base une alternative en présentiel ;
- besoin Excel avec préférence e-learning en autonomie : `TRT3000E — Excel 2016 : Fondamentaux au perfectionnement | E-LEARNING` devient la recommandation principale et Excel 365 Base une alternative en présentiel.

La validation comprend 332 tests automatisés réussis, un lint sans erreur ni avertissement, un build Vite réussi et un contrôle fonctionnel sur le site public. Le health public a confirmé `ok=true`, `openaiConfigured=true`, `pathwayAssistantEnabled=true`, la révision `02b4612`, 1 058 formations et `lastError=null`.

### Jalons historiques

- Connexion du frontend au backend public : commit `928ba5f`.
- Jalon fonctionnel Codespaces du 29 août 2026 : commit `e03d105`.
- Tag Codespaces historique : `search-llm-codespaces-v1-2026-08-29`.
- Ancienne branche de développement Luna : `feat/search-llm-recall-augmentation-2026-08-28`.
- Ancien jalon public du 20 août 2026 : `projet-2-public-v1.4-2026-08-20`.
- Le benchmark indépendant final Luna a été exécuté sur un snapshot de 1 058 formations.

Les jalons antérieurs restent conservés pour l'historique. Le tag `pathway-assistant-v1-2026-09-12` permet de retrouver la V1 initiale ; il ne contient pas les évolutions ultérieures. Pour poursuivre le développement courant, partir de la révision actuelle de `main` après vérification du dépôt. Un retour à un ancien tag est une opération explicite, pas la procédure normale de reprise.

Avant toute intervention, vérifier :

```powershell
git status
git branch --show-current
git log --oneline -5
```

### Reprise directe depuis GitHub

Le dépôt versionné est la source de vérité du code et du guide. Les supports de
présentation servent de contexte historique et ne remplacent pas son état actuel.

1. Lire `GUIDE_REPRISE.md`, les consignes applicables du dépôt et les documents liés.
2. Vérifier la tête de `main`, les branches et propositions de modification déjà
   ouvertes, puis les workflows associés à la révision concernée.
3. Avec un clone de travail, vérifier aussi la branche, les modifications locales et
   la synchronisation distante avant toute édition. Une lecture via le connecteur
   GitHub ne renseigne pas l'état du poste personnel ou d'un ancien Codespace.
4. Préparer une modification ciblée du guide sur une branche dédiée, depuis une
   révision connue. Contrôler le diff et proposer la fusion dans GitHub.
5. Vérifier de nouveau `main` avant la fusion : le workflow quotidien peut publier
   un nouveau catalogue pendant le travail.

Un changement du guide ne justifie pas un appel OpenAI ou une nouvelle mesure de
pertinence. Toute évolution du code, fusion ou mise en production doit conserver
un périmètre explicite. Un push sur `main` déclenche actuellement le workflow Pages,
y compris pour une modification documentaire ; le backend Infomaniak suit sa
procédure séparée.

## Environnement local

L’environnement de référence est Visual Studio Code avec un terminal PowerShell intégré. Utiliser `npm.cmd`, et non `npm`, lorsque la politique PowerShell bloque `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd run dev
```

La base technique utilise React et Vite 8.2.1. Le chemin Vite est `/catalogue-formations/`.

## Architecture fonctionnelle

### Recherche classique, rappel lexical et facettes Cours

Le moteur de recherche local est défini dans `src/domain/courseSearch.js`.

Il expose désormais deux usages distincts :

- `searchCourses(courses, query)` : recherche classique visible par l'utilisateur ;
- `searchCourseCandidates(courses, query)` : rappel lexical élargi utilisé pour compléter les candidats de Luna.

#### Recherche classique

Une requête vide retourne le catalogue dans son ordre d'entrée.

Lorsqu'une recherche est active, le moteur classe les formations selon leur pertinence en combinant notamment :

- pondération des champs ;
- IDF ;
- couverture des termes significatifs ;
- preuves minimales ;
- expressions précises dans certains champs ;
- normalisation linguistique limitée.

La recherche classique utilise principalement :

- code ;
- `titleRaw` ;
- `domainRaw` ;
- `themeRaw` ;
- `publicRaw` ;
- `targetAudienceRaw` ;
- `catalogueOffers`.

Les objectifs peuvent également fournir une preuve contrôlée lorsqu'une expression suffisamment précise y correspond. Le contenu détaillé des formations n'est volontairement pas ajouté massivement à la recherche classique afin de limiter le bruit lexical.

Des adaptations ciblées ont notamment été ajoutées pour :

- neutraliser certains mots conversationnels peu informatifs ;
- mieux gérer les pluriels ;
- conserver certaines équivalences métier utiles ;
- reconnaître des formulations de niveau débutant comme `je débute`, `débutant` ou `je commence` et les rapprocher de `Base` ou `Fondamentaux`.

Ces adaptations doivent rester limitées à des besoins observés. Ne pas enrichir automatiquement le dictionnaire à partir de quelques formulations artificielles.

#### Rappel lexical pour Luna

`searchCourseCandidates()` utilise une représentation plus riche que la recherche classique.

Elle ajoute notamment :

- `objectivesRaw` avec un poids réduit ;
- `contentRaw` avec un poids réduit.

Cette fonction produit actuellement un **Top 40 local** qui est fusionné avec les candidats de la première passe Luna.

Son rôle est d'améliorer le rappel avant la sélection finale du LLM. Ses résultats ne doivent pas être présentés directement comme recommandations utilisateur.

#### Tri de la recherche

Sans texte de recherche, les tris habituels restent disponibles :

- Intitulé A-Z ;
- Intitulé Z-A ;
- Code A-Z ;
- Code Z-A.

Avec une recherche classique active :

- **Pertinence** est le classement par défaut ;
- l'utilisateur peut néanmoins choisir les tris par intitulé ou code.

Avec une recherche Luna active :

- l'ordre retourné par Luna est conservé ;
- l'interface affiche `Classement : pertinence IA`.

Appuyer sur **Entrée** dans le champ de recherche ne déclenche pas Luna. L'utilisateur doit cliquer explicitement sur **Booster ma recherche avec l'IA**, afin d'éviter les appels API involontaires et les coûts associés.

#### Facettes Cours

L'application propose cinq facettes multi-sélection :

1. Offre de formation ;
2. Entité de formation ;
3. Domaine ;
4. Thème ;
5. Public.

Les valeurs d'une même facette sont combinées par OU ; les facettes sont combinées par ET.

Domaine devient disponible après sélection d'une offre ou d'une entité. Thème dépend ensuite d'un domaine et tient compte du Public sélectionné.

La pagination affiche 20 résultats par page pour la navigation classique.

Dans `App.jsx`, la liste issue du mode de recherche actif devient la source de vérité pour les facettes, leurs compteurs, les Sessions et l'affichage.

Le champ `publicRaw` alimente la valeur structurée Public et sa facette. Une valeur vide devient **Non renseigné**.

`targetAudienceRaw` correspond au texte libre **Public visé** affiché sur la carte ; il ne doit pas être confondu avec la facette Public.

### Recherche IA — GPT-5.6 Luna

La recherche IA utilise `gpt-5.6-luna` via le backend Node :

- `server/searchApi.mjs` : API HTTP et validation ;
- `server/llmSearch.mjs` : recherche Luna en deux passes.

L'utilisateur doit cliquer explicitement sur **Booster ma recherche avec l'IA**. La touche Entrée ne déclenche aucun appel OpenAI.

#### Architecture

1. Luna analyse le snapshot courant du catalogue sous forme compacte (1 061 formations au 1er septembre 2026) et sélectionne jusqu'à 40 candidats.
2. `searchCourseCandidates()` produit en parallèle un Top 40 lexical.
3. Les deux listes sont fusionnées et dédupliquées.
4. Luna analyse les fiches détaillées de l'union.
5. Elle recommande des formations ou décide de s'abstenir.

Les codes autorisés sont contraints aux codes présents dans le catalogue officiel.

#### Résultats

La deuxième passe distingue :

- `recommendedCodes` : 1 à 3 formations répondant directement au besoin ;
- `complementaryCodes` : 0 à 3 formations apportant un complément utile ;
- `relatedCodes` : 0 à 3 formations proches du sujet, uniquement en cas d'abstention.

Les `relatedCodes` ne sont jamais intégrés aux résultats principaux.

Si aucune formation n'est suffisamment pertinente, Luna retourne `abstain = true`. L'interface affiche alors zéro résultat principal et peut présenter séparément des **Formations proches du sujet**.

Les essais récents sur les restrictions de public, les demandes multi-intentions, la présentation orale et l'abstention sont des tests fonctionnels. Ils ne constituent pas une validation indépendante.

### Référentiels du profil de parcours — jalon du 18 octobre 2026

La centralisation est intégrée à `main` par `bbc7ed98138c998684bdab350b898b0dc4b56666`.
Le [contrat HTTP v1](docs/PROFILE_REFERENCES.md) décrit le format et ses limites.
Sa mention initiale « développement local, non publié, non déployé » décrit
l'état de préparation ; la publication GitHub et Pages est maintenant vérifiée.
Ces preuves GitHub ne suffisaient pas à établir sa mise en service Infomaniak.
Le relevé SSH et les contrôles HTTP du 18 octobre à 15:38 UTC la confirment
désormais, comme détaillé dans le bilan de vérification ci-dessus.

- `src/config/pathwayProfile.js` définit les huit champs, options et contraintes
  partagés par le formulaire, le validateur HTTP et l'endpoint.
- `server/profileReferences.mjs` expose `GET /api/profile-references`, sans appel IA,
  sans accès au catalogue et indépendamment de la clé OpenAI et du drapeau du parcours.
- Le format porte `schemaVersion: 1`, une révision SHA-256 et le périmètre `pathway`.
  L'ETag et `If-None-Match` permettent les réponses 200/304.
- Les suggestions d'entités viennent de `src/config/entities.js`. Une entité libre
  reste acceptée ; les suggestions ne constituent pas une liste blanche exhaustive.
- Les catégories du parcours restent `PAT`, `PE`, `PU Police`, `PU Prison`, `PJ`.
  Aucune conversion vers les catégories internes de ciblage n'est introduite.
- Le formulaire exige la catégorie de personnel, le rôle et l'objectif.
  L'API exige le rôle et l'objectif, conserve des chaînes libres et n'impose pas
  les listes d'options comme valeurs fermées.
- Cette évolution ne raccorde pas l'avatar et n'ajoute aucun déclenchement de recherche
  ou de construction de parcours. Le lecteur avatar, la gestion d'un référentiel
  obsolète et la validation sur le réseau institutionnel restent des étapes distinctes.

Validation locale consignée dans le contrat le 18 octobre : **352 tests réussis**,
dont 14 nouveaux, lint, `git diff --check`, build standard et build `self-hosted`
réussis, sans connexion externe ni clé OpenAI. Le rendu du formulaire a été testé
côté serveur, sans validation dans un navigateur réel. Ces résultats sont ceux
du contrôle documenté, pas une nouvelle exécution pendant la reprise du guide.
Le workflow Pages de `bbc7ed9` confirme séparément la réussite de ses étapes
tests, lint et build standard ; il ne valide pas le build `self-hosted`
ni le déploiement Node Infomaniak.

### Disponibilité des sessions

Les Sessions forment un bloc séparé des cinq facettes Cours :

- **Inscriptions ouvertes** correspond à `hasOpenSession` ;
- **Ouverture programmée** correspond à `hasScheduledSession`.

Les deux booléens sont indépendants et peuvent être vrais simultanément. Une sélection Sessions est utilisable avec un critère Cours actif. La recherche texte seule ne constitue pas un critère permettant d’activer les filtres Sessions. Quand le dernier critère Cours est supprimé, les sélections Sessions sont également supprimées.

### URL partageables

Les paramètres `q`, `offer`, `entity`, `domain`, `theme`, `public` et `sort` sont sérialisés dans l’URL. La pagination ne l’est pas. Aucun paramètre « pertinence » n’est ajouté.

Les Sessions sont volontairement exclues des URL partageables. Leur état est dynamique et peut évoluer quotidiennement ; persister ce filtre pourrait donner un résultat différent ou trompeur lors d’une consultation ultérieure.

## Données et artefacts

| Artefact | Rôle | Versionné |
| --- | --- | --- |
| `src/data/officialCatalogueSnapshot.json` | Dernier snapshot officiel promu et utilisé par l’application | Oui |
| `reports/officialCatalogueSnapshot.candidate.json` | Candidat produit par l’import | Non, ignoré par Git |
| `reports/catalogue-import-report.candidate.md` | Rapport du candidat, différentiel et contrôles | Non, ignoré par Git |
| `reports/catalogue-import-report.md` | Rapport correspondant au dernier snapshot promu | Oui |
| `src/data/officialCourseSamples.js` | Références métier et ciblages validés | Oui |

Le candidat et le rapport candidat partagent une date de snapshot. Une empreinte SHA-256 lie le JSON candidat au rapport et est revérifiée lors de la promotion.

`reports/catalogue-import-report.md` est généré automatiquement : il ne doit pas être corrigé manuellement. Il reflète le dernier snapshot effectivement promu et comprend la surveillance des 24 références validées.

## Import sécurisé

La chaîne locale et automatisée suit les étapes suivantes :

1. lire l’index officiel et dédupliquer les cours présents dans plusieurs offres ;
2. récupérer et analyser chaque fiche ;
3. produire le snapshot et le rapport candidats dans `reports/` ;
4. vérifier la structure, les codes uniques, les offres, les dates, les statuts de récupération et l’empreinte SHA-256 ;
5. comparer le candidat au snapshot officiel ;
6. exécuter tests, lint, build et `git diff --check` ;
7. promouvoir uniquement le candidat validé ;
8. revérifier le contenu écrit.

La promotion sauvegarde en mémoire les deux fichiers officiels précédents et les restaure si l’écriture ou la vérification échoue. La dernière version valide est donc protégée.

Commandes utiles :

```powershell
npm.cmd run import:catalogue
npm.cmd run promote:catalogue -- --confirm-date AAAA-MM-JJ
```

Ne jamais promouvoir un candidat sans examiner son rapport et confirmer sa date.

## Automatisation quotidienne

Le workflow `.github/workflows/update-catalogue.yml` est planifié à **05:07 Europe/Zurich** et accepte aussi un lancement manuel. Le lancement manuel utilise par défaut `dry_run: true`, donc sans promotion, commit, push ni déploiement.

### Job `validate`

- importe le candidat ;
- valide le candidat et détermine s’il existe un changement ;
- exécute tests, lint, build et diff-check ;
- publie les artefacts candidats pour les jobs suivants.

### Job `publish`

Il s’exécute seulement si un changement existe et si le lancement autorise une publication. Il :

- télécharge les artefacts validés ;
- promeut le snapshot et le rapport ;
- réexécute tests, lint, build et diff-check ;
- limite le commit automatique à `officialCatalogueSnapshot.json` et `catalogue-import-report.md` ;
- pousse le commit sur `main` ;
- déploie le build validé sur GitHub Pages.

Un échec des tests ou d’un autre contrôle empêche d’atteindre le commit et le push automatiques.

### Job `notify`

Le courriel joint le rapport candidat lorsqu’il existe et utilise trois statuts :

- `SUCCESS` : traitement réussi avec des changements ; si une publication était autorisée, elle a réussi ;
- `NO_CHANGE` : aucun changement du catalogue ;
- `ALERT` : validation, publication ou autre étape technique en échec.

Une revue métier présente dans le rapport reste mentionnée dans les courriels `SUCCESS` et `NO_CHANGE`. Elle ne transforme pas le statut en `ALERT`.

## Deux chemins de déploiement

Le chemin dépend de l’origine de la modification :

### Push direct ou humain sur `main`

`.github/workflows/deploy.yml` installe les dépendances, exécute les tests et le lint, construit l’application, prépare le catalogue publié, déploie `dist` sur GitHub Pages et contrôle la disponibilité de l’URL publique.

### Mise à jour automatique du catalogue

`.github/workflows/update-catalogue.yml` valide et promeut les données, crée et pousse le commit automatique, puis effectue lui-même le déploiement du build validé.

Le push automatique utilise le `GITHUB_TOKEN` du workflow. Les événements produits avec ce jeton ne redéclenchent normalement pas un autre workflow fondé sur l’événement `push`. Il s’agit donc de deux chemins selon l’origine de la modification, et non de deux déploiements automatiques simultanés.

## Extraction et évolution des Sessions

Dans la table « Liste des sessions » de chaque fiche officielle :

- `icon_vert.png` produit `hasOpenSession: true` ;
- `icon_timer.png` produit `hasScheduledSession: true`.

L’absence d’une icône produit `false` pour le booléen correspondant. Plusieurs occurrences et la coexistence des deux icônes sont prises en charge. Les statuts sont recalculés à chaque import et leurs changements apparaissent dans le différentiel métier.

## Ciblage métier

Chaque référence validée peut contenir :

- `targeting.targets` : liste des couples `{ category, entity }` autorisés ;
- `targeting.targetingSource` : provenance de la décision (`public`, `publicDetail` ou `explicit`) ;
- `normalizationStatus` : état de validation du ciblage.

`normalizationStatus: 'validated'` avec un objet `targeting` rend le ciblage utilisable. `needsReview` indique qu’aucun ciblage métier validé n’est disponible. Un cours `needsReview` reste présent et recherchable par les critères qui n’exigent pas de ciblage validé, notamment code, intitulé, organisateur ou domaine ; il est exclu d’une sélection qui exige une catégorie ou une appartenance métier.

Le référentiel métier documenté lors du contrôle du 20 août 2026 comportait **24 ciblages validés**. Parmi eux, 22 références étaient présentes et 2 absentes ; ce constat est daté et ne constitue pas une constante métier.

## Surveillance 24/24 et robustesse

Les 24 références surveillées sont dérivées directement de `officialCourseSamples` : aucune seconde liste de codes n’est maintenue. Les champs comparés sont `titleRaw`, `organizingEntityRaw`, `publicRaw`, `targetAudienceRaw` et `domainRaw`, après trim et normalisation des espaces et retours de ligne.

Les écarts sont classés ainsi :

- `REVUE MÉTIER PRIORITAIRE` pour un Public modifié ou supprimé ;
- `REVUE MÉTIER` pour une entité organisatrice différente ;
- `INFORMATION À EXAMINER` pour le Public visé ;
- `ÉVOLUTION CONTEXTUELLE` pour le titre ou le domaine ;
- `ENRICHISSEMENT` pour `null` vers une valeur ;
- `RÉFÉRENCE ABSENTE` si le cours validé n’est plus dans le candidat ;
- `DIFFÉRENCE TYPOGRAPHIQUE` pour une variation de casse seulement.

Ces signaux sont non bloquants et ne modifient jamais automatiquement `targeting`, `targetingSource` ou `normalizationStatus`. Ils ne déclenchent pas automatiquement `needsReview`. Seules les anomalies techniques bloquent la validation ou la publication.

Les tests de robustesse évitent désormais de dépendre d’une volumétrie métier fixe. Les tests structurels contrôlent les invariants ; les scénarios synthétiques couvrent les comportements ; les références validées sont contrôlées séparément du catalogue vivant.

## Validation historique de V1.2 — 20 août 2026

Le 20 août 2026, la recherche V1.2 a été validée sur l’application publique avec les contrôles manuels suivants :

- « prise de parole » : OK ;
- « tableur » : OK ;
- « IA » : OK ;
- effacement de la recherche : retour aux 1 056 formations, OK.

Lors de cette validation, les 272 tests techniques réussissaient, ainsi que le lint et le build. Le nombre de tests est un constat daté et non une constante future.

## Historique des moteurs de recherche évalués

Un benchmark de décision de 30 requêtes a servi à comparer plusieurs approches.

| Approche | Meilleur score observé |
| --- | ---: |
| V1.2 au moment du benchmark | 5/30 |
| Typesense lexical | 0/30 |
| Typesense sémantique | 9/30 |
| Typesense hybride | 6/30 |
| MiniLM SAME | 10/30 |
| MiniLM ENRICHED | 9/30 |
| GPT-5.6 Luna deux passes | **26/30** |

Le score V1.2 de 5/30 correspond à l'état du moteur au moment de ce benchmark. La recherche classique a été améliorée depuis ; ce score ne doit donc pas être présenté comme une mesure de sa qualité actuelle.

### Typesense

Typesense a été testé en modes lexical, sémantique et hybride.

Le meilleur résultat brut a été obtenu en sémantique avec **9/30**. L'ajout de seuils permettant de mieux gérer les abstentions a fortement dégradé la récupération des requêtes positives.

Décision : **STOP Typesense pour l'architecture testée.**

Rapport : `reports/typesense-decision-benchmark-2026-08-26.md`

### MiniLM

MiniLM a ensuite été testé avec une représentation identique au corpus précédent puis avec des contenus enrichis.

Le meilleur score observé a été **10/30** avec MiniLM SAME brut.

L'enrichissement des fiches n'a pas apporté de gain et les seuils d'abstention réduisaient fortement la qualité sur les requêtes naturelles et multi-intentions.

Décision : **STOP MiniLM et les moteurs vectoriels classiques comme moteur principal.**

Rapport : `reports/minilm-enriched-decision-2026-08-26.md`

### GPT-5.6 Luna

#### Benchmark historique de développement

L'approche LLM contrainte par les codes officiels du catalogue avait obtenu :

**26/30 = 86,7 %**

Détail :

- natural positive : 13/14 ;
- multi-intent : 2/5 ;
- context restriction : 6/6 ;
- abstention : 5/5.

Coût total observé sur ces 30 recherches : **0,6270 USD**, soit **0,0209 USD par recherche** en moyenne.

Ce benchmark a ensuite servi au diagnostic et à l'amélioration du rappel. Il est donc **consommé** et doit être présenté comme un résultat historique de développement.

#### Benchmark indépendant final — 30 août 2026

Un nouveau jeu de **40 requêtes indépendantes** a été constitué avec les réponses attendues définies avant toute exécution Luna, puis gelé et versionné avant le premier appel au modèle.

Résultat strict :

**37/40 = 92,5 %**

Détail :

- natural positive : **18/18 — 100 %** ;
- multi-intent : **6/8 — 75 %** ;
- context restriction : **6/7 — 85,7 %** ;
- abstention : **7/7 — 100 %**.

Coût total observé : **0,945976 USD**, soit environ **0,02365 USD par recherche**.

La revue métier des trois échecs stricts a montré :

- un cas TSA dont la formulation était ambiguë sur l'âge et pour lequel plusieurs formations alternatives étaient légitimes ;
- deux cas liés aux magistrats où Luna a proposé des formations fonctionnellement équivalentes ou plus adaptées aux formulations utilisées ;
- aucun défaut fonctionnel majeur de l'architecture Luna n'a été identifié sur cette campagne.

Le score officiel reste néanmoins **37/40 (92,5 %)** : la revue qualitative complète l'interprétation sans modifier a posteriori le benchmark gelé.

Traçabilité :

- benchmark gelé : tag `search-benchmark-independent-final-2026-08-29` ;
- résultat brut : commit `e0af8a4` ;
- tag résultat : `search-luna-independent-result-2026-08-30` ;
- SHA-256 du rapport brut : `cb376b3ca244f0f2b37a84f9d325d6e3aa4190fd72429817f6f0cd510776b889`.

Décision au 30 août 2026 : **GO vers la préparation d'un pilote / d'un déploiement sécurisé**, sans retoucher Luna sur la base de ces trois écarts.

Ce benchmark est désormais **consommé** pour tout futur réglage. Il reste utilisable comme test de régression, mais un nouveau jeu indépendant sera nécessaire pour mesurer objectivement une future version modifiée du moteur.

Rapports :

- `reports/llm-two-pass-decision-2026-08-27.md`
- `reports/llm-recall-augmentation-decision-2026-08-28.md`

## Maintenance de la recherche classique

- Ne pas enrichir le dictionnaire par réflexe : ajouter un synonyme seulement lorsqu’un besoin utilisateur démontré le justifie.
- Ne pas recalibrer quotidiennement les poids ou seuils ; les petites évolutions quotidiennes du catalogue sont supportées.
- Réévaluer le moteur seulement en cas d’évolution importante du catalogue ou de ses champs, ou lorsque des problèmes utilisateurs observés le justifient.

### Audit métier historique du 20 août 2026

Les résultats ci-dessous concernent l'état de la recherche classique à cette date, avant les améliorations réalisées fin août et avant l'intégration de Luna.

Un audit de 50 recherches représentatives a mesuré 28 résultats `BON` (56 %), 11 `ACCEPTABLE` (22 %), 3 `MAUVAIS` (6 %) et 8 `AUCUN` (16 %). L’examen métier des cas en échec a montré que six recherches sans résultat étaient de bonnes abstentions, car aucune formation réellement pertinente n’existait dans le catalogue. Quatre lacunes lexicales ou métier réelles et un cas de bruit lexical ont été identifiés.

Le comportement considéré comme correct lors de cet audit était donc de **45 recherches sur 50, soit 90 %**. Ce taux comprend les recherches pertinentes retrouvées et les bonnes abstentions lorsque le catalogue ne contient réellement aucune réponse adaptée. Il s’agit d’un constat daté, et non d’une garantie permanente du moteur.

Trois corrections lexicales ont ensuite été expérimentées temporairement :

- « accueillir un nouveau collaborateur » vers `DIP-002` ;
- « écrire un courrier professionnel » vers `SEM1033` ;
- « développement durable » vers `SEM-10647`.

Sur les formulations ayant servi à concevoir ces règles, le taux utilisable apparent passait de 78 % à 84 % et le comportement correct de 90 % à 96 %. Un hold-out indépendant, composé de formulations nouvelles, n’a toutefois obtenu qu’une paraphrase réussie sur cinq pour l’accueil, une sur cinq pour le courrier professionnel et deux sur cinq pour le développement durable. Les contrôles négatifs n’ont pas révélé de nouveau bruit important et les 47 autres requêtes historiques sont restées inchangées, mais aucune règle n’a atteint le niveau minimal de généralisation attendu.

La décision prise à cette date a été de **ne pas intégrer ces trois corrections lexicales expérimentales**. Leur gain apparent dépendait trop des formulations utilisées pour les concevoir. Enrichir artificiellement le dictionnaire dans ces conditions complexifierait la maintenance, risquerait d’introduire du bruit et suradapterait le moteur aux tests sans démontrer un bénéfice général pour les utilisateurs.

Les futures adaptations doivent être fondées prioritairement sur des recherches réellement effectuées par les utilisateurs, des échecs récurrents observés et des besoins métier démontrés, puis validées sur un jeu de tests indépendant avant intégration. Ne pas enrichir le moteur à partir de quelques exemples fabriqués. Aucune solution technique de suivi des utilisateurs ou d’analytics n’est décidée à ce stade ; ce sujet doit être étudié séparément.

## Coûts OpenAI

Pour chaque test utilisant Luna, relever les tokens d’entrée, les tokens de sortie, les tokens lus et écrits dans le cache ainsi que le coût total en USD.

Benchmark historique Luna : **0,6270 USD pour 30 recherches**, soit **0,0209 USD par recherche** en moyenne.

Benchmark indépendant final du 30 août 2026 : **0,945976 USD pour 40 recherches**, soit environ **0,02365 USD par recherche** en moyenne.

Usage total du benchmark final :
- input : **4 071 094 tokens** ;
- output : **7 182 tokens** ;
- lus depuis le cache : **349 580 tokens** ;
- écrits dans le cache : **3 721 274 tokens**.

Avec un cache chaud, certains appels observés pendant le développement sont descendus autour de **0,003 à 0,004 USD**.

Exemple observé : 88 382 tokens d’entrée, 99 tokens de sortie, 81 800 tokens lus depuis le cache, 6 576 écrits dans le cache, pour **0,00340000 USD**.

Les coûts varient selon l’état du cache, la taille de l’union des candidats et la deuxième passe. Les tarifs OpenAI doivent être revérifiés avant toute estimation budgétaire de production.

## Reprise dans Codespaces

Pour relancer l’environnement de développement :

- backend Luna : `nohup npm start > /tmp/catalogue-api.log 2>&1 &`
- contrôle backend : `curl -s http://localhost:8787/api/health`
- logs backend : `tail -n 50 /tmp/catalogue-api.log`
- frontend Vite : `nohup npm run dev -- --host 0.0.0.0 > /tmp/catalogue-vite.log 2>&1 &`
- URL habituelle : `http://localhost:5173/catalogue-formations/`

Après modification de `server/searchApi.mjs` ou `server/llmSearch.mjs`, redémarrer le backend Node.

Le backend Luna dispose du script `npm start`, qui lance `node server/searchApi.mjs`.

## Principe de décision du projet

Avant de valider une orientation importante, examiner explicitement :

- le bénéfice attendu ;
- les limites ;
- les risques et effets de bord ;
- les alternatives ;
- la complexité ;
- la maintenance ;
- la cohérence métier ;
- la cohérence avec l’architecture existante.

Ne pas implémenter une fonctionnalité uniquement parce qu’elle est techniquement possible. À bénéfice comparable, préférer systématiquement la solution la plus simple à utiliser et à maintenir.

## Backend Luna, sécurité et déploiement

### Backend Node

Le backend de recherche IA repose sur :

- `server/searchApi.mjs` : serveur HTTP et validation des requêtes ;
- `server/llmSearch.mjs` : logique Luna, rappel lexical et sélection finale.

Le port local par défaut est `8787`.

Endpoints :

- `GET /api/health`
- `GET /api/catalogue`
- `GET /api/profile-references` : présent dans le code depuis `bbc7ed9` ; disponibilité Infomaniak vérifiée le 18 octobre (200/304 et CORS).
- `POST /api/search`
- `POST /api/pathway`

Le frontend Vite utilise un proxy local `/api` vers ce serveur.

### Protections déjà en place

Le backend applique actuellement, en développement comme sur le pilote public :

- JSON invalide : HTTP `400` ;
- `query` absente ou de mauvais type : HTTP `400` ;
- requête supérieure à 1 000 caractères : HTTP `422` ;
- body supérieur à 16 000 caractères : HTTP `413` ;
- mauvaise méthode HTTP : `405` avec en-tête `Allow` ;
- route inconnue : HTTP `404` ;
- erreur interne ou OpenAI : HTTP `500` ;
- réponses JSON des routes de recherche avec `Cache-Control: no-store` ; le référentiel de profil utilise son contrat spécifique de revalidation (`public, max-age=0, must-revalidate` et ETag).

Les erreurs techniques détaillées restent dans les logs serveur et ne sont pas renvoyées telles quelles au navigateur.

### GitHub Pages et clé OpenAI

GitHub Pages héberge uniquement du contenu statique.

La clé `OPENAI_API_KEY` ne doit donc jamais être placée :

- dans React ;
- dans une variable Vite exposée au navigateur ;
- dans Git ;
- dans GitHub Pages ;
- dans une documentation publique.

Dans Codespaces, la clé est fournie comme secret GitHub.

L'architecture publique conserve un backend séparé entre le navigateur et OpenAI. Le frontend GitHub Pages communique avec `https://api.a658yg-catalogue.ch` via `VITE_SEARCH_API_BASE_URL`.

### Variante de même origine pour les réseaux institutionnels

Le 5 octobre 2026, un réseau Wi-Fi institutionnel a laissé fonctionner `GET /api/health` mais a provoqué `Failed to fetch` sur les appels IA interdomaines. Les mêmes scénarios ont fonctionné sur un autre réseau. Le diagnostic le plus probable est un filtrage du précontrôle CORS `OPTIONS` ou des `POST` interdomaines.

La branche `feat/same-origin-infomaniak`, fusionnée dans `main` le 7 octobre 2026 par la pull request `#1` (commit de fusion `03b8950`), fournit une variante sans ce point de dépendance :

- `npm run build:self-hosted` construit le frontend pour la racine `/` ;
- le serveur Node sert les fichiers de `dist` sans modifier les routes `/api` ;
- les appels IA utilisent `/api/search` et `/api/pathway` sur la même origine ;
- `GET /api/catalogue` fournit au frontend le catalogue courant déjà synchronisé par le backend ;
- le snapshot intégré au build reste le repli si le chargement dynamique échoue ;
- le build GitHub Pages par défaut reste inchangé.

Cette variante est déployée sur le même site Node.js Infomaniak avec la commande de build `npm ci && npm run build:self-hosted`. Elle a été validée depuis le Wi-Fi institutionnel sur l'adresse temporaire `https://endch4cfkas.preview.hosting-ik.com`, y compris avec une recherche IA réelle.

Adresses au 7 octobre 2026 :

- démonstration immédiate sur le réseau institutionnel : `https://endch4cfkas.preview.hosting-ik.com` ;
- future adresse publique : `https://catalogue.a658yg-catalogue.ch` ;
- adresse historique du backend, qui sert également le frontend : `https://api.a658yg-catalogue.ch` ;
- frontend GitHub Pages conservé : `https://technologies-formation.github.io/catalogue-formations/`.

Les deux domaines personnalisés Infomaniak sont techniquement opérationnels et couverts par le certificat Let's Encrypt. Le filtre du réseau institutionnel les classe toutefois temporairement dans `Newly Observed Domain`. Ils doivent être retestés début novembre 2026. Tant que cette classification subsiste, l'adresse temporaire Infomaniak est l'adresse de démonstration de référence. Le frontend GitHub Pages reste disponible, mais ses appels IA interdomaines peuvent encore être bloqués sur ce réseau.

### Déploiement public pilote

Le backend est désormais déployé sur Infomaniak pour le pilote public.

Les principaux mécanismes actuellement en place sont :

- hébergement Infomaniak sous Node.js 24 ;
- CORS limité au frontend `https://technologies-formation.github.io` et autorisation des requêtes provenant de la même origine Infomaniak ;
- rate limiting configuré à 10 requêtes par période de 10 minutes et par IP ;
- limitation à une recherche IA simultanée ;
- timeout OpenAI configuré à 90 secondes ;
- validation stricte des requêtes et limitation de leur taille ;
- journalisation serveur sans enregistrer le texte des recherches utilisateur ;
- clé OpenAI conservée exclusivement côté serveur.

Le runtime actif se trouve dans `/srv/customer/sites/api.a658yg-catalogue.ch`. La configuration privée se trouve hors de ce répertoire dans `/srv/customer/.a658yg-catalogue.env` et ne doit jamais être affichée, copiée dans Git ou remplacée pendant un déploiement.

Pour le déploiement de `02b4612`, l'archive GitHub a été préparée dans `/srv/customer/a658yg-release-02b4612`, puis le runtime précédent a été sauvegardé dans `/srv/customer/a658yg-backup-20260913-before-02b4612.tgz`. Les fichiers de la nouvelle révision ont ensuite été copiés dans le runtime actif en conservant `node_modules` et la configuration privée. Les empreintes de `server/pathwayEngine.mjs` et `server/llmSearch.mjs` ont été comparées à celles de la release avant le redémarrage.

Configuration Infomaniak validée :

- Node.js 24 ;
- port d'écoute `8787` ;
- commande de build `npm ci && npm run build:self-hosted` ;
- commande d'exécution chargeant `/srv/customer/.a658yg-catalogue.env` puis `server/searchApi.mjs` ;
- redémarrage manuel depuis `Tableau de bord > Exécution de l'application > Redémarrer`.

Après chaque évolution du code serveur, vérifier successivement la sauvegarde, les empreintes des fichiers déployés, le redémarrage, `/api/health` sur une adresse Infomaniak, puis un scénario réel sur le frontend public. Un push GitHub ou un déploiement Pages ne met pas à jour automatiquement le code Node.js installé sur Infomaniak.

Dernier contrôle au 7 octobre 2026 : 1 073 formations, snapshot du 7 octobre 2026, commit de catalogue `41131bbe551ff0e3cd094b8221699371fa2c72c1`, synchronisation réussie et `lastError: null`.

Le monitoring et le suivi budgétaire restent à consolider avant une éventuelle industrialisation à plus grande échelle ;
- éventuelle authentification ou restriction d'accès.

## Contrôles avant commit

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
git diff --check
git status --short
```

Ajouter explicitement les fichiers concernés :

```powershell
git add -- chemin/du/fichier1 chemin/du/fichier2
```

Éviter `git add .`. Vérifier le staging avec `git diff --cached --name-only` et `git diff --cached --check` avant de committer.

## Sécurité et limites

- Ne jamais modifier le dépôt du Projet n°1 depuis ce dossier.
- Ne jamais versionner de secret, mot de passe, jeton, fichier `.env`, clé privée ou configuration propre au poste.
- Configurer l’identité Git localement au dépôt si nécessaire, jamais globalement sans décision explicite.
- La recherche classique locale n’utilise aucun service externe, modèle IA, token ou API. La recherche Luna utilise en revanche l’API OpenAI via le backend Node sécurisé. Toute évolution doit préserver les règles de sécurité et être justifiée par un besoin mesuré.

## 30 octobre 2026 — Appréciation qualitative des cours

GO utilisateur pour les corrections du dialogue Assistant et les fiches validées en maquette. Base Catalogue : `ce07b1fa7d9c0319df6f37ad188ec75290e240d4`. Deux modules d'exploitation changent : `server/llmSearch.mjs` et `server/pathwayEngine.mjs` ; le formulaire restauré et les fichiers statiques ne sont pas remplacés.

Les sélections de la seconde passe portent une appréciation structurée `relevance` : `direct`, `partial` ou `support`, avec une justification fondée sur objectif, contenu et acquis. Il ne s'agit ni d'un score chiffré ni d'une preuve d'accès ou de modalité. Un cockpit non précisé doit rester partiellement correspondant ; Excel en appui et de niveau inconnu reste conditionnel et facultatif. L'organisateur est transmis depuis `organizingEntity` ou `officialData.organizingEntityRaw`, sans déduction depuis le profil. Les offres restent celles du cours.

Les appels restent au nombre de deux. La seconde passe de recherche passe d'un plafond de sortie de 500 à 1200 tokens pour contenir ces appréciations ; ce plafond reste dans la politique de réservation existante du pilote public. Le plafond de parcours reste 1200. Cela ne garantit pas un coût réel inchangé : l'usage réel est comptabilisé par le suivi existant. Aucun appel payant n'est nécessaire aux tests. Le pilote public reste désactivé.

Validation : suite locale Catalogue, contrôles des bornes publiques, tests de transmission des appréciations et de l'organisateur ; scénarios indépendants des recommandations réelles, aucun benchmark officiel modifié. Installer après sauvegarde vérifiée des deux modules et contrôle de leur empreinte, puis redémarrer le Catalogue. Ne pas supprimer les états, recherches ni compteurs.

Résultat local du lot : 408 tests réussis ; compilation réussie et lint terminé avec deux avertissements préexistants dans `server/profileReferences.mjs` (variables `body` et `etag`). Publication et installation restent en attente d'une autorisation explicite de publication dans les dépôts publics demandée par la revue automatique. Aucun déploiement n'a été réalisé.

Empreintes attendues AVANT remplacement des modules installés issus de `ce07b1f` : `server/pathwayEngine.mjs` = `8a33fde2b6b525c09dd4352602765fabd768bcc3109d4981a134be3199268607`, `server/llmSearch.mjs` = `d93732bbceaf3ee5683cc086bedf77b24e8506edc2bfd9d2ae48e1c65ba39927`. Toute différence doit interrompre l'installation avant remplacement pour analyse. Les nouvelles empreintes sont respectivement `477012854fc692e0b40ac4262d5953998c0c2ee58d8238d972989f5a738cdceb` et `978f029e898a7a5a856fdd835433a788795215069f28c3f3f58a801eeca5089e`.


### Publication et validation distantes

Le GO explicite de publication a été reçu. Version de code publiée sur `fix/course-relevance-2026-10-30` : `c807f71e3d118aabfd70a7721ed1d2d64e0506c6`, arbre identique à la version locale validée. Le workflow GitHub 41032148918 est réussi : 408 tests, lint et compilation. L'Assistant associé `3ac02bcaa697d359ecfebebfef438fc100542a81` a également passé ses tests Linux/Windows et la suite navigateur complète. Ces résultats remplacent l'attente de publication mentionnée plus haut. Aucun service Infomaniak n'a encore été modifié. Les empreintes d'installation précédentes restent valables ; ne remplacer que les deux modules prévus, après sauvegarde vérifiée, puis redémarrer le Catalogue avant l'Assistant. Coût OpenAI API des vérifications : 0 token / 0 $.


## Assistant — référence avant pilote, 30 octobre 2026

Le groupe pilote utilisera quatre identifiants/mots de passe individuels sur l’Assistant séparé, sans inscription publique par mail. L’opérateur confirme par SSH la version Assistant `13fd45b2f90b5a1d594a4ac54936fe7e7d8f2610` et le marqueur de préparation, avec zéro testeur actif. Les captures après acceptation et reprise confirment le besoin Cockpit RH/suivi des absences, l’offre DF-OPE seule et la suppression de l’entité DIP-SEM ; une confirmation distincte reste nécessaire avant génération.

Ces contrôles concernent l’Assistant. Les lots d’affinement et de quatre accès n’ont pas modifié le Catalogue. La version du snapshot de données ne désigne pas les versions des modules serveur ; ne pas en déduire une installation depuis le seul journal de synchronisation. Le cas général des trois cockpits et la durée officielle inhabituelle restent expressément conservés à la demande de l’utilisateur.

Le [guide Assistant](https://github.com/technologies-formation/a658-yg-avatar/blob/fix/dialogue-course-relevance-2026-10-30/GUIDE_REPRISE.md) contient les références de tests, les procédures privées, les limites et les étapes avant ouverture. Nom retenu du jalon : « Assistant formation — référence avant pilote », tag Assistant prévu `jalon-assistant-avant-pilote-2026-10-30`. Ne pas confondre ce repère avec une validation de tous les cas métier ou une ouverture effective. Les sauvegardes privées, le budget/seuil d’arrêt et le document personnel de reprise doivent être finalisés avant l’activation des testeurs. Aucune clé, fiche d’accès, recherche réelle ou capture privée n’est publiée par cette mise à jour.
