# Catalogue de formations — Projet n°2

> **Prototype de démonstration non officiel — ne constitue pas le catalogue officiel de formation de l’État de Genève.**

Cette application React permet de consulter **1'078 formations** issues du catalogue importé. Elle propose une recherche et une navigation à facettes adaptées au catalogue de formations du personnel de l’État de Genève.

## Fonctionnalités actuelles

- recherche textuelle par intitulé, mot-clé ou code, insensible à la casse et aux accents ;
- cinq facettes multi-sélection : **Offre de formation**, **Entité de formation**, **Domaine**, **Thème** et **Public** ;
- combinaison OU entre les valeurs d’une même facette et ET entre les facettes ;
- activation progressive des facettes selon les sélections disponibles ;
- recherche interne et compteur dynamique pour chaque facette ;
- pastilles récapitulatives et réinitialisation des filtres ;
- compteur du nombre total de formations correspondant aux critères ;
- tri par intitulé ou par code, dans les deux ordres ;
- pagination de 20 formations par page ;
- cartes uniques par formation présentant le code, l’intitulé, les offres, les métadonnées structurées, le Public visé et un lien vers la fiche officielle ;
- interface responsive et utilisable au clavier.

La valeur applicative **Non renseigné** est utilisée pour le Public lorsque la donnée source correspondante est vide. Le Public structuré utilisé par la facette reste distinct du texte descriptif « Public visé ».

## Installation et lancement local

L’environnement de référence est Visual Studio Code avec un terminal PowerShell intégré. Sous PowerShell, utiliser `npm.cmd` afin d’éviter le blocage éventuel de `npm.ps1` par la politique de sécurité Windows.

```powershell
npm.cmd ci
npm.cmd run dev
```

L’application est alors accessible à l’adresse indiquée par Vite, sous le chemin `/catalogue-formations/`.

## Contrôles du projet

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

## Publication

Le projet utilise Vite avec le chemin de base `/catalogue-formations/`. Un workflow GitHub Actions est présent dans `.github/workflows/deploy.yml` pour construire et publier le contenu de `dist` sur GitHub Pages depuis la branche `main`.

Le dépôt GitHub cible doit utiliser un nom compatible avec ce chemin de base, ou la configuration Vite doit être adaptée avant publication.

## Limites actuelles

Cette version reste un prototype. Elle ne propose pas encore de recherche sémantique, de favoris, de sessions, de dates de formation ni d’informations sur les places disponibles.
