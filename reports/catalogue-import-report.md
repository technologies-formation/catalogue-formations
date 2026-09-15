# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-09-15
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 135.7 secondes
- Taille du JSON final : 2.04 Mio (2136547 octets)
- Empreinte SHA-256 du snapshot : `605500c1920849dfe3e712e4332d609cda8792f414147f6abe5ef17bce619608`

## Synthèse

- Occurrences détectées dans l’index : 1642
- Codes uniques : 1044
- Occurrences éliminées par déduplication : 598
- Formations présentes dans plusieurs offres : 302
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1044
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1053 |
| Cours dans le candidat | 1044 |
| Cours ajoutés | 4 |
| Cours supprimés | 13 |
| Cours modifiés | 65 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| CO-01549 | Les soirées du CAS Enseigner en situation complexe au secondaire | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP | DGEO/SRH/Secteur de la formation continue EO | Profession enseignante |
| CO-01717 | Comment aborder et gérer le racisme dans le cadre scolaire ? | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP | DGEO/SRH/Secteur de la formation continue EO | Formation générale |
| EP-1313ETB | Améliorer la démarche d'équipe | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Formations spécifiques |
| EP-1318ETB | Améliorer la démarche d'équipe | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Formations spécifiques |

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| FSM012 | Moniteurs sanitaires - refresh BLS-AED (Generic provider) | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD001 | Accompagnement des stagiaires (ADS) - base | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD022 | Coach FOBA | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD170 | Formateurs TTI (technique) | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD171 | Formateurs Tir (technique) | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD177 | Cours cadre TTI | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD183 | Cours cadre Tir | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD207 | BFFA - M1 : Animer des sessions de formation pour des groupes d'adultes (FFA CF-AF). | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD240 | Coach FOI | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD373 | Accompagnement des stagiaires - Refresh | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD418 | Formation continue pour les coaches de la pratique - module 1: Rôle et tâches de la/du coach et formulation des objectifs. | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD419 | Formation continue pour les coaches de la pratique - module 2: planifier, organiser et suivre les objectifs. | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |
| OCD422 | Formation continue pour les coaches de la pratique - module 3: Evaluation de l'apprentissage et du transfert | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formateurs |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| OMP-005TSA | ComFor: Evaluer la communication et intervenir | `hasOpenSession` : « true » → « false » |
| SEM-10218 | CO-ESII / Utiliser le logiciel d'édition audio Audacity | `titleRaw` : « CO-ESII : Utiliser le logiciel d'édition audio Audacity / NOUVEAU » → « CO-ESII / Utiliser le logiciel d'édition audio Audacity » |
| SEM-10266 | CO-ESII / Apprendre Javascript avec p5.js / Formation hybride | `titleRaw` : « CO-ESII / Apprendre Javascript avec p5.js / NOUVEAU / Formation hybride » → « CO-ESII / Apprendre Javascript avec p5.js / Formation hybride » |
| SEM-10347 | EP-CO-ESII-OMP / L'erreur est humaine: introduction à l'esprit critique | `titleRaw` : « EP-CO-ESII-OMP / L'erreur est humaine: introduction à l'esprit critique / NOUVEAU » → « EP-CO-ESII-OMP / L'erreur est humaine: introduction à l'esprit critique » |
| SEM-10348 | EP-CO-ESII-OMP / Esprit critique : gestion de l'incertitude (bayésianisme) | `titleRaw` : « EP-CO-ESII-OMP / Esprit critique : gestion de l'incertitude (bayésianisme) / NOUVEAU » → « EP-CO-ESII-OMP / Esprit critique : gestion de l'incertitude (bayésianisme) » |
| SEM-10349 | EP-ESI-ESII-OMP / IA et esprit critique / Formation autonome en ligne | `titleRaw` : « EP-ESI-ESII-OMP / IA et esprit critique / NOUVEAU / Formation autonome en ligne » → « EP-ESI-ESII-OMP / IA et esprit critique / Formation autonome en ligne » |
| SEM-10350 | CO-ESII / Activités autour de l'IA pour les élèves | `titleRaw` : « CO-ESII / Activités autour de l'IA pour les élèves / NOUVEAU » → « CO-ESII / Activités autour de l'IA pour les élèves » |
| SEM-10408 | CO-ESII : Montage vidéo avec Da Vinci Resolve | `titleRaw` : « CO-ESII : Montage vidéo avec Da Vinci Resolve / NOUVEAU » → « CO-ESII : Montage vidéo avec Da Vinci Resolve » |
| SEM-10429 | CO-ESII / GarageBand : création de morceaux de musique avec un Mac | `titleRaw` : « CO-ESII / GarageBand : création de morceaux de musique avec un Mac / NOUVEAU » → « CO-ESII / GarageBand : création de morceaux de musique avec un Mac » |
| SEM-10449 | CO-ESII / Introduire un peu de classe inversée dans mes cours / Formation autonome en ligne | `titleRaw` : « CO-ESII / Introduire un peu de classe inversée dans mes cours / NOUVEAU / Formation autonome en ligne » → « CO-ESII / Introduire un peu de classe inversée dans mes cours / Formation autonome en ligne » |
| SEM-10463 | EP-CO-ESII / Utiliser les fraiseuses numériques (CNC) du FabLab du SEM | `titleRaw` : « EP-CO-ESII / Utiliser les fraiseuses numériques (CNC) du FabLab du SEM / NOUVEAU » → « EP-CO-ESII / Utiliser les fraiseuses numériques (CNC) du FabLab du SEM » |
| SEM-10464 | EP-CO-ESII / Utiliser les imprimantes 3D du FabLab du SEM | `titleRaw` : « EP-CO-ESII / Utiliser les imprimantes 3D du FabLab du SEM / NOUVEAU » → « EP-CO-ESII / Utiliser les imprimantes 3D du FabLab du SEM » |
| SEM-10465 | EP-CO-ESII / Utiliser la découpeuse vinyle du FabLab du SEM | `titleRaw` : « EP-CO-ESII / Utiliser la découpeuse vinyle du FabLab du SEM / NOUVEAU » → « EP-CO-ESII / Utiliser la découpeuse vinyle du FabLab du SEM » |
| SEM-10469 | CO-ESII / Enseigner à l'ère de ChatGPT et de l'IA / Formation autonome en ligne | `titleRaw` : « CO-ESII / Enseigner à l'ère de ChatGPT et de l'IA / Formation autonome en ligne / NOUVEAU » → « CO-ESII / Enseigner à l'ère de ChatGPT et de l'IA / Formation autonome en ligne » |
| SEM-10472 | EP-ESI-ESII-OMP / Utiliser la découpeuse laser du FabLab du SEM | `titleRaw` : « EP-ESI-ESII-OMP / Utiliser la découpeuse laser du FabLab du SEM / NOUVEAU » → « EP-ESI-ESII-OMP / Utiliser la découpeuse laser du FabLab du SEM » |
| SEM-10473 | EP-ESI-ESII-OMP / Découverte de la partie Fabrication numérique du FabLab du SEM | `titleRaw` : « EP-ESI-ESII-OMP / Découverte de la partie Fabrication numérique du FabLab du SEM / NOUVEAU » → « EP-ESI-ESII-OMP / Découverte de la partie Fabrication numérique du FabLab du SEM » |
| SEM-10524 | CO -ESII / Wikipédia en classe : Former des élèves critiques et acteurs du savoir / Formation hybride | `titleRaw` : « CO -ESII / Wikipédia en classe : Former des élèves critiques et acteurs du savoir / NOUVEAU / Formation hybride » → « CO -ESII / Wikipédia en classe : Former des élèves critiques et acteurs du savoir / Formation hybride » |
| SEM-10549 | ESII / Détecter plus efficacement le plagiat avec Compilatio / Formation autonome en ligne | `titleRaw` : « ESII / Détecter plus efficacement le plagiat avec Compilatio / NOUVEAU / Formation autonome en ligne » → « ESII / Détecter plus efficacement le plagiat avec Compilatio / Formation autonome en ligne » |
| SEM-10550 | ESII / Créer facilement une bibliographie avec ZoteroBib / Formation autonome en ligne | `titleRaw` : « ESII / Créer facilement une bibliographie avec ZoteroBib / NOUVEAU / Formation autonome en ligne » → « ESII / Créer facilement une bibliographie avec ZoteroBib / Formation autonome en ligne » |
| SEM-10617 | CO-PO / Générer des images avec l'intelligence artificielle | `titleRaw` : « CO-PO / Générer des images avec l'intelligence artificielle / NOUVEAU » → « CO-PO / Générer des images avec l'intelligence artificielle » |
| SEM-10658 | EP-OMP-CO-ESII / Les enjeux des droits d'auteurs et de protections des données / Formation autonome en ligne | `titleRaw` : « EP-OMP-CO-ESII / Les enjeux des droits d'auteurs et de protections des données / NOUVEAU / Formation autonome en ligne » → « EP-OMP-CO-ESII / Les enjeux des droits d'auteurs et de protections des données / Formation autonome en ligne » |
| SEM-10659 | EP-CO-ESII-OMP / IA et métacognition: Explorer les Liens entre Cerveau et Machine / Formation autonome en ligne | `titleRaw` : « EP-CO-ESII-OMP / IA et métacognition: Explorer les Liens entre Cerveau et Machine / NOUVEAU / Formation autonome en ligne » → « EP-CO-ESII-OMP / IA et métacognition: Explorer les Liens entre Cerveau et Machine / Formation autonome en ligne » |
| SEM-10713 | ESI-ESII / Introduction à LibreOffice.Math / Formation autonome en ligne | `titleRaw` : « ESI-ESII / Introduction à LibreOffice.Math / NOUVEAU » → « ESI-ESII / Introduction à LibreOffice.Math / Formation autonome en ligne » |
| SEM-10754 | CO-ESII : De meilleurs écrits avec Antidote / Formation autonome en ligne | `titleRaw` : « CO-ESII : De meilleurs écrits avec Antidote / NOUVEAU / Formation autonome en ligne » → « CO-ESII : De meilleurs écrits avec Antidote / Formation autonome en ligne » |
| SEM-10921 | EP-OMP-CO-ESII / Introduction à H5P / Formation autonome en ligne | `titleRaw` : « EP-OMP-CO-ESII / Introduction à H5P / Formation autonome en ligne / NOUVEAU » → « EP-OMP-CO-ESII / Introduction à H5P / Formation autonome en ligne » |
| SEM-10923 | EP-OMP-CO-ESII / Produire du contenu interactif avec H5P - niveau 2 / Formation autonome en ligne | `titleRaw` : « EP-OMP-CO-ESII / Produire du contenu interactif avec H5P - niveau 2 / Formation autonome en ligne / NOUVEAU » → « EP-OMP-CO-ESII / Produire du contenu interactif avec H5P - niveau 2 / Formation autonome en ligne » |
| SEM-10928 | EP-OMP-CO-ESII / Créer une activité automatisée avec H5P / Formation autonome en ligne | `titleRaw` : « EP-OMP-CO-ESII / Créer une activité automatisée avec H5P / Formation autonome en ligne / NOUVEAU » → « EP-OMP-CO-ESII / Créer une activité automatisée avec H5P / Formation autonome en ligne » |
| SEM-10929 | EP-OMP-CO-ESII / Créer une vidéo interactive avec H5P / Formation autonome en ligne | `titleRaw` : « EP-OMP-CO-ESII / Créer une vidéo interactive avec H5P / NOUVEAU / Formation autonome en ligne » → « EP-OMP-CO-ESII / Créer une vidéo interactive avec H5P / Formation autonome en ligne » |
| SEM-P1568 | EP / Usages pédagogiques de l'ordinateur de classe / Formation autonome en ligne | `titleRaw` : « EP / Usages pédagogiques de l'ordinateur de classe / Formation autonome en ligne / NOUVEAU » → « EP / Usages pédagogiques de l'ordinateur de classe / Formation autonome en ligne » |
| SEM-P1570 | EP-OMP / Didactique de l'informatique : Scratch Jr, Scratch et Bluebot | `titleRaw` : « EP-OMP / Didactique de l'informatique : Scratch Jr, Scratch et Bluebot / Nouveau » → « EP-OMP / Didactique de l'informatique : Scratch Jr, Scratch et Bluebot » |
| SEM-P1571 | EP-OMP / Didactique de l'informatique : Thymio | `titleRaw` : « EP-OMP / Didactique de l'informatique : Thymio / Nouveau » → « EP-OMP / Didactique de l'informatique : Thymio » |
| SEM-P1572 | EP-OMP / Soutenir la participation et ancrer les apprentissages avec un outil numérique simple | `titleRaw` : « EP-OMP / Soutenir la participation et ancrer les apprentissages avec un outil numérique simple / NOUVEAU » → « EP-OMP / Soutenir la participation et ancrer les apprentissages avec un outil numérique simple » |
| SEM-P1573 | EP-OMP / Blue-Bot en classe : une démarche pluridisciplinaire | `titleRaw` : « EP-OMP / Blue-Bot en classe : une démarche pluridisciplinaire / Nouveau » → « EP-OMP / Blue-Bot en classe : une démarche pluridisciplinaire » |
| SEM-P4001 | EP / Formation institutionnelle obligatoire / TBI (Base) pour le Cycle 2 | `hasOpenSession` : « false » → « true » |
| SEM1122 | Ajuster sa voix et son comportement non verbal, force d'influence | `hasOpenSession` : « false » → « true » |
| SEM1151 | Sensibilisation à la Communication NonViolente (CNV©) | `hasOpenSession` : « true » → « false » |
| SEM1166 | L'intelligence émotionnelle au service de la conduite d'équipe | `hasOpenSession` : « false » → « true » |
| SEM1196 | Accompagner et vivre le changement | `hasOpenSession` : « false » → « true » |
| SEM1215 | Les neurosciences au service du management | `hasOpenSession` : « false » → « true » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| EP-1051 | Enseigner la musique au CE en articulant activités clés en main et objectifs PER | `contentRaw` |
| EP-732 | Les inégalités scolaires de genre : de la théorie à la pratique, de la classe au préau | `contentRaw` |
| EP-994 | Improvisation au piano pour accompagner et inciter au mouvement durant les leçons de musique/mouvement | `objectivesRaw` |
| OMP-039 | Autisme et enseignement structuré suivant le TEACCH Programme | `contentRaw` |
| OMP-106 | La danse au service des élèves à besoins éducatifs particuliers | `objectivesRaw`, `prerequisitesRaw` |
| OMP-107 | Utiliser Popplet pour soutenir la mémorisation et la structuration de la pensée chez les élèves | `objectivesRaw`, `contentRaw`, `prerequisitesRaw` |
| SEM-10239 | CO-ESII / Des pistes pour intégrer les droits humains dans son enseignement en découvrant des films (documentaires et fictions) et des intervenants en lien avec le festival FIFDH. | `contentRaw` |
| SEM-10347 | EP-CO-ESII-OMP / L'erreur est humaine: introduction à l'esprit critique | `generalInformationRaw` |
| SEM-10348 | EP-CO-ESII-OMP / Esprit critique : gestion de l'incertitude (bayésianisme) | `generalInformationRaw` |
| SEM-10352 | ESI-ESII / Accompagner vos élèves vers un usage plus responsable des smartphones / NOUVEAU / Formation autonome en ligne | `objectivesRaw` |
| SEM-10441 | EP-CO-ESII / Modélisation et réalisation d'objet en 3D | `contentRaw` |
| SEM-10447 | EP-CO-ESII / S'organiser pour réduire son stress avec un logiciel de prise de notes / Formation autonome en ligne | `generalInformationRaw` |
| SEM-10541 | CO-ESII / Créer des questionnaires avec Google Forms / Formation autonome en ligne | `objectivesRaw` |
| SEM-10548 | CO-ESII / Des outils numériques pour accompagner des TP en Sciences / Formation autonome en ligne | `objectivesRaw` |
| SEM-10605 | CO-ESII / L'image et la représentation du réel dans le cinéma documentaire aujourd'hui avec le Festival Visions du Réel | `contentRaw` |
| SEM-10607 | CO-ESII / L'image filmique au service des sciences humaines avec le Festival Black Movie | `contentRaw` |
| SEM-10615 | CO-ESII / Le film au coeur des enjeux humains et sociaux de l'Amérique du Sud avec le festival FILMAR | `generalInformationRaw` |
| SEM-10705 | CO-ESII / Cortex : apprendre son vocabulaire tout en s'amusant / Formation autonome en ligne | `generalInformationRaw` |
| SEM-10754 | CO-ESII : De meilleurs écrits avec Antidote / Formation autonome en ligne | `generalInformationRaw` |
| SEM-10906 | CO-ESII / Moodle : Devenir autonome - l'évaluation critériée dans Moodle / Formation autonome en ligne | `objectivesRaw` |
| SEM-10913 | CO-ESII / Moodle : évaluations automatisées - niveau 2 / Formation autonome en ligne | `contentRaw` |
| SEM-P1083 | EP-OMP-CO-ESII / Et si votre classe réalisait un court film ! / Formation hybride | `objectivesRaw`, `contentRaw` |
| SEM-P1525 | EP-OMP / Tablettes numériques en classe | `generalInformationRaw` |
| SEM-P1534 | EP-OMP / Photographie argentique (UNIQUEMENT C2/7P-8P et DS) | `objectivesRaw` |
| SEM-P1535 | EP-OMP / Usages pédagogiques des tablettes numériques / Formation autonome en ligne | `generalInformationRaw` |
| SEM-P1563 | EP-OMP / LaDigitale.dev : des outils numériques simples pour optimiser des gestes quotidiens en classe / Formation autonome en ligne | `contentRaw` |
| SEM-P1565 | EP-OMP / Apprendre l'analyse des vidéos publicitaires avec ses élèves / Formation autonome en ligne | `generalInformationRaw` |
| SEM-P1566 | EP-CO-ESII-OMP / La formation de l'image photographique ; construire un sténopé en classe avec une boîte à chaussures | `objectivesRaw` |
| SEM-P1567 | EP-CO-ESII-OMP / L'animation filmique comme vecteur de la compréhension du monde avec le festival Animatou | `objectivesRaw` |
| SEM-P1572 | EP-OMP / Soutenir la participation et ancrer les apprentissages avec un outil numérique simple | `generalInformationRaw`, `objectivesRaw` |

