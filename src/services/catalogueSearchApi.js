const API_BASE_URL =
  (import.meta.env.VITE_SEARCH_API_BASE_URL ?? '').replace(/\/$/, '')

export const isAiSearchConfigured =
  import.meta.env.DEV || Boolean(API_BASE_URL)

export async function searchCatalogueWithAi(query, { signal } = {}) {
  if (!isAiSearchConfigured) {
    throw new Error('Recherche avec l’IA non configurée.')
  }

  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    signal,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error ?? `Erreur HTTP ${response.status}`)
  }

  return data
}
