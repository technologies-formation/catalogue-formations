# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-09-18
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 123.8 secondes
- Taille du JSON final : 2.05 Mio (2145860 octets)
- Empreinte SHA-256 du snapshot : `ea83a3719a9002f3e419541d011b360c1c73911a8fb3cb513ea834bac51fe8cf`

## Synthèse

- Occurrences détectées dans l’index : 1648
- Codes uniques : 1054
- Occurrences éliminées par déduplication : 594
- Formations présentes dans plusieurs offres : 298
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1054
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1055 |
| Cours dans le candidat | 1054 |
| Cours ajoutés | 1 |
| Cours supprimés | 2 |
| Cours modifiés | 14 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| EP-1297ETB | Bien collaborer | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Profession enseignante |

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| CO-01664 | Faire vivre la littérature suisse romande en classe, présentation des séquences LiRom disponibles sur le site Ecole EEL | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II | DGEO/SRH/Secteur de la formation continue EO | Langues |
| CO-01676 | La transition écologique : quels enjeux pour respecter les limites de notre planète ? | DIP-CO - Offre de formation du Cycle d'orientation<br>DIP-EP - Offre de formation de l'enseignement primaire<br>DIP-ES II - Offre de formation de l'ES II | DGEO/SRH/Secteur de la formation continue EO | Formation générale |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EP-01APPCO | Ateliers de pratique professionnelle en contexte de co-intervention (APP CO) | `targetAudienceRaw` : « Cette formation s'adresse aux professionnelles et professionnels impliqués dans un dispositif de co-intervention au cycle élémentaire. » → « Cette formation s'adresse aux professionnelles et professionnels impliqués pour la première année dans un dispositif de co-intervention au cycle élémentaire. »<br>`hasScheduledSession` : « false » → « true » |
| FP313 | MyABI - VBME - gestion des pièces à conviction (cadres) | `hasOpenSession` : « true » → « false » |
| OMP-015TSA | Les transitions de l'enfance à l'âge adulte | `hasOpenSession` : « true » → « false » |
| S2-EPS18 | Escalade : perfectionnement J+S | `hasOpenSession` : « false » → « true » |
| SEM-10465 | EP-CO-ESII / Utiliser la découpeuse vinyle du FabLab du SEM | `hasOpenSession` : « true » → « false » |
| SEM-10656 | EP-CO-ESII-OMP / A la découverte du Cyanotype | `hasOpenSession` : « true » → « false » |
| SEM-P4001 | EP / Formation institutionnelle obligatoire / TBI (Base) pour le Cycle 2 | `hasOpenSession` : « true » → « false » |
| SEM0872 | Gestion du temps et des priorités | `hasOpenSession` : « true » → « false » |
| SEM1089 | Le management transversal | `hasOpenSession` : « false » → « true » |
| SEM1095 | Prévenir et gérer les comportements agressifs | `hasOpenSession` : « true » → « false » |
| SEM1122 | Ajuster sa voix et son comportement non verbal, force d'influence | `hasOpenSession` : « false » → « true » |
| SEM1164 | L'intelligence collective au service de la transformation et l'innovation | `hasOpenSession` : « false » → « true » |
| SEM1237 | Comment acquérir une vision synthétique et objective d'une situation ? | `hasOpenSession` : « false » → « true » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| EP-004EPP | Encadrer, planifier et sécuriser les activités scolaires (anciennement prévention des accidents) | `prerequisitesRaw` |
| EP-01APPCO | Ateliers de pratique professionnelle en contexte de co-intervention (APP CO) | `durationRaw` |

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
| DF-OPE - L'offre de formation de l'OPE | 168 | 168 |
| DIP - Service de la formation DRH-DIP | 3 | 3 |
| DIP-CO - Offre de formation du Cycle d'orientation | 229 | 229 |
| DIP-EP - Offre de formation de l'enseignement primaire | 304 | 304 |
| DIP-ES II - Offre de formation de l'ES II | 241 | 241 |
| DIP-OMP - Offre formation de l'OMP | 232 | 232 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 154 | 154 |
| PJ - Offre de formation du pouvoir judiciaire | 54 | 54 |
| POLICE - CFPS - Centre de Formation de la Police | 193 | 193 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1054/1054 | 100.0 % |
| `domainRaw` | 1054/1054 | 100.0 % |
| `themeRaw` | 975/1054 | 92.5 % |
| `publicRaw` | 942/1054 | 89.4 % |
| `durationRaw` | 1037/1054 | 98.4 % |
| `targetAudienceRaw` | 935/1054 | 88.7 % |
| `generalInformationRaw` | 533/1054 | 50.6 % |
| `objectivesRaw` | 1004/1054 | 95.3 % |
| `contentRaw` | 939/1054 | 89.1 % |
| `prerequisitesRaw` | 381/1054 | 36.1 % |
| `additionalInformationRaw` | 343/1054 | 32.5 % |

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
- TRT700 — Informations complémentaires (`additionalInformationRaw`)
- TRT702 — Informations complémentaires (`additionalInformationRaw`)
- TRT703 — Informations complémentaires (`additionalInformationRaw`)
- TRT701 — Informations complémentaires (`additionalInformationRaw`)
- SFIN-001 — Généralités (`generalInformationRaw`)
- SFIN-003 — Généralités (`generalInformationRaw`)
- TRT011 — Informations complémentaires (`additionalInformationRaw`)
- SFIN-002 — Généralités (`generalInformationRaw`)
- TRT023 — Informations complémentaires (`additionalInformationRaw`)
- TRT024 — Informations complémentaires (`additionalInformationRaw`)
- TRT012 — Informations complémentaires (`additionalInformationRaw`)
- EP-373FEX — Généralités (`generalInformationRaw`)
- EP-372FEX — Généralités (`generalInformationRaw`)
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

- Date et heure de promotion : 2026-09-18T08:11:56.742Z
- Snapshot candidat validé : 2026-09-18
- Empreinte SHA-256 : `ea83a3719a9002f3e419541d011b360c1c73911a8fb3cb513ea834bac51fe8cf`
- Promotion manuelle confirmée.
