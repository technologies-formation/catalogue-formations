# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-09-25
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 119.2 secondes
- Taille du JSON final : 2.03 Mio (2129289 octets)
- Empreinte SHA-256 du snapshot : `73175e7dfe398306febff33d2b95e41a6210ea8778b8577f88517b640d9be13b`

## Synthèse

- Occurrences détectées dans l’index : 1627
- Codes uniques : 1043
- Occurrences éliminées par déduplication : 584
- Formations présentes dans plusieurs offres : 295
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1043
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1057 |
| Cours dans le candidat | 1043 |
| Cours ajoutés | 2 |
| Cours supprimés | 16 |
| Cours modifiés | 10 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| EP-1344ETB | Parler pour apprendre | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Langues |
| SEM000 | (intitulé \| POS1) Améliorer l'expérience utilisateur dans l'Espace de formation (Intitulé : Zéphir) | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | Informatique Bureautique |

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
| SEM-10347 | EP-CO-ESII-OMP / L'erreur est humaine: introduction à l'esprit critique | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | DIP-SEM / Secteur Formation | Médias, image, numérique |
| SEM-10429 | CO-ESII / GarageBand : création de morceaux de musique avec un Mac | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-SEM - Offre de formation du Service Écoles-Médias | DIP-SEM / Secteur Formation | Arts |
| SEM-10524 | CO -ESII / Wikipédia en classe : Former des élèves critiques et acteurs du savoir / Formation hybride | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | DIP-SEM / Secteur Formation | Médias, image, numérique |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EP-092EVEN | Enseigner au cycle élémentaire : enjeux, apports et pistes pour construire les bases de la réussite scolaire - différé | `hasOpenSession` : « true » → « false » |
| PJ-0098 | Gestion des pièces à conviction - Magistrats | `hasOpenSession` : « true » → « false » |
| S2-PREQ01 | Analyse des pratiques professionnelles (APP) à l'attention du personnel enseignant du préqualifiant | `hasOpenSession` : « false » → « true »<br>`hasScheduledSession` : « true » → « false » |
| SEM-10656 | EP-CO-ESII-OMP / A la découverte du Cyanotype | `hasOpenSession` : « true » → « false » |
| SEM0733 | Améliorer l'ergonomie de son poste de travail | `hasOpenSession` : « true » → « false » |
| SEM1108 | Parler en public | `hasOpenSession` : « false » → « true » |
| SEM1195 | Communication et feed-back constructif | `hasOpenSession` : « true » → « false » |
| SEM1209 | Assertivité et confiance en soi en situation de travail | `hasOpenSession` : « false » → « true » |
| TRT1005 | Excel 365 Base | `hasScheduledSession` : « false » → « true » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| EP-004EPP | Encadrer, planifier et sécuriser les activités scolaires (anciennement prévention des accidents) | `prerequisitesRaw` |
| S2-PREQ01 | Analyse des pratiques professionnelles (APP) à l'attention du personnel enseignant du préqualifiant | `contentRaw` |

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
| DIP-CO - Offre de formation du Cycle d'orientation | 226 | 226 |
| DIP-EP - Offre de formation de l'enseignement primaire | 305 | 305 |
| DIP-ES II - Offre de formation de l'ES II | 239 | 239 |
| DIP-OMP - Offre formation de l'OMP | 230 | 230 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 151 | 151 |
| POLICE - CFPS - Centre de Formation de la Police | 193 | 193 |
| Pouvoir Judiciaire - Offre de formation du Pouvoir judiciaire | 54 | 54 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1043/1043 | 100.0 % |
| `domainRaw` | 1043/1043 | 100.0 % |
| `themeRaw` | 977/1043 | 93.7 % |
| `publicRaw` | 930/1043 | 89.2 % |
| `durationRaw` | 1025/1043 | 98.3 % |
| `targetAudienceRaw` | 924/1043 | 88.6 % |
| `generalInformationRaw` | 519/1043 | 49.8 % |
| `objectivesRaw` | 994/1043 | 95.3 % |
| `contentRaw` | 926/1043 | 88.8 % |
| `prerequisitesRaw` | 382/1043 | 36.6 % |
| `additionalInformationRaw` | 340/1043 | 32.6 % |

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
- TRT701 — Informations complémentaires (`additionalInformationRaw`)
- TRT703 — Informations complémentaires (`additionalInformationRaw`)
- TRT702 — Informations complémentaires (`additionalInformationRaw`)
- TRT700 — Informations complémentaires (`additionalInformationRaw`)
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

- Date et heure de promotion : 2026-09-25T08:45:54.753Z
- Snapshot candidat validé : 2026-09-25
- Empreinte SHA-256 : `73175e7dfe398306febff33d2b95e41a6210ea8778b8577f88517b640d9be13b`
- Promotion manuelle confirmée.
