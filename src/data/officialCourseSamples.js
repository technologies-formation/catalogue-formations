export const officialCourseSamples = [
  {
    code: 'DIP-002',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/DIP-002.html',
    officialData: {
      titleRaw:
        "Séance d'accueil destinée aux nouvelles et nouveaux collaborateurs - DIP",
      domainRaw: "FONCTIONNEMENT DE L'ADMINISTRATION",
      organizingEntityRaw: 'Service développement des compétences DIP',
      publicRaw: 'Spécifique',
      targetAudienceRaw: `Cette séance d'accueil s'adresse aux personnes nouvellement engagées au sein du DIP, répondant aux critères suivants :

- le personnel administratif et technique
- les apprenties et apprentis
- le personnel enseignant engagé en cours d'année scolaire, n'ayant pas bénéficié d'une séance d'accueil organisée par sa direction générale

Dans certains cas, des auxiliaires peuvent également être invitées et invités à y prendre part.`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'PAT', entity: 'DIP' },
        { category: 'PE', entity: 'DIP' },
      ],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'FP173',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/FP173.html',
    officialData: {
      titleRaw: 'Traversée de la Rade - Prérequis.',
      domainRaw: '01. FORMATION INITIALE Police',
      organizingEntityRaw: 'Centre Formation Police et Métiers Sécurité',
      publicRaw: 'Tout public',
      targetAudienceRaw:
        "Cette manifestation sportive est ouverte à l'ensemble du personnel de la police genevoise (ADM, ASP, policière/policier) sous réserve de disponibilité des places. Les policiers en formation concernés par l'événement seront mobilisés directement par l'organisation.",
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'POL', entity: 'POLICE' },
        { category: 'PAT', entity: 'POLICE' },
      ],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'OCD151',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/OCD151.html',
    officialData: {
      titleRaw: 'CAS Violences plurielles',
      domainRaw: 'Collaboration & auto-gestion',
      organizingEntityRaw: "Centre de formation de l'OCD",
      publicRaw: 'Personnel administratif OCD',
      targetAudienceRaw:
        "Le personnel du travail social en institution et hors murs, de la santé, de l'enseignement, de l'administration, de la police et des champs apparentés; exerçant dans les champs de la précarité, de la probation, du milieu carcéral, de la santé mentale et des services sociaux et de protection de l'adulte et de l'enfant. Formation destinée aux fonctionnaires en lien direct avec les bénéficiaires et/ou occupant des fonctions d'encadrement d'équipe.",
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PAT', entity: 'OCD' }],
      targetingSource: 'public',
    },
  },
  {
    code: 'OCD425',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/OCD425.html',
    officialData: {
      titleRaw: null,
      domainRaw: null,
      organizingEntityRaw: null,
      publicRaw: null,
      targetAudienceRaw: null,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PEN', entity: 'OCD' }],
      targetingSource: 'explicit',
    },
  },
  {
    code: 'PJ-1001',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/PJ-1001.html',
    officialData: {
      titleRaw:
        "ERAJ - Formation de base en administration judiciaire Demande via un ticket ASI et inscription en ligne sur le site de l'ERAJ.",
      domainRaw: 'FORMATION COLLABORATEURS',
      organizingEntityRaw: 'Secteur formation du Pouvoir judiciaire',
      publicRaw: 'Tout-e collaborateur/trice (PAT)',
      targetAudienceRaw:
        'Personnel administratif, non juriste, du domaine judiciaire',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PAT', entity: 'PJ' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'PJ-0028',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/PJ-0028.html',
    officialData: {
      titleRaw: null,
      domainRaw: null,
      organizingEntityRaw: null,
      publicRaw: null,
      targetAudienceRaw: null,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'MAG', entity: 'PJ' }],
      targetingSource: 'explicit',
    },
  },
  {
    code: 'SEM1098',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/SEM1098.html',
    officialData: {
      titleRaw: "Les clés d'une communication efficace",
      domainRaw: 'COMMUNIQUER ET TRANSMETTRE',
      organizingEntityRaw: 'Service du développement professionnel OPE',
      publicRaw: 'Tout public',
      targetAudienceRaw:
        "Ce cours est destiné à toutes celles et tous ceux qui souhaitent améliorer la qualité de leur communication en s'appropriant et en intégrant de manière consciente les principes de l'écoute active qui représentent des clés indispensables pour une communication efficace.",
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'PAT', entity: null },
        { category: 'PE', entity: null },
        { category: 'POL', entity: null },
        { category: 'PEN', entity: null },
        { category: 'MAG', entity: null },
      ],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'S2-590',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/S2-590.html',
    officialData: {
      titleRaw: 'Modéliser le réel : le dialogue entre mathématiques et physique',
      domainRaw: 'Mathématiques',
      organizingEntityRaw:
        "Direction générale de l'enseig. secondaire II / Service formation continue de l' ES II",
      publicRaw: 'Enseignants du PO',
      targetAudienceRaw:
        "Personnes qui, dans l'ES II, sont enseignantes de mathématiques et/ou physique.",
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PE', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'CO-01683',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/CO-01683.html',
    officialData: {
      titleRaw:
        "Suivi des élèves avec l'équipe enseignante, MPS et la direction (Maîtrise de classe, module 2)",
      domainRaw: 'Profession enseignante',
      organizingEntityRaw: 'DGEO/SRH/Secteur de la formation continue EO',
      publicRaw: 'Enseignants du CO + ES II',
      targetAudienceRaw: "Enseignantes et enseignants de l'ESI et de l'ESII",
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PE', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'SEM-10904',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/SEM-10904.html',
    officialData: {
      titleRaw:
        'CO-ESII / Moodle : Devenir autonome - créer des évaluations automatisées - niveau 1 / Formation autonome en ligne',
      domainRaw: 'Médias, image, numérique',
      organizingEntityRaw: 'DIP-SEM / Secteur Formation',
      publicRaw: 'Enseignants du CO + ES II',
      targetAudienceRaw: 'Ensemble du corps enseignant (CO/ESII)',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PE', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'FP203',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/FP203.html',
    officialData: {
      titleRaw: 'Formation pour évaluateurs - EC',
      domainRaw: '04. ÉVALUATIONS DE COMPÉTENCES Police',
      organizingEntityRaw: 'Centre Formation Police et Métiers Sécurité',
      publicRaw: 'Tout public',
      targetAudienceRaw: `Personnel policier.
Personnel administratif de la police.
Personnel OCD - OCE.`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'POL', entity: 'POLICE' },
        { category: 'PAT', entity: 'POLICE' },
        { category: 'PAT', entity: 'OCD' },
        { category: 'PEN', entity: 'OCD' },
        { category: 'PAT', entity: 'OCE' },
      ],
      targetingSource: 'explicit',
    },
  },
  {
    code: 'SEM0735',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/SEM0735.html',
    officialData: {
      titleRaw: 'Ethique et déontologie de la fonction publique',
      domainRaw: "FONCTIONNEMENT DE L'ADMINISTRATION",
      organizingEntityRaw: 'Service du développement professionnel OPE',
      publicRaw: 'Tout public',
      targetAudienceRaw: 'Tout-e collaborateur/trice',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'PAT', entity: null },
        { category: 'PE', entity: null },
        { category: 'POL', entity: null },
        { category: 'PEN', entity: null },
        { category: 'MAG', entity: null },
      ],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'SEM1080',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/SEM1080.html',
    officialData: {
      titleRaw: "Identifier et gérer les risques d'un projet",
      domainRaw: 'GESTION DE PROJET',
      organizingEntityRaw: 'Service du développement professionnel OPE',
      publicRaw: 'Tout public',
      targetAudienceRaw:
        'Toute personne amenée à contribuer et/ou à réaliser un projet et qui souhaite approfondir cette thématique.',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'PAT', entity: null },
        { category: 'PE', entity: null },
        { category: 'POL', entity: null },
        { category: 'PEN', entity: null },
        { category: 'MAG', entity: null },
      ],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'SEM0518',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/SEM0518.html',
    officialData: {
      titleRaw:
        'Prévenir les tensions dans ses relations par une bonne communication',
      domainRaw: 'TRAVAILLER ENSEMBLE',
      organizingEntityRaw: 'Service du développement professionnel OPE',
      publicRaw: 'Tout public',
      targetAudienceRaw: `Collaboratices et collaborateurs désireux d'agir pour améliorer sa communication et éviter les conflits.
Ce cours n'est pas un lieu de résolution pour des conflits avérés. Si vous avez des difficultés, nous vous invitons à solliciter votre hiérarchie ou votre RH départemental, voire le Groupe de confiance - qui peuvent vous accompagner dans une démarche et/ou vous orienter.
Les responsables d'équipe amenés à gérer des conflits dans lesquels elles et ils ne sont pas impliqués, mais dans lesquels elles et ils jouent un rôle de tiers, ou souhaitant développer leur compétence à gérer les tensions au quotidien dans leur équipe, choisiront la formation "Manager : Gérer les tensions au sein de son équipe".`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'PAT', entity: null },
        { category: 'PE', entity: null },
        { category: 'POL', entity: null },
        { category: 'PEN', entity: null },
        { category: 'MAG', entity: null },
      ],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'CO-01660',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/CO-01660.html',
    officialData: {
      titleRaw:
        "Statues, musées, noms des rues : les controverses autour des traces mémorielles dans l'espace public",
      domainRaw: 'Sciences humaines et sociales',
      organizingEntityRaw: 'DGEO/SRH/Secteur de la formation continue EO',
      publicRaw: 'Enseignants du CO + ES II',
      targetAudienceRaw:
        "Enseignantes et enseignants d'histoire, de citoyenneté, de géographie, de connaissance du milieu du CO et de l'ESII",
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PE', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'EP-520',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/EP-520.html',
    officialData: {
      titleRaw:
        "L'écriture au cycle élémentaire : du geste d'écriture à la production",
      domainRaw: 'Langues',
      organizingEntityRaw: 'DGEO/SRH/Secteur de la formation continue EO',
      publicRaw: 'enseignant-e-s cycle 1 & division spécialisée',
      targetAudienceRaw: `Personnel enseignant CE (MGEN*, ECSP, ECA)
Personnel enseignant OMP
*maitresses et maitres généralistes titulaires de classe`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PE', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'SEM-P1575',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/SEM-P1575.html',
    officialData: {
      titleRaw:
        "EP-OMP / Découvrir l'intelligence artificielle / Formation hybride / NOUVEAU",
      domainRaw: 'Médias, image, numérique',
      organizingEntityRaw: 'DIP-SEM / Secteur Formation',
      publicRaw: 'Enseignants EP - OMP',
      targetAudienceRaw: 'Ensemble du corps enseignant EP et OMP',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PE', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'CO-01686',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/CO-01686.html',
    officialData: {
      titleRaw:
        'Précarité, migration et scolarité des enfants à Genève : éclairages et ressources (DIAC)',
      domainRaw: 'Profession enseignante',
      organizingEntityRaw: 'DGEO/SRH/Secteur de la formation continue EO',
      publicRaw: 'Enseignants ES II - CO - EP - OMP',
      targetAudienceRaw: `Enseignantes et enseignants de l'EP, de l'ESI, de l'ESII et de l'OMP
Les participants identifient quelques-unes des préoccupations majeures des élèves, de leurs familles et des enseignants qui les côtoient à travers une expérience rapportée du terrain ;
A la fin de la séance, les participants sont capables d'identifier les défis pour ces familles et, en collaboration avec les personnes ressources de leur établissement (conseillères et conseillers sociaux, éducatrices et éducateurs), de mieux les orienter.`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PE', entity: 'DIP' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'FP007',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/FP007.html',
    officialData: {
      titleRaw: 'CCI - Cours tactique',
      domainRaw: '03. FORMATION DES CADRES Police',
      organizingEntityRaw: 'Centre Formation Police et Métiers Sécurité',
      publicRaw: 'Police',
      targetAudienceRaw:
        'Ce cours est à destination des agents de la Police, à partir de 10 ans de service.',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'POL', entity: 'POLICE' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'FP020',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/FP020.html',
    officialData: {
      titleRaw: 'Pilotage automobile',
      domainRaw: '02. FORMATION CONTINUE Police',
      organizingEntityRaw: 'Centre Formation Police et Métiers Sécurité',
      publicRaw: 'Police',
      targetAudienceRaw: `Personnel policier, ASP 3 et ASP 4, jusqu'au grade de Sergent.e-Chef.fe (inclus) dont le matricule correspond aux années suivantes :
- P96XXX
- P01XXX
- P06XXX
- P11XXX
- P16XXX
- P21XXX
Ce cours concerne également les collaborateurs/trices concerné/e/s par un report des années précédentes.
En dehors des collaborateurs/trices concerné/e/s, aucune inscription ne sera acceptée.
Les cas particuliers sont priés de prendre contact directement avec CFPS-FOCO (par mail ou par téléphone).`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'POL', entity: 'POLICE' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'OCD175',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/OCD175.html',
    officialData: {
      titleRaw: 'Formation cantonale genevoise (FCG)',
      domainRaw: 'Introduction à la privation de liberté',
      organizingEntityRaw: "Centre de formation de l'OCD",
      publicRaw: 'Personnel Pénitentiaire',
      targetAudienceRaw: 'Agents de détention stagiaires',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PEN', entity: 'OCD' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'OCD207',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/OCD207.html',
    officialData: {
      titleRaw:
        "BFFA - M1 : Animer des sessions de formation pour des groupes d'adultes (FFA CF-AF).",
      domainRaw: 'Formateurs',
      organizingEntityRaw: "Centre de formation de l'OCD",
      publicRaw: 'Tout-e collaborateur/trice OCD',
      targetAudienceRaw: `Le certificat est requis dans le plan de développement des agents de détention du secteur recrutement et développement des compétences de l'OCD (SC FOI/FOBA/Sécurité personnelle, chargés de formation).
Il est proposé aux moniteurs et formateurs internes de l'OCD en tant que formation de spécialisation, qui le souhaitent et en font la demande.`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [
        { category: 'PEN', entity: 'OCD' },
        { category: 'PAT', entity: 'OCD' },
      ],
      targetingSource: 'explicit',
    },
  },
  {
    code: 'PJ-0001',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/PJ-0001.html',
    officialData: {
      titleRaw:
        'Accueil des nouveaux collaborateurs. La convocation est directement adressée aux collaboratrices et collaborateurs par RH-Formation',
      domainRaw: 'FORMATION COLLABORATEURS',
      organizingEntityRaw: 'Secteur formation du Pouvoir judiciaire',
      publicRaw: 'Tout-e collaborateur/trice (PAT)',
      targetAudienceRaw: `Nouveaux collaborateurs du Pouvoir judiciaire.
La convocation est directement adressée aux collaboratrices et collaborateurs par RH-Formation`,
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'PAT', entity: 'PJ' }],
      targetingSource: 'publicDetail',
    },
  },
  {
    code: 'PJ-0026',
    sourceUrl:
      'https://outils.ge.ch/referentiel/formation/CatalogueDescription/PJ-0026.html',
    officialData: {
      titleRaw: 'Déontologie judiciaire',
      domainRaw: 'FORMATION MAGISTRATS',
      organizingEntityRaw: 'Secteur formation du Pouvoir judiciaire',
      publicRaw: 'Magistrats',
      targetAudienceRaw: 'Magistrats des trois filières',
    },
    normalizationStatus: 'validated',
    targeting: {
      targets: [{ category: 'MAG', entity: 'PJ' }],
      targetingSource: 'publicDetail',
    },
  },
]
