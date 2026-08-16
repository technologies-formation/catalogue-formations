export const DEFAULT_COURSE_SORT = 'title-asc'

export const COURSE_SORT_OPTIONS = [
  { value: 'title-asc', label: 'Intitulé — A à Z' },
  { value: 'title-desc', label: 'Intitulé — Z à A' },
  { value: 'code-asc', label: 'Code — A à Z' },
  { value: 'code-desc', label: 'Code — Z à A' },
]

const frenchCollator = new Intl.Collator('fr', {
  sensitivity: 'base',
})

export function sortCourses(courses, sortOrder = DEFAULT_COURSE_SORT) {
  const [field, direction] = sortOrder.split('-')
  const directionMultiplier = direction === 'desc' ? -1 : 1

  return [...courses].sort((left, right) => {
    const leftValue =
      field === 'code' ? left.code : (left.officialData.titleRaw ?? '')
    const rightValue =
      field === 'code' ? right.code : (right.officialData.titleRaw ?? '')

    return frenchCollator.compare(leftValue, rightValue) * directionMultiplier
  })
}