### Changements d’offres

Aucun rattachement à une offre n’a changé.

### Anomalies techniques

Aucune anomalie technique.

## Surveillance des références validées

Ces signaux sont informatifs et non bloquants. Ils ne modifient ni le ciblage ni le statut de validation.

| Indicateur | Références |
| --- | ---: |
| Références contrôlées | 24 |
| Références présentes | 21 |
| Références absentes | 3 |
| Références identiques | 20 |
| Revues métier prioritaires | 0 |
| Revues métier | 0 |
| Références nécessitant une revue métier | 0 |
| Informations à examiner | 1 |
| Enrichissements | 0 |
| Évolutions contextuelles | 0 |
| Différences typographiques | 0 |

| Code | Catégorie d’écart | Champ | Valeur de référence | Valeur actuelle |
| --- | --- | --- | --- | --- |
| CO-01660 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| EP-520 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| CO-01686 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP<br>Les participants identifient quelques-unes des préoccupations majeures des élèves, de leurs familles et des enseignants qui les côtoient à travers une expérience rapportée du terrain ;<br>A la fin de la séance, les participants sont capables d'identifier les défis pour ces familles et, en collaboration avec les personnes ressources de leur établissement (conseillères et conseillers sociaux, éducatrices et éducateurs), de mieux les orienter.` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP` |
| OCD207 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |

