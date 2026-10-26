import test from 'node:test'
import assert from 'node:assert/strict'
import {prepareSearchCatalogue} from './catalogueState.mjs'
const row=overrides=>({code:'SESSION-TEST',titleRaw:'Cours synthétique',sourceUrl:'https://example.test/course',catalogueOffers:[],fetchStatus:'ok',sourceSnapshotDate:'2026-10-23',hasOpenSession:true,hasScheduledSession:false,...overrides})
const availability=source=>prepareSearchCatalogue([source]).detailedByCode.get(source.code).sessionAvailability
const unknown={hasOpenSession:null,hasScheduledSession:null,observedOn:null,source:null}
for(const [open,scheduled] of [[true,false],[false,true],[true,true],[false,false]]){
 test(`sessions : flags indépendants, relevé daté et aucune mutation (${open}/${scheduled})`,()=>{
  const source=row({hasOpenSession:open,hasScheduledSession:scheduled}),before=structuredClone(source)
  assert.deepEqual(availability(source),{hasOpenSession:open,hasScheduledSession:scheduled,observedOn:'2026-10-23',source:'official-session-icons'})
  assert.deepEqual(source,before)
 })
}
test('sessions : échec de collecte, flags incomplets ou date invalide deviennent inconnus',()=>{
 for(const overrides of [{fetchStatus:'error'},{hasOpenSession:null},{hasScheduledSession:undefined},{sourceSnapshotDate:null},{sourceSnapshotDate:'2026-02-30'},{sourceSnapshotDate:'23/10/2026'}])assert.deepEqual(availability(row(overrides)),unknown)
})


test('sessions : dates d’ouverture officielles futures, triées, sans modifier les anciennes données',()=>{
 const result=availability(row({hasScheduledSession:true,scheduledOpeningDates:['2026-11-03','2026-11-03','2026-02-30','2026-10-23','2027-01-02']}))
 assert.deepEqual(result.scheduledOpeningDates,['2026-11-03','2027-01-02'])
 assert.equal(availability(row({scheduledOpeningDates:['2026-11-03']})).scheduledOpeningDates,undefined)
 assert.equal(availability(row({fetchStatus:'error',hasScheduledSession:true,scheduledOpeningDates:['2026-11-03']})).scheduledOpeningDates,undefined)
})
