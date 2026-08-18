# Rapport d’import du catalogue officiel

- Date du snapshot : 2026-08-18
- URL source : https://outils.ge.ch/referentiel/formation/CatalogueDescription/
- Durée totale de l’import : 138.4 secondes
- Taille du JSON final : 2.05 Mio (2146217 octets)
- Empreinte SHA-256 du snapshot : `13940cd53eca720f0da8b25b92c5fa1735b086400a15278f47bd963be3a21a2c`

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
| Cours dans le snapshot officiel | 1055 |
| Cours dans le candidat | 1057 |
| Cours ajoutés | 3 |
| Cours supprimés | 1 |
| Cours modifiés | 13 |
| Cours dont les offres ont changé | 0 |
| Anomalies techniques | 0 |

### Cours ajoutés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| EP-090EVEN | Construire les bases de la réussite scolaire dès le cycle élémentaire : enjeux, apports et pistes - présentiel | DIP-EP - Offre de formation de l'enseignement primaire | DGEO/SRH/Secteur de la formation continue EO | Capacités transversales |
| OMP-119TSA | Journée refresh prévention et gestion des crises comportementales | DIP-OMP - Offre formation de l'OMP | DGOMP/SRH | Formations spécifiques |
| TRT3016E | Maîtriser les fondamentaux du Numérique Responsable \| E-Learning | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | NUMERIQUE A L'ETAT |

### Cours supprimés

| Code | Intitulé | Offres | Entité | Domaine |
| --- | --- | --- | --- | --- |
| SEM000 | (intitulé \| POS1) Améliorer l'expérience utilisateur dans l'Espace de formation (Intitulé : Zéphir) | DF-OPE - L'offre de formation de l'OPE | Service du développement professionnel OPE | Informatique Bureautique |

### Cours modifiés — champs visibles ou utilisés

| Code | Intitulé candidat | Changements |
| --- | --- | --- |
| EP-489 | Apprendre par le corps en classe et hors de la classe | `hasOpenSession` : « true » → « false » |
| EP-699 | Introduction aux fonctions exécutives et attentionnelles à l'école primaire | `hasOpenSession` : « true » → « false » |
| EP-974 | L'éducation nutritionnelle et sensorielle au cycle élémentaire | `hasOpenSession` : « true » → « false » |
| S2-117 | Dessin d'observation : vision et posture | `hasOpenSession` : « true » → « false » |
| SEM-10244 | CO-ESII / Une promenade en images pour l'Histoire de Genève : rencontre avec A. Bosch, conférencier et historien | `hasOpenSession` : « false » → « true » |
| SEM-10605 | CO-ESII / L'image et la représentation du réel dans le cinéma documentaire aujourd'hui avec le Festival Visions du Réel | `hasOpenSession` : « true » → « false » |
| SEM-10656 | EP-CO-ESII-OMP / A la découverte du Cyanotype | `hasOpenSession` : « false » → « true » |
| SEM0056 | Principes généraux du droit administratif | `hasOpenSession` : « true » → « false » |
| SEM1089 | Le management transversal | `hasOpenSession` : « true » → « false » |
| SEM1171 | Comment collaborer au sein d'une équipe intergénérationnelle | `hasOpenSession` : « true » → « false » |
| SEM1215 | Les neurosciences au service du management | `hasOpenSession` : « true » → « false » |

### Cours modifiés — champs descriptifs longs

| Code | Intitulé candidat | Champs modifiés |
| --- | --- | --- |
| S2-FIO002A | Enseignement par compétences, pédagogie différenciée, évaluation | `objectivesRaw` |
| SEM-10755 | ESII : Prise de notes et journal de lecture avec Keep / NOUVEAU / Formation autonome en ligne | `contentRaw` |

### Changements d’offres

Aucun rattachement à une offre n’a changé.

### Anomalies techniques

Aucune anomalie technique.

## Offres détectées

| Offre | Occurrences | Formations uniques |
| --- | ---: | ---: |
| Détention - Offre de formation de l'OCD | 71 | 71 |
| DF-OPE - L'offre de formation de l'OPE | 169 | 169 |
| DIP - Service de la formation DRH-DIP | 3 | 3 |
| DIP-CO - Offre de formation du Cycle d'orientation | 226 | 226 |
| DIP-EP - Offre de formation de l'enseignement primaire | 292 | 292 |
| DIP-ES II - Offre de formation de l'ES II | 236 | 236 |
| DIP-OMP - Offre formation de l'OMP | 232 | 232 |
| DIP-SEM - Offre de formation du Service Écoles-Médias | 153 | 153 |
| PJ - Offre de formation du pouvoir judiciaire | 56 | 56 |
| POLICE - CFPS - Centre de Formation de la Police | 210 | 210 |

