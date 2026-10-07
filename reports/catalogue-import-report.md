# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-10-07
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 125.2 secondes
- Taille du JSON final : 2.08 Mio (2181355 octets)
- Empreinte SHA-256 du snapshot : `4cfbc77479229e1e491dab3f804745a82041c9edd09b939e4e35185224808e4a`

## Synthèse

- Occurrences détectées dans l’index : 1651
- Codes uniques : 1073
- Occurrences éliminées par déduplication : 578
- Formations présentes dans plusieurs offres : 294
- Nombre maximal d’offres pour une formation : 5
- Fiches récupérées avec succès : 1073
- Fiches indisponibles : 0

## Comparaison avec le snapshot officiel

Les ajouts, suppressions et modifications sont des évolutions métier à examiner ; ils ne constituent pas automatiquement des anomalies.

| Indicateur | Valeur |
| --- | ---: |
| Cours dans le snapshot officiel | 1068 |
| Cours dans le candidat | 1073 |
| Cours ajoutés | 5 |
| Cours supprimés | 0 |
| Cours modifiés | 26 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| EP-1340ETB | MSN : mathématiques | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Mathématiques |
| S2-PATC017 | Formation continue pour les médiatrices et médiateurs du réseau de médiation de l'ESII. | DIP-ES II - Offre de formation de l'ES II | Direction générale de l'enseig. secondaire II | Développement professionnel |
| S2-PATC018 | Médiation scolaire : formation de base pour rejoindre le réseau de médiation de l'ESII | DIP-ES II - Offre de formation de l'ES II | Direction générale de l'enseig. secondaire II | Développement professionnel |
| SEM1255 | Construire le futur : la boîte à outils du manager | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | MANAGEMENT ET RESSOURCES HUMAINES |
| SEM1263 | Améliorer sa mémoire pour être plus efficace | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | APTITUDES PERSONNELLES |

### Cours supprimés