## Offres détectées

| Offre | Occurrences | Formations uniques |
| --- | ---: | ---: |
| Détention - Offre de formation de l'OCD | 57 | 57 |
| DF-OPE - L'offre de formation de l'OPE | 169 | 169 |
| DIP - Service de la formation DRH-DIP | 3 | 3 |
| DIP-CO - Offre de formation du Cycle d'orientation | 229 | 229 |
| DIP-EP - Offre de formation de l'enseignement primaire | 305 | 305 |
| DIP-ES II - Offre de formation de l'ES II | 242 | 242 |
| DIP-OMP - Offre formation de l'OMP | 235 | 235 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 154 | 154 |
| PJ - Offre de formation du pouvoir judiciaire | 55 | 55 |
| POLICE - CFPS - Centre de Formation de la Police | 193 | 193 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1044/1044 | 100.0 % |
| `domainRaw` | 1044/1044 | 100.0 % |
| `themeRaw` | 978/1044 | 93.7 % |
| `publicRaw` | 932/1044 | 89.3 % |
| `durationRaw` | 1027/1044 | 98.4 % |
| `targetAudienceRaw` | 925/1044 | 88.6 % |
| `generalInformationRaw` | 523/1044 | 50.1 % |
| `objectivesRaw` | 996/1044 | 95.4 % |
| `contentRaw` | 932/1044 | 89.3 % |
| `prerequisitesRaw` | 383/1044 | 36.7 % |
| `additionalInformationRaw` | 341/1044 | 32.7 % |

