// Deux activations distinctes : environnement et fichier privé. Aucun secret dans le site.
import {lstatSync,realpathSync} from 'node:fs'
import {dirname,isAbsolute,join,relative} from 'node:path'
import {readPrivateJson} from './consumptionLedger.mjs'
import {PUBLIC_COST_POLICY,PublicCostError,requirePublicCostPolicy,verifyPublicCostProof} from './publicCostPolicy.mjs'
import {createPublicCatalogueApi} from './publicPilotApi.mjs'
import {isPathwayAssistantEnabled} from './pathwayAssistant.mjs'

const inside=(parent,child)=>{const r=relative(parent,child);return !r||!r.startsWith('..')&&!isAbsolute(r)}
const fail=()=>{throw new PublicCostError('public_configuration')}
export function readPublicCatalogueLaunch(environment,{siteDirectory=process.cwd(),privateDirectories=[],now=Date.now}={}){
 if(environment.A658_PUBLIC_PILOT_ENABLED!=='true')return {enabled:false}
 const file=environment.A658_PUBLIC_PILOT_CONFIG
 if(typeof file!=='string'||!isAbsolute(file))fail()
 const root=dirname(file),stat=lstatSync(root),site=realpathSync(siteDirectory)
 if(!stat.isDirectory()||stat.isSymbolicLink()||(stat.mode&0o077)||realpathSync(root)!==root||inside(site,root)||inside(root,site))fail()
 for(const directory of privateDirectories){const actual=realpathSync(directory);if(inside(actual,root)||inside(root,actual))fail()}
 if(file!==join(root,'public-pilot-catalogue.json'))fail()
 const value=readPrivateJson(file)
 if(!value||Object.keys(value).sort().join(',')!=='costPolicy,enabled,token,version'||value.version!==1||typeof value.enabled!=='boolean'||value.costPolicy!==PUBLIC_COST_POLICY.id)fail()
 if(!value.enabled)return {enabled:false}
 requirePublicCostPolicy(now())
 if(typeof value.token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(value.token))fail()
 const apiKey=environment.OPENAI_API_KEY
 if(typeof apiKey!=='string'||!apiKey.trim()||/\s/.test(apiKey))fail()
 return {enabled:true,token:value.token,apiKey,directory:join(root,'public-catalogue-requests'),now}
}

export function publicCatalogueUsage(value){
 const proof=value.publicCostProof,costMicroUsd=verifyPublicCostProof(proof)
 return {costMicroUsd,inputTokens:proof.calls.reduce((sum,c)=>sum+c.inputTokens,0),outputTokens:proof.calls.reduce((sum,c)=>sum+c.outputTokens,0)}
}

export function createPublicCatalogueRuntime({environment=process.env,siteDirectory=process.cwd(),privateDirectories=[],getCatalogue,runExclusive,observe,fetchImpl,now=Date.now}={}){
 const launch=readPublicCatalogueLaunch(environment,{siteDirectory,privateDirectories,now})
 return {enabled:launch.enabled,handler:createPublicCatalogueApi({...launch,getCatalogue,runExclusive,observe,fetchImpl,pathwayEnabled:launch.enabled&&isPathwayAssistantEnabled(environment)})}
}
