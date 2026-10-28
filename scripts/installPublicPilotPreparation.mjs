// Installation de code uniquement. Aucun lancement, environnement ou état privé modifié.
import {createHash,randomUUID} from 'node:crypto'
import {lstatSync,realpathSync,readFileSync,writeFileSync,copyFileSync,renameSync,unlinkSync,existsSync,mkdtempSync,chmodSync,mkdirSync,openSync,fsyncSync,closeSync,constants} from 'node:fs'
import {dirname,join,resolve,isAbsolute,relative} from 'node:path'
import {fileURLToPath,pathToFileURL} from 'node:url'
import {execFileSync} from 'node:child_process'

export const LIVE_BASELINE=Object.freeze({
 'server/searchApi.mjs':'5c5fbf785c2006664afd3df0d859fdcdd15207306fb966e49e52278830cfde88',
 'server/llmSearch.mjs':'03c0b8f06f5649b75791efd7ea08461bd1242494d84252411181fa9faac66b9c',
 'server/pathwayEngine.mjs':'86de32200422309f3eb604d6e76301d994afeb5154dbee75656afa46d886afbc',
})
export const PUBLIC_CODE_FILES=Object.freeze(['server/publicCostPolicy.mjs','server/publicBoundedFetch.mjs','server/publicPilotApi.mjs','server/publicPilotRuntime.mjs','server/llmSearch.mjs','server/searchApi.mjs'])
const digest=value=>createHash('sha256').update(value).digest('hex')
const syntaxCheck=file=>execFileSync(process.execPath,['--check',file],{stdio:'pipe'})
const present=file=>{try{lstatSync(file);return true}catch(error){if(error.code==='ENOENT')return false;throw error}}
const flush=file=>{const fd=openSync(file,'r');try{fsyncSync(fd)}finally{closeSync(fd)}}
function canonicalDirectory(path){
 if(typeof path!=='string'||!isAbsolute(path))throw Error('Chemin absolu requis')
 const s=lstatSync(path);if(!s.isDirectory()||s.isSymbolicLink()||realpathSync(path)!==path)throw Error('Dossier réel requis')
 return path
}
function readCode(file){
 const stat=lstatSync(file)
 if(!stat.isFile()||stat.isSymbolicLink()||stat.nlink!==1||stat.size>2*1024*1024)throw Error('Fichier de code non régulier')
 return {content:readFileSync(file),mode:stat.mode&0o777}
}
const same=(a,b)=>digest(a)===digest(b)

export function installPublicPreparation({siteDirectory,backupParent,sourceDirectory=resolve(dirname(fileURLToPath(import.meta.url)),'..'),expectedBefore=LIVE_BASELINE,checkSyntax=syntaxCheck}={}){
 canonicalDirectory(siteDirectory);canonicalDirectory(join(siteDirectory,'server'));canonicalDirectory(sourceDirectory);canonicalDirectory(backupParent)
 const scope=relative(siteDirectory,backupParent)
 if(!scope||!scope.startsWith('..')&&!isAbsolute(scope))throw Error('Sauvegarde hors du site requise')
 const sources=new Map(PUBLIC_CODE_FILES.map(path=>{const source=readCode(join(sourceDirectory,path));checkSyntax(join(sourceDirectory,path));return[path,source]}))
 const current=new Map()
 for(const path of PUBLIC_CODE_FILES){if(present(join(siteDirectory,path)))current.set(path,readCode(join(siteDirectory,path)))}
 for(const [path,hash]of Object.entries(expectedBefore)){
  const code=current.get(path)??readCode(join(siteDirectory,path))
  if(!PUBLIC_CODE_FILES.includes(path)&&digest(code.content)!==hash)throw Error('Empreinte inattendue : '+path)
 }
 const installed=PUBLIC_CODE_FILES.every(path=>current.has(path)&&same(current.get(path).content,sources.get(path).content))
 if(installed)return {changed:false,files:PUBLIC_CODE_FILES.length}
 // Vérifier tous les fichiers avant la toute première écriture.
 for(const path of PUBLIC_CODE_FILES){
  const code=current.get(path),before=expectedBefore[path]
  if(before?(!code||digest(code.content)!==before):code)throw Error('Empreinte inattendue ou préparation partielle : '+path)
 }
 const backup=mkdtempSync(join(backupParent,'a658-public-preparation-backup-'));chmodSync(backup,0o700);mkdirSync(join(backup,'server'),{mode:0o700})
 const manifest={version:1,at:new Date().toISOString(),siteDirectory,publicActivation:false,files:PUBLIC_CODE_FILES.map(path=>({path,before:current.has(path)?digest(current.get(path).content):null,after:digest(sources.get(path).content),mode:current.get(path)?.mode??0o644}))}
 for(const [path,code]of current){writeFileSync(join(backup,path),code.content,{mode:0o600,flag:'wx'});if(!same(readFileSync(join(backup,path)),code.content))throw Error('Sauvegarde non vérifiée')}
 writeFileSync(join(backup,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600,flag:'wx'})
 for(const path of current.keys())flush(join(backup,path))
 flush(join(backup,'manifest.json'));flush(join(backup,'server'));flush(backup);flush(backupParent)
 const written=[],temporary=[]
 try{
  for(const path of PUBLIC_CODE_FILES){
   const target=join(siteDirectory,path),old=current.get(path)
   if(old?!same(readCode(target).content,old.content):present(target))throw Error('Code modifié pendant la préparation')
   const temp=target+'.a658-'+randomUUID()+'.tmp';temporary.push(temp)
   writeFileSync(temp,sources.get(path).content,{mode:old?.mode??0o644,flag:'wx'});chmodSync(temp,old?.mode??0o644);flush(temp);renameSync(temp,target);written.push(path);flush(dirname(target))
   checkSyntax(target)
   if(!same(readCode(target).content,sources.get(path).content))throw Error('Code installé non vérifié')
  }
  for(const [path,hash]of Object.entries(expectedBefore)){if(!PUBLIC_CODE_FILES.includes(path)&&digest(readCode(join(siteDirectory,path)).content)!==hash)throw Error('Fichier conservé modifié pendant la préparation')}
 }catch(error){
  let rollback=true
  for(const path of written.reverse()){
   try{
    const target=join(siteDirectory,path)
    if(!same(readCode(target).content,sources.get(path).content))throw Error('Modification concurrente')
    const old=current.get(path)
    if(old){const temp=target+'.a658-restore-'+randomUUID()+'.tmp';temporary.push(temp);copyFileSync(join(backup,path),temp,constants.COPYFILE_EXCL);chmodSync(temp,old.mode);flush(temp);renameSync(temp,target)}else unlinkSync(target)
    flush(dirname(target))
   }catch{rollback=false}
  }
  throw Error((rollback?'Installation annulée ; code précédent restauré.':'Installation interrompue ; restauration manuelle nécessaire.')+' Sauvegarde : '+backup,{cause:error})
 }finally{for(const file of temporary){if(existsSync(file))unlinkSync(file)}}
 return {changed:true,backup,files:PUBLIC_CODE_FILES.length}
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{
  const result=installPublicPreparation({siteDirectory:process.argv[2],backupParent:process.argv[3]})
  if(result.changed)console.log('Sauvegarde du code vérifiée : '+result.backup)
  console.log(result.changed?'Préparation du catalogue installée.':'Préparation du catalogue déjà présente ; aucun fichier remplacé.')
  console.log('Aucun serveur redémarré, aucune configuration privée modifiée, aucun appel API lancé. Activation publique distincte requise.')
 }catch(error){console.error(error.message);process.exitCode=1}
}
