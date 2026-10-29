# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-10-29
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 124.6 secondes
- Taille du JSON final : 2.08 Mio (2177403 octets)
- Empreinte SHA-256 du snapshot : `8726cd39fffad6754c34fa357e8d2e4bc9a03b96ceb7b65ea578b3a525209000`

## Synthèse

- Occurrences détectées dans l’index : 1616
- Codes uniques : 1056
- Occurrences éliminées par déduplication : 560
- Formations présentes dans plusieurs offres : 287
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1056
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1053 |
| Cours dans le candidat | 1056 |
| Cours ajoutés | 7 |
| Cours supprimés | 4 |
| Cours modifiés | 25 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| EP-1292ETB | Réparer plutôt que punir : les cercles restauratifs dans ma classe | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Profession enseignante |
| SEM1234E | Apprendre autrement: licence Gamelearn | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | APPRENDRE AUTREMENT |
| SEM1266 | L'intelligence émotionnelle : de la compréhension à l'action | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | MANAGEMENT ET RESSOURCES HUMAINES |
| TRT3015E | OneNote : Prenez, organisez et partagez vos notes efficacement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |
| TRT3018E | Outlook 365 : Fondamentaux au perfectionnement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |
| TRT3019E | PowerPoint 365 : Fondamentaux au perfectionnement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |
| TRT3020E | Word 365 : Fondamentaux au perfectionnement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| TRT3000E | Excel 2016 : Fondamentaux au perfectionnement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |
| TRT3001E | Outlook 2016 : Fondamentaux au perfectionnement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |
| TRT3002E | PowerPoint 2016: Fondamentaux au perfectionnement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |
| TRT3003E | Word 2016 : Fondamentaux au perfectionnement \| E-LEARNING | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | LOGICIELS BUREAUTIQUES |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| CO-01453 | Initiation à la sérigraphie | `targetAudienceRaw` : « Enseignantes et enseignants d'AV de l'enseignement primaire (MDAS AV), de l'ESI et de l'ESII » → « Enseignantes et enseignants d'arts visuels de l'enseignement primaire (MDAS AV), de l'ESI et de l'ESII » |
| CO-1172CFP | FIO IOSP : VISITES AUX CFP | `hasOpenSession` : « true » → « false » |
| OMP-18SSEJ | Premiers secours : cours de base - OMP | `publicRaw` : « Enseignants EP - OMP » → `null` |
| OMP-19SSEJ | Premiers secours - cours de rafraîchissement - OMP | `publicRaw` : « Enseignants div. spécialisée » → `null` |
| PJ-1093 | Sensibilisation au flow et à la pleine conscience au travail | `hasOpenSession` : « true » → « false » |
| S2-952 | Au-delà des faits : comment évaluer l'information et raisonner sous incertitude | `hasOpenSession` : « true » → « false » |
| SEM0735 | Ethique et déontologie de la fonction publique | `hasOpenSession` : « false » → « true » |
| SEM0737 | Les bases de la gestion de projet | `hasOpenSession` : « true » → « false » |
| SEM1086 | Budget et planification financière | `hasOpenSession` : « true » → « false » |
| SEM1095 | Prévenir et gérer les comportements agressifs | `hasOpenSession` : « true » → « false » |
| SEM1161 | Sensibilisation à la pleine-conscience au travail | `hasOpenSession` : « true » → « false » |
| SEM1162 | Comment concilier équilibre personnel et efficacité professionnelle ? | `hasOpenSession` : « true » → « false » |
| SEM1163 | Développer ses ressources personnelles pour agir avec confiance | `hasOpenSession` : « false » → « true » |
| SEM1166 | L'intelligence émotionnelle au service de la conduite d'équipe | `hasOpenSession` : « true » → « false » |
| SEM1169 | Ecrire pour être compris | `hasOpenSession` : « true » → « false » |
| SEM1171 | Comment collaborer au sein d'une équipe intergénérationnelle | `hasOpenSession` : « true » → « false » |
| SEM1198 | Prendre soin de soi pour un meilleur équilibre au travail : intégrer les TOP dans son quotidien | `hasOpenSession` : « true » → « false » |
| SEM1263 | Améliorer sa mémoire pour être plus efficace | `hasScheduledSession` : « false » → « true »<br>`scheduledOpeningDates` : «  » → « 2026-11-03 » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| EO-010 | Histoire sans chute ou comment repenser le travail du textile dans nos ateliers | `prerequisitesRaw` |
| SEM0052 | Tensions et conflits au sein de vos équipes : anticiper, désamorcer et réguler | `generalInformationRaw` |
| SEM0487 | L'Etat et son administration : les fondamentaux | `generalInformationRaw` |
| SEM0518 | Développer ses qualités relationnelles pour prévenir les tensions | `generalInformationRaw` |
| SEM0815 | Mi-parcours professionnel: donner un nouvel élan à sa carrière | `generalInformationRaw` |
| SEM1043 | Trouver sa place dans la complexité du monde professionnel | `generalInformationRaw` |
| SEM1141 | Retrouver son équilibre et développer son pouvoir d'agir au travail | `generalInformationRaw` |
| SEM1163 | Développer ses ressources personnelles pour agir avec confiance | `generalInformationRaw` |

