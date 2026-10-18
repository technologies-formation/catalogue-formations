# Référentiels du parcours — contrat HTTP v1

Statut : développement local, non publié, non déployé. Référence de départ :
`3efb6c40ec8c42229ccb30611d489aeb9f25fbd1`. Ce jalon ne raccorde pas l'avatar
et n'active aucune recherche ou construction de parcours.

## Source unique et séparation des usages

`src/config/pathwayProfile.js` définit les options du formulaire de parcours,
ses contraintes et celles du validateur HTTP. Le composant `PathwayAssistant.jsx`,
`server/pathwayAssistant.mjs` et l'endpoint lisent cette même définition.
Les suggestions d'entités sont dérivées de `src/config/entities.js`, sans seconde liste.
Les définitions sont gelées récursivement pour éviter une mutation accidentelle.

Les catégories du parcours restent `PAT`, `PE`, `PU Police`, `PU Prison`, `PJ`.
Les trois situations managériales et tous les libellés sont conservés à l'identique.
Les entrées vides « À renseigner » et « Non précisée » restent des éléments d'interface,
pas des valeurs métier à envoyer.

Les catégories internes de `personnelCategories.js`, les règles de `profileRules.js`,
les ciblages validés des formations et les recommandations sont distincts. Ils ne sont
ni modifiés ni exportés par ce contrat. Aucune conversion `PU Police → POL`,
`PU Prison → PEN` ou `PJ → MAG` n'est introduite.

## Accès

- `GET /api/profile-references` : réponse 200 JSON ou 304 sans corps.
- `OPTIONS /api/profile-references` : réponse 204 pour les origines autorisées.
- Autres méthodes : 405, `Allow: GET, OPTIONS`.
- Les restrictions CORS existantes sont appliquées avant le handler. Aucune origine
  supplémentaire n'est autorisée. CORS n'est pas une authentification.
- L'endpoint est indépendant du drapeau d'activation du parcours et de la clé OpenAI.
  Son handler n'importe aucun moteur, catalogue de formations ou service réseau.
  Il ne consomme ni quota de recherche ni appel IA.

## Structure de la réponse

| Propriété | Contrat |
| --- | --- |
| `schemaVersion` | Entier `1` : version majeure du format |
| `revision` | SHA-256 hexadécimal de 64 caractères calculé sur le contenu décrit ci-dessous |
| `pathway.scope` | Chaîne `pathway`, aucun mélange avec le ciblage interne |
| `pathway.apiValidation` | Sémantique conservée du validateur HTTP |
| `pathway.fields` | Objet contenant les huit champs du profil |

Chaque champ contient `type: "string"`, `maxLength`, `requiredInApi`,
`requiredInForm` et `formControl` (`text`, `textarea` ou `select`).
`personnelCategory` et `managerStatus` ajoutent `options`, tableau ordonné de
couples `{ value, label }`. `entity` ajoute `allowCustom: true` et `suggestions`,
tableau `{ value, label }` dérivé des entités existantes.

| Champ | Maximum | Obligatoire API | Obligatoire formulaire |
| --- | ---: | --- | --- |
| `personnelCategory` | 80 | Non | Oui |
| `entity` | 120 | Non | Non |
| `managerStatus` | 120 | Non | Non |
| `role` | 300 | Oui | Oui |
| `objective` | 1 000 | Oui | Oui |
| `existingSkills` | 1 000 | Non | Non |
| `timeAvailable` | 300 | Non | Non |
| `constraints` | 1 000 | Non | Non |

Les longueurs sont mesurées comme avant avec la propriété JavaScript `length`,
après `trim()` côté API. Aucun minimum de deux caractères pour le rôle ou de dix
pour l'objectif n'est ajouté : une chaîne non vide suffit pour chacun.

`apiValidation` expose les comportements existants :

