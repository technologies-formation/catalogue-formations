import http from 'node:http'
import { searchWithLuna } from './llmSearch.mjs'

const PORT = Number(process.env.PORT || 8787)

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(data))
}

async function readJson(request) {
  let body = ''

  for await (const chunk of request) {
    body += chunk

    if (body.length > 16_000) {
      throw new Error('Requête trop volumineuse')
    }
  }

  return JSON.parse(body || '{}')
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
      const query = String(body.query ?? '').trim()

      if (!query) {
        sendJson(response, 400, {
          error: 'Le champ query est obligatoire',
        })
        return
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
      sendJson(response, 400, {
        error: error.message,
      })
    }

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
