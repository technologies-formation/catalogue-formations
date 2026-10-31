// Les offres et les organisateurs sont deux dimensions indépendantes du catalogue.
export const environmentOptions = ['Police', 'Environnement carcéral', 'Pouvoir judiciaire', 'Enseignement au DIP', 'Autre']
export function trainingFields(courses = []) {
  const optionList = values => [...new Set(values.filter(x => typeof x === 'string' && x.trim()))].sort((a,b)=>a.localeCompare(b,'fr')).map(value=>({value,label:value}))
  const field = (maxLength, options, formControl='textarea') => ({type:'string',maxLength,requiredInApi:false,requiredInForm:false,formControl,options})
  return {
    professionalEnvironment: field(120, environmentOptions.map(value=>({value,label:value})), 'select'),
    trainingOffers: field(4000, optionList(courses.flatMap(c=>c.catalogueOffers??[]))),
    trainingOrganizers: field(4000, optionList(courses.map(c=>c.organizingEntity??c.officialData?.organizingEntityRaw))),
  }
}
export function selectedScope(value) {
  if(value==null||value==='')return []
  if(typeof value!=='string'||value.length>4000)throw Error('Périmètre invalide')
  const parts=value.split('\n').map(x=>x.trim()).filter(Boolean)
  if(parts.length>100||new Set(parts).size!==parts.length)throw Error('Périmètre invalide')
  return parts
}
export function scopeCatalogue(catalogue, profile) {
  const offers=selectedScope(profile.trainingOffers),organizers=selectedScope(profile.trainingOrganizers)
  if(!offers.length&&!organizers.length)return catalogue
  const fields=trainingFields(catalogue.courses)
  for(const [key,values]of [['trainingOffers',offers],['trainingOrganizers',organizers]])
    if(values.some(value=>!fields[key].options.some(x=>x.value===value)))throw Error('Périmètre à actualiser avant la recherche')
  const courses=catalogue.courses.filter(c=>(!offers.length||offers.some(x=>c.catalogueOffers?.includes(x)))&&(!organizers.length||organizers.includes(c.organizingEntity??c.officialData?.organizingEntityRaw)))
  const codes=new Set(courses.map(c=>c.code))
  return {...catalogue,courses,officialCodes:catalogue.officialCodes.filter(c=>codes.has(c)),ultraCompactCatalogue:catalogue.ultraCompactCatalogue.filter(c=>codes.has(c.code)),detailedByCode:new Map([...catalogue.detailedByCode].filter(([c])=>codes.has(c))),courseByCode:new Map([...catalogue.courseByCode].filter(([c])=>codes.has(c)))}
}
