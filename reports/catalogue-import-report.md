# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-11-24
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 146.4 secondes
- Taille du JSON final : 2.11 Mio (2215688 octets)
- Empreinte SHA-256 du snapshot : `f45cb5d1b1fb7549b519ce1a094a7efd9f852f042ba6175a45d8b19dd0a5a2bc`

## Synthèse

- Occurrences détectées dans l’index : 1633
- Codes uniques : 1078
- Occurrences éliminées par déduplication : 555
- Formations présentes dans plusieurs offres : 284
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1078
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1077 |
| Cours dans le candidat | 1078 |
| Cours ajoutés | 1 |
| Cours supprimés | 0 |
| Cours modifiés | 6 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| CO-1172ENT | FIO IOSP : VISITES EN ENTREPRISE | DIP-CO - Offre de formation du Cycle d'orientation | DGEO/SRH/Secteur de la formation continue EO | Formation générale |

### Cours supprimés

Aucun cours supprimé.

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EP-1336ETB | Plans de travail/atelier/autonomie/Différenciation/Coopération | `targetAudienceRaw` : `null` → « Personnel enseignant CE+CM (MGEN*, ECSP, ECA, MDAS) Personnel enseignant OMP *maitresses et maitres généralistes titulaires de classe » |
| FP211 | EC1 Processus d'évaluation SOF - Inscription participant-e-s | `hasOpenSession` : « true » → « false » |
| OMP-084 | Le théâtre d'improvisation: un outil pédagogique ludique pour la cohésion de groupe et l'amélioration du climat scolaire. | `hasOpenSession` : « true » → « false » |
| PJ-0068 | Sensibilisation à la sécurité du système d'information | `hasOpenSession` : « false » → « true » |
| S2-221 | Narrative Across Media : Film and Literature in the ESL Classroom | `hasOpenSession` : « true » → « false » |
| SEM-10266 | CO-ESII / Apprendre Javascript avec p5.js / Formation hybride | `hasOpenSession` : « true » → « false » |

### Cours modifiés — champs descriptifs longs

Aucun champ descriptif long n’a changé.

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
| Références identiques | 18 |
| Revues métier prioritaires | 0 |
| Revues métier | 0 |
| Références nécessitant une revue métier | 0 |
| Informations à examiner | 3 |
| Enrichissements | 0 |
| Évolutions contextuelles | 1 |
| Différences typographiques | 0 |

| Code | Catégorie d’écart | Champ | Valeur de référence | Valeur actuelle |
| --- | --- | --- | --- | --- |
| DIP-002 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Cette séance d'accueil s'adresse aux personnes nouvellement engagées au sein du DIP, répondant aux critères suivants :<br><br>- le personnel administratif et technique<br>- les apprenties et apprentis<br>- le personnel enseignant engagé en cours d'année scolaire, n'ayant pas bénéficié d'une séance d'accueil organisée par sa direction générale<br><br>Dans certains cas, des auxiliaires peuvent également être invitées et invités à y prendre part.` | `Cette séance d'accueil s'adresse aux personnes nouvellement engagées au sein du DIP, répondant aux critères suivants :<br>- le personnel administratif et technique<br>- le personnel enseignant engagé en cours d'année scolaire, n'ayant pas bénéficié d'une séance d'accueil organisée par sa direction générale<br>Dans certains cas, des auxiliaires peuvent également être invitées et invités à y prendre part.` |
| CO-01683 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| SEM0518 | ÉVOLUTION CONTEXTUELLE | `titleRaw` | `Prévenir les tensions dans ses relations par une bonne communication` | `Développer ses qualités relationnelles pour prévenir les tensions` |
| SEM0518 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Collaboratices et collaborateurs désireux d'agir pour améliorer sa communication et éviter les conflits.<br>Ce cours n'est pas un lieu de résolution pour des conflits avérés. Si vous avez des difficultés, nous vous invitons à solliciter votre hiérarchie ou votre RH départemental, voire le Groupe de confiance - qui peuvent vous accompagner dans une démarche et/ou vous orienter.<br>Les responsables d'équipe amenés à gérer des conflits dans lesquels elles et ils ne sont pas impliqués, mais dans lesquels elles et ils jouent un rôle de tiers, ou souhaitant développer leur compétence à gérer les tensions au quotidien dans leur équipe, choisiront la formation "Manager : Gérer les tensions au sein de son équipe".` | `Le cours s'adresse à toute personne souhaitant développer ses qualités relationnelles et prévenir les tensions dans son cadre professionnel. Il a une visée préventive et n'est pas un lieu de résolution de conflits avérés : en cas de difficulté installée, la hiérarchie, le RH départemental ou le Groupe de confiance peuvent accompagner et orienter. Les responsables d'équipe appelés à intervenir comme tiers s'orienteront vers le cours « Tensions et conflits au sein de vos équipes : anticiper, désamorcer et réguler» (SEM00052).` |
| CO-01660 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| EP-520 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| CO-01686 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP<br>Les participants identifient quelques-unes des préoccupations majeures des élèves, de leurs familles et des enseignants qui les côtoient à travers une expérience rapportée du terrain ;<br>A la fin de la séance, les participants sont capables d'identifier les défis pour ces familles et, en collaboration avec les personnes ressources de leur établissement (conseillères et conseillers sociaux, éducatrices et éducateurs), de mieux les orienter.` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP` |

## Offres détectées

| Offre | Occurrences | Formations uniques |
| --- | ---: | ---: |
| Détention - Offre de formation de l'OCD | 70 | 70 |
| DF-OPE - L'offre de formation de l'OPE | 168 | 168 |
| DIP - Service de la formation DRH-DIP | 6 | 6 |
| DIP-CO - Offre de formation du Cycle d'orientation | 216 | 216 |
| DIP-EP - Offre de formation de l'enseignement primaire | 323 | 323 |
| DIP-ES II - Offre de formation de l'ES II | 234 | 234 |
| DIP-OMP - Offre formation de l'OMP | 228 | 228 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 143 | 143 |
| POLICE - CFPS - Centre de Formation de la Police | 191 | 191 |
| Pouvoir Judiciaire - Offre de formation du Pouvoir judiciaire | 54 | 54 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1078/1078 | 100.0 % |
| `domainRaw` | 1078/1078 | 100.0 % |
| `themeRaw` | 998/1078 | 92.6 % |
| `publicRaw` | 960/1078 | 89.1 % |
| `durationRaw` | 1058/1078 | 98.1 % |
| `targetAudienceRaw` | 961/1078 | 89.1 % |
| `generalInformationRaw` | 531/1078 | 49.3 % |
| `objectivesRaw` | 1023/1078 | 94.9 % |
| `contentRaw` | 936/1078 | 86.8 % |
| `prerequisitesRaw` | 373/1078 | 34.6 % |
| `additionalInformationRaw` | 322/1078 | 29.9 % |

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
- Sections écartées car elles contenaient une coordonnée de contact : 23

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
- CO-1172HES — Contenu (`contentRaw`)
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

- Date et heure de promotion : 2026-11-24T14:46:48.342Z
- Snapshot candidat validé : 2026-11-24
- Empreinte SHA-256 : `f45cb5d1b1fb7549b519ce1a094a7efd9f852f042ba6175a45d8b19dd0a5a2bc`
- Promotion manuelle confirmée.