### Changements d’offres

Aucun rattachement à une offre n’a changé.

### Anomalies techniques

Aucune anomalie technique.

## Surveillance des références validées

Ces signaux sont informatifs et non bloquants. Ils ne modifient ni le ciblage ni le statut de validation.

| Indicateur | Références |
| --- | ---: |
| Références contrôlées | 24 |
| Références présentes | 22 |
| Références absentes | 2 |
| Références identiques | 19 |
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
| SEM0518 | ÉVOLUTION CONTEXTUELLE | `titleRaw` | `Prévenir les tensions dans ses relations par une bonne communication` | `Développer ses qualités relationnelles pour prévenir les tensions` |
| SEM0518 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Collaboratices et collaborateurs désireux d'agir pour améliorer sa communication et éviter les conflits.<br>Ce cours n'est pas un lieu de résolution pour des conflits avérés. Si vous avez des difficultés, nous vous invitons à solliciter votre hiérarchie ou votre RH départemental, voire le Groupe de confiance - qui peuvent vous accompagner dans une démarche et/ou vous orienter.<br>Les responsables d'équipe amenés à gérer des conflits dans lesquels elles et ils ne sont pas impliqués, mais dans lesquels elles et ils jouent un rôle de tiers, ou souhaitant développer leur compétence à gérer les tensions au quotidien dans leur équipe, choisiront la formation "Manager : Gérer les tensions au sein de son équipe".` | `Le cours s'adresse à toute personne souhaitant développer ses qualités relationnelles et prévenir les tensions dans son cadre professionnel. Il a une visée préventive et n'est pas un lieu de résolution de conflits avérés : en cas de difficulté installée, la hiérarchie, le RH départemental ou le Groupe de confiance peuvent accompagner et orienter. Les responsables d'équipe appelés à intervenir comme tiers s'orienteront vers le cours « Tensions et conflits au sein de vos équipes : anticiper, désamorcer et réguler» (SEM00052).` |
| CO-01660 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| EP-520 | RÉFÉRENCE ABSENTE | `présence` | `présente` | `absente` |
| CO-01686 | INFORMATION À EXAMINER | `targetAudienceRaw` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP<br>Les participants identifient quelques-unes des préoccupations majeures des élèves, de leurs familles et des enseignants qui les côtoient à travers une expérience rapportée du terrain ;<br>A la fin de la séance, les participants sont capables d'identifier les défis pour ces familles et, en collaboration avec les personnes ressources de leur établissement (conseillères et conseillers sociaux, éducatrices et éducateurs), de mieux les orienter.` | `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP` |

## Offres détectées

| Offre | Occurrences | Formations uniques |
| --- | ---: | ---: |
| Détention - Offre de formation de l'OCD | 60 | 60 |
| DF-OPE - L'offre de formation de l'OPE | 168 | 168 |
| DIP - Service de la formation DRH-DIP | 5 | 5 |
| DIP-CO - Offre de formation du Cycle d'orientation | 217 | 217 |
| DIP-EP - Offre de formation de l'enseignement primaire | 315 | 315 |
| DIP-ES II - Offre de formation de l'ES II | 233 | 233 |
| DIP-OMP - Offre formation de l'OMP | 228 | 228 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 143 | 143 |
| POLICE - CFPS - Centre de Formation de la Police | 193 | 193 |
| Pouvoir Judiciaire - Offre de formation du Pouvoir judiciaire | 54 | 54 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1056/1056 | 100.0 % |
| `domainRaw` | 1056/1056 | 100.0 % |
| `themeRaw` | 986/1056 | 93.4 % |
| `publicRaw` | 943/1056 | 89.3 % |
| `durationRaw` | 1036/1056 | 98.1 % |
| `targetAudienceRaw` | 938/1056 | 88.8 % |
| `generalInformationRaw` | 522/1056 | 49.4 % |
| `objectivesRaw` | 1001/1056 | 94.8 % |
| `contentRaw` | 925/1056 | 87.6 % |
| `prerequisitesRaw` | 374/1056 | 35.4 % |
| `additionalInformationRaw` | 320/1056 | 30.3 % |

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
- TRT703 — Informations complémentaires (`additionalInformationRaw`)
- TRT702 — Informations complémentaires (`additionalInformationRaw`)
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

- Date et heure de promotion : 2026-10-29T10:52:06.320Z
- Snapshot candidat validé : 2026-10-29
- Empreinte SHA-256 : `8726cd39fffad6754c34fa357e8d2e4bc9a03b96ceb7b65ea578b3a525209000`
- Promotion manuelle confirmée.
