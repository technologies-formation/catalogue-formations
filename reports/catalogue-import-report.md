# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-10-15
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 137.4 secondes
- Taille du JSON final : 2.02 Mio (2122655 octets)
- Empreinte SHA-256 du snapshot : `11b29b9f606d02a0380a4da070a1cc489a8c880f6c88dabfebdda2362b7ff3e6`

## Synthèse

- Occurrences détectées dans l’index : 1609
- Codes uniques : 1049
- Occurrences éliminées par déduplication : 560
- Formations présentes dans plusieurs offres : 287
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1049
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1059 |
| Cours dans le candidat | 1049 |
| Cours ajoutés | 3 |
| Cours supprimés | 13 |
| Cours modifiés | 14 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| CO-1172CFP | FIO IOSP : VISITES AUX CFP | DIP-CO - Offre de formation du Cycle d'orientation | DGEO/SRH/Secteur de la formation continue EO | Formation générale |
| EP-1357ETB | La distance émotionnelle dans la posture enseignante | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Formations spécifiques |
| SEM1264 | Optimiser sa rédaction professionnelle à l'ère de l'IA | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | COMMUNIQUER ET TRANSMETTRE |

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
| EP-979 | Créer et relier un livre avec les moyens du bord (CE) | `hasOpenSession` : « true » → « false » |
| FP003 | Formation coach | `hasOpenSession` : « true » → « false » |
| FP020 | Pilotage automobile | `hasOpenSession` : « true » → « false » |
| SEM-10244 | CO-ESII / Une promenade en images pour l'Histoire de Genève : rencontre avec A. Bosch, conférencier et historien | `hasOpenSession` : « false » → « true » |
| SEM-P1534 | EP-OMP / Photographie argentique (UNIQUEMENT C2/7P-8P et DS) | `publicRaw` : « enseignant-e-s cycle 2 & division spécialisée » → « Ensemble du corps enseignant »<br>`hasOpenSession` : « true » → « false » |
| SEM-P4011 | OMP / Formation institutionnelle obligatoire science informatique pour l'OMP Primaire | `hasOpenSession` : « true » → « false » |
| SEM0487 | L'Etat et son administration : les fondamentaux | `titleRaw` : « Approche institutionnelle de l'administration cantonale » → « L'Etat et son administration : les fondamentaux » |
| SEM1043 | Trouver sa place dans la complexité du monde professionnel | `titleRaw` : « Comment aborder sereinement la complexité et l'ambiguïté du monde du travail ? » → « Trouver sa place dans la complexité du monde professionnel » |
| SEM1161 | Sensibilisation à la pleine-conscience au travail | `hasOpenSession` : « true » → « false » |
| SEM1164 | Faciliter des démarches d'intelligence collective au service de la transformation | `titleRaw` : « L'intelligence collective au service de la transformation et l'innovation » → « Faciliter des démarches d'intelligence collective au service de la transformation » |
| SEM1197 | Formatrices et formateurs occasionnels : construire et animer une formation | `titleRaw` : « Formateurs occasionnels: construire et animer une formation » → « Formatrices et formateurs occasionnels : construire et animer une formation » |
| SEM1214 | Charge mentale au travail: s'en décharger avant la surcharge | `titleRaw` : « Charge mentale au travail: s'en décharger avant d'être surchargé.e » → « Charge mentale au travail: s'en décharger avant la surcharge » |
| TRT1003 | Certification ICDL (ECDL) | `hasScheduledSession` : « false » → « true » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| S2-FOSEC4 | Premiers secours : cours de perfectionnement pour personnes préposées aux premiers secours de l'ES II et de l'ES I | `prerequisitesRaw` |
| SEM0487 | L'Etat et son administration : les fondamentaux | `generalInformationRaw`, `objectivesRaw` |
| SEM1043 | Trouver sa place dans la complexité du monde professionnel | `generalInformationRaw`, `objectivesRaw`, `contentRaw` |
| SEM1164 | Faciliter des démarches d'intelligence collective au service de la transformation | `objectivesRaw`, `contentRaw`, `additionalInformationRaw` |

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
| Références identiques | 19 |
| Revues métier prioritaires | 0 |
| Revues métier | 0 |
| Références nécessitant une revue métier | 0 |
| Informations à examiner | 2 |
| Enrichissements | 0 |
| Évolutions contextuelles | 0 |
| Différences typographiques | 0 |

