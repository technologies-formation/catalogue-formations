import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { fullCatalogueCourses } from './data/fullCatalogueCourses.js'
import {
  getPublicFacetOptions,
  matchesPublicFacet,
} from './domain/coursePublic.js'

const NO_FILTER = ''
const LONG_TARGET_AUDIENCE_THRESHOLD = 240

function formatFormationCount(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "'")
}

function uniqueTextValues(values) {
  return [
    ...new Set(
      values.filter((value) => typeof value === 'string' && value.trim()),
    ),
  ].sort((left, right) => left.localeCompare(right, 'fr-CH'))
}

function getFacetOptions(courses, getValue) {
  return uniqueTextValues(courses.flatMap((course) => getValue(course) ?? []))
}

const trainingOfferOptions = getFacetOptions(
  fullCatalogueCourses,
  (course) => course.catalogueOffers,
)
const trainingEntityOptions = getFacetOptions(
  fullCatalogueCourses,
  (course) => course.officialData.organizingEntityRaw,
)

function App() {
  const [officialSearch, setOfficialSearch] = useState(NO_FILTER)
  const [trainingOffers, setTrainingOffers] = useState([])
  const [trainingEntities, setTrainingEntities] = useState([])
  const [domains, setDomains] = useState([])
  const [themes, setThemes] = useState([])
  const [publics, setPublics] = useState([])
  const [showGettingStarted, setShowGettingStarted] = useState(true)

  const hasPrimarySelection = trainingOffers.length > 0 || trainingEntities.length > 0
  const hasDomainSelection = domains.length > 0

  const coursesMatchingPrimaryFacets = useMemo(
    () =>
      fullCatalogueCourses.filter(
        (course) =>
          (trainingOffers.length === 0 ||
            course.catalogueOffers.some((offer) => trainingOffers.includes(offer))) &&
          (trainingEntities.length === 0 ||
            trainingEntities.includes(course.officialData.organizingEntityRaw)),
      ),
    [trainingEntities, trainingOffers],
  )

  const domainOptions = useMemo(
    () =>
      getFacetOptions(
        coursesMatchingPrimaryFacets,
        (course) => course.officialData.domainRaw,
      ),
    [coursesMatchingPrimaryFacets],
  )
  const publicOptions = useMemo(
    () => getPublicFacetOptions(coursesMatchingPrimaryFacets),
    [coursesMatchingPrimaryFacets],
  )
  const themeOptions = useMemo(
    () =>
      getFacetOptions(
        coursesMatchingPrimaryFacets.filter(
          (course) =>
            domains.includes(course.officialData.domainRaw) &&
            matchesPublicFacet(course, publics),
        ),
        (course) => course.officialData.themeRaw,
      ),
    [coursesMatchingPrimaryFacets, domains, publics],
  )

  useEffect(() => {
    if (!hasPrimarySelection) {
      setDomains([])
      setThemes([])
      setPublics([])
      return
    }

    setDomains((selected) => selected.filter((value) => domainOptions.includes(value)))
    setPublics((selected) => selected.filter((value) => publicOptions.includes(value)))
  }, [domainOptions, hasPrimarySelection, publicOptions])

  useEffect(() => {
    setThemes((selected) =>
      hasDomainSelection
        ? selected.filter((value) => themeOptions.includes(value))
        : [],
    )
  }, [hasDomainSelection, themeOptions])

  const matchingOfficialCourses = useMemo(
    () =>
      fullCatalogueCourses.filter((course) => {
        const query = officialSearch.trim().toLocaleLowerCase('fr-CH')
        const searchableText = `${course.code} ${course.officialData.titleRaw ?? ''}`
          .toLocaleLowerCase('fr-CH')

        return (
          (!query || searchableText.includes(query)) &&
          (trainingOffers.length === 0 ||
            course.catalogueOffers.some((offer) => trainingOffers.includes(offer))) &&
          (trainingEntities.length === 0 ||
            trainingEntities.includes(course.officialData.organizingEntityRaw)) &&
          (domains.length === 0 || domains.includes(course.officialData.domainRaw)) &&
          (themes.length === 0 || themes.includes(course.officialData.themeRaw)) &&
          matchesPublicFacet(course, publics)
        )
      }),
    [
      officialSearch,
      trainingOffers,
      trainingEntities,
      domains,
      themes,
      publics,
    ],
  )

  const activeOfficialFilters = [
    officialSearch.trim() && {
      key: 'search',
      label: `Recherche : ${officialSearch.trim()}`,
      clear: () => setOfficialSearch(NO_FILTER),
    },
    ...trainingOffers.map((value) => ({
      key: `offer-${value}`,
      label: `Offre : ${value}`,
      clear: () => setTrainingOffers((selected) => selected.filter((item) => item !== value)),
    })),
    ...trainingEntities.map((value) => ({
      key: `entity-${value}`,
      label: `Entité : ${value}`,
      clear: () => setTrainingEntities((selected) => selected.filter((item) => item !== value)),
    })),
    ...domains.map((value) => ({
      key: `domain-${value}`,
      label: `Domaine : ${value}`,
      clear: () => setDomains((selected) => selected.filter((item) => item !== value)),
    })),
    ...themes.map((value) => ({
      key: `theme-${value}`,
      label: `Thème : ${value}`,
      clear: () => setThemes((selected) => selected.filter((item) => item !== value)),
    })),
    ...publics.map((value) => ({
      key: `public-${value}`,
      label: `Public : ${value}`,
      clear: () => setPublics((selected) => selected.filter((item) => item !== value)),
    })),
  ].filter(Boolean)

  function resetOfficialFilters() {
    setOfficialSearch(NO_FILTER)
    setTrainingOffers([])
    setTrainingEntities([])
    setDomains([])
    setThemes([])
    setPublics([])
  }

  return (
    <div className="site-shell">
      <main>
        <section className="search-hero" aria-labelledby="page-title">
          <header className="search-hero-topbar">
            <div className="institutional-identity">
              <div className="brand-mark" aria-hidden="true">GE</div>
              <div className="institutional-wordmark">
                <span className="brand-name">RÉPUBLIQUE ET CANTON DE GENÈVE</span>
                <span className="brand-service">Formation du personnel</span>
              </div>
            </div>
            <button
              className="help-button"
              type="button"
              onClick={() => setShowGettingStarted(true)}
            >
              Aide
            </button>
          </header>
          <div className="application-intro">
            <h1 id="page-title">Catalogue de formations</h1>
            <p className="application-subtitle">
              Recherchez les formations proposées au personnel de l’État de Genève.
            </p>
          </div>
          <label className="main-search-field">
            <span>Rechercher une formation</span>
            <input
              type="search"
              value={officialSearch}
              onChange={(event) => setOfficialSearch(event.target.value)}
              placeholder="Rechercher une formation, un mot-clé ou un code..."
            />
          </label>
          <div className="search-support">
            <p className="search-examples">
              Exemples : communication, projet, intelligence artificielle, FP173
            </p>
            <p className="prototype-note">
              Données issues du catalogue importé — {formatFormationCount(fullCatalogueCourses.length)} formations.
              {' '}Prototype de démonstration.
            </p>
          </div>
        </section>

        {showGettingStarted && (
          <section className="getting-started" aria-labelledby="getting-started-title">
            <div>
              <h2 id="getting-started-title">Besoin d’aide&nbsp;?</h2>
              <p>
                Utilisez la recherche ou les filtres pour trouver une formation.
                Les résultats s’adaptent automatiquement à vos choix.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowGettingStarted(false)}
              aria-label="Fermer l’aide"
            >
              Fermer
            </button>
          </section>
        )}

        <section
          className="official-catalog"
          aria-labelledby="official-catalog-heading"
        >
          <div className="official-catalog-layout">
            <aside className="official-filter-panel" aria-label="Filtres du catalogue officiel">
              <h2>Affiner les résultats</h2>

              <FacetGroup
                label="Offre de formation"
                help="Catalogue ou offre auxquels la formation est rattachée."
                options={trainingOfferOptions}
                selected={trainingOffers}
                onChange={setTrainingOffers}
              />

              <FacetGroup
                label="Entité de formation"
                help="Entité organisatrice indiquée dans la fiche officielle."
                options={trainingEntityOptions}
                selected={trainingEntities}
                onChange={setTrainingEntities}
              />

              <FacetGroup
                label="Domaine"
                help="Domaine indiqué dans la fiche officielle."
                options={domainOptions}
                selected={domains}
                onChange={setDomains}
                disabled={!hasPrimarySelection}
                disabledReason="Sélectionnez d’abord une offre ou une entité."
              />

              <FacetGroup
                label="Thème"
                help="Thème indiqué dans la fiche officielle."
                options={themeOptions}
                selected={themes}
                onChange={setThemes}
                disabled={!hasDomainSelection}
                disabledReason="Sélectionnez d’abord un domaine."
              />

              <FacetGroup
                label="Public"
                help="Public indiqué dans la fiche officielle."
                options={publicOptions}
                selected={publics}
                onChange={setPublics}
                disabled={!hasPrimarySelection}
                disabledReason="Sélectionnez d’abord une offre ou une entité."
              />

              <button
                className="reset-filters"
                type="button"
                onClick={resetOfficialFilters}
              >
                Réinitialiser les filtres
              </button>
            </aside>

            <div className="official-catalog-results">
              <div className="official-results-heading">
                <h2 id="official-catalog-heading">
                  {formatFormationCount(matchingOfficialCourses.length)} formation
                  {matchingOfficialCourses.length !== 1 ? 's' : ''} trouvée
                  {matchingOfficialCourses.length !== 1 ? 's' : ''}
                </h2>
                {activeOfficialFilters.length > 0 && (
                  <div className="active-filters" aria-label="Filtres actifs">
                    {activeOfficialFilters.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={filter.clear}
                        title={`Retirer le filtre ${filter.label}`}
                      >
                        <span>{filter.label}</span>
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="official-results-scroll" aria-live="polite">
                {matchingOfficialCourses.length > 0 ? (
                  matchingOfficialCourses.map((course) => (
                    <OfficialCourseCard key={course.code} course={course} />
                  ))
                ) : (
                  <div className="empty-state official-empty-state">
                    <h3>Aucune formation ne correspond aux critères sélectionnés.</h3>
                    <p>
                      Modifiez ou réinitialisez certains filtres pour élargir
                      votre recherche.
                    </p>
                    <button
                      className="reset-filters"
                      type="button"
                      onClick={resetOfficialFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}

function FacetGroup({
  label,
  help,
  options,
  selected,
  onChange,
  disabled = false,
  disabledReason,
}) {
  function toggleOption(value) {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  const selectionSummary =
    selected.length === 0
      ? 'Sélectionner...'
      : selected.length === 1
        ? selected[0]
        : `${selected.length} sélectionnées`

  const triggerContent = (
    <>
      <span className="facet-label">{label}</span>
      <span className="facet-selection" title={selectionSummary}>
        {selectionSummary}
      </span>
      <span className="facet-chevron" aria-hidden="true" />
    </>
  )

  if (disabled) {
    return (
      <div className="facet is-disabled" aria-disabled="true">
        <div className="facet-trigger">{triggerContent}</div>
        <p className="facet-status">{disabledReason}</p>
      </div>
    )
  }

  return (
    <details className="facet">
      <summary className="facet-trigger">{triggerContent}</summary>
      <div className="facet-dropdown">
          {help && <p className="field-help">{help}</p>}
          <div className="facet-options" role="group" aria-label={label}>
            {options.map((option) => (
              <label key={option} className="facet-option">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
      </div>
    </details>
  )
}

function OfficialCourseCard({ course }) {
  const unavailable = 'Information officielle non disponible'
  const theme = course.officialData.themeRaw
  const targetAudience =
    typeof course.officialData.targetAudienceRaw === 'string' &&
    course.officialData.targetAudienceRaw.trim() !== ''
      ? course.officialData.targetAudienceRaw
      : unavailable
  const hasLongTargetAudience =
    targetAudience !== unavailable &&
    targetAudience.length > LONG_TARGET_AUDIENCE_THRESHOLD

  return (
    <article className="official-course-card">
      <div className="official-course-card-heading">
        <h3>{course.officialData.titleRaw ?? unavailable}</h3>
        <p className="official-course-code">
          <span>Code du cours</span> {course.code}
        </p>
      </div>
      <dl className="official-course-metadata">
        <div>
          <dt>Domaine</dt>
          <dd>{course.officialData.domainRaw ?? unavailable}</dd>
        </div>
        {theme && (
          <div>
            <dt>Thème</dt>
            <dd>{theme}</dd>
          </div>
        )}
        <div>
          <dt>Entité de formation</dt>
          <dd>{course.officialData.organizingEntityRaw ?? unavailable}</dd>
        </div>
        <div>
          <dt>Public</dt>
          <dd>{course.officialData.publicValue}</dd>
        </div>
      </dl>
      <section className="official-course-target-audience" aria-label="Public visé">
        <h4>Public visé</h4>
        <p className="target-audience-preview">{targetAudience}</p>
        {hasLongTargetAudience && (
          <details className="target-audience-details">
            <summary>Lire le public visé complet</summary>
            <p>{targetAudience}</p>
          </details>
        )}
      </section>
      <div className="official-course-offers">
        <h4>Offre{course.catalogueOffers.length !== 1 ? 's' : ''} de formation</h4>
        <ul>
          {course.catalogueOffers.map((offer) => (
            <li key={offer}>{offer}</li>
          ))}
        </ul>
      </div>
      <div className="official-course-card-action">
        <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">
          Voir la formation <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default App