- `trimBeforeLengthCheck: true` ;
- `optionalNull: "omit"` et `optionalBlank: "omit"` ;
- `unknownFields: "ignore"` ;
- `enforceOptions: false` : les options sont celles du formulaire, pas une liste
  fermée imposée à l'API. Les champs renseignés restent des chaînes libres.

Les entités et services personnalisés restent acceptés. Les suggestions ne doivent
pas être utilisées comme une liste blanche exhaustive. Les codes et libellés doivent
être utilisés sans inventer de correspondance entre référentiels.

## Révision et cache

La révision est calculée côté serveur sur les octets UTF-8 de
`JSON.stringify({ schemaVersion: 1, pathway })`. Elle est indépendante de l'heure,
des variables privées et du renouvellement quotidien du catalogue de formations.
Toute modification des options, libellés ou contraintes modifie la révision.

L'ETag fort vaut la révision entourée de guillemets. Les réponses 200 et 304 portent
`Cache-Control: public, max-age=0, must-revalidate` : le client peut conserver le
contenu mais doit le revalider avant réutilisation. `If-None-Match` accepte l'ETag
précédent, sa forme faible, une liste ou `*`. Une révision différente retourne 200.
Le précontrôle CORS accepte `If-None-Match` et le navigateur peut lire `ETag` via
`Access-Control-Expose-Headers`. `Vary: Origin` est présent même sans en-tête
`Origin`, pour éviter de mélanger les variantes avec et sans autorisation CORS.

Une modification incompatible du format exige une hausse de `schemaVersion`.
Une évolution compatible des listes modifie seulement `revision`. Le client doit
ignorer les propriétés additives inconnues, mais refuser une version majeure inconnue.
Une valeur retirée doit faire demander une nouvelle sélection ; aucun renommage
automatique ne doit être déduit du libellé. Les évolutions de règles d'acceptation
HTTP nécessitent une décision explicite, pas seulement une édition des options.

Le serveur ne négocie pas encore une révision attendue lors de `POST /api/pathway`.
Le client doit donc gérer l'obsolescence ; aucune garantie de transaction entre une
lecture du référentiel et une soumission ultérieure n'est ajoutée par ce jalon.
La durée admissible d'un éventuel cache client hors ligne reste à définir avant
un raccordement réel. Sans contrat compatible, conserver le brouillon et bloquer
l'envoi réel est le comportement recommandé ; la simulation peut rester disponible.

## Validation et mise en service ultérieure

Les nouveaux tests couvrent le rendu serveur du vrai formulaire avec Vite/React
existants, les contraintes et valeurs historiques, la liberté des champs API,
les limites après trim, les révisions, le contrat HTTP, 200/304/405, le précontrôle
et les refus CORS. Les tests HTTP du handler utilisent un serveur éphémère sur
`127.0.0.1`, sans lancer le backend applicatif ni aucune IA.

La suite existante, le lint et les builds doivent rester verts. Aucune dépendance
n'est ajoutée. Une publication du code sur GitHub ne déploie pas le backend Node
Infomaniak : son déploiement, la vérification des restrictions d'origine et l'essai
sur le réseau institutionnel nécessitent une validation distincte.

Vérification locale du 18.10.2026 : 352 tests réussis, dont 14 nouveaux, sans
échec ni test ignoré ; lint, `git diff --check`, build standard et build
`self-hosted` réussis. Les tests ont été exécutés avec les connexions réseau
externes bloquées et sans clé OpenAI. L'avertissement de bundle supérieur à
500 ko subsiste : le build de référence produit déjà environ 2,25 Mo de JavaScript.
Le rendu du formulaire est vérifié côté serveur, pas dans un navigateur réel.

Le dépôt avatar reste inchangé. Son futur lecteur devra utiliser le contrat plutôt
que recopier les options, et conserver ses protections techniques indépendantes :
destination autorisée, taille maximale, délais, validation du format, confirmation
et invalidation des réponses obsolètes.
