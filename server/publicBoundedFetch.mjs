import {PUBLIC_COST_POLICY,PublicCostError,publicCostUpper,requirePublicCostPolicy} from './publicCostPolicy.mjs'
const fail=code=>{throw new PublicCostError(code)}
export async function readPublicCostJson(response,limit=131072){
 if(response.redirected||!/^application\/json(?:;|$)/i.test(response.headers.get('content-type')??''))fail('public_response_unverified')
 const chunks=[];let bytes=0
 for await(const chunk of response.body??[]){bytes+=chunk.length;if(bytes>limit)fail('public_response_unverified');chunks.push(chunk)}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{fail('public_response_unverified')}
}
export function createPublicBoundedFetch({fetchImpl=globalThis.fetch,now=Date.now,signal}={}){
 const rule=PUBLIC_COST_POLICY.research,calls=[];let attempts=0,busy=false,blocked=false
 const allowed=new Set(['model','reasoning','store','max_output_tokens','prompt_cache_key','instructions','input','text','service_tier','prompt_cache_options'])
 return {
  async fetch(url,init){
   requirePublicCostPolicy(now())
   if(blocked||busy||attempts>=rule.calls||String(url)!=='https://api.openai.com/v1/responses'||init?.method!=='POST')fail('public_call_bound')
   if(signal?.aborted)fail('public_cancelled')
   let body;try{body=JSON.parse(init.body)}catch{fail('public_request_unverified')}
   if(!body||Array.isArray(body)||Object.keys(body).some(k=>!allowed.has(k))||body.model!==rule.model||body.reasoning?.effort!=='none'||Object.keys(body.reasoning).length!==1||
    typeof body.input!=='string'||typeof body.instructions!=='string'||!Number.isSafeInteger(body.max_output_tokens)||body.max_output_tokens<1||body.max_output_tokens>rule.maxOutputTokens)fail('public_request_unverified')
   const payload={...body,store:false,service_tier:'default',prompt_cache_options:{mode:'implicit',ttl:'30m'}}
   if(Buffer.byteLength(JSON.stringify(payload))>4*1024*1024)fail('public_request_unverified')
   busy=true;attempts++
   try{
    const response=await fetchImpl(url,{...init,redirect:'error',credentials:'omit',body:JSON.stringify(payload),signal:AbortSignal.any([signal??new AbortController().signal,init.signal??new AbortController().signal])})
    const value=await readPublicCostJson(response)
    if(response.status!==200||value.model!==rule.model||value.service_tier!=='default'||value.status!=='completed')fail('public_response_unverified')
    const u=value.usage;publicCostUpper('research',u?.input_tokens,u?.output_tokens)
    if(u.output_tokens>body.max_output_tokens)fail('public_usage_unverified')
    calls.push({inputTokens:u.input_tokens,outputTokens:u.output_tokens})
    return new Response(JSON.stringify(value),{status:200,headers:{'Content-Type':'application/json'}})
   }catch(error){blocked=true;throw error}finally{busy=false}
  },
  proof(){
   if(blocked||busy||calls.length!==attempts)fail('public_response_unverified')
   const upperMicroUsd=calls.reduce((sum,c)=>sum+publicCostUpper('research',c.inputTokens,c.outputTokens),0)
   if(upperMicroUsd>rule.reserveMicroUsd)fail('public_call_bound')
   return {policy:PUBLIC_COST_POLICY.id,model:rule.model,serviceTier:'default',cacheTtl:'30m',calls:[...calls],upperMicroUsd}
  },
 }
}
