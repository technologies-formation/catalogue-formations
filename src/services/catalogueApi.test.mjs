import test from 'node:test'
import assert from 'node:assert/strict'
import {loadCatalogue} from './catalogueApi.js'
import {fullCatalogueCourses,fullCatalogueSnapshotDate} from '../data/fullCatalogueCourses.js'
import {catalogueDateLabel} from '../domain/catalogueDate.js'
test('catalogue : date des données réellement chargées, y compris repli hors ligne',async()=>{
 const bundled=await loadCatalogue({mode:'production',fetchImpl:()=>{throw Error('Ne pas appeler')}})
 assert.equal(bundled.courses,fullCatalogueCourses);assert.equal(bundled.snapshotDate,fullCatalogueSnapshotDate)
 const courses=[{code:'TEST'}],live=await loadCatalogue({mode:'self-hosted',fetchImpl:async()=>new Response(JSON.stringify({courses,catalogue:{snapshotDate:'2026-10-27'}}))})
 assert.deepEqual(live,{courses,snapshotDate:'2026-10-27'})
 const unknown=await loadCatalogue({mode:'self-hosted',fetchImpl:async()=>new Response(JSON.stringify({courses}))})
 assert.equal(unknown.snapshotDate,null)
 const fallback=await loadCatalogue({mode:'self-hosted',fetchImpl:async()=>{throw Error('Indisponible')}})
 assert.equal(fallback.courses,fullCatalogueCourses);assert.equal(fallback.snapshotDate,fullCatalogueSnapshotDate)
 assert.equal(catalogueDateLabel('2026-10-27'),'Catalogue actualisé le 27.10.2026')
 for(const date of [null,'2026-02-30','27/10/2026','<script>'])assert.equal(catalogueDateLabel(date),'Date du catalogue non renseignée')
})