Aucun cours supprimé.

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EP-519 | Appropriation des MER Français cycle moyen | `titleRaw` : « Appropriation des MER Français 5e-6e » → « Appropriation des MER Français cycle moyen »<br>`targetAudienceRaw` : « Personnel enseignant CM (MGEN*, ECSP, ECA), prioritairement pour celles et ceux travaillant avec des élèves de 5P-6P Personnel enseignant OMP *maitresses et maitres généralistes titulaires de classe » → « Personnel enseignant CM (MGEN*, ECSP, ECA), prioritairement pour celles et ceux travaillant avec des élèves du cycle moyen Personnel enseignant OMP *maitresses et maitres généralistes titulaires de classe » |
| S2-326 | Commerce extérieur suisse : un an de bouleversements géopolitiques - où en sommes-nous ? | `hasOpenSession` : « false » → « true » |
| SEM-P4001 | EP / Formation institutionnelle obligatoire / TBI (Base) pour le Cycle 2 | `hasOpenSession` : « false » → « true » |
| SEM-P4005 | EP / Formation institutionnelle obligatoire / TBI (Base) pour le Cycle 1 | `hasOpenSession` : « false » → « true » |
| SEM-P4009 | EP / Formation institutionnelle obligatoire / Science informatique pour les enseignants 5P-6P | `hasOpenSession` : « false » → « true » |
| SEM-P4010 | EP / Formation institutionnelle obligatoire / Science informatique pour le Cycle 1 | `hasOpenSession` : « false » → « true » |
| SEM0647 | Bilan de mes ressources et de mes intérêts : première approche | `hasOpenSession` : « true » → « false » |
| SEM1118 | Gérer ses émotions dans ses relations professionnelles | `hasOpenSession` : « true » → « false » |
| SEM1141 | Retrouver son équilibre et développer son pouvoir d'agir au travail | `titleRaw` : « La roue de l'équilibre de vie au travail » → « Retrouver son équilibre et développer son pouvoir d'agir au travail »<br>`targetAudienceRaw` : « Toute personne intéressée à développer ses aptitudes personnelles et professionnelles et à effectuer un travail sur soi. Des difficultés relationnelles, conflictuelles et/ou organisationnelles peuvent être une incitation à suivre et vivr… » → `null` |
| SEM1169 | Ecrire pour être compris | `hasOpenSession` : « false » → « true » |
| SEM1212 | Améliorer et apaiser ses relations professionnelles | `hasOpenSession` : « true » → « false » |
| SEM1214 | Charge mentale au travail: s'en décharger avant d'être surchargé.e | `hasOpenSession` : « false » → « true » |
| SEM1218 | Sensibilisation aux approches agiles | `hasOpenSession` : « true » → « false » |
| SEM1220 | Adapter sa manière de communiquer pour des relations professionnelles efficaces (PCM) | `hasOpenSession` : « false » → « true » |
| SEM1246 | Renforcer son esprit critique à l'ère de l'IA et de la désinformation | `hasOpenSession` : « true » → « false » |
| SEM1254 | Storytelling, l'art de convaincre par le récit | `publicRaw` : « Ressources humaines » → « Manager »<br>`targetAudienceRaw` : `null` → « Managers, chefs et cheffes de projet, spécialistes »<br>`hasScheduledSession` : « false » → « true » |
| SEM1261 | Gouvernance des données RH | `targetAudienceRaw` : « Ressources humaines : Précisions sur le public cible : Cette formation s'adresse plus particulièrement aux gestionnaires de données RH, à savoir : - Les personnes directement impliquées dans la gouvernance des données comme les propriéta… » → « Ressources humaines : Précisions sur le public cible : Cette formation s'adresse plus particulièrement aux gestionnaires de données RH, à savoir : - Les personnes directement impliquées dans la gouvernance des données comme les propriéta… » |
| TRT1004 | Windows 11 | `hasScheduledSession` : « false » → « true » |
| TRT1013 | PowerPoint 365 Base | `hasScheduledSession` : « false » → « true » |
| TRT1014 | PowerPoint 365 Avancé | `hasScheduledSession` : « false » → « true » |
| TRT1015 | Word 365 Base | `hasScheduledSession` : « false » → « true » |
| TRT1016 | Word 365 Publipostage | `hasScheduledSession` : « false » → « true » |
| TRT1017 | Word 365 Mise en forme avancée | `hasScheduledSession` : « false » → « true » |
| TRT1018 | Word 365 Longs documents | `hasScheduledSession` : « false » → « true » |
| TRT1020 | Word 365 Gagner en efficacité | `hasScheduledSession` : « false » → « true » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| EP-519 | Appropriation des MER Français cycle moyen | `objectivesRaw`, `contentRaw` |
| S2-326 | Commerce extérieur suisse : un an de bouleversements géopolitiques - où en sommes-nous ? | `contentRaw` |
| SEM1040 | Mindmap : une méthode pour organiser ses idées et ses informations | `generalInformationRaw`, `objectivesRaw`, `contentRaw` |
| SEM1141 | Retrouver son équilibre et développer son pouvoir d'agir au travail | `generalInformationRaw`, `objectivesRaw`, `contentRaw`, `additionalInformationRaw` |
| SEM1261 | Gouvernance des données RH | `prerequisitesRaw` |

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
| DF-OPE - L'offre de formation de l'OPE | 174 | 174 |
| DIP - Service de la formation DRH-DIP | 4 | 4 |
| DIP-CO - Offre de formation du Cycle d'orientation | 223 | 223 |
| DIP-EP - Offre de formation de l'enseignement primaire | 316 | 316 |
| DIP-ES II - Offre de formation de l'ES II | 239 | 239 |
| DIP-OMP - Offre formation de l'OMP | 230 | 230 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 148 | 148 |
| POLICE - CFPS - Centre de Formation de la Police | 193 | 193 |
| Pouvoir Judiciaire - Offre de formation du Pouvoir judiciaire | 54 | 54 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1073/1073 | 100.0 % |
| `domainRaw` | 1073/1073 | 100.0 % |
| `themeRaw` | 994/1073 | 92.6 % |
| `publicRaw` | 958/1073 | 89.3 % |
| `durationRaw` | 1053/1073 | 98.1 % |
| `targetAudienceRaw` | 950/1073 | 88.5 % |
| `generalInformationRaw` | 539/1073 | 50.2 % |
| `objectivesRaw` | 1020/1073 | 95.1 % |
| `contentRaw` | 947/1073 | 88.3 % |
| `prerequisitesRaw` | 384/1073 | 35.8 % |
| `additionalInformationRaw` | 342/1073 | 31.9 % |

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
- TRT702 — Informations complémentaires (`additionalInformationRaw`)
- TRT701 — Informations complémentaires (`additionalInformationRaw`)
- TRT703 — Informations complémentaires (`additionalInformationRaw`)
- SFIN-001 — Généralités (`generalInformationRaw`)
- SFIN-003 — Généralités (`generalInformationRaw`)
- SFIN-002 — Généralités (`generalInformationRaw`)
- TRT011 — Informations complémentaires (`additionalInformationRaw`)
- TRT023 — Informations complémentaires (`additionalInformationRaw`)
- TRT012 — Informations complémentaires (`additionalInformationRaw`)
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

- Date et heure de promotion : 2026-10-07T10:10:25.108Z
- Snapshot candidat validé : 2026-10-07
- Empreinte SHA-256 : `4cfbc77479229e1e491dab3f804745a82041c9edd09b939e4e35185224808e4a`
- Promotion manuelle confirmée.
