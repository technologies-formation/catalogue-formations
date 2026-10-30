# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-10-30
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 127.5 secondes
- Taille du JSON final : 2.08 Mio (2181565 octets)
- Empreinte SHA-256 du snapshot : `422c55bf167a6356a26abd9ab82a53277b6bbf1cd9affc6849feb1d31d06831e`

## Synthèse

- Occurrences détectées dans l’index : 1617
- Codes uniques : 1057
- Occurrences éliminées par déduplication : 560
- Formations présentes dans plusieurs offres : 287
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1057
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1056 |
| Cours dans le candidat | 1057 |
| Cours ajoutés | 3 |
| Cours supprimés | 2 |
| Cours modifiés | 40 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| CO-1172HES | FIO IOSP : VISITES HES | DIP-CO - Offre de formation du Cycle d'orientation | DGEO/SRH/Secteur de la formation continue EO | Formation générale |
| SEM0729E | Système de contrôle interne (SCI) - E-learning | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | FONCTIONNEMENT DE L'ADMINISTRATION |
| SEM1265 | L'Odyssée du changement : concevoir des interventions pour favoriser le changement de comportements | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | FONCTIONNEMENT DE L'ADMINISTRATION |

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| FP131 | Pilotage Moto / FJR - Supérieur (piste) | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |
| FP156 | Pilotage moto / FJR - Trajectoire 1 (route) | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| CO-1172CFP | FIO IOSP : VISITES AUX CFP | `hasOpenSession` : « false » → « true » |
| EP-1057 | Stratégies pour enseigner l'orthographe aux élèves faibles en orthographe ou dysorthographiques | `hasOpenSession` : « true » → « false » |
| EP-1292ETB | Réparer plutôt que punir : les cercles restauratifs dans ma classe | `targetAudienceRaw` : `null` → « Personnel enseignant CE+CM (MGEN*, ECSP, ECA, MDAS) *maitresses et maitres généralistes titulaires de classe » |
| FP291 | Formation initiale pour évaluateurs - Recrutement | `hasOpenSession` : « false » → « true » |
| S2-553 | W3 : Maîtriser le prompt : dialoguer avec l'IA sans perdre son intention pédagogique | `titleRaw` : « W3 : Maîtriser le prompt : dialoguer avec l?IA sans perdre son intention pédagogique » → « W3 : Maîtriser le prompt : dialoguer avec l'IA sans perdre son intention pédagogique » |
| S2-556 | W6 : Agents IA pour l'éducation : concevoir des assistants pédagogiques contrôlés | `titleRaw` : « W6 : Agents IA pour l?éducation : concevoir des assistants pédagogiques contrôlés » → « W6 : Agents IA pour l'éducation : concevoir des assistants pédagogiques contrôlés » |
| S2-FOSEC4 | Premiers secours : cours de perfectionnement pour personnes préposées aux premiers secours de l'ES II et de l'ES I | `hasOpenSession` : « true » → « false » |
| SEM-P1574 | EP / GarageBand : créations sonores sur tablette / NOUVEAU | `hasOpenSession` : « true » → « false » |
| SEM1084 | Finances publiques: introduction | `targetAudienceRaw` : « Nouveaux collaborateurs de l'Etat » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat Nouveaux collaborateurs de l'Etat » |
| SEM1085 | Finances et comptabilité | `targetAudienceRaw` : « - Nouveaux collaborateurs à l'Etat, qui ont suivi le module d'introduction mais veulent un approfondissement - Nouveaux collaborateurs des directions financières et des services financiers - Collaborateurs en charge de la gestion comptab… » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat - Nouveaux collaborateurs à l'Etat, qui ont suivi le module d'introduction mais veulent un approfondissement - Nouveaux collaborateurs des dir… » |
| SEM1086 | Budget et planification financière | `targetAudienceRaw` : « - Cadres supérieurs de l'Etat, qui ont suivi le module introduction mais veulent un approfondissement - Collaborateurs des directions financières et des services financiers - Cadres supérieurs des Etats-majors ou des directions générales » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat - Cadres supérieurs de l'Etat, qui ont suivi le module introduction mais veulent un approfondissement - Collaborateurs des directions financiè… » |
| SEM1121 | Management de la continuité des activités (MCA) | `targetAudienceRaw` : « - Toute personne (responsable de service, expert/e métier, etc.) devant réaliser ou participer à la réalisation d'un plan de continuité - Toute personne chargée de contrôle interne (CI), relais ou répondante CI d'une entité - Toute perso… » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat - Toute personne (responsable de service, expert/e métier, etc.) devant réaliser ou participer à la réalisation d'un plan de continuité - Tout… » |
| SEM1129E | Formation au plan comptable MCH2 de l'Etat de Genève - E-learning | `targetAudienceRaw` : « - Comptables - Contrôleurs de gestion et contrôleurs internes - Gestionnaires s'occupant de factures ou de suivi budgétaire - Responsables intéressés par l'organisation budgétaire et comptable de l'Etat » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat - Comptables - Contrôleurs de gestion et contrôleurs internes - Gestionnaires s'occupant de factures ou de suivi budgétaire - Responsables int… » |
| SEM1145 | Mener des concertations avec des partenaires de projets | `titleRaw` : « Mener des concertations avec des partenaires de projet » → « Mener des concertations avec des partenaires de projets » |
| SEM1149 | La négociation entre stratégie et relation | `hasOpenSession` : « true » → « false » |
| SEM1161 | Sensibilisation à la pleine-conscience au travail | `hasOpenSession` : « false » → « true » |
| SEM1176 | Prise en main de l'outil de gestion des risques Etat | `targetAudienceRaw` : « - Toute personne (responsable d'unité, expert/e métier, etc.) pouvant être amenée à participer à l'analyse ou à la gestion des risques - Toute personne chargée de contrôle interne, relais ou répondante CI d'un service, responsable de la … » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat - Toute personne (responsable d'unité, expert/e métier, etc.) pouvant être amenée à participer à l'analyse ou à la gestion des risques - Toute… » |
| SEM1195 | Communication et feed-back constructif | `hasOpenSession` : « true » → « false » |
| SEM1197 | Formatrices et formateurs occasionnels | `titleRaw` : « Formatrices et formateurs occasionnels : construire et animer une formation » → « Formatrices et formateurs occasionnels » |
| SEM1215 | Les neurosciences au service du management | `hasOpenSession` : « true » → « false » |
| SEM1220 | Adapter sa manière de communiquer pour des relations professionnelles efficaces (PCM) | `hasOpenSession` : « true » → « false » |
| SEM1221 | Gestion des risques | `targetAudienceRaw` : « Tout public » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat Tout public » |
| SEM1243 | Identification et transfert des savoirs en vue de la retraite | `titleRaw` : « Identification et transfert des savoirs pour les futures personnes retraitées » → « Identification et transfert des savoirs en vue de la retraite » |
| SEM1244 | Comment manager les équipes intergénérationnelles ? | `titleRaw` : « Comment manager les équipes intergénérationnelles » → « Comment manager les équipes intergénérationnelles ? » |
| SEM1256 | Gestion des investissements | `targetAudienceRaw` : « Collaborateurs de l'Etat impliqués dans la gestion financière des investissements. Collaborateurs des directions financières et services financiers, ainsi que des services de contrôle de gestion. » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat Collaborateurs de l'Etat impliqués dans la gestion financière des investissements. Collaborateurs des directions financières et services finan… » |
| SEM1257 | Projets d'investissement et immobilisations | `targetAudienceRaw` : « Chef de projets (investissement) » → « Cette formation est exclusivement réservée aux collaboratrices et collaborateurs du Petit Etat Chef de projets (investissement) » |
| SEM1266 | L'intelligence émotionnelle : de la compréhension à l'action | `hasScheduledSession` : « false » → « true »<br>`scheduledOpeningDates` : «  » → « 2026-11-03 » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| EP-017MDAS | Recyclage massage cardiaque BLS-AED | `contentRaw` |
| EP-1292ETB | Réparer plutôt que punir : les cercles restauratifs dans ma classe | `objectivesRaw` |
| S2-110 | Histoire et esthétique des séries télévisées et initiation à la réalisation pratique d'une mini-série | `contentRaw` |
| S2-267 | La galassia delle scrittrici siciliane contemporanee | `contentRaw` |
| S2-362 | Enseigner le droit de manière ludique en consolidant son savoir professionnel | `objectivesRaw`, `contentRaw` |
| S2-429 | Energie solaire : panneaux photovoltaïques et thermiques | `contentRaw` |
| S2-454 | Enseigner les questions socialement vives (QSV) en mobilisant la nature des sciences (NOS), pour des décisions éclairées | `objectivesRaw`, `contentRaw` |
| S2-553 | W3 : Maîtriser le prompt : dialoguer avec l'IA sans perdre son intention pédagogique | `contentRaw` |
| S2-555 | W5 : Automatiser sans déshumaniser : workflows utiles pour l'enseignement | `contentRaw` |
| S2-556 | W6 : Agents IA pour l'éducation : concevoir des assistants pédagogiques contrôlés | `contentRaw` |
| S2-620 | Gestion du stress et prévention du burn-out | `objectivesRaw` |
| S2-646 | Un T-shirt en filature : enseigner l'interdépendance à partir du textile par une approche systémique et concrète | `objectivesRaw` |
| S2-851 | Favoriser le travail autonome des élèves et la différenciation de l'enseignement au collège et à l'école de culture générale (ECG) | `objectivesRaw` |
| S2-952 | Au-delà des faits : comment évaluer l'information et raisonner sous incertitude | `contentRaw` |
| S2-EPS02 | Escalade murs et zones blocs (I) | `contentRaw` |
| SEM0487 | L'Etat et son administration : les fondamentaux | `generalInformationRaw` |

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
| DF-OPE - L'offre de formation de l'OPE | 170 | 170 |
| DIP - Service de la formation DRH-DIP | 5 | 5 |
| DIP-CO - Offre de formation du Cycle d'orientation | 218 | 218 |
| DIP-EP - Offre de formation de l'enseignement primaire | 315 | 315 |
| DIP-ES II - Offre de formation de l'ES II | 233 | 233 |
| DIP-OMP - Offre formation de l'OMP | 228 | 228 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 143 | 143 |
| POLICE - CFPS - Centre de Formation de la Police | 191 | 191 |
| Pouvoir Judiciaire - Offre de formation du Pouvoir judiciaire | 54 | 54 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1057/1057 | 100.0 % |
| `domainRaw` | 1057/1057 | 100.0 % |
| `themeRaw` | 987/1057 | 93.4 % |
| `publicRaw` | 944/1057 | 89.3 % |
| `durationRaw` | 1037/1057 | 98.1 % |
| `targetAudienceRaw` | 940/1057 | 88.9 % |
| `generalInformationRaw` | 522/1057 | 49.4 % |
| `objectivesRaw` | 1002/1057 | 94.8 % |
| `contentRaw` | 925/1057 | 87.5 % |
| `prerequisitesRaw` | 374/1057 | 35.4 % |
| `additionalInformationRaw` | 319/1057 | 30.2 % |

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

- Date et heure de promotion : 2026-10-30T10:50:41.207Z
- Snapshot candidat validé : 2026-10-30
- Empreinte SHA-256 : `422c55bf167a6356a26abd9ab82a53277b6bbf1cd9affc6849feb1d31d06831e`
- Promotion manuelle confirmée.
