export function positiveIntegerEnv(name, fallback, minimum = 1) {
  const raw = process.env[name]

  if (raw === undefined || raw === '') {
    return fallback
  }

  const value = Number(raw)

  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(
      `${name} doit être un entier supérieur ou égal à ${minimum}`,
    )
  }

  return value
}
