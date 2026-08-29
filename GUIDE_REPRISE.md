# Guide de reprise — Catalogue de formations — Projet n°2

Ce document est la référence technique et opérationnelle pour reprendre le projet après une interruption.

> **État actualisé au 29 août 2026**
>
> Le projet dispose désormais d'une architecture de recherche combinant :
> - la recherche classique locale ;
> - GPT-5.6 Luna en deux passes ;
> - un rappel lexical local Top 40 ;
> - un backend Node sécurisé pour les appels OpenAI.
>
> Jalon de référence Codespaces :
> - commit : `e03d105`
> - tag : `search-llm-codespaces-v1-2026-08-29`
> - tests : **288/288 réussis**
>
> Le frontend statique peut être publié sur GitHub Pages, mais **Luna nécessite un backend sécurisé séparé**. La clé `OPENAI_API_KEY` ne doit jamais être exposée dans le navigateur.
>
> Le benchmark indépendant Luna a obtenu **26/30 (86,7 %)** avant les adaptations ultérieures. Ce benchmark est désormais consommé ; un nouveau jeu indépendant sera nécessaire pour mesurer la qualité finale de la version actuelle.

## État de référence

- Projet : Catalogue de formations — Projet n°2, indépendant du Projet n°1.
- Branche principale du dépôt : `main`.
- Branche de développement actuelle : `feat/search-llm-recall-augmentation-2026-08-28`.
- Dépôt distant : [github.com/technologies-formation/catalogue-formations](https://github.com/technologies-formation/catalogue-formations).
- URL publique historique du frontend statique : [technologies-formation.github.io/catalogue-formations](https://technologies-formation.github.io/catalogue-formations/).
- Jalon fonctionnel Codespaces au 29 août 2026 : commit `e03d105`.
- Tag de reprise : `search-llm-codespaces-v1-2026-08-29`.
- Ancien jalon public du 20 août 2026 : `projet-2-public-v1.4-2026-08-20`.
- Le snapshot utilisé pendant les tests Luna contient 1 058 formations. Cette volumétrie peut évoluer avec les mises à jour du catalogue.

Le tag `search-llm-codespaces-v1-2026-08-29` correspond à une version fonctionnelle en environnement Codespaces. Il ne signifie pas que le backend Luna est déjà déployé en production publique.

Avant toute intervention, vérifier :

```powershell
git status
git branch --show-current
git log --oneline -5
```

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

1. Luna analyse les 1 058 formations sous forme compacte et sélectionne jusqu'à 40 candidats.
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

`.github/workflows/deploy.yml` installe les dépendances, construit l’application et déploie `dist` sur GitHub Pages.

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

L'approche LLM contrainte par les codes officiels du catalogue a obtenu :

**26/30 = 86,7 %**

Détail du benchmark indépendant :

- natural positive : 13/14 ;
- multi-intent : 2/5 ;
- context restriction : 6/6 ;
- abstention : 5/5.

Coût total observé sur les 30 recherches : **0,6270 USD**.

Coût moyen : **0,0209 USD par recherche**.

Décision : **GO pour l'architecture Luna en deux passes.**

Le benchmark ayant servi à cette validation a ensuite été utilisé pour diagnostiquer et améliorer le rappel. Il est donc désormais **consommé**.

Les adaptations réalisées après le résultat 26/30 ne doivent pas être présentées comme indépendamment validées sur ce même benchmark.

Un nouveau jeu de test indépendant sera nécessaire avant toute affirmation définitive sur la qualité de la version actuelle.

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

Benchmark indépendant Luna : **0,6270 USD pour 30 recherches**, soit **0,0209 USD par recherche** en moyenne.

Avec un cache chaud, certains appels observés pendant le développement sont descendus autour de **0,003 à 0,004 USD**.

Exemple observé : 88 382 tokens d’entrée, 99 tokens de sortie, 81 800 tokens lus depuis le cache, 6 576 écrits dans le cache, pour **0,00340000 USD**.

Les coûts varient selon l’état du cache, la taille de l’union des candidats et la deuxième passe. Les tarifs OpenAI doivent être revérifiés avant toute estimation budgétaire de production.

## Reprise dans Codespaces

Pour relancer l’environnement de développement :

- backend Luna : `nohup node server/searchApi.mjs > /tmp/catalogue-api.log 2>&1 &`
- contrôle backend : `curl -s http://localhost:8787/api/health`
- logs backend : `tail -n 50 /tmp/catalogue-api.log`
- frontend Vite : `nohup npm run dev -- --host 0.0.0.0 > /tmp/catalogue-vite.log 2>&1 &`
- URL habituelle : `http://localhost:5173/catalogue-formations/`

Après modification de `server/searchApi.mjs` ou `server/llmSearch.mjs`, redémarrer le backend Node.

Le backend Luna ne dispose pas encore d’un script npm dédié ; il est lancé directement avec `node server/searchApi.mjs`.

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
- `POST /api/search`

Le frontend Vite utilise un proxy local `/api` vers ce serveur.

### Protections déjà en place

Le backend Codespaces applique actuellement :

- JSON invalide : HTTP `400` ;
- `query` absente ou de mauvais type : HTTP `400` ;
- requête supérieure à 1 000 caractères : HTTP `422` ;
- body supérieur à 16 000 caractères : HTTP `413` ;
- mauvaise méthode HTTP : `405` avec en-tête `Allow` ;
- route inconnue : HTTP `404` ;
- erreur interne ou OpenAI : HTTP `500` ;
- réponses JSON avec `Cache-Control: no-store`.

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

Pour un usage public, l'architecture devra conserver un backend séparé entre le navigateur et OpenAI.

### À traiter avant production publique

Le backend actuel est adapté au développement et aux tests Codespaces, mais pas encore à une exposition publique définitive.

Il reste notamment à décider ou mettre en place :

- hébergement du backend ;
- CORS ;
- rate limiting ;
- protection contre les abus ;
- monitoring ;
- suivi budgétaire ;
- gestion des timeouts ;
- journalisation de production ;
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
