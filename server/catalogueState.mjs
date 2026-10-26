import { projectSnapshotCourse } from '../src/data/fullCatalogueCourses.js'

function clean(value) {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(' | ')

  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}


// Les icônes de la fiche officielle décrivent un relevé daté, pas une réservation.
function sessionAvailability(course) {
  const date = course.sourceSnapshotDate
  const validDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(date + 'T12:00:00Z')) && new Date(date + 'T12:00:00Z').toISOString().slice(0, 10) === date
  const dates = Array.isArray(course.scheduledOpeningDates) ? [...new Set(course.scheduledOpeningDates.filter(value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T12:00:00Z')) && new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value && value > date))].sort().slice(0, 100) : []
  return course.fetchStatus === 'ok' && validDate &&
    typeof course.hasOpenSession === 'boolean' && typeof course.hasScheduledSession === 'boolean'
    ? { hasOpenSession: course.hasOpenSession, hasScheduledSession: course.hasScheduledSession, observedOn: date, source: 'official-session-icons', ...(course.hasScheduledSession && dates.length ? { scheduledOpeningDates: dates } : {}) }
    : { hasOpenSession: null, hasScheduledSession: null, observedOn: null, source: null }
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
        sessionAvailability: sessionAvailability(course),
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
