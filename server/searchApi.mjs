import http from 'node:http'
import { searchWithLuna } from './llmSearch.mjs'

const PORT = Number(process.env.PORT || 8787)

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

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      service: 'catalogue-search-api',
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/search') {
    try {
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

      const result = await searchWithLuna(query)

      console.log(
        'Usage OpenAI :',
        JSON.stringify(result.usage ?? {}, null, 2)
      )

      sendJson(response, 200, {
        ok: true,
        query,
        ...result,
      })
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(response, error.status, {
          error: error.message,
        })
        return
      }

      console.error('Erreur /api/search :', error)

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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Catalogue Search API : http://localhost:${PORT}`)
  console.log(
    `OPENAI_API_KEY : ${
      process.env.OPENAI_API_KEY ? 'configurée ✅' : 'absente ❌'
    }`
  )
  console.log('Mode /api/search : LUNA + rappel lexical — appels OpenAI actifs')
})
