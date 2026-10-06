import assert from 'node:assert/strict'
import test from 'node:test'
import { createCorsHandler } from './cors.mjs'

function responseHeaders() {
  const headers = new Map()

  return {
    headers,
    response: {
      setHeader(name, value) {
        headers.set(name, value)
      },
    },
  }
}

test('autorise la même origine Infomaniak sans en-tête CORS', () => {
  const applyCors = createCorsHandler({
    allowedOrigins: new Set(['https://technologies-formation.github.io']),
    isProduction: true,
  })
  const { headers, response } = responseHeaders()

  assert.equal(applyCors({
    headers: {
      host: 'endch4cfkas.preview.hosting-ik.com',
      origin: 'https://endch4cfkas.preview.hosting-ik.com',
    },
  }, response), true)
  assert.equal(headers.size, 0)
})

test('utilise le domaine transmis par le proxy pour reconnaître la même origine', () => {
  const applyCors = createCorsHandler({
    allowedOrigins: new Set(),
    isProduction: true,
  })
  const { response } = responseHeaders()

  assert.equal(applyCors({
    headers: {
      host: 'localhost:8787',
      origin: 'https://endch4cfkas.preview.hosting-ik.com',
      'x-forwarded-host': 'endch4cfkas.preview.hosting-ik.com',
    },
  }, response), true)
})

test('conserve les origines interdomaines explicitement autorisées', () => {
  const origin = 'https://technologies-formation.github.io'
  const applyCors = createCorsHandler({
    allowedOrigins: new Set([origin]),
    isProduction: true,
  })
  const { headers, response } = responseHeaders()

  assert.equal(applyCors({
    headers: {
      host: 'api.a658yg-catalogue.ch',
      origin,
    },
  }, response), true)
  assert.equal(headers.get('Access-Control-Allow-Origin'), origin)
})

test('refuse une origine externe non autorisée en production', () => {
  const applyCors = createCorsHandler({
    allowedOrigins: new Set(['https://technologies-formation.github.io']),
    isProduction: true,
  })
  const { response } = responseHeaders()

  assert.equal(applyCors({
    headers: {
      host: 'api.a658yg-catalogue.ch',
      origin: 'https://example.com',
    },
  }, response), false)
})
