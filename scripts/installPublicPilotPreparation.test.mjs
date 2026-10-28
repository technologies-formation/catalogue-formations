import test from 'node:test'
import assert from 'node:assert/strict'
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,readdirSync,existsSync,statSync,symlinkSync} from 'node:fs'
import {join} from 'node:path'
import {tmpdir} from 'node:os'
import {createHash} from 'node:crypto'
import {installPublicPreparation,PUBLIC_CODE_FILES} from './installPublicPilotPreparation.mjs'
const hash=value=>createHash('sha256').update(value).digest('hex')
function fixture(t){
 const root=mkdtempSync(join(tmpdir(),'public-install-')),site=join(root,'site'),source=join(root,'source')
 for(const path of [site,source,join(site,'server'),join(source,'server')])mkdirSync(path)
 const before={}
 for(const name of ['searchApi.mjs','llmSearch.mjs','pathwayEngine.mjs']){const path='server/'+name,text='export const oldCode='+JSON.stringify(name)+'\n';writeFileSync(join(site,path),text,{mode:0o644});before[path]=hash(text)}
 for(const path of PUBLIC_CODE_FILES)writeFileSync(join(source,path),'export const prepared='+JSON.stringify(path)+'\n')
 writeFileSync(join(site,'.env'),'PRIVATE_SENTINEL',{mode:0o600});writeFileSync(join(site,'server','private-state.json'),'PRIVATE_STATE',{mode:0o600})
 t.after(()=>{assert.equal(readFileSync(join(site,'.env'),'utf8'),'PRIVATE_SENTINEL');assert.equal(readFileSync(join(site,'server','private-state.json'),'utf8'),'PRIVATE_STATE');rmSync(root,{recursive:true,force:true})})
 return {root,site,source,before,options:{siteDirectory:site,backupParent:root,sourceDirectory:source,expectedBefore:before}}
}
test('installation limitée, sauvegarde privée vérifiée, moteur conservé et seconde exécution sans remplacement',t=>{
 const f=fixture(t),result=installPublicPreparation(f.options)
 assert.equal(result.changed,true);assert.equal(statSync(result.backup).mode&0o777,0o700)
 const manifest=JSON.parse(readFileSync(join(result.backup,'manifest.json'),'utf8'));assert.equal(manifest.publicActivation,false)
 for(const path of PUBLIC_CODE_FILES)assert.equal(readFileSync(join(f.site,path),'utf8'),readFileSync(join(f.source,path),'utf8'))
 assert.equal(hash(readFileSync(join(f.site,'server/pathwayEngine.mjs'))),f.before['server/pathwayEngine.mjs'])
 for(const path of ['server/searchApi.mjs','server/llmSearch.mjs']){assert.equal(hash(readFileSync(join(result.backup,path))),f.before[path]);assert.equal(statSync(join(result.backup,path)).mode&0o777,0o600)}
 assert.equal(existsSync(join(result.backup,'.env')),false)
 assert.equal(installPublicPreparation(f.options).changed,false);assert.equal(readdirSync(f.root).filter(n=>n.startsWith('a658-public-preparation-backup-')).length,1)
})
test('empreinte inattendue, ajout déjà présent ou lien symbolique : refus avant sauvegarde et avant remplacement',t=>{
 for(const kind of ['hash','existing','link','dangling']){
  const f=fixture(t),original=readFileSync(join(f.site,'server/llmSearch.mjs'))
  if(kind==='hash')writeFileSync(join(f.site,'server/searchApi.mjs'),'export const unexpected=true\n')
  if(kind==='existing')writeFileSync(join(f.site,PUBLIC_CODE_FILES[0]),'existing')
  if(kind==='link')symlinkSync(join(f.source,PUBLIC_CODE_FILES[0]),join(f.site,PUBLIC_CODE_FILES[0]))
  if(kind==='dangling')symlinkSync(join(f.root,'absent'),join(f.site,PUBLIC_CODE_FILES[0]))
  assert.throws(()=>installPublicPreparation(f.options));assert.deepEqual(readFileSync(join(f.site,'server/llmSearch.mjs')),original)
  assert.equal(readdirSync(f.root).some(n=>n.startsWith('a658-public-preparation-backup-')),false)
 }
})
test('échec de vérification après écriture : restauration des anciens fichiers et retrait des seuls ajouts de cette tentative',t=>{
 const f=fixture(t),oldSearch=readFileSync(join(f.site,'server/searchApi.mjs')),oldLlm=readFileSync(join(f.site,'server/llmSearch.mjs'));let checked=0
 assert.throws(()=>installPublicPreparation({...f.options,checkSyntax(){if(++checked===PUBLIC_CODE_FILES.length+5)throw Error('synthetic post-install check failure')}}),/code précédent restauré/)
 assert.deepEqual(readFileSync(join(f.site,'server/searchApi.mjs')),oldSearch);assert.deepEqual(readFileSync(join(f.site,'server/llmSearch.mjs')),oldLlm)
 for(const path of PUBLIC_CODE_FILES.filter(p=>!f.before[p]))assert.equal(existsSync(join(f.site,path)),false)
 assert.equal(readdirSync(join(f.site,'server')).some(n=>n.includes('.tmp')),false)
})
