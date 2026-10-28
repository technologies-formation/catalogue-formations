import test from 'node:test'
import assert from 'node:assert/strict'
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,readdirSync,rmSync,chmodSync,symlinkSync,existsSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {spawn} from 'node:child_process'
import net from 'node:net'
import {pathToFileURL} from 'node:url'
import {PUBLIC_COST_POLICY} from './publicCostPolicy.mjs'
import {readPublicCatalogueLaunch,createPublicCatalogueRuntime,publicCatalogueUsage} from './publicPilotRuntime.mjs'
const now=()=>Date.parse('2026-10-28T12:00:00Z')
function fixture(t){
 const root=mkdtempSync(join(tmpdir(),'public-launch-')),site=join(root,'site'),directory=join(root,'pilot');mkdirSync(site);mkdirSync(directory,{mode:0o700})
 const file=join(directory,'public-pilot-catalogue.json'),value={version:1,enabled:true,costPolicy:PUBLIC_COST_POLICY.id,token:'t'.repeat(43)}
 const write=v=>writeFileSync(file,JSON.stringify(v),{mode:0o600});write(value)
 t.after(()=>rmSync(root,{recursive:true,force:true}))
 return {root,site,directory,file,value,write,environment:{A658_PUBLIC_PILOT_ENABLED:'true',A658_PUBLIC_PILOT_CONFIG:file,OPENAI_API_KEY:'SYNTHETIC_KEY'}}
}
test('lancement public fermé par défaut, aucune clé, configuration ou source consultée',()=>{
 const environment={get A658_PUBLIC_PILOT_CONFIG(){throw Error('do not read')},get OPENAI_API_KEY(){throw Error('do not read')}}
 assert.deepEqual(readPublicCatalogueLaunch(environment),{enabled:false})
 const service=createPublicCatalogueRuntime({environment,getCatalogue(){throw Error('do not read')}})
 assert.equal(service.enabled,false)
})
test('double activation, fichier protégé hors du site et des suivis privés, expiration avant clé',t=>{
 const f=fixture(t),options={siteDirectory:f.site,now},read=()=>readPublicCatalogueLaunch(f.environment,options)
 const result=read();assert.equal(result.enabled,true);assert.equal(result.directory,join(f.directory,'public-catalogue-requests'));assert.equal(existsSync(result.directory),false)
 f.write({...f.value,enabled:false});Object.defineProperty(f.environment,'OPENAI_API_KEY',{get(){throw Error('do not read')},configurable:true});assert.deepEqual(read(),{enabled:false})
 f.write(f.value);assert.throws(()=>readPublicCatalogueLaunch(f.environment,{...options,now:()=>Date.parse(PUBLIC_COST_POLICY.validUntil)}),/public_cost_review_expired/)
 Object.defineProperty(f.environment,'OPENAI_API_KEY',{value:'SYNTHETIC_KEY',configurable:true})
 chmodSync(f.file,0o644);assert.throws(read);chmodSync(f.file,0o600)
 chmodSync(f.directory,0o755);assert.throws(read);chmodSync(f.directory,0o700)
 assert.throws(()=>readPublicCatalogueLaunch(f.environment,{...options,privateDirectories:[f.directory]}))
 assert.throws(()=>readPublicCatalogueLaunch(f.environment,{...options,siteDirectory:f.directory}))
 for(const value of [{...f.value,token:'short'},{...f.value,costPolicy:'unverified'},{...f.value,extra:true}]){f.write(value);assert.throws(read)}
 f.write(f.value);const link=join(f.root,'link');symlinkSync(f.directory,link,'dir');assert.throws(()=>readPublicCatalogueLaunch({...f.environment,A658_PUBLIC_PILOT_CONFIG:join(link,'public-pilot-catalogue.json')},options))
})
test('suivi public : borne vérifiée, sans reprendre le tarif nominal du moteur',()=>{
 const value={usage:{total:{cost:0}},publicCostProof:{policy:PUBLIC_COST_POLICY.id,model:'gpt-5.6-luna',serviceTier:'default',cacheTtl:'30m',calls:[{inputTokens:1000,outputTokens:100}],upperMicroUsd:748}}
 assert.deepEqual(publicCatalogueUsage(value),{costMicroUsd:748,inputTokens:1000,outputTokens:100})
 assert.throws(()=>publicCatalogueUsage({...value,publicCostProof:{...value.publicCostProof,upperMicroUsd:0}}))
})
test('serveur réel : préparation inactive, santé et catalogue disponibles sans aucun appel OpenAI',{timeout:15000},async t=>{
 const holder=net.createServer();await new Promise(resolve=>holder.listen(0,'127.0.0.1',resolve));const port=holder.address().port;await new Promise(resolve=>holder.close(resolve))
 const child=spawn(process.execPath,['server/searchApi.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port),NODE_ENV:'test',CATALOGUE_SYNC_ENABLED:'false',A658_CONSUMPTION_ENABLED:'false',A658_PUBLIC_PILOT_ENABLED:'false',OPENAI_API_KEY:'SYNTHETIC_KEY'},stdio:['ignore','pipe','pipe']})
 let output='';child.stdout.on('data',c=>output+=c);child.stderr.on('data',c=>output+=c)
 t.after(async()=>{if(child.exitCode===null&&child.signalCode===null){child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve))}})
 const origin='http://127.0.0.1:'+port
 let health
 for(let i=0;i<150;i++){try{health=await fetch(origin+'/api/health');break}catch{await new Promise(resolve=>setTimeout(resolve,20))}}
 assert.ok(health,output);assert.equal(health.status,200);assert.equal((await health.json()).publicPilotEnabled,false)
 assert.equal((await fetch(origin+'/api/catalogue')).status,200)
 const response=await fetch(origin+'/api/public/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'Fictif'})})
 assert.equal(response.status,503);assert.equal((await response.json()).code,'public_disabled');assert.match(output,/Pilote public du catalogue : désactivé/)
})
test('serveur réel isolé : authentification, concurrence partagée et attribution du coût public au suivi Assistant',{timeout:15000},async t=>{
 const f=fixture(t),tracking=join(f.root,'tracking'),started=join(f.root,'started'),release=join(f.root,'release'),guard=join(f.root,'guard.mjs')
 const script=`import {writeFileSync,existsSync} from 'node:fs';
 let calls=0;
 globalThis.fetch=async(url,init)=>{
  if(url!=='https://api.openai.com/v1/responses'||init.method!=='POST')throw Error('Forbidden network');
  const body=JSON.parse(init.body);
  if(body.model!=='gpt-5.6-luna'||body.service_tier!=='default'||body.prompt_cache_options.ttl!=='30m'||body.max_output_tokens>1200)throw Error('Unbounded call');
  writeFileSync(${JSON.stringify(started)},String(++calls));
  while(!existsSync(${JSON.stringify(release)}))await new Promise(r=>setTimeout(r,10));
  return new Response(JSON.stringify({status:'completed',model:'gpt-5.6-luna',service_tier:'default',usage:{input_tokens:1000,output_tokens:100},output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({codes:[],interpretedGoal:'Fictif',recommendedCodes:[],complementaryCodes:[],relatedCodes:[],abstain:true,reason:'Fictif'})}]}]}),{headers:{'Content-Type':'application/json'}});
 };
 `
 writeFileSync(guard,script)
 const holder=net.createServer();await new Promise(resolve=>holder.listen(0,'127.0.0.1',resolve));const port=holder.address().port;await new Promise(resolve=>holder.close(resolve))
 const child=spawn(process.execPath,['--import',pathToFileURL(guard).href,'server/searchApi.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port),NODE_ENV:'test',MAX_CONCURRENT_SEARCHES:'1',CATALOGUE_SYNC_ENABLED:'false',...f.environment,A658_CONSUMPTION_ENABLED:'true',A658_CONSUMPTION_DIRECTORY:tracking,A658_REPORT_TOKEN:'r'.repeat(43)},stdio:['ignore','pipe','pipe']})
 let output='';child.stdout.on('data',c=>output+=c);child.stderr.on('data',c=>output+=c)
 t.after(async()=>{if(child.exitCode===null&&child.signalCode===null){child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve))}})
 const origin='http://127.0.0.1:'+port;let health
 for(let i=0;i<150;i++){try{health=await fetch(origin+'/api/health');break}catch{await new Promise(resolve=>setTimeout(resolve,20))}}
 assert.ok(health,output);assert.equal((await health.json()).publicPilotEnabled,true)
 const body=JSON.stringify({query:'zzzzzzzz-no-match-test'}),headers={'Content-Type':'application/json'}
 assert.equal((await fetch(origin+'/api/public/search',{method:'POST',headers,body})).status,404);assert.equal(existsSync(started),false)
 const pending=fetch(origin+'/api/public/search',{method:'POST',headers:{...headers,Authorization:'Bearer '+'t'.repeat(43),'X-A658-Public-Request':'1'.repeat(64)},body})
 for(let i=0;i<150&&!existsSync(started);i++)await new Promise(resolve=>setTimeout(resolve,20))
 assert.equal(existsSync(started),true,output)
 assert.equal((await fetch(origin+'/api/search',{method:'POST',headers,body})).status,503)
 writeFileSync(release,'release');const result=await pending;assert.equal(result.status,200,await result.clone().text())
 const value=await result.json(),calls=Number(readFileSync(started,'utf8'));assert.ok(calls<=2);assert.equal(value.publicCostProof.upperMicroUsd,748*calls)
 const events=readdirSync(tracking).filter(n=>n.endsWith('.event.json')).map(n=>JSON.parse(readFileSync(join(tracking,n),'utf8')))
 assert.equal(events.length,1);assert.equal(events[0].app,'assistant');assert.equal(events[0].action,'search');assert.equal(events[0].costMicroUsd,748*calls)
})
