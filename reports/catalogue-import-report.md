# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-09-16
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 138.7 secondes
- Taille du JSON final : 2.05 Mio (2152858 octets)
- Empreinte SHA-256 du snapshot : `2e19ae981d7aaa2ca3556185eade298531cfcb21575e1c04582ef88a32c76dce`

## Synthèse

- Occurrences détectées dans l’index : 1656
- Codes uniques : 1057
- Occurrences éliminées par déduplication : 599
- Formations présentes dans plusieurs offres : 301
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1057
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1044 |
| Cours dans le candidat | 1057 |
| Cours ajoutés | 17 |
| Cours supprimés | 4 |
| Cours modifiés | 16 |
| Cours dont les offres ont changé | 1 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| EP-1332ETB | Apprendre par le corps | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Corps et mouvement |
| EP-1333ETB | Des pratiques pédagogiques diversifiées et en mouvement : concevoir des apprentissages transversaux par le parcours. | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Profession enseignante |
| EP-1334ETB | Apprendre à apprendre | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Capacités transversales |
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
| S2-301 | Voyage à Auschwitz-Birkenau | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP | Direction générale de l'enseig. secondaire II | Sciences humaines et sociales |

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| EP-1034 | Exercice de l'autorité pédagogique en classe | DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-OMP - Offre formation de l'OMP | DGEO/SRH/Secteur de la formation continue EO | Profession enseignante |
| EP-739 | Collaboration (multi)professionnelle dans les établissements scolaires : comprendre, analyser, agir | DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-OMP - Offre formation de l'OMP | DGEO/SRH/Secteur de la formation continue EO | Capacités transversales |
| EP-997 | Cercle vertueux propice aux apprentissages : de la théorie à la pratique | DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-OMP - Offre formation de l'OMP | DGEO/SRH/Secteur de la formation continue EO | Profession enseignante |
| SEM000 | (intitulé \| POS1) Améliorer l'expérience utilisateur dans l'Espace de formation (Intitulé : Zéphir) | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | Informatique Bureautique |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EO-008 | Conduire un entretien avec des parents | `hasOpenSession` : « true » → « false » |
| EO-010 | Histoire sans chute ou comment repenser le travail du textile dans nos ateliers | `publicRaw` : « Enseignant-e-s MDAS » → « Enseignants de l'EP + CO »<br>`targetAudienceRaw` : « Personnel enseignant MDAS AC&M et AV uniquement » → « Personnel enseignant CE+CM (MGEN*, ECSP, ECA, MDAS) Personnel enseignant ESI » |
| EP-095MDAS | Comprendre et gérer les conflits en EPS : stratégies d'autorégulation | `hasOpenSession` : « true » → « false » |
| EP-1042 | Développement de la communication et du langage oral, TDL, défis langagiers et stratégies pédagogiques (1P-2P) | `hasOpenSession` : « true » → « false » |
| EP-730 | Les corridors biologiques : séquence interdisciplinaire 7P-8P | `hasOpenSession` : « true » → « false » |
| EP-994 | Improvisation au piano pour accompagner et inciter au mouvement durant les leçons de musique/mouvement | `hasOpenSession` : « true » → « false » |
| OMP-001TEP | Formation à la technique d'entretien de préoccupation partagée (TEPP) | `hasOpenSession` : « false » → « true » |
| S2-EPS18 | Escalade : perfectionnement J+S | `hasOpenSession` : « true » → « false » |
| SEM-10524 | CO -ESII / Wikipédia en classe : Former des élèves critiques et acteurs du savoir / Formation hybride | `hasOpenSession` : « true » → « false » |
| SEM-P1511 | EP-OMP / Introduction à Thymio : observer, comprendre et relever des défis autour des concepts de la robotique | `hasOpenSession` : « true » → « false » |
| SEM0737 | Les bases de la gestion de projet | `hasOpenSession` : « true » → « false » |
| SEM1085 | Finances et comptabilité | `hasOpenSession` : « false » → « true » |
| SEM1122 | Ajuster sa voix et son comportement non verbal, force d'influence | `hasOpenSession` : « true » → « false » |
| SEM1166 | L'intelligence émotionnelle au service de la conduite d'équipe | `hasOpenSession` : « true » → « false » |
| SEM1216 | Lecture rapide à l'ère numérique | `hasOpenSession` : « false » → « true » |
| SEM1243 | Identification et transfert des savoirs pour les futures personnes retraitées | `hasOpenSession` : « false » → « true » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| OMP-001TEP | Formation à la technique d'entretien de préoccupation partagée (TEPP) | `durationRaw`, `contentRaw`, `prerequisitesRaw` |