## Disponibilité des champs

| Champ | Présent | Pourcentage |
| --- | ---: | ---: |
| `organizingEntityRaw` | 1057/1057 | 100.0 % |
| `domainRaw` | 1057/1057 | 100.0 % |
| `themeRaw` | 978/1057 | 92.5 % |
| `publicRaw` | 949/1057 | 89.8 % |
| `durationRaw` | 1042/1057 | 98.6 % |
| `targetAudienceRaw` | 941/1057 | 89.0 % |
| `generalInformationRaw` | 548/1057 | 51.8 % |
| `objectivesRaw` | 1007/1057 | 95.3 % |
| `contentRaw` | 952/1057 | 90.1 % |
| `prerequisitesRaw` | 400/1057 | 37.8 % |
| `additionalInformationRaw` | 356/1057 | 33.7 % |

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
- SFIN-003 — Généralités (`generalInformationRaw`)
- SFIN-002 — Généralités (`generalInformationRaw`)
- TRT012 — Informations complémentaires (`additionalInformationRaw`)
- TRT011 — Informations complémentaires (`additionalInformationRaw`)
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

## Comparaison avec les formations de référence

| Groupe | Code | Champ | Valeur de l’échantillon V1.1 | Valeur importée |
| --- | --- | --- | --- | --- |
| DIP | DIP-002 | `targetAudienceRaw` | `Cette séance d'accueil s'adresse aux personnes nouvellement engagées au sein du DIP, répondant aux critères suivants :<br><br>- le personnel administratif et technique<br>- les apprenties et apprentis<br>- le personnel enseignant engagé en cours d'année scolaire, n'ayant pas bénéficié d'une séance d'accueil organisée par sa direction générale<br><br>Dans certains cas, des auxiliaires peuvent également être invitées et invités à y prendre part.` | `Cette séance d'accueil s'adresse aux personnes nouvellement engagées au sein du DIP, répondant aux critères suivants :<br>- le personnel administratif et technique<br>- les apprenties et apprentis<br>- le personnel enseignant engagé en cours d'année scolaire, n'ayant pas bénéficié d'une séance d'accueil organisée par sa direction générale<br>Dans certains cas, des auxiliaires peuvent également être invitées et invités à y prendre part.` |
| DIP | EP-520 | `présence` | `présent` | `absent` |
| Police | FP173 | `targetAudienceRaw` | `Cette manifestation sportive est ouverte à l'ensemble du personnel de la police genevoise (ADM, ASP, policière/policier) sous réserve de disponibilité des places. Les policiers en formation concernés par l'événement seront mobilisés directement par l'organisation.` | `Cette manifestation sportive est ouverte à l'ensemble du personnel de la police genevoise (ADM, ASP, policière/policier) sous réserve de disponibilité des places.<br>Les policiers en formation concernés par l'événement seront mobilisés directement par l'organisation.` |
| OCD | OCD151 | `targetAudienceRaw` | `Le personnel du travail social en institution et hors murs, de la santé, de l'enseignement, de l'administration, de la police et des champs apparentés; exerçant dans les champs de la précarité, de la probation, du milieu carcéral, de la santé mentale et des services sociaux et de protection de l'adulte et de l'enfant. Formation destinée aux fonctionnaires en lien direct avec les bénéficiaires et/ou occupant des fonctions d'encadrement d'équipe.` | `Le personnel du travail social en institution et hors murs, de la santé, de l'enseignement, de l'administration, de la police et des champs apparentés; exerçant dans les champs de la précarité, de la probation, du milieu carcéral, de la santé mentale et des services sociaux et de protection de l'adulte et de l'enfant.<br>Formation destinée aux fonctionnaires en lien direct avec les bénéficiaires et/ou occupant des fonctions d'encadrement d'équipe.` |
| Pouvoir judiciaire | PJ-0001 | `titleRaw` | `Accueil des nouveaux collaborateurs. La convocation est directement adressée aux collaboratrices et collaborateurs par RH-Formation` | `Accueil des nouveaux collaborateurs.<br>La convocation est directement adressée aux collaboratrices et collaborateurs par RH-Formation` |

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

- Date et heure de promotion : 2026-08-18T07:08:54.731Z
- Snapshot candidat validé : 2026-08-18
- Empreinte SHA-256 : `13940cd53eca720f0da8b25b92c5fa1735b086400a15278f47bd963be3a21a2c`
- Promotion manuelle confirmée.
