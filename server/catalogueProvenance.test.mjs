import test from 'node:test'
import assert from 'node:assert/strict'
import {buildCataloguePathway} from './catalogueProvenance.mjs'
test('provenance : données et version capturées ensemble avant une synchronisation concurrente',async()=>{
 const active={metadata:{snapshotDate:'2026-10-26',snapshotHash:'a'.repeat(64)},search:{codes:['TEST']}}
 const result=await buildCataloguePathway({objective:'Test'},active,async(profile,options)=>{
  assert.equal(options.catalogue,active.search);assert.equal(profile.objective,'Test')
  active.metadata={snapshotDate:'2026-10-27',snapshotHash:'b'.repeat(64)}
  return {summary:'Exemple',catalogue:{snapshotDate:'inventée'},recommendedSteps:[]}
 })
 assert.deepEqual(result.catalogue,{snapshotDate:'2026-10-26',snapshotHash:'a'.repeat(64)})
})
