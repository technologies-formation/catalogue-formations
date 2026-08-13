# Catalogue de formations — Maquette métier V1.1

> **Prototype de démonstration non officiel — ne constitue pas le catalogue de formation officiel de l’État de Genève.**

Cette application React permet de rechercher et de filtrer des formations. La démonstration contient actuellement un échantillon de 24 formations issues du catalogue officiel. Cet échantillon ne représente pas l’intégralité de l’offre et ses données peuvent évoluer. Le projet n’est pas un service officiel en production.

## Fonctionnalités

- recherche par code ou intitulé ;
- recherche insensible à la casse et aux accents ;
- filtres Catégorie de personnel, Appartenance et Entité organisatrice ;
- filtre Domaine de formation conditionnel et dynamique ;
- filtres cumulatifs et réinitialisation ;
- interface responsive.

## Orientations futures

Les orientations envisagées, non disponibles dans cette version, comprennent :

- la synchronisation avec le catalogue officiel ;
- la détection des publications, modifications et dépublications ;
- la recherche sémantique en langage naturel.

## Utilisation locale

```powershell
npm install
npm run dev
```

Contrôles disponibles :

```powershell
npm test
npm run lint
npm run build
```
