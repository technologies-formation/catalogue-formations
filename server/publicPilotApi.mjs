// N'est monté par aucun lanceur actuel. Accès serveur à serveur uniquement.
import {createHash,timingSafeEqual} from 'node:crypto'
import {openSync,closeSync,writeFileSync,fsyncSync} from 'node:fs'
import {join} from 'node:path'
import {PUBLIC_COST_POLICY,PublicCostError,requirePublicCostPolicy} from './publicCostPolicy.mjs'
import {createPublicBoundedFetch} from './publicBoundedFetch.mjs'
import {protectedDirectory} from './consumptionLedger.mjs'
import {searchWithLuna} from './llmSearch.mjs'
import {buildPathwayWithLuna} from './pathwayEngine.mjs'
import {validatePathwayInput} from './pathwayAssistant.mjs'
const send=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value))}
const fail=code=>{throw new PublicCostError(code)}
const hash=value=>createHash('sha256').update(value).digest()

export function createPublicCatalogueApi(options={}){
 const enabled=options.enabled===true
 if(!enabled)return async(_req,res,url)=>{if(!url.pathname.startsWith('/api/public/'))return false;send(res,503,{code:'public_disabled'});return true}
 const {token,directory,getCatalogue,apiKey,fetchImpl=globalThis.fetch,now=Date.now}=options
 if(typeof token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(token)||typeof apiKey!=='string'||!apiKey.trim()||typeof getCatalogue!=='function')fail('public_configuration')
 const root=protectedDirectory(directory);let busy=false
 const authorized=req=>{const actual=req.headers.authorization;return typeof actual==='string'&&timingSafeEqual(hash(actual),hash('Bearer '+token))}
 const reserve=(request,action)=>{
  let fd
  try{fd=openSync(join(root,request+'.json'),'wx',0o600);writeFileSync(fd,JSON.stringify({version:1,action,at:new Date(now()).toISOString()}));fsyncSync(fd);closeSync(fd);fd=undefined;const parent=openSync(root,'r');try{fsyncSync(parent)}finally{closeSync(parent)}}
  catch(error){if(fd!==undefined)closeSync(fd);fail(error.code==='EEXIST'?'public_duplicate':'public_storage')}
 }
 return async(req,res,url)=>{
  if(!url.pathname.startsWith('/api/public/'))return false
  if(!authorized(req)){send(res,404,{code:'not_found'});return true}
  try{
   requirePublicCostPolicy(now())
   if(req.method==='GET'&&url.pathname==='/api/public/policy'){send(res,200,{policy:PUBLIC_COST_POLICY.id});return true}
   const action=url.pathname==='/api/public/search'?'search':url.pathname==='/api/public/pathway'?'pathway':null
   if(req.method!=='POST'||!action){send(res,404,{code:'not_found'});return true}
   if(action==='pathway'&&options.pathwayEnabled!==true)fail('public_disabled')
   const request=req.headers['x-a658-public-request']
   if(typeof request!=='string'||! /^[a-f0-9]{64}$/.test(request)||req.headers['content-type']?.split(';')[0].trim()!=='application/json')fail('public_request_unverified')
   const chunks=[];let bytes=0
   for await(const chunk of req){bytes+=chunk.length;if(bytes>16000)fail('public_request_unverified');chunks.push(chunk)}
   let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{fail('public_request_unverified')}
   if(!body||typeof body!=='object'||Array.isArray(body))fail('public_request_unverified')
   let input
   if(action==='search'){if(typeof body.query!=='string'||!body.query.trim()||body.query.length>1000)fail('public_request_unverified');input=body.query.trim()}
   else input=validatePathwayInput(body)
   if(busy)fail('public_busy')
   busy=true
   const controller=new AbortController(),cancel=()=>{if(!res.writableEnded)controller.abort()};res.once('close',cancel)
   try{
    const run=async()=>{
     reserve(request,action)
     const active=getCatalogue(),bounded=createPublicBoundedFetch({fetchImpl,now,signal:controller.signal})
     const result=action==='search'?await searchWithLuna(input,{apiKey,fetchImpl:bounded.fetch,catalogue:active.search}):await buildPathwayWithLuna(input,{apiKey,fetchImpl:bounded.fetch,catalogue:active.search})
     return {...result,ok:true,catalogue:{snapshotDate:active.metadata.snapshotDate,snapshotHash:active.metadata.snapshotHash},publicCostProof:bounded.proof()}
    }
    const observed=()=>typeof options.observe==='function'?options.observe(action,run):run()
    const result=typeof options.runExclusive==='function'?await options.runExclusive(observed):await observed()
    if(!controller.signal.aborted)send(res,200,result)
   }finally{busy=false;res.removeListener('close',cancel)}
  }catch(error){
   const code=error instanceof PublicCostError?error.code:'public_unavailable'
   if(!res.writableEnded&&!res.headersSent)send(res,['public_duplicate','public_busy'].includes(code)?409:code==='public_request_unverified'?400:503,{code})
  }
  return true
 }
}