### Changements d’offres

| Code | Intitulé | Offres ajoutées | Offres retirées |
| --- | --- | --- | --- |
| EO-010 | Histoire sans chute ou comment repenser le travail du textile dans nos ateliers | DIP-CO - Offre de formation du Cycle d'orientation | — |

### Anomalies techniques

Aucune anomalie technique.

## Surveillance des références validées

Ces signaux sont informatifs et non bloquants. Ils ne modifient ni le ciblage ni le statut de validation.

| Indicateur | Références |
| --- | ---: |
| Références contrôlées | 24 |
| Références présentes | 22 |
| Références absentes | 2 |
| Références identiques | 21 |
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

## Offres détectées

| Offre | Occurrences | Formations uniques |
| --- | ---: | ---: |
| Détention - Offre de formation de l'OCD | 70 | 70 |
| DF-OPE - L'offre de formation de l'OPE | 168 | 168 |
| DIP - Service de la formation DRH-DIP | 3 | 3 |
| DIP-CO - Offre de formation du Cycle d'orientation | 231 | 231 |
| DIP-EP - Offre de formation de l'enseignement primaire | 306 | 306 |
| DIP-ES II - Offre de formation de l'ES II | 243 | 243 |
| DIP-OMP - Offre formation de l'OMP | 233 | 233 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 154 | 154 |
| PJ - Offre de formation du pouvoir judiciaire | 55 | 55 |
| POLICE - CFPS - Centre de Formation de la Police | 193 | 193 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1057/1057 | 100.0 % |
| `domainRaw` | 1057/1057 | 100.0 % |
| `themeRaw` | 978/1057 | 92.5 % |
| `publicRaw` | 945/1057 | 89.4 % |
| `durationRaw` | 1040/1057 | 98.4 % |
| `targetAudienceRaw` | 938/1057 | 88.7 % |
| `generalInformationRaw` | 534/1057 | 50.5 % |
| `objectivesRaw` | 1007/1057 | 95.3 % |
| `contentRaw` | 942/1057 | 89.1 % |
| `prerequisitesRaw` | 382/1057 | 36.1 % |
| `additionalInformationRaw` | 343/1057 | 32.5 % |

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
- Sections écartées car elles contenaient une coordonnée de contact : 22

### Sections exclues pour minimisation des données

Ces sections n’ont pas été copiées car elles contenaient une adresse électronique ou un numéro de téléphone.

- OCD001E — Informations complémentaires (`additionalInformationRaw`)
- TRT701 — Informations complémentaires (`additionalInformationRaw`)
- TRT700 — Informations complémentaires (`additionalInformationRaw`)
- TRT702 — Informations complémentaires (`additionalInformationRaw`)
- TRT703 — Informations complémentaires (`additionalInformationRaw`)
- SFIN-002 — Généralités (`generalInformationRaw`)
- SFIN-001 — Généralités (`generalInformationRaw`)
- SFIN-003 — Généralités (`generalInformationRaw`)
- TRT012 — Informations complémentaires (`additionalInformationRaw`)
- TRT011 — Informations complémentaires (`additionalInformationRaw`)
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

- Date et heure de promotion : 2026-09-16T08:31:59.302Z
- Snapshot candidat validé : 2026-09-16
- Empreinte SHA-256 : `2e19ae981d7aaa2ca3556185eade298531cfcb21575e1c04582ef88a32c76dce`
- Promotion manuelle confirmée.
