import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'

const CONTENT_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.webp', 'image/webp'],
])

function safePathname(pathname) {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return null
  }
}

async function regularFile(filePath) {
  try {
    return (await stat(filePath)).isFile()
  } catch {
    return false
  }
}

export function createStaticFrontendHandler({ root = path.resolve('dist') } = {}) {
  const resolvedRoot = path.resolve(root)
  const indexPath = path.join(resolvedRoot, 'index.html')

  return async function serveStaticFrontend(request, response, url) {
    if (!existsSync(indexPath) || !['GET', 'HEAD'].includes(request.method)) {
      return false
    }

    const pathname = safePathname(url.pathname)

    if (!pathname || pathname.startsWith('/api/')) {
      return false
    }

    const requestedPath = pathname === '/' ? '/index.html' : pathname
    const candidate = path.resolve(resolvedRoot, `.${requestedPath}`)
    const insideRoot = candidate.startsWith(`${resolvedRoot}${path.sep}`)
    const candidateExists = insideRoot && await regularFile(candidate)

    if (!candidateExists && path.extname(requestedPath)) {
      return false
    }

    const filePath = candidateExists ? candidate : indexPath
    const extension = path.extname(filePath).toLowerCase()
    const cacheControl = pathname.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'no-cache'

    response.writeHead(200, {
      'Content-Type': CONTENT_TYPES.get(extension) ?? 'application/octet-stream',
      'Cache-Control': cacheControl,
    })

    if (request.method === 'HEAD') {
      response.end()
    } else {
      createReadStream(filePath).pipe(response)
    }

    return true
  }
}
