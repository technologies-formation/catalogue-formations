export function isCourseTargetingReady(course) {
  return (
    course.normalizationStatus === 'validated' &&
    course.targeting !== null &&
    course.targeting !== undefined
  )
}
