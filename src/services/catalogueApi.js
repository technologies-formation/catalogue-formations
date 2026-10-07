import { fullCatalogueCourses } from '../data/fullCatalogueCourses.js'

export async function loadCatalogueCourses() {
  if (import.meta.env.MODE !== 'self-hosted') {
    return fullCatalogueCourses
  }

  try {
    const response = await fetch('/api/catalogue', {
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data.courses) || data.courses.length === 0) {
      throw new Error('Catalogue distant invalide')
    }

    return data.courses
  } catch {
    return fullCatalogueCourses
  }
}
