import test from 'node:test'
import assert from 'node:assert/strict'
import {buildPathwayWithLuna} from './pathwayEngine.mjs'
const response=value=>({ok:true,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],usage:{}})})
function catalogue(){
 const courses=[['COCKPIT-RH','Cockpit RH','OPE'],['COCKPIT-PAIE','Cockpit Paie','OPE'],['COCKPIT-FORM','Cockpit Formation','OPE'],['EXCEL-BASE','Excel Base','OPE'],['PJ-EXCEL','Excel PJ','PJ']].map(([code,title,offer])=>({code,title,duration:'1 jour',catalogueOffers:[offer],sourceUrl:'https://example.test/'+code,officialData:{titleRaw:title,publicRaw:'Tout public',durationRaw:'1 jour',themeRaw:title.startsWith('Cockpit')?'SIRH':'EXCEL'}}))
 return {courses,officialCodes:courses.map(c=>c.code),ultraCompactCatalogue:courses.map(c=>[c.code,c.title]),courseByCode:new Map(courses.map(c=>[c.code,c])),detailedByCode:new Map(courses.map(c=>[c.code,{...c,content:c.title}]))}
}
const profile={professionalEnvironment:'Pouvoir judiciaire',personnelCategory:'PAT',role:'Chef',managerStatus:'Manager, expérience non précisée',objective:'Créer des tableaux pour mes collègues concernant les cockpits',existingSkills:'Débutant avec Excel',timeAvailable:'5 jours sur 1 an'}
async function run(p,information=[]){
 const requests=[],base=p.trainingOffers==='PJ'?'PJ-EXCEL':'EXCEL-BASE',answers=[{interpretedGoal:'Acquérir des compétences Excel',codes:[base]},{abstain:false,summary:'Parcours Excel.',recommendedSteps:[{code:base,rationale:'Bases pour commencer.'}],optionalSteps:[],informationalCourses:information,gaps:[]}]
 const result=await buildPathwayWithLuna(p,{catalogue:catalogue(),apiKey:'FAKE_TEST_ONLY',fetchImpl:async(_,init)=>{requests.push(JSON.parse(init.body));return response(answers.shift())}})
 assert.equal(requests.length,2)
 return {result,requests}
}
test('Cockpit reste le besoin initial : Excel débutant ne supprime pas les pistes métier omises par le modèle',async()=>{
 for(const trainingOffers of [undefined,'OPE\nPJ']){
  const {result,requests}=await run({...profile,trainingOffers})
  assert.deepEqual(result.optionalSteps.filter(x=>x.course.code.startsWith('COCKPIT')).map(x=>x.course.code),trainingOffers?['COCKPIT-RH','COCKPIT-PAIE','COCKPIT-FORM']:[])
  assert.equal(result.recommendedSteps[0].course.code,'EXCEL-BASE')
  assert.match(result.interpretedGoal,/Besoin initial.*cockpits/)
  for(const item of result.optionalSteps.filter(x=>x.course.code.startsWith('COCKPIT')))assert.match(item.rationale,/droits d’accès.*prérequis/)
  assert.match(requests[1].input,/COCKPIT-RH/)
  assert.match(requests[1].instructions,/ne remplace jamais une demande/)
 }
})
test('un cours Cockpit informatif à accès non établi reste une piste facultative, sans garantie d’accès',async()=>{
 const {result}=await run(profile,[{code:'COCKPIT-RH',rationale:'Cockpit à confirmer selon le besoin et les droits.'}])
 assert.equal(result.optionalSteps.filter(x=>x.course.code==='COCKPIT-RH').length,1)
 assert.equal(result.recommendedSteps.some(x=>x.course.code==='COCKPIT-RH'),false)
})
test('un périmètre explicite PJ exclut les Cockpits OPE sans élargissement automatique',async()=>{
 const {result,requests}=await run({...profile,trainingOffers:'PJ'})
 assert.equal([...result.recommendedSteps,...result.optionalSteps,...result.informationalCourses].some(x=>x.course.code.startsWith('COCKPIT')),false)
 assert.doesNotMatch(requests[1].input,/COCKPIT-RH/)
})
test('un Cockpit RH explicite ne force pas les Cockpits Paie et Formation',async()=>{
 const {result}=await run({...profile,trainingOffers:'OPE',objective:'Utiliser le Cockpit RH'})
 assert.deepEqual(result.optionalSteps.filter(x=>x.course.code.startsWith('COCKPIT')).map(x=>x.course.code),['COCKPIT-RH'])
})
test('un objectif Excel seul ne reçoit pas de cours Cockpit par les seuls acquis',async()=>{
 const {result}=await run({...profile,objective:'Apprendre les bases Excel',existingSkills:'Je connais les Cockpits'})
 assert.equal(result.optionalSteps.some(x=>x.course.code.startsWith('COCKPIT')),false)
})
