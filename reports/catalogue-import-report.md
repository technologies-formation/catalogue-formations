# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-09-01
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 121.1 secondes
- Taille du JSON final : 2.06 Mio (2159222 octets)
- Empreinte SHA-256 du snapshot : `ab8579af8386d331d6c83e442cbbe32fa8b718a572fb4bc8099f4a9fea688a2f`

## Synthèse

- Occurrences détectées dans l’index : 1654
- Codes uniques : 1061
- Occurrences éliminées par déduplication : 593
- Formations présentes dans plusieurs offres : 300
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1061
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1060 |
| Cours dans le candidat | 1061 |
| Cours ajoutés | 1 |
| Cours supprimés | 0 |
| Cours modifiés | 18 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| SEM-3159 | LabTice, le nouveau logiciel de labo langues pour l'ESI et l'ESII / formation pour les référents | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-ES II - Offre de formation de l'ES II<br>DIP-SEM - Offre de formation du Service Écoles-Médias | DIP-SEM / Secteur Formation | Médias, image, numérique |

### Cours supprimés

Aucun cours supprimé.

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| CO-00312 | Module de perfectionnement Moniteur ski J+S | `hasOpenSession` : « false » → « true »<br>`hasScheduledSession` : « true » → « false » |
| CO-01197 | Cours d'introduction au Sport scolaire J+S | `hasOpenSession` : « false » → « true »<br>`hasScheduledSession` : « true » → « false » |
| CO-01418 | Cours d'introduction Moniteur Ski J+S | `hasOpenSession` : « false » → « true »<br>`hasScheduledSession` : « true » → « false » |
| CO-01797 | Module de perfectionnement au Sport scolaire J+S | `hasOpenSession` : « false » → « true »<br>`hasScheduledSession` : « true » → « false » |
| EP-988 | La danse, un appui pour le corps et la gestion de groupe | `hasOpenSession` : « true » → « false » |
| FP249 | Formation Initiale Sentinelle milicien/milicienne | `hasOpenSession` : « true » → « false » |
| OMP-021TSA | Soutenir les interactions sociales des jeunes enfants sur le spectre de l'autisme | `hasOpenSession` : « true » → « false » |
| OMP-048 | Particularités cognitives et sensorielles des élèves avec autisme; outils pour les intégrer à la classe | `hasOpenSession` : « false » → « true » |
| PJ-0038 | Méthodologie Gestion de projet (volet 3) | `hasScheduledSession` : « true » → « false » |
| PJ-0094 | Fondamentaux Gestion de projet (volet 2) | `hasScheduledSession` : « true » → « false » |
| PJ-0101 | Gestion des pièces à conviction - Personnel du TMIN, TPN et CJP titulaire d'une licence | `hasOpenSession` : « true » → « false » |
| SEM-P1575 | EP-OMP / Découvrir l'intelligence artificielle / Formation hybride / NOUVEAU | `hasOpenSession` : « true » → « false » |
| SEM-P4005 | EP / Formation institutionnelle obligatoire / TBI (Base) pour le Cycle 1 | `hasOpenSession` : « true » → « false » |
| SEM-P4009 | EP / Formation institutionnelle obligatoire / Science informatique pour les enseignants 5P-6P | `hasOpenSession` : « false » → « true » |
| SEM-P4010 | EP / Formation institutionnelle obligatoire / Science informatique pour le Cycle 1 | `hasOpenSession` : « true » → « false » |
| TRT023 | CFI - Achats: gestion des demandes d'achat | `hasOpenSession` : « true » → « false » |
| TRT039 | Consultation et saisie dans Ge-Invest | `hasOpenSession` : « true » → « false » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| SEM-4009 | Formation IA et ORFO pour les enseignants AFP | `durationRaw` |

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
| Détention - Offre de formation de l'OCD | 70 | 70 |
| DF-OPE - L'offre de formation de l'OPE | 170 | 170 |
| DIP - Service de la formation DRH-DIP | 3 | 3 |
| DIP-CO - Offre de formation du Cycle d'orientation | 227 | 227 |
| DIP-EP - Offre de formation de l'enseignement primaire | 299 | 299 |
| DIP-ES II - Offre de formation de l'ES II | 238 | 238 |
| DIP-OMP - Offre formation de l'OMP | 234 | 234 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 154 | 154 |
| PJ - Offre de formation du pouvoir judiciaire | 55 | 55 |
| POLICE - CFPS - Centre de Formation de la Police | 204 | 204 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1061/1061 | 100.0 % |
| `domainRaw` | 1061/1061 | 100.0 % |
| `themeRaw` | 982/1061 | 92.6 % |
| `publicRaw` | 951/1061 | 89.6 % |
| `durationRaw` | 1046/1061 | 98.6 % |
| `targetAudienceRaw` | 942/1061 | 88.8 % |
| `generalInformationRaw` | 544/1061 | 51.3 % |
| `objectivesRaw` | 1009/1061 | 95.1 % |
| `contentRaw` | 951/1061 | 89.6 % |
| `prerequisitesRaw` | 394/1061 | 37.1 % |
| `additionalInformationRaw` | 353/1061 | 33.3 % |

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
- EP-372FEX — Généralités (`generalInformationRaw`)
- EP-373FEX — Généralités (`generalInformationRaw`)
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

- Date et heure de promotion : 2026-09-01T03:20:17.691Z
- Snapshot candidat validé : 2026-09-01
- Empreinte SHA-256 : `ab8579af8386d331d6c83e442cbbe32fa8b718a572fb4bc8099f4a9fea688a2f`
- Promotion manuelle confirmée.