| Code | Catégorie d’écart | Champ | Valeur de référence | Valeur actuelle |
| --- | --- | --- | --- | --- |
| DIP-002 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Cette séance d'accueil s'adresse aux personnes nouvellement engagées au sein du DIP, répondant aux critères suivants :<br><br>- le personnel administratif et technique<br>- les apprenties et apprentis<br>- le personnel enseignant engagé en cours d'année scolaire, n'ayant pas bénéficié d'une séance d'accueil organisée par sa direction générale<br><br>Dans certains cas, des auxiliaires peuvent également être invitées et invités à y prendre part.` | `Cette séance d'accueil s'adresse aux personnes nouvellement engagées au sein du DIP, répondant aux critères suivants :<br>- le personnel administratif et technique<br>- le personnel enseignant engagé en cours d'année scolaire, n'ayant pas bénéficié d'une séance d'accueil organisée par sa direction générale<br>Dans certains cas, des auxiliaires peuvent également être invitées et invités à y prendre part.` |
| CO-01660 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| EP-520 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| CO-01686 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP<br>Les participants identifient quelques-unes des préoccupations majeures des élèves, de leurs familles et des enseignants qui les côtoient à travers une expérience rapportée du terrain ;<br>A la fin de la séance, les participants sont capables d'identifier les défis pour ces familles et, en collaboration avec les personnes ressources de leur établissement (conseillères et conseillers sociaux, éducatrices et éducateurs), de mieux les orienter.` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP` |
| OCD207 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |

## Offres détectées

| Offre | Occurrences | Formations uniques |
| --- | ---: | ---: |
| Détention - Offre de formation de l'OCD | 57 | 57 |
| DF-OPE - L'offre de formation de l'OPE | 165 | 165 |
| DIP - Service de la formation DRH-DIP | 4 | 4 |
| DIP-CO - Offre de formation du Cycle d'orientation | 218 | 218 |
| DIP-EP - Offre de formation de l'enseignement primaire | 314 | 314 |
| DIP-ES II - Offre de formation de l'ES II | 233 | 233 |
| DIP-OMP - Offre formation de l'OMP | 228 | 228 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 143 | 143 |
| POLICE - CFPS - Centre de Formation de la Police | 193 | 193 |
| Pouvoir Judiciaire - Offre de formation du Pouvoir judiciaire | 54 | 54 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1049/1049 | 100.0 % |
| `domainRaw` | 1049/1049 | 100.0 % |
| `themeRaw` | 983/1049 | 93.7 % |
| `publicRaw` | 934/1049 | 89.0 % |
| `durationRaw` | 1029/1049 | 98.1 % |
| `targetAudienceRaw` | 934/1049 | 89.0 % |
| `generalInformationRaw` | 512/1049 | 48.8 % |
| `objectivesRaw` | 996/1049 | 94.9 % |
| `contentRaw` | 918/1049 | 87.5 % |
| `prerequisitesRaw` | 369/1049 | 35.2 % |
| `additionalInformationRaw` | 320/1049 | 30.5 % |

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
| SEM-10348 | EP-CO-ESII-OMP / Esprit critique : gestion de l'incertitude (bayésianisme) | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10349 | EP-ESI-ESII-OMP / IA et esprit critique / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10351 | EP-ESI-ESII-OMP / Rechercher avec des IA (et sans !) / NOUVEAU / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10454 | EP-CO-ESII-OMP / Impression 3D, la base pour créer des objets 3D et les imprimer / Formation hybride | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10470 | EP-CO-ESII-OMP / Convertir des fichiers audio et vidéo avec VLC / Formation autonome en ligne / NOUVEAU | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10471 | EP-CO-ESII-OMP / Apprendre à faire des montages vidéos avec vos élèves en utilisant les configurations du DIP<br>/ Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |

## Anomalies de l’index et minimisation des données

- Lignes de cours non analysées : 0
- Occurrences répétées dans une même offre : 0
- Codes avec plusieurs intitulés dans l’index : 0
- Sections écartées car elles contenaient une coordonnée de contact : 22

### Sections exclues pour minimisation des données

Ces sections n’ont pas été copiées car elles contenaient une adresse électronique ou un numéro de téléphone.

- OCD001E — Informations complémentaires (`additionalInformationRaw`)
- TRT700 — Informations complémentaires (`additionalInformationRaw`)
- TRT701 — Informations complémentaires (`additionalInformationRaw`)
- TRT702 — Informations complémentaires (`additionalInformationRaw`)
- TRT703 — Informations complémentaires (`additionalInformationRaw`)
- SFIN-001 — Généralités (`generalInformationRaw`)
- SFIN-002 — Généralités (`generalInformationRaw`)
- SFIN-003 — Généralités (`generalInformationRaw`)
- TRT011 — Informations complémentaires (`additionalInformationRaw`)
- TRT012 — Informations complémentaires (`additionalInformationRaw`)
- TRT023 — Informations complémentaires (`additionalInformationRaw`)
- TRT024 — Informations complémentaires (`additionalInformationRaw`)
- EP-372FEX — Généralités (`generalInformationRaw`)
- EP-373FEX — Généralités (`generalInformationRaw`)
- S2-301 — Informations complémentaires (`additionalInformationRaw`)
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

- Date et heure de promotion : 2026-10-15T08:13:54.552Z
- Snapshot candidat validé : 2026-10-15
- Empreinte SHA-256 : `11b29b9f606d02a0380a4da070a1cc489a8c880f6c88dabfebdda2362b7ff3e6`
- Promotion manuelle confirmée.
