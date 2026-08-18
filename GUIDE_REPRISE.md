# Guide de reprise — Catalogue de formations — Projet n°2

Ce document est la référence technique et opérationnelle pour reprendre le projet après une interruption.

## État de référence

- Projet : Catalogue de formations — Projet n°2, indépendant du Projet n°1.
- Branche principale : `main`.
- Dépôt distant : [github.com/technologies-formation/catalogue-formations](https://github.com/technologies-formation/catalogue-formations).
- URL publique : [technologies-formation.github.io/catalogue-formations](https://technologies-formation.github.io/catalogue-formations/).
- HEAD documentaire au 18 août 2026 : `c1d674e2406d4bc0e5e3473ce0b47d37e6466d78`.
- Tag stable : `projet-2-public-v1.3-2026-08-17` (commit `3790db9805c2d93f197641e024abcd28f88ce0a2`).
- Snapshot officiel actuellement publié : 1 057 formations.

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

### Recherche et facettes Cours

L’application propose une recherche par intitulé ou code et cinq facettes multi-sélection :

1. Offre de formation ;
2. Entité de formation ;
3. Domaine ;
4. Thème ;
5. Public.

Les valeurs d’une même facette sont combinées par OU ; les facettes sont combinées par ET. Domaine devient disponible après sélection d’une offre ou d’une entité. Thème dépend ensuite d’un domaine et tient compte du Public sélectionné.

Le tri porte sur l’intitulé ou le code, dans les deux ordres. La pagination affiche 20 résultats par page.

Le champ `publicRaw` alimente la valeur structurée Public et sa facette. Une valeur vide devient **Non renseigné**. `targetAudienceRaw` correspond au texte libre **Public visé** affiché sur la carte ; il ne doit pas être confondu avec la facette Public.

### Disponibilité des sessions

Les Sessions forment un bloc séparé des cinq facettes Cours :

- **Inscriptions ouvertes** correspond à `hasOpenSession` ;
- **Ouverture programmée** correspond à `hasScheduledSession`.

Les deux booléens sont indépendants et peuvent être vrais simultanément. Une sélection Sessions est utilisable avec un critère Cours actif. Quand le dernier critère Cours est supprimé, les sélections Sessions sont également supprimées.

### URL partageables

La recherche, les offres, entités, domaines, thèmes, publics et le tri sont sérialisés dans l’URL. La pagination ne l’est pas.

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

`reports/catalogue-import-report.md` est généré automatiquement : il ne doit pas être corrigé manuellement. Il peut temporairement refléter le format du dernier snapshot effectivement promu. La surveillance 24/24 déjà présente dans le code apparaîtra dans ce rapport versionné lors d’une future promotion produisant un nouveau rapport officiel.

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

Le référentiel contient actuellement **24 ciblages validés**. Le contrôle du 18 août 2026 observait 22 références présentes et 2 absentes ; ce chiffre est un constat daté, pas une constante métier.

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

Ne pas implémenter une fonctionnalité uniquement parce qu’elle est techniquement possible.

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
- La recherche sémantique / IA est une évolution future à étudier après stabilisation du socle actuel ; aucune architecture IA n’est décidée.
