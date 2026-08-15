# Guide de reprise — Catalogue de formations — Projet n°2

Ce document rassemble les informations nécessaires pour reprendre le projet après plusieurs semaines d'interruption.

## Identification et périmètre

- **Nom du projet :** Catalogue de formations — Projet n°2
- **Dossier local :** `C:\Users\yanng\OneDrive\Documents\Projets-Codex\CatalogueFormationEGE-PROJET2`
- Le Projet n°2 est indépendant du Projet n°1.
- Ne jamais modifier les dépôts du Projet n°1 depuis ce dossier.
- Ce dossier possède son propre dépôt Git local indépendant.
- La branche principale est `main`.

## Environnement de travail

L'environnement principal est Visual Studio Code avec son terminal PowerShell intégré.

Sous PowerShell, toujours utiliser `npm.cmd` et non `npm`, car le script `npm.ps1` est bloqué par la politique de sécurité Windows.

La base actuelle est fonctionnelle avec **Vite 8.2.1**.

## Installation et lancement local

Installer les dépendances :

```powershell
npm.cmd ci
```

Lancer le serveur de développement :

```powershell
npm.cmd run dev
```

URL locale actuelle : <http://localhost:5173/catalogue-formations/>

## Références Git

Commit initial du Projet n°2 :

```text
0260193 chore: initialiser le projet 2 depuis la base v1.2
```

Identité Git configurée uniquement pour ce dépôt :

```text
user.name = Yann GOY
user.email = yann.goy@gmail.com
```

Ne pas modifier la configuration Git globale du poste.

Commandes de contrôle utiles :

```powershell
git status
git log --oneline -5
```

Pour préparer un commit, éviter `git add .` et ajouter explicitement chaque fichier concerné, par exemple :

```powershell
git add GUIDE_REPRISE.md
```

## Contrôles avant un jalon

Avant chaque jalon important :

1. exécuter les tests ;
2. exécuter le lint ;
3. exécuter le build ;
4. contrôler le résultat avec `git status`.

## État de référence

Le premier jalon est propre et le working tree est `clean`.
