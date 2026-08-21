# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-08-21
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 134.6 secondes
- Taille du JSON final : 2.05 Mio (2153936 octets)
- Empreinte SHA-256 du snapshot : `ac13e93f243619e1ad54ce0c5812f999a2430ecd1f8adc6731739a3dc91c3734`

## Synthèse

- Occurrences détectées dans l’index : 1648
- Codes uniques : 1057
- Occurrences éliminées par déduplication : 591
- Formations présentes dans plusieurs offres : 299
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1057
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1056 |
| Cours dans le candidat | 1057 |
| Cours ajoutés | 6 |
| Cours supprimés | 5 |
| Cours modifiés | 13 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| OCD014 | Experte et Expert en management du domaine des privations de liberté | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formation des cadres |
| OCD179 | FOP II - Conduite d'intervention en milieu carcéral (Dir., Off. sup., Off.) | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formation des cadres |
| OCD332 | FOP I - Conduite d'intervention en milieu carcéral | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formation des cadres |
| OCD374 | Prévenir l'épuisement professionnel - cadres | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formation des cadres |
| OCD423 | Gestion de crise pour les cadres des services pénitentiaires - Compétences de bases | Détention - Offre de formation de l'OCD | Centre de formation de l'OCD | Formation des cadres |
| OMP-112 | Enseigner et soutenir l'autorégulation : stratégies transversales d'apprentissage pour les élèves en difficulté | DIP-OMP - Offre formation de l'OMP | DGOMP/SRH | Capacités transversales |

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| FP058 | Plongeur niveau 1 | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |
| FP059 | Plongeur niveau 2 | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |
| FP060 | Plongeur niveau 3 | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |
| FP061 | Plongeur sous-glace | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |
| FP065 | Plongeur trimix | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EP-1058 | Le mouvement pour apprendre : investir la salle de jeux au quotidien | `hasOpenSession` : « true » → « false » |
| EP-971 | Petits et grands jeux de collaboration/coopération | `hasOpenSession` : « true » → « false » |
| OMP-025 | Cours de langue des signes niveau débutant | `hasOpenSession` : « true » → « false » |
| OMP-106 | La danse au service des élèves à besoins éducatifs particuliers | `hasOpenSession` : « false » → « true » |
| OMP-111 | Des jeux de société pour construire l'attention, la mémoire, la compréhension et le raisonnement | `titleRaw` : « Des jeux de société pour construire l?attention, la mémoire, la compréhension et le raisonnement » → « Des jeux de société pour construire l'attention, la mémoire, la compréhension et le raisonnement »<br>`domainRaw` : « Développement professionnel » → « Capacités transversales »<br>`themeRaw` : « Développement personnel » → « Stratégie d'apprentissage »<br>`targetAudienceRaw` : `null` → « Personnel pédagogique OMP + personnel enseignant EP » |
| S2-433 | Evaluation HSE des risques au laboratoire (I) | `hasOpenSession` : « false » → « true » |
| S2-435 | Intelligence artificielle pour l'enseignement de la chimie | `hasOpenSession` : « false » → « true » |
| S2-454 | Enseigner les questions socialement vives (QSV) en mobilisant la nature des sciences (NOS), pour des décisions éclairées | `hasOpenSession` : « true » → « false » |
| SEM-P1566 | EP-CO-ESII-OMP / La formation de l'image photographique ; construire un sténopé en classe avec une boîte à chaussures | `titleRaw` : « EP-CO-ESII-OMP / La formation de l'image photographique; construire un stenopé en classe avec une boîte à chaussure » → « EP-CO-ESII-OMP / La formation de l'image photographique ; construire un sténopé en classe avec une boîte à chaussures » |
| SEM-P4011 | OMP / Formation institutionnelle obligatoire science informatique pour l'OMP Primaire | `titleRaw` : « OMP / Formation institutionnelle obligatoire pour l'OMP Primaire » → « OMP / Formation institutionnelle obligatoire science informatique pour l'OMP Primaire » |
| SEM1122 | Ajuster sa voix et son comportement non verbal, force d'influence | `hasOpenSession` : « false » → « true » |
| SEM1171 | Comment collaborer au sein d'une équipe intergénérationnelle | `hasOpenSession` : « false » → « true » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| FP070 | Moniteur de plongée niveau 1 | `durationRaw` |

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
| Détention - Offre de formation de l'OCD | 71 | 71 |
| DF-OPE - L'offre de formation de l'OPE | 170 | 170 |
| DIP - Service de la formation DRH-DIP | 3 | 3 |
| DIP-CO - Offre de formation du Cycle d'orientation | 226 | 226 |
| DIP-EP - Offre de formation de l'enseignement primaire | 294 | 294 |
| DIP-ES II - Offre de formation de l'ES II | 236 | 236 |
| DIP-OMP - Offre formation de l'OMP | 234 | 234 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 153 | 153 |
| PJ - Offre de formation du pouvoir judiciaire | 56 | 56 |
| POLICE - CFPS - Centre de Formation de la Police | 205 | 205 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1057/1057 | 100.0 % |
| `domainRaw` | 1057/1057 | 100.0 % |
| `themeRaw` | 978/1057 | 92.5 % |
| `publicRaw` | 947/1057 | 89.6 % |
| `durationRaw` | 1042/1057 | 98.6 % |
| `targetAudienceRaw` | 941/1057 | 89.0 % |
| `generalInformationRaw` | 544/1057 | 51.5 % |
| `objectivesRaw` | 1007/1057 | 95.3 % |
| `contentRaw` | 952/1057 | 90.1 % |
| `prerequisitesRaw` | 396/1057 | 37.5 % |
| `additionalInformationRaw` | 354/1057 | 33.5 % |

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
| SEM-10347 | EP-CO-ESII-OMP / L'erreur est humaine: introduction à l'esprit critique / NOUVEAU | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10348 | EP-CO-ESII-OMP / Esprit critique : gestion de l'incertitude (bayésianisme) / NOUVEAU | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
| SEM-10349 | EP-ESI-ESII-OMP / IA et esprit critique / NOUVEAU / Formation autonome en ligne | 5 | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-OMP - Offre formation de l'OMP<br>DIP-SEM - Offre de formation du Service Écoles-Médias | 1 |
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

- Date et heure de promotion : 2026-08-21T05:07:45.612Z
- Snapshot candidat validé : 2026-08-21
- Empreinte SHA-256 : `ac13e93f243619e1ad54ce0c5812f999a2430ecd1f8adc6731739a3dc91c3734`
- Promotion manuelle confirmée.
