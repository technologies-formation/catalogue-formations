import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { positiveIntegerEnv } from './config.mjs'
import { searchWithLuna } from './llmSearch.mjs'
import { catalogueStore, catalogueSyncEnabled, initializeCatalogue, startCatalogueSync } from './catalogueRuntime.mjs'

const PORT = Number(process.env.PORT || 8787)
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const RATE_LIMIT_MAX = positiveIntegerEnv('RATE_LIMIT_MAX', 10)
const RATE_LIMIT_WINDOW_MS = positiveIntegerEnv(
  'RATE_LIMIT_WINDOW_MS',
  600_000,
  1_000,
)
const TRUST_PROXY = process.env.TRUST_PROXY === 'true'
const MAX_CONCURRENT_SEARCHES = positiveIntegerEnv(
  'MAX_CONCURRENT_SEARCHES',
  1,
)

let activeLunaSearches = 0
const rateLimits = new Map()

function getClientIp(request) {
  if (TRUST_PROXY) {
    const forwarded = request.headers['x-forwarded-for']

    if (typeof forwarded === 'string' && forwarded.trim()) {
      return forwarded.split(',')[0].trim()
    }
  }

  return request.socket.remoteAddress || 'unknown'
}

function applyRateLimit(request, response) {
  const now = Date.now()

  for (const [ip, entry] of rateLimits) {
    if (now >= entry.resetAt) {
      rateLimits.delete(ip)
    }
  }

  const clientIp = getClientIp(request)

  let entry = rateLimits.get(clientIp)

  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    }
  }

  entry.count += 1
  rateLimits.set(clientIp, entry)

  if (entry.count > RATE_LIMIT_MAX) {
    const retryAfter = Math.max(
      1,
      Math.ceil((entry.resetAt - now) / 1_000),
    )

    response.setHeader('Retry-After', String(retryAfter))

    sendJson(response, 429, {
      error: 'Trop de recherches. Merci de réessayer plus tard.',
    })

    return false
  }

  return true
}

const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
)

function applyCors(request, response) {
  const origin = request.headers.origin

  if (!origin) {
    return true
  }

  const allowed =
    ALLOWED_ORIGINS.has(origin) ||
    (!IS_PRODUCTION && ALLOWED_ORIGINS.size === 0)

  if (!allowed) {
    return false
  }

  response.setHeader('Access-Control-Allow-Origin', origin)
  response.setHeader('Vary', 'Origin')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Access-Control-Max-Age', '600')

  return true
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(data))
}

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function readJson(request) {
  let body = ''

  for await (const chunk of request) {
    body += chunk

    if (body.length > 16_000) {
      throw new HttpError(413, 'Requête trop volumineuse')
    }
  }

  try {
    return JSON.parse(body || '{}')
  } catch {
    throw new HttpError(400, 'Le corps de la requête doit être un JSON valide')
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(
    request.url,
    `http://${request.headers.host || 'localhost'}`
  )

  if (!applyCors(request, response)) {
    sendJson(response, 403, {
      error: 'Origin non autorisée',
    })
    return
  }

  if (
    request.method === 'OPTIONS' &&
    (url.pathname === '/api/search' || url.pathname === '/api/health')
  ) {
    response.writeHead(204)
    response.end()
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      service: 'catalogue-search-api',
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
      catalogue: { syncEnabled: catalogueSyncEnabled, ...catalogueStore.status() },
    })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/search') {
    const requestId = randomUUID()
    const startedAt = Date.now()

    response.setHeader('X-Request-Id', requestId)

    try {
      if (!applyRateLimit(request, response)) {
        console.log(
          JSON.stringify({
            event: 'search',
            requestId,
            status: 429,
            durationMs: Date.now() - startedAt,
          }),
        )
        return
      }

      const body = await readJson(request)

      if (typeof body.query !== 'string') {
        throw new HttpError(400, 'Le champ query doit être une chaîne de caractères')
      }

      const query = body.query.trim()

      if (!query) {
        throw new HttpError(400, 'Le champ query est obligatoire')
      }

      if (query.length > 1_000) {
        throw new HttpError(
          422,
          'La recherche est trop longue (1 000 caractères maximum)',
        )
      }

      if (activeLunaSearches >= MAX_CONCURRENT_SEARCHES) {
        response.setHeader('Retry-After', '5')

        console.log(
          JSON.stringify({
            event: 'search',
            requestId,
            status: 503,
            durationMs: Date.now() - startedAt,
            reason: 'concurrency-limit',
          }),
        )

        sendJson(response, 503, {
          error: 'Le service traite déjà une recherche. Merci de réessayer dans quelques secondes.',
        })
        return
      }

      activeLunaSearches += 1

      let result

      try {
        result = await searchWithLuna(query)
      } finally {
        activeLunaSearches -= 1
      }

      console.log(
        JSON.stringify({
          event: 'search',
          requestId,
          status: 200,
          durationMs: Date.now() - startedAt,
          usage: result.usage ?? {},
        }),
      )

      sendJson(response, 200, {
        ok: true,
        query,
        ...result,
      })
    } catch (error) {
      if (error instanceof HttpError) {
        console.log(
          JSON.stringify({
            event: 'search',
            requestId,
            status: error.status,
            durationMs: Date.now() - startedAt,
          }),
        )

        sendJson(response, error.status, {
          error: error.message,
        })
        return
      }

      console.error(
        JSON.stringify({
          event: 'search-error',
          requestId,
          status: 500,
          durationMs: Date.now() - startedAt,
          error: error instanceof Error ? error.name : 'UnknownError',
        }),
      )

      sendJson(response, 500, {
        error: 'Le service de recherche est momentanément indisponible',
      })
    }

    return
  }

  if (url.pathname === '/api/search') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, {
      error: 'Method Not Allowed',
    })
    return
  }

  if (url.pathname === '/api/health') {
    response.setHeader('Allow', 'GET')
    sendJson(response, 405, {
      error: 'Method Not Allowed',
    })
    return
  }

  sendJson(response, 404, {
    error: 'Not found',
  })
})

await initializeCatalogue()
server.once('listening', () => {
  const stopSync = startCatalogueSync()
  server.once('close', stopSync)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Catalogue Search API : http://localhost:${PORT}`)
  console.log(
    `OPENAI_API_KEY : ${
      process.env.OPENAI_API_KEY ? 'configurée ✅' : 'absente ❌'
    }`
  )
  console.log('Mode /api/search : LUNA + rappel lexical — appels OpenAI actifs')
})