### Correspondance des libellés officiels

- `Public visé` → `targetAudienceRaw`
- `Généralités` / `Généralité` → `generalInformationRaw`
- `Objectifs` → `objectivesRaw`
- `Contenu` → `contentRaw`
- `Pré-requis` → `prerequisitesRaw`
- `Informations complémentaires` → `additionalInformationRaw`

Libellés de blocs observés : `Contenu`, `Détails de l'inscription`, `Généralités`, `Informations complémentaires`, `Intervenant(e)(s)`, `Langue du cours`, `Mots-clés`, `Méthodologie`, `Objectifs`, `Organisation`, `Proposition de`, `Pré-requis`, `Préambule`, `Public visé`, `Support`, `Voir aussi`.

## Exemples de formations multi-offres

| Code | Intitulé | Occurrences | Offres finales | Objets JSON |
| --- | --- | ---: | --- | ---: |
| SEM-10204 | EP-CO-ESII-OMP / Traitement de texte et tableur : utiliser les styles / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10213 | EP-CO-ESII-OMP / Présentation : Maîtriser l'art des présentations avec Sozi ! / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10321 | EP-CO-ESII-OMP / : L'information à l'ère digitale : des fake news aux bulles filtrantes! / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10346 | EP-CO-ESII-OMP / Problèmes liés au biais et à la sécurité des intelligence artificielles / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10347 | EP-CO-ESII-OMP / L'erreur est humaine: introduction à l'esprit critique | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10348 | EP-CO-ESII-OMP / Esprit critique : gestion de l'incertitude (bayésianisme) | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10349 | EP-ESI-ESII-OMP / IA et esprit critique / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10351 | EP-ESI-ESII-OMP / Rechercher avec des IA (et sans !) / NOUVEAU / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10454 | EP-CO-ESII-OMP / Impression 3D, la base pour créer des objets 3D et les imprimer / Formation hybride | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10470 | EP-CO-ESII-OMP / Convertir des fichiers audio et vidéo avec VLC / Formation autonome en ligne / NOUVEAU | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |

