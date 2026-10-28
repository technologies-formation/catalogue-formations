import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import {mkdtempSync,rmSync,readdirSync} from 'node:fs'
import {join} from 'node:path'
import {tmpdir} from 'node:os'
import {PUBLIC_COST_POLICY,publicCostUpper,verifyPublicCostProof,requirePublicCostPolicy} from './publicCostPolicy.mjs'
import {createPublicBoundedFetch} from './publicBoundedFetch.mjs'
import {createPublicCatalogueApi} from './publicPilotApi.mjs'
const now=()=>Date.parse('2026-10-28T12:00:00Z'),json=value=>new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json'}})
const body={model:'gpt-5.6-luna',reasoning:{effort:'none'},instructions:'Fictif',input:'Texte fictif',max_output_tokens:1200}
const answer=(changes={})=>({status:'completed',model:'gpt-5.6-luna',service_tier:'default',usage:{input_tokens:1000,output_tokens:100},output:[{type:'message',role:'assistant',content:[{type:'output_text',text:'{}'}]}],...changes})
test('bornes au contexte maximal, deux passes, cache écrit et marge : provisions suffisantes',()=>{
 assert.equal(publicCostUpper('dialogue',1050000,2000),290400)
 assert.ok(publicCostUpper('dialogue',1050000,2000)<=PUBLIC_COST_POLICY.dialogue.reserveMicroUsd)
 assert.ok(2*publicCostUpper('research',1050000,1200)<=PUBLIC_COST_POLICY.research.reserveMicroUsd)
 for(const pair of [[1050001,0],[1,1201],[0,0],[1,-1],[1.5,1]])assert.throws(()=>publicCostUpper('research',...pair))
 assert.throws(()=>requirePublicCostPolicy(Date.parse(PUBLIC_COST_POLICY.validUntil)))
})
test('paramètres fixés avant transport, deux appels au plus et aucune relance après échec',async()=>{
 const sent=[],meter=createPublicBoundedFetch({now,fetchImpl:async(_url,init)=>{sent.push(JSON.parse(init.body));return json(answer())}})
 for(let i=0;i<2;i++)await meter.fetch('https://api.openai.com/v1/responses',{method:'POST',body:JSON.stringify({...body,service_tier:'priority',prompt_cache_options:{ttl:'12h'}})})
 assert.equal(sent.length,2);assert.ok(sent.every(v=>v.service_tier==='default'&&v.prompt_cache_options.ttl==='30m'&&v.store===false))
 assert.equal(verifyPublicCostProof(meter.proof()),1496)
 await assert.rejects(meter.fetch('https://api.openai.com/v1/responses',{method:'POST',body:JSON.stringify(body)}));assert.equal(sent.length,2)
 let calls=0;const failed=createPublicBoundedFetch({now,fetchImpl:async()=>{calls++;throw Error('synthetic timeout')}})
 for(let i=0;i<2;i++)await assert.rejects(failed.fetch('https://api.openai.com/v1/responses',{method:'POST',body:JSON.stringify(body)}))
 assert.equal(calls,1);assert.throws(()=>failed.proof())
})
test('outils, autre modèle, sortie trop longue, endpoint de comptage ou durée expirée : zéro départ',async()=>{
 let calls=0;const meter=createPublicBoundedFetch({now,fetchImpl:async()=>{calls++;return json(answer())}})
 for(const b of [{...body,tools:[{type:'web_search'}]},{...body,model:'gpt-6-astra'},{...body,max_output_tokens:1201},{...body,input:[]},{...body,reasoning:{effort:'high'}}])await assert.rejects(meter.fetch('https://api.openai.com/v1/responses',{method:'POST',body:JSON.stringify(b)}))
 await assert.rejects(meter.fetch('https://api.openai.com/v1/responses/input_tokens',{method:'POST',body:JSON.stringify(body)}));assert.equal(calls,0)
 const expired=createPublicBoundedFetch({now:()=>Date.parse(PUBLIC_COST_POLICY.validUntil),fetchImpl:async()=>{calls++}})
 await assert.rejects(expired.fetch('https://api.openai.com/v1/responses',{method:'POST',body:JSON.stringify(body)}));assert.equal(calls,0)
})
test('modèle, usage ou niveau de service non confirmé : aucune seconde passe',async()=>{
 for(const changes of [{model:'other'},{service_tier:'priority'},{usage:{}},{usage:{input_tokens:1050001,output_tokens:10}}]){
  let calls=0;const meter=createPublicBoundedFetch({now,fetchImpl:async()=>{calls++;return json(answer(changes))}})
  for(let n=0;n<2;n++)await assert.rejects(meter.fetch('https://api.openai.com/v1/responses',{method:'POST',body:JSON.stringify(body)}))
  assert.equal(calls,1);assert.throws(()=>meter.proof())
 }
})
test('API protégée désactivée : aucune clé ni lecture de configuration',async()=>{
 const handler=createPublicCatalogueApi({get token(){throw Error('do not read')}}),res={writeHead(code){this.code=code},end(){}}
 assert.equal(await handler({},res,new URL('https://test.invalid/api/public/policy')),true);assert.equal(res.code,503)
 assert.equal(await handler({},res,new URL('https://test.invalid/api/search')),false)
})
test('API bornée : authentification avant IA, preuve, réservation durable et doublon après redémarrage',async t=>{
 const directory=mkdtempSync(join(tmpdir(),'public-catalogue-')),token='t'.repeat(43),calls=[]
 const course={code:'PUBLIC-A',title:'Communiquer',officialData:{titleRaw:'Communiquer',publicRaw:'Tout public'},sourceUrl:'https://example.invalid/course'}
 const active={metadata:{snapshotDate:'2026-10-27',snapshotHash:'a'.repeat(64)},search:{courses:[course],ultraCompactCatalogue:[['PUBLIC-A','Communiquer']],officialCodes:['PUBLIC-A'],detailedByCode:new Map([['PUBLIC-A',course]]),courseByCode:new Map([['PUBLIC-A',course]])}}
 const options={enabled:true,pathwayEnabled:true,token,directory,getCatalogue:()=>active,apiKey:'SYNTHETIC_KEY',now,fetchImpl:async(_url,init)=>{
  calls.push(JSON.parse(init.body));assert.ok(readdirSync(directory).some(n=>n.endsWith('.json')))
  const result=calls.length%2?{codes:['PUBLIC-A'],interpretedGoal:'Communiquer'}:{recommendedCodes:['PUBLIC-A'],complementaryCodes:[],relatedCodes:[],reason:'Fictif',abstain:false,summary:'Fictif',recommendedSteps:[{code:'PUBLIC-A',rationale:'Fictif'}],optionalSteps:[],informationalCourses:[],gaps:[]}
  return json(answer({output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify(result)}]}]}))
 }}
 let handler=createPublicCatalogueApi(options)
 const server=http.createServer((req,res)=>handler(req,res,new URL(req.url,'https://test.invalid')));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));rmSync(directory,{recursive:true,force:true})})
 const request=(path,{body,authorized=true,id='1'.repeat(64)}={})=>new Promise((resolve,reject)=>{
  const req=http.request({host:'127.0.0.1',port:server.address().port,path,method:body?'POST':'GET',headers:{...(authorized?{Authorization:'Bearer '+token}:{}),'X-A658-Public-Request':id,'Content-Type':'application/json'}},res=>{let text='';res.on('data',c=>text+=c);res.on('end',()=>resolve({status:res.statusCode,value:JSON.parse(text)}))});req.on('error',reject);req.end(body?JSON.stringify(body):undefined)
 })
 assert.equal((await request('/api/public/search',{authorized:false,body:{query:'Communiquer'}})).status,404);assert.equal(calls.length,0)
 assert.equal((await request('/api/public/policy')).value.policy,PUBLIC_COST_POLICY.id);assert.equal(calls.length,0)
 const first=await request('/api/public/search',{body:{query:'Communiquer'}});assert.equal(first.status,200);assert.equal(calls.length,2);assert.equal(verifyPublicCostProof(first.value.publicCostProof),1496)
 handler=createPublicCatalogueApi(options);assert.equal((await request('/api/public/search',{body:{query:'Communiquer'}})).status,409);assert.equal(calls.length,2)
 const path=await request('/api/public/pathway',{body:{role:'Assistant',objective:'Communiquer'},id:'2'.repeat(64)});assert.equal(path.status,200);assert.equal(calls.length,4);verifyPublicCostProof(path.value.publicCostProof)
})
