import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import http from 'node:http'
import test from 'node:test'
import { trainingFields } from './trainingScope.mjs'
import { pathwayProfile } from '../src/config/pathwayProfile.js'
import { createCorsHandler } from './cors.mjs'
import { buildProfileReferences, handleProfileReferences } from './profileReferences.mjs'

async function fixture(t) {
  const applyCors = createCorsHandler({ allowedOrigins: new Set(['https://avatar.example.invalid']), isProduction: true })
  const server = http.createServer((request, response) => {
    if (!applyCors(request, response)) { response.writeHead(403); response.end(); return }
    if (handleProfileReferences(request, response, new URL(request.url, 'http://localhost'))) return
    response.writeHead(404); response.end()
  })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
  t.after(() => new Promise(resolve => server.close(resolve)))
  return 'http://127.0.0.1:' + server.address().port
}

test('contrat versionne : uniquement le parcours, aucune regle de ciblage ou de recommandation', () => {
  const data = buildProfileReferences()
  assert.deepEqual(Object.keys(data), ['schemaVersion', 'revision', 'pathway'])
  assert.equal(data.schemaVersion, 1)
  assert.match(data.revision, /^[a-f0-9]{64}$/)
  assert.deepEqual(data.pathway, {...pathwayProfile,fields:{...pathwayProfile.fields,...trainingFields([])}})
  assert.equal(data.revision, createHash('sha256').update(JSON.stringify({ schemaVersion: 1, pathway: data.pathway })).digest('hex'))
})

test('revision stable sans horodatage, modifiee par toute evolution du contrat', () => {
  const before = buildProfileReferences()
  assert.equal(buildProfileReferences().revision, before.revision)
  for (const change of [
    definition => { definition.fields.personnelCategory.options[0].label += ' modifie' },
    definition => { definition.fields.managerStatus.options.push({ value: 'Test', label: 'Test' }) },
    definition => { definition.fields.entity.suggestions.push({ value: 'TEST', label: 'Test' }) },
    definition => { definition.fields.role.maxLength++ },
    definition => { definition.fields.personnelCategory.requiredInApi = true },
  ]) {
    const definition = structuredClone(pathwayProfile)
    change(definition)
    assert.notEqual(buildProfileReferences(definition).revision, before.revision)
  }
})

test('GET HTTP : contrat identique au module partage et cache revalidable', async t => {
  const base = await fixture(t)
  const response = await fetch(base + '/api/profile-references')
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /^application\/json/)
  assert.equal(response.headers.get('cache-control'), 'public, max-age=0, must-revalidate')
  assert.equal(response.headers.get('vary'), 'Origin')
  const data = await response.json()
  assert.deepEqual(data, buildProfileReferences())
  assert.equal(response.headers.get('etag'), `"${data.revision}"`)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.ok(JSON.stringify(data).length < 8192)
})

test('ETag : 304 sans corps, formes faible/liste/etoile et reponse 200 si revision differente', async t => {
  const base = await fixture(t)
  const etag = `"${buildProfileReferences().revision}"`
  for (const tag of [etag, 'W/' + etag, '"ancienne", W/' + etag, '*']) {
    const response = await fetch(base + '/api/profile-references', { headers: { 'If-None-Match': tag } })
    assert.equal(response.status, 304)
    assert.equal(response.headers.get('etag'), etag)
    assert.equal(response.headers.get('vary'), 'Origin')
    assert.equal(await response.text(), '')
  }
  const changed = await fetch(base + '/api/profile-references', { headers: { 'If-None-Match': '"autre"' } })
  assert.equal(changed.status, 200)
  assert.deepEqual(await changed.json(), buildProfileReferences())
})

test('methodes interdites et routes voisines ne declenchent aucun traitement metier', async t => {
  const base = await fixture(t)
  for (const method of ['POST', 'PUT', 'DELETE', 'HEAD']) {
    const response = await fetch(base + '/api/profile-references', { method })
    assert.equal(response.status, 405)
    assert.equal(response.headers.get('allow'), 'GET, OPTIONS')
  }
  assert.equal((await fetch(base + '/api/profile-references-other')).status, 404)
  assert.equal((await fetch(base + '/api/pathway')).status, 404)
})

test('CORS : ETag lisible et precontrole If-None-Match autorise sur la nouvelle route', async t => {
  const base = await fixture(t)
  const origin = 'https://avatar.example.invalid'
  const preflight = await fetch(base + '/api/profile-references', {
    method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'if-none-match' },
  })
  assert.equal(preflight.status, 204)
  assert.equal(await preflight.text(), '')
  assert.equal(preflight.headers.get('access-control-allow-origin'), origin)
  assert.match(preflight.headers.get('access-control-allow-headers'), /If-None-Match/)
  const response = await fetch(base + '/api/profile-references', { headers: { Origin: origin } })
  assert.equal(response.headers.get('access-control-expose-headers'), 'ETag')
  assert.equal(response.headers.get('vary'), 'Origin')
  assert.equal(response.status, 200)
})

test('CORS existant : origine inconnue refusee avant la lecture des referentiels', async t => {
  const base = await fixture(t)
  for (const method of ['GET', 'OPTIONS']) {
    const response = await fetch(base + '/api/profile-references', { method, headers: { Origin: 'https://interdit.example.invalid' } })
    assert.equal(response.status, 403)
    assert.equal(response.headers.get('etag'), null)
  }
})
