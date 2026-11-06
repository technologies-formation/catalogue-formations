import { createHash } from 'node:crypto'
import { trainingFields } from './trainingScope.mjs'
import { pathwayProfile } from '../src/config/pathwayProfile.js'

export const PROFILE_REFERENCES_SCHEMA_VERSION = 1

export function buildProfileReferences(definition = pathwayProfile, courses = []) {
  if(definition===pathwayProfile)definition={...definition,fields:{...definition.fields,...trainingFields(courses)}}
  const content = { schemaVersion: PROFILE_REFERENCES_SCHEMA_VERSION, pathway: definition }
  const revision = createHash('sha256').update(JSON.stringify(content)).digest('hex')
  return { schemaVersion: content.schemaVersion, revision, pathway: definition }
}

const references = buildProfileReferences()
const body = JSON.stringify(references)
const etag = `"${references.revision}"`

function matchesEtag(header, etag) {
  return typeof header === 'string' && header.split(',').some(value => {
    const tag = value.trim()
    return tag === '*' || tag.replace(/^W\//, '') === etag
  })
}

// Appele apres le controle CORS existant, sans acces au catalogue, a l'IA ou aux quotas.
export function handleProfileReferences(request, response, url, courses = []) {
  if (url.pathname !== '/api/profile-references') return false

  const references = buildProfileReferences(pathwayProfile,courses)
  const body = JSON.stringify(references), etag = '"'+references.revision+'"'
  response.setHeader('Vary', 'Origin')
  response.setHeader('Allow', 'GET, OPTIONS')
  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return true
  }
  if (request.method !== 'GET') {
    response.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
    response.end(JSON.stringify({ error: 'Method Not Allowed' }))
    return true
  }

  response.setHeader('ETag', etag)
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  if (matchesEtag(request.headers['if-none-match'], etag)) {
    response.writeHead(304)
    response.end()
    return true
  }
  response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(body)
  return true
}
