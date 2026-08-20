# Catalogue de formations — Projet n°2

> **Prototype de démonstration non officiel — ne constitue pas le catalogue officiel de formation de l’État de Genève.**

Cette application React/Vite permet de consulter les **1 056 formations** du snapshot officiel actuellement publié au 20 août 2026. Cette volumétrie issue du snapshot courant peut évoluer avec les mises à jour quotidiennes. L’application est accessible à l’adresse [technologies-formation.github.io/catalogue-formations](https://technologies-formation.github.io/catalogue-formations/).

## Fonctionnalités

- recherche lexicale enrichie sur le code, l’intitulé, le domaine, le thème, le Public, le Public visé et les offres de formation ;
- normalisation des accents et des variations simples, avec reconnaissance de certains acronymes et synonymes métier validés ;
- classement par pertinence lorsqu’une recherche est active, tout en conservant les tris habituels lorsque la recherche est vide ;
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

Le contenu statique est publié sur GitHub Pages. Un push direct sur `main` déclenche `.github/workflows/deploy.yml`. Les mises à jour automatiques du catalogue sont validées, promues et déployées par `.github/workflows/update-catalogue.yml`.

## Choix de recherche

Une recherche sémantique a été expérimentée, mais elle n’est pas retenue dans l’architecture actuelle : les essais n’ont pas démontré un gain suffisant au regard de la complexité technique supplémentaire. La recherche lexicale enrichie V1.2 reste la solution de référence afin de préserver la simplicité, les performances et la maintenance.
