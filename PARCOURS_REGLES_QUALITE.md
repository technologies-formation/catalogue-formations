# Parcours : pertinence, temps et modalité

Décisions métier du 28 octobre 2026.

- Le temps disponible est un repère de planification, pas un plafond d'accès aux apprentissages. Conserver les étapes directement nécessaires, calculer leur durée et exposer l'écart ; ne pas réduire silencieusement l'objectif.
- Éviter les redondances : un parcours ciblé et un e-learning généraliste couvrant le même besoin constituent des voies à comparer, pas un cumul automatique. La préférence souple pour l'en ligne ne prime pas sur la pertinence, les acquis et la complémentarité. Une exigence exclusivement en ligne reste distincte.
- La modalité est extraite du titre et des déclarations explicites du descriptif (informations générales, contenu, objectifs, informations complémentaires). Un cours sur la conception de e-learning n'est pas pour autant dispensé en ligne. Une mention ambiguë ou contradictoire reste inconnue.
- En l'absence de mention, appliquer la règle transitoire validée : présentiel présumé (`value: in_person`, `sourceField: catalogue-default`, `evidence: null`). Ce n'est ni une preuve dans la fiche ni un futur indicateur SIRH. Ne pas garantir une compatibilité sur cette seule hypothèse.
- Les versions proches des logiciels restent possibles si les compétences enseignées sont pertinentes ; expliciter la différence sans promettre d'équivalence.

Les modalités sont calculées par le serveur et transmises aux deux passes utiles, puis aux résultats. Aucun nouveau champ n'est imputé au catalogue source. Les données et réservations précédentes ne sont ni recalculées ni réinitialisées.

Installer d'abord l'Assistant qui accepte les nouvelles provenances, puis `server/pathwayEngine.mjs`. Les autres modules composites du Catalogue et l'interface construite restent inchangés. Les résultats déjà enregistrés gardent leur contenu d'origine.

Validation : 386 tests locaux réussis, dont présence d'un socle de 16 h pour 2 h disponibles et alternative non cumulée, modes explicites/présumés, descriptif, négation et ambiguïté. Faux transports uniquement, aucune génération payante. La pertinence réelle du prochain résultat devra être évaluée par l'opérateur : les tests de consignes ne prouvent pas une décision sémantique du modèle.
