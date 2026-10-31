import test from 'node:test'
import assert from 'node:assert/strict'
import {trainingFields,scopeCatalogue} from './trainingScope.mjs'
import {buildProfileReferences} from './profileReferences.mjs'
import {pathwayProfile} from '../src/config/pathwayProfile.js'
const courses=[{code:'A',catalogueOffers:['Offre 1','Offre 2'],officialData:{organizingEntityRaw:'Centre 1'}},{code:'B',catalogueOffers:['Offre 2'],officialData:{organizingEntityRaw:'Centre 2'}}]
const catalogue={courses,officialCodes:['A','B'],ultraCompactCatalogue:[{code:'A'},{code:'B'}],courseByCode:new Map(courses.map(c=>[c.code,c])),detailedByCode:new Map(courses.map(c=>[c.code,{code:c.code}]))}
test('listes issues des cours, distinctes et actualisées sans dépendre des libellés antérieurs',()=>{
 const a=buildProfileReferences(pathwayProfile,courses),b=buildProfileReferences(pathwayProfile,[...courses,{code:'C',catalogueOffers:['Nouvelle offre'],officialData:{organizingEntityRaw:'Nouveau centre'}}])
 assert.notEqual(a.revision,b.revision);assert.equal(b.pathway.fields.trainingOffers.options.length,3);assert.equal(b.pathway.fields.trainingOrganizers.options.length,3)
 assert.deepEqual(trainingFields(courses).trainingOffers.options.map(o=>o.value),['Offre 1','Offre 2'])
})
test('union dans chaque critère, intersection entre offres et entités, sans mutation du catalogue',()=>{
 assert.equal(scopeCatalogue(catalogue,{}),catalogue)
 const scoped=scopeCatalogue(catalogue,{trainingOffers:'Offre 1\nOffre 2',trainingOrganizers:'Centre 2'})
 assert.deepEqual(scoped.officialCodes,['B']);assert.deepEqual([...scoped.detailedByCode.keys()],['B']);assert.deepEqual(scoped.ultraCompactCatalogue,[{code:'B'}]);assert.equal(catalogue.courses.length,2)
 assert.deepEqual(scopeCatalogue(catalogue,{trainingOffers:'Offre 1',trainingOrganizers:'Centre 2'}).officialCodes,[])
 assert.throws(()=>scopeCatalogue(catalogue,{trainingOffers:'Offre supprimée'}));assert.throws(()=>scopeCatalogue(catalogue,{trainingOffers:'Offre 1\nOffre 1'}))
})
