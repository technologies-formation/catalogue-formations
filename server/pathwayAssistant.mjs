const FIELD_LIMITS = {
  personnelCategory: 80,
  entity: 120,
  managerStatus: 120,
  role: 300,
  objective: 1_000,
  existingSkills: 1_000,
  timeAvailable: 300,
  constraints: 1_000,
}

const REQUIRED_FIELDS = new Set(['role', 'objective'])

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

  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    const value = body[field]

    if (value === undefined || value === null) {
      if (REQUIRED_FIELDS.has(field)) {
        throw new PathwayInputError(400, `Le champ ${field} est obligatoire`)
      }
      continue
    }

    if (typeof value !== 'string') {
      throw new PathwayInputError(400, `Le champ ${field} doit être une chaîne de caractères`)
    }

    const normalized = value.trim()

    if (!normalized && REQUIRED_FIELDS.has(field)) {
      throw new PathwayInputError(400, `Le champ ${field} est obligatoire`)
    }

    if (normalized.length > limit) {
      throw new PathwayInputError(422, `Le champ ${field} dépasse ${limit} caractères`)
    }

    if (normalized) {
      profile[field] = normalized
    }
  }

  return profile
}
