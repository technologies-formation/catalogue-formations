export const PUBLIC_NOT_PROVIDED = 'Non renseigné'

export function getCoursePublicValue(publicRaw) {
  return typeof publicRaw === 'string' && publicRaw.trim() !== ''
    ? publicRaw
    : PUBLIC_NOT_PROVIDED
}

export function getPublicFacetOptions(courses) {
  return [
    ...new Set(courses.map((course) => course.officialData.publicValue)),
  ].sort((left, right) => left.localeCompare(right, 'fr-CH'))
}

export function matchesPublicFacet(course, selectedPublics) {
  return (
    selectedPublics.length === 0 ||
    selectedPublics.includes(course.officialData.publicValue)
  )
}
