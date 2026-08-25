# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-08-25
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 119.5 secondes
- Taille du JSON final : 2.05 Mio (2151685 octets)
- Empreinte SHA-256 du snapshot : `e710421267dc437939cac128cee13a60a36b138914a7a58fa19823e1eac9084f`

## Synthèse

- Occurrences détectées dans l’index : 1647
- Codes uniques : 1056
- Occurrences éliminées par déduplication : 591
- Formations présentes dans plusieurs offres : 299
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1056
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1058 |
| Cours dans le candidat | 1056 |
| Cours ajoutés | 0 |
| Cours supprimés | 2 |
| Cours modifiés | 10 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

Aucun cours ajouté.

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| FP063 | Plongeur trimix avancé | POLICE - CFPS - Centre de Formation de la Police | Centre Formation Police et Métiers Sécurité | 02. FORMATION CONTINUE Police |
| TRT3016E | Maîtriser les fondamentaux du Numérique Responsable \| E-Learning | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | NUMERIQUE A L'ETAT |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| CO-01699 | Evaluer efficacement en latin : conception d'évaluation et stratégies de révision | `hasOpenSession` : « false » → « true » |
| EP-101MDAS | Comprendre et gérer les conflits en EPS : stratégies d'autorégulation - niveau II | `hasOpenSession` : « true » → « false » |
| EP-1042 | Développement de la communication et du langage oral, TDL, défis langagiers et stratégies pédagogiques (1P-2P) | `hasOpenSession` : « true » → « false » |
| EP-580 | Initiation à l'observation et à la détermination des oiseaux communs avec une classe | `hasOpenSession` : « true » → « false » |
| FP249 | Formation Initiale Sentinelle milicien/milicienne | `hasOpenSession` : « true » → « false » |
| OMP-008TSA | Comprendre et répondre aux comportements défis | `hasOpenSession` : « true » → « false » |
| SEM-P1565 | EP-OMP / Apprendre l'analyse des vidéos publicitaires avec ses élèves / Formation autonome en ligne | `publicRaw` : « Enseignants de l' EP- CO -OMP » → « Enseignants EP - OMP » |
| SEM1040 | Mindmap : une méthode pour organiser ses idées et ses informations | `hasOpenSession` : « false » → « true » |
| SEM1193 | Prendre et assumer son rôle | `hasOpenSession` : « true » → « false » |
| SEM1200 | Moi, manager et négociateur ! | `hasOpenSession` : « true » → « false » |

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
| POLICE - CFPS - Centre de Formation de la Police | 204 | 204 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1056/1056 | 100.0 % |
| `domainRaw` | 1056/1056 | 100.0 % |
| `themeRaw` | 977/1056 | 92.5 % |
| `publicRaw` | 945/1056 | 89.5 % |
| `durationRaw` | 1041/1056 | 98.6 % |
| `targetAudienceRaw` | 941/1056 | 89.1 % |
| `generalInformationRaw` | 543/1056 | 51.4 % |
| `objectivesRaw` | 1006/1056 | 95.3 % |
| `contentRaw` | 951/1056 | 90.1 % |
| `prerequisitesRaw` | 394/1056 | 37.3 % |
| `additionalInformationRaw` | 353/1056 | 33.4 % |

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

- Date et heure de promotion : 2026-08-25T05:08:16.265Z
- Snapshot candidat validé : 2026-08-25
- Empreinte SHA-256 : `e710421267dc437939cac128cee13a60a36b138914a7a58fa19823e1eac9084f`
- Promotion manuelle confirmée.
