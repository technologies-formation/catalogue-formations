import { projectSnapshotCourse } from '../src/data/fullCatalogueCourses.js'

function clean(value) {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(' | ')

  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}


export function prepareSearchCatalogue(snapshot) {
  const courses = snapshot.map(projectSnapshotCourse)
  const ultraCompactCatalogue = courses.map((course) => ({
    code: course.code,
    title: course.officialData?.titleRaw ?? '',
    domain: course.officialData?.domainRaw ?? '',
    theme: course.officialData?.themeRaw ?? '',
    public: course.officialData?.publicRaw ?? '',
    targetAudience: course.officialData?.targetAudienceRaw ?? '',
  }))

  const officialCodes = ultraCompactCatalogue.map(({ code }) => code)

  const detailedByCode = new Map(
    snapshot.map((course) => [
      course.code,
      {
        code: course.code,
        title: clean(course.titleRaw),
        organizingEntity: clean(course.organizingEntityRaw),
        domain: clean(course.domainRaw),
        theme: clean(course.themeRaw),
        public: clean(course.publicRaw),
        targetAudience: clean(course.targetAudienceRaw),
        duration: clean(course.durationRaw),
        generalInformation: clean(course.generalInformationRaw),
        objectives: clean(course.objectivesRaw),
        content: clean(course.contentRaw),
        prerequisites: clean(course.prerequisitesRaw),
        additionalInformation: clean(course.additionalInformationRaw),
      },
    ]),
  )

  const courseByCode = new Map(
    courses.map((course) => [course.code, course]),
  )

  return { courses, ultraCompactCatalogue, officialCodes, detailedByCode, courseByCode }
}
