# Provenance de la modalité dans les parcours

La modalité souhaitée par la personne et celle du cours sont deux informations distinctes. Le moteur ajoute aux fiches autorisées et aux cours publics une propriété `deliveryMode`, reconstruite côté serveur. Une étiquette explicite dans le titre permet d’indiquer `online`, `in_person` ou `hybrid`, avec `sourceField: 'titleRaw'` et le titre complet comme preuve. Sans étiquette, ou en présence d’étiquettes contradictoires, la valeur est `unknown` avec source et preuve nulles. Le classement, les codes de cours et les durées ne sont pas modifiés par ce mécanisme.

Cette extraction est volontairement limitée : elle n’infère pas une modalité à partir du contenu pédagogique, d’un lieu implicite, de la durée ou de l’absence d’e-learning. Elle n’interprète pas les indications de session. Une information inconnue reste inconnue, même si la personne a une préférence explicite.

Les consignes du deuxième passage demandent d’utiliser cette propriété pour décrire la modalité, de ne jamais présumer du présentiel, de signaler un écart avec la préférence et d’expliciter l’incertitude lorsqu’une compatibilité ne peut pas être établie. Une formation hybride ne garantit pas un suivi entièrement en ligne ou en présentiel.

Les tests de développement couvrent les titres sans indication, les étiquettes en ligne, présentiel et hybride, les mentions d’e-learning comme sujet de cours, et les étiquettes contradictoires. Des réponses préparées vérifient la provenance transmise et les consignes ; ces tests ne constituent pas un benchmark sémantique et ne prouvent pas le respect des consignes par un modèle réel. Aucun appel OpenAI n’est effectué.

L’évolution est additive pour les consommateurs du contrat. L’avatar accepte aussi les anciennes réponses sans propriété de modalité, qu’il affiche comme non renseignées. Les textes de parcours déjà reçus ne sont pas réécrits.
