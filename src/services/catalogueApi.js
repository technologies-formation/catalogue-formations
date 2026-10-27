import { fullCatalogueCourses, fullCatalogueSnapshotDate } from '../data/fullCatalogueCourses.js'

export async function loadCatalogue({ mode = import.meta.env?.MODE, fetchImpl = globalThis.fetch } = {}) {
  const bundled = { courses: fullCatalogueCourses, snapshotDate: fullCatalogueSnapshotDate }
  if (mode !== 'self-hosted') return bundled
  try {
    const response = await fetchImpl('/api/catalogue', { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
    const data = await response.json()
    if (!Array.isArray(data.courses) || data.courses.length === 0) throw new Error('Catalogue distant invalide')
    return { courses: data.courses, snapshotDate: data.catalogue?.snapshotDate ?? null }
  } catch {
    return bundled
  }
}

export async function loadCatalogueCourses(options) {
  return (await loadCatalogue(options)).courses
}
