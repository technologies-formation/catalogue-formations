# Guide de reprise — Catalogue de formations — Projet n°2

Ce document rassemble les informations nécessaires pour reprendre le projet après plusieurs semaines d’interruption.

## Identification et périmètre

- **Nom du projet :** Catalogue de formations — Projet n°2
- **Dossier local :** `<dossier-local-du-projet-2>`
- Le Projet n°2 est indépendant du Projet n°1.
- Ne jamais modifier les dépôts du Projet n°1 depuis ce dossier.
- Ce dossier possède son propre dépôt Git local indépendant.
- La branche principale est `main`.

## Environnement de travail

L’environnement principal est Visual Studio Code avec son terminal PowerShell intégré.

Sous PowerShell, toujours utiliser `npm.cmd` et non `npm`, car le script `npm.ps1` peut être bloqué par la politique de sécurité Windows.

La base actuelle est fonctionnelle avec **Vite 8.2.1**.

## Installation et lancement local

Depuis `<dossier-local-du-projet-2>`, installer les dépendances :

```powershell
npm.cmd ci
```

Lancer le serveur de développement :

```powershell
npm.cmd run dev
```

Consulter ensuite l’adresse locale affichée par Vite, sous le chemin `/catalogue-formations/`.

## Références Git

Commit initial du Projet n°2 :

```text
0260193 chore: initialiser le projet 2 depuis la base v1.2
```

Si une identité Git doit être définie, la configurer uniquement pour ce dépôt avec des valeurs adaptées à la personne qui intervient :

```powershell
git config --local user.name "<nom-du-contributeur>"
git config --local user.email "<adresse-du-contributeur>"
```

Ne pas modifier la configuration Git globale du poste.

Commandes de contrôle utiles :

```powershell
git status
git log --oneline -5
```

Pour préparer un commit, éviter `git add .` et ajouter explicitement chaque fichier concerné, par exemple :

```powershell
git add README.md GUIDE_REPRISE.md
```

## Contrôles avant un jalon

Avant chaque jalon important :

1. exécuter les tests avec `npm.cmd test` ;
2. exécuter le lint avec `npm.cmd run lint` ;
3. exécuter le build avec `npm.cmd run build` ;
4. lancer `git diff --check` ;
5. contrôler le résultat avec `git status`.

## Publication sur GitHub Pages

- Le chemin de base Vite est `/catalogue-formations/`.
- Le workflow `.github/workflows/deploy.yml` construit le projet et publie le dossier `dist` depuis la branche `main`.
- Avant la première publication, vérifier le dépôt distant, la correspondance entre son nom et le chemin de base Vite, ainsi que l’activation de GitHub Pages avec GitHub Actions.
- Ne jamais versionner de secret, de fichier `.env`, de clé privée ou de configuration propre au poste.

## État fonctionnel de référence

Le catalogue contient **1'078 formations**. Il comprend actuellement :

- une recherche textuelle ;
- cinq facettes avec multi-sélection, recherche interne et compteurs dynamiques ;
- un tri par intitulé ou par code ;
- une pagination de 20 formations par page ;
- des cartes détaillées donnant accès aux fiches officielles.

Avant toute nouvelle intervention, confirmer que le working tree est propre avec `git status` et consulter les derniers commits avec `git log --oneline -5`.
