export function createCorsHandler({ allowedOrigins, isProduction }) {
  return function applyCors(request, response) {
    const origin = request.headers.origin

    if (!origin) {
      return true
    }

    let sameOrigin = false

    try {
      const originUrl = new URL(origin)
      const forwardedHost = request.headers['x-forwarded-host']
      const requestHost = (
        typeof forwardedHost === 'string' && forwardedHost.trim()
          ? forwardedHost
          : request.headers.host
      )
        ?.split(',')[0]
        .trim()

      sameOrigin = Boolean(requestHost) && originUrl.host === requestHost
    } catch {
      return false
    }

    if (sameOrigin) {
      return true
    }

    const allowed =
      allowedOrigins.has(origin) ||
      (!isProduction && allowedOrigins.size === 0)

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
}
