const API_BASE_URL =
  (import.meta.env.VITE_SEARCH_API_BASE_URL ?? '').replace(/\/$/, '')

export const isPathwayAssistantConfigured =
  import.meta.env.DEV || Boolean(API_BASE_URL)

export async function buildPathway(profile, { signal } = {}) {
  if (!isPathwayAssistantConfigured) {
    throw new Error('Assistant de parcours non configuré.')
  }

  const response = await fetch(`${API_BASE_URL}/api/pathway`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
    signal,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error ?? `Erreur HTTP ${response.status}`)
  }

  return data
}
