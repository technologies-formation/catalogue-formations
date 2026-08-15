import officialCatalogueSnapshot from './officialCatalogueSnapshot.json' with {
  type: 'json',
}
import { officialCourseSamples } from './officialCourseSamples.js'
import { getCoursePublicValue } from '../domain/coursePublic.js'

const validatedTargetingByCode = new Map(
  officialCourseSamples
    .filter(
      (course) =>
        course.normalizationStatus === 'validated' &&
        course.targeting !== null,
    )
    .map((course) => [
      course.code,
      {
        normalizationStatus: course.normalizationStatus,
        targeting: course.targeting,
      },
    ]),
)

export const fullCatalogueCourses = officialCatalogueSnapshot.map(
  (snapshotCourse) => {
    const validatedTargeting = validatedTargetingByCode.get(snapshotCourse.code)

    return {
      code: snapshotCourse.code,
      sourceUrl: snapshotCourse.sourceUrl,
      officialData: {
        titleRaw: snapshotCourse.titleRaw,
        organizingEntityRaw: snapshotCourse.organizingEntityRaw,
        domainRaw: snapshotCourse.domainRaw,
        themeRaw:
          typeof snapshotCourse.themeRaw === 'string' &&
          snapshotCourse.themeRaw.trim() !== ''
            ? snapshotCourse.themeRaw
            : null,
        publicRaw: snapshotCourse.publicRaw,
        publicValue: getCoursePublicValue(snapshotCourse.publicRaw),
        targetAudienceRaw: snapshotCourse.targetAudienceRaw,
      },
      catalogueOffers: snapshotCourse.catalogueOffers,
      normalizationStatus:
        validatedTargeting?.normalizationStatus ?? 'needsReview',
      targeting: validatedTargeting?.targeting ?? null,
    }
  },
)
