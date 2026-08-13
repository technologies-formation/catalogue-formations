export function evaluateCourseTargeting(targeting, userProfile) {
  const categoryTargets = targeting.targets.filter(
    (target) => target.category === userProfile.personnelCategory,
  )

  if (categoryTargets.length === 0) {
    return {
      matches: false,
      reason: 'categoryMismatch',
      source: targeting.targetingSource,
    }
  }

  if (
    !categoryTargets.some(
      (target) => target.entity === null || target.entity === userProfile.entity,
    )
  ) {
    return {
      matches: false,
      reason: 'entityMismatch',
      source: targeting.targetingSource,
    }
  }

  return {
    matches: true,
    reason: 'matched',
    source: targeting.targetingSource,
  }
}
