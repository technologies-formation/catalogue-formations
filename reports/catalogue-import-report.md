# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-10-20
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 138.9 secondes
- Taille du JSON final : 2.05 Mio (2149203 octets)
- Empreinte SHA-256 du snapshot : `ca64d432b476a9cfe329bd30ce39d5cabfcb71ced77cef37ccbf6960b816023b`

## Synthèse

- Occurrences détectées dans l’index : 1623
- Codes uniques : 1063
- Occurrences éliminées par déduplication : 560
- Formations présentes dans plusieurs offres : 287
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1063
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1050 |
| Cours dans le candidat | 1063 |
| Cours ajoutés | 13 |
| Cours supprimés | 0 |
| Cours modifiés | 7 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

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

### Cours supprimés

Aucun cours supprimé.

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EP-996 | Accueillir un élève allophone nouvellement arrivé en classe régulière : pistes d'action | `titleRaw` : « Accueillir un élève allophone nouvellement arrivé en classe ordinaire : pistes d'action » → « Accueillir un élève allophone nouvellement arrivé en classe régulière : pistes d'action » |
| FP196 | FOCO en matière d'audition (St-Yves) : POLICE (Sauf PJ & GSJ) | `hasOpenSession` : « true » → « false » |
| FP197 | FOCO en matière d'audition (St-Yves) : PJ & Suivi Judiciaire | `hasOpenSession` : « true » → « false » |
| FP255 | Sport et Santé - Bilan fonctionnel | `hasOpenSession` : « true » → « false » |
| S2-340 | Penser l'Histoire dans l'Anthropocène | `hasOpenSession` : « true » → « false » |
| SEM0518 | Développer ses qualités relationnelles pour prévenir les tensions | `hasOpenSession` : « false » → « true » |
| SEM1210 | Management et Assertivité | `hasOpenSession` : « true » → « false » |

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
| Détention - Offre de formation de l'OCD | 70 | 70 |
| DF-OPE - L'offre de formation de l'OPE | 166 | 166 |
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
| `organizingEntityRaw` | 1063/1063 | 100.0 % |
| `domainRaw` | 1063/1063 | 100.0 % |
| `themeRaw` | 984/1063 | 92.6 % |
| `publicRaw` | 948/1063 | 89.2 % |
| `durationRaw` | 1043/1063 | 98.1 % |
| `targetAudienceRaw` | 948/1063 | 89.2 % |
| `generalInformationRaw` | 528/1063 | 49.7 % |
| `objectivesRaw` | 1009/1063 | 94.9 % |
| `contentRaw` | 932/1063 | 87.7 % |
| `prerequisitesRaw` | 371/1063 | 34.9 % |
| `additionalInformationRaw` | 324/1063 | 30.5 % |

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
- FP218 — Généralités (`generalInformationRaw`)
- FP217 — Généralités (`generalInformationRaw`)

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

- Date et heure de promotion : 2026-10-20T08:26:53.413Z
- Snapshot candidat validé : 2026-10-20
- Empreinte SHA-256 : `ca64d432b476a9cfe329bd30ce39d5cabfcb71ced77cef37ccbf6960b816023b`
- Promotion manuelle confirmée.
