# Synchronisation du catalogue backend

## Statut

Évolution préparée le 2 septembre 2026 à partir de `277be5b`.
L'activation en production reste une étape distincte. Aucun changement des prompts,
du modèle Luna, des classements ou des benchmarks historiques.

## Fonctionnement

Les deux workflows Pages ajoutent au build le snapshot et son rapport déjà validés,
avec `node scripts/preparePublishedCatalogue.mjs`. Le workflow quotidien le fait
après son commit de données, afin de désigner la bonne révision.

Le répertoire public `catalogue-sync/` contient :

- `manifest.json` : version du format, commit, date du snapshot, volume et empreintes ;
- `<empreinte-snapshot>.json` : snapshot exact ;
- `<empreinte-rapport>.md` : rapport exact.

Ces données sont déjà publiques dans le dépôt. Le manifeste et les fichiers sont
livrés dans le même artefact Pages que le frontend. Le backend lit cette publication,
et non la tête de `main`, qui peut précéder un déploiement ou correspondre à un build
ayant échoué. `publishedAt` est la date de préparation de l'artefact, pas une mesure
du moment où tous les caches CDN ont basculé.

Au démarrage, le backend prépare le catalogue embarqué. Si la synchronisation est
activée, il tente de charger le cache persistant validé avant d'écouter les requêtes.
Il vérifie ensuite Pages en arrière-plan, puis chaque heure. Il télécharge un
manifeste et les deux fichiers nommés par empreinte, avec une limite globale de
15 secondes pour les téléchargements. Les redirections sont refusées ; les réponses
sont limitées à 8 Kio / 10 Mio / 1 Mio. Aucun token GitHub ou appel OpenAI requis.

Les validations existantes de `scripts/promoteOfficialCatalogue.mjs` contrôlent le
snapshot et le rapport. Les empreintes, dates et volumes doivent correspondre.
Un snapshot plus ancien que celui chargé, ou un artefact préparé avant celui déjà
chargé, est refusé. Il n'y a pas de nouveau seuil de baisse de volume ici : celui
du workflow reste applicable et sa dérogation humaine n'est pas contournée ni annulée.

Toutes les projections sont préparées avant bascule : catalogue compact, fiches
détaillées, cours et codes autorisés. Une recherche capture une référence unique
avant sa première passe et la conserve jusqu'à sa réponse, même si une mise à jour
se termine pendant l'appel OpenAI.

Le cache conserve dans un même fichier le manifeste, le snapshot et le rapport.
L'écriture passe par un fichier temporaire, un flush et un renommage atomique sur
le même système de fichiers. La mémoire ne bascule qu'après cette écriture réussie.
Les fichiers cache ont le mode 600. Le cache n'est pas un fichier du dépôt.

Si le réseau, la validation, la préparation ou l'écriture échoue, le catalogue actif
reste utilisable. Un cache corrompu au démarrage est rejeté au profit du snapshot
embarqué. Un rafraîchissement ne peut pas s'exécuter en double.

## Configuration

| Variable | Défaut | Effet |
| --- | --- | --- |
| `CATALOGUE_SYNC_ENABLED` | désactivée | `true` active le chargement du cache et les vérifications Pages |
| `CATALOGUE_SYNC_INTERVAL_MS` | `3600000` | intervalle, minimum `60000` |
| `CATALOGUE_CACHE_FILE` | `var/catalogue-cache.json` dans le projet | fichier persistant hors répertoire public recommandé en production |

Pour Infomaniak, prévoir un fichier situé hors du dossier public, accessible en
écriture à l'application et conservé lors des redéploiements. Confirmer ces propriétés
sur l'hébergement avant activation. Ne jamais déplacer ni exposer la clé OpenAI.

## Ordre de mise en service

1. Valider et intégrer la branche, puis vérifier la réussite du déploiement Pages.
2. Vérifier depuis Node.js sur Infomaniak l'accès HTTPS au manifeste et aux fichiers.
3. Sauvegarder l'état runtime précédent et contrôler le clone de déploiement.
4. Déployer les modules `server/`, leurs dépendances `src/` et
   `scripts/promoteOfficialCatalogue.mjs`. Conserver la configuration privée et les
   dépendances existantes ; aucune dépendance npm supplémentaire n'est introduite.
5. Configurer le cache persistant et activer `CATALOGUE_SYNC_ENABLED=true`.
6. Redémarrer une fois depuis le Manager Infomaniak.
7. Vérifier `health`, l'égalité de l'empreinte avec Pages, puis le parcours navigateur.
   Une recherche IA réelle a un coût distinct et nécessite un suivi des tokens.

Les recherches de développement et les runners historiques restent sur le snapshot
embarqué par défaut. Ne pas activer la synchronisation pendant un benchmark gelé.

## Observabilité et limites

`GET /api/health` ajoute `catalogue` : `syncEnabled`, `snapshotDate`, `courseCount`,
`snapshotHash`, `commit`, `publishedAt`, `source`, `lastCheckAt`, `lastSuccessAt`,
`lastError`. Aucun chemin privé ni secret n'est retourné. `ok: true` indique que
l'API répond ; cela ne garantit pas une synchronisation récente. Examiner aussi
`lastSuccessAt` et `lastError`. Les événements `catalogue-sync` sont journalisés ;
aucune nouvelle notification externe n'est envoyée automatiquement.

Un décalage jusqu'à un intervalle de vérification, plus la propagation Pages, est
normal. Une transition CDN incohérente ou un fichier momentanément absent fait
échouer le rafraîchissement sans remplacer la dernière version valide. Une nouvelle
tentative a lieu au prochain intervalle. Une indisponibilité durable peut donc
prolonger le décalage et doit être suivie dans health/logs.

Le cache suppose un unique processus écrivain (pilote actuel). Une montée en charge
avec plusieurs processus doit revoir cette hypothèse et la stratégie de stockage.
Une remise en ligne volontaire d'un ancien catalogue nécessite une procédure
explicite : la protection contre les versions anciennes bloque le retour automatique.

Pour désactiver : retirer `CATALOGUE_SYNC_ENABLED=true` puis redémarrer. Le backend
utilise alors le snapshot embarqué, qui doit être vérifié avant ce retour arrière.
Une restauration du code précédent requiert les fichiers runtime sauvegardés.

## Vérifications

Tests sans réseau réel : cache hors ligne, corruption, écriture impossible, retour
à une version ancienne, taille excessive, délai réseau, appels simultanés, packaging
incohérent et conservation de la même version entre les deux passes Luna.
Ces contrôles sont des tests techniques et de régression, pas un nouveau benchmark
indépendant de pertinence. Le score historique 37/40 reste inchangé.
