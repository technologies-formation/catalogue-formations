import { pathwayProfileFields } from '../src/config/pathwayProfile.js'

export class PathwayInputError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'PathwayInputError'
    this.status = status
  }
}

export function isPathwayAssistantEnabled(env = process.env) {
  return env.ASSISTANT_PARCOURS_ENABLED === 'true'
}

export function validatePathwayInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new PathwayInputError(400, 'Le corps de la requête doit être un objet JSON')
  }

  const profile = {}

  for (const [field, { maxLength, requiredInApi }] of Object.entries(pathwayProfileFields)) {
    const value = body[field]

    if (value === undefined || value === null) {
      if (requiredInApi) {
        throw new PathwayInputError(400, `Le champ ${field} est obligatoire`)
      }
      continue
    }

    if (typeof value !== 'string') {
      throw new PathwayInputError(400, `Le champ ${field} doit être une chaîne de caractères`)
    }

    const normalized = value.trim()

    if (!normalized && requiredInApi) {
      throw new PathwayInputError(400, `Le champ ${field} est obligatoire`)
    }

    if (normalized.length > maxLength) {
      throw new PathwayInputError(422, `Le champ ${field} dépasse ${maxLength} caractères`)
    }

    if (normalized) {
      profile[field] = normalized
    }
  }

  return profile
}
