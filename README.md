# Catalogue de formations — Projet n°2

> **Prototype de démonstration non officiel — ne constitue pas le catalogue officiel de formation de l’État de Genève.**

Cette application React/Vite permet de consulter les **1 061 formations** du snapshot officiel actuellement publié au 1er septembre 2026. Cette volumétrie issue du snapshot courant peut évoluer avec les mises à jour quotidiennes. L’application est accessible à l’adresse [technologies-formation.github.io/catalogue-formations](https://technologies-formation.github.io/catalogue-formations/).

## Fonctionnalités

- recherche lexicale enrichie sur le code, l’intitulé, le domaine, le thème, le Public, le Public visé et les offres de formation ;
- recherche assistée par **GPT-5.6 Luna**, déclenchée explicitement, avec recommandations principales, compléments et abstention lorsque le catalogue ne répond pas suffisamment au besoin ;
- normalisation des accents et des variations simples, avec reconnaissance de certains acronymes et synonymes métier validés ;
- classement par pertinence par défaut avec une recherche classique, avec possibilité de trier aussi par intitulé ou code ;
- cinq facettes **Cours** multi-sélection : **Offre de formation**, **Entité de formation**, **Domaine**, **Thème** et **Public** ;
- logique OU entre les valeurs d’une même facette et ET entre les facettes ;
- activation de Domaine après sélection d’une offre ou d’une entité, puis de Thème après sélection d’un domaine ;
- recherche interne et compteurs dynamiques dans les facettes ;
- tri par intitulé ou code, dans les deux ordres ;
- pagination de 20 résultats ;
- cartes présentant notamment le Public structuré, le texte descriptif **Public visé**, les offres et le lien vers la fiche officielle.

La valeur applicative **Non renseigné** est utilisée lorsque le Public source est vide. Le Public utilisé par la facette reste distinct du texte libre « Public visé ».

## Disponibilité des sessions

Un bloc séparé des facettes Cours permet de filtrer les formations selon deux indicateurs indépendants :

- **Inscriptions ouvertes** ;
- **Ouverture programmée**.

Une formation peut présenter les deux statuts. Le filtre Sessions devient pertinent après la sélection d’au moins un critère Cours ; si le dernier critère Cours disparaît, les sélections Sessions sont supprimées. Ces informations sont extraites des fiches officielles et peuvent évoluer lors de la mise à jour quotidienne.

## URL partageables

La recherche, les cinq facettes Cours et le tri sont sérialisés dans l’URL afin de partager une sélection. Les filtres Sessions en sont volontairement exclus : leur état est dynamique et peut évoluer quotidiennement, ce qui rendrait une URL enregistrée rapidement trompeuse.

## Mise à jour du catalogue

Un workflow quotidien construit un candidat, le valide, produit un différentiel et ne promeut le nouveau snapshot qu’après réussite des contrôles techniques. La dernière version valide reste ainsi protégée. Les écarts avec les références métier validées sont signalés sans modifier automatiquement leur ciblage.

## Installation et lancement local

L’environnement de référence utilise PowerShell. Employer `npm.cmd` pour éviter le blocage éventuel de `npm.ps1` par la politique de sécurité Windows.

```powershell
npm.cmd ci
npm.cmd run dev
```

Vite affiche l’adresse locale ; l’application utilise le chemin de base `/catalogue-formations/`.

## Contrôles

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
git diff --check
```

## Publication

Le frontend statique peut être publié sur GitHub Pages. Un push direct sur `main` déclenche `.github/workflows/deploy.yml`. Les mises à jour automatiques du catalogue sont validées, promues et déployées par `.github/workflows/update-catalogue.yml`.

La recherche IA utilise un backend Node sécurisé séparé, déployé sur Infomaniak à l’adresse `https://api.a658yg-catalogue.ch`. La clé OpenAI reste exclusivement côté serveur et n’est jamais exposée dans le navigateur ou dans GitHub Pages. Le frontend public communique avec ce backend via `VITE_SEARCH_API_BASE_URL`.

## Choix de recherche

L’application combine désormais deux modes :

- une **recherche classique locale**, rapide et sans appel externe ;
- une recherche assistée par **GPT-5.6 Luna**, déclenchée explicitement avec le bouton **Booster ma recherche avec l’IA**.

Luna fonctionne en deux passes et utilise également un rappel lexical local pour compléter ses candidats. Les codes proposés sont contraints aux formations présentes dans le catalogue officiel.

Typesense et MiniLM ont été évalués puis abandonnés pour l’architecture actuelle, leurs résultats n’ayant pas apporté un gain suffisant. Le benchmark indépendant final, gelé avant exécution, a obtenu **37/40 (92,5 %)** avec Luna. Ce benchmark est désormais consommé : il peut servir de test de régression, mais toute nouvelle mesure indépendante exige un nouveau jeu de cas défini et gelé avant exécution.

La documentation technique détaillée et l’historique des décisions sont disponibles dans `GUIDE_REPRISE.md`.