## Anomalies de l’index et minimisation des données

- Lignes de cours non analysées : 0
- Occurrences répétées dans une même offre : 0
- Codes avec plusieurs intitulés dans l’index : 0
- Sections écartées car elles contenaient une coordonnée de contact : 21

### Sections exclues pour minimisation des données

Ces sections n’ont pas été copiées car elles contenaient une adresse électronique ou un numéro de téléphone.

- OCD001E — Informations complémentaires (`additionalInformationRaw`)
- TRT701 — Informations complémentaires (`additionalInformationRaw`)
- TRT700 — Informations complémentaires (`additionalInformationRaw`)
- TRT703 — Informations complémentaires (`additionalInformationRaw`)
- TRT702 — Informations complémentaires (`additionalInformationRaw`)
- SFIN-001 — Généralités (`generalInformationRaw`)
- SFIN-002 — Généralités (`generalInformationRaw`)
- TRT011 — Informations complémentaires (`additionalInformationRaw`)
- TRT012 — Informations complémentaires (`additionalInformationRaw`)
- SFIN-003 — Généralités (`generalInformationRaw`)
- TRT023 — Informations complémentaires (`additionalInformationRaw`)
- TRT024 — Informations complémentaires (`additionalInformationRaw`)
- EP-373FEX — Généralités (`generalInformationRaw`)
- EP-372FEX — Généralités (`generalInformationRaw`)
- EP-002ANG — Pré-requis (`prerequisitesRaw`)
- FP254 — Informations complémentaires (`additionalInformationRaw`)
- FP208 — Généralités (`generalInformationRaw`)
- FP209 — Généralités (`generalInformationRaw`)
- FP210 — Généralités (`generalInformationRaw`)
- FP217 — Généralités (`generalInformationRaw`)
- FP218 — Généralités (`generalInformationRaw`)

## Erreurs de récupération

Aucune erreur.

## Contrôles d’unicité

- Aucun code dupliqué : réussi
- Nombre d’objets égal au nombre de codes uniques : réussi
- Aucune offre dupliquée dans `catalogueOffers` : réussi
- Chaque code traité une seule fois : réussi
- Une formation multi-offres reste un objet unique : réussi

## Audit de sécurité

Aucun token, secret, mot de passe, chemin Windows personnel, clé privée ou adresse électronique n’a été détecté dans les artefacts générés.

## Conclusion technique

Les contrôles structurels sont réussis. Toute intégration dans l’application reste soumise à une validation distincte.

## Promotion

- Date et heure de promotion : 2026-09-15T08:37:55.149Z
- Snapshot candidat validé : 2026-09-15
- Empreinte SHA-256 : `605500c1920849dfe3e712e4332d609cda8792f414147f6abe5ef17bce619608`
- Promotion manuelle confirmée.
