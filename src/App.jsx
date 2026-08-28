import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import './App.css'
import { fullCatalogueCourses } from './data/fullCatalogueCourses.js'
import {
  getPublicFacetOptions,
  matchesPublicFacet,
} from './domain/coursePublic.js'
import {
  getPageCount,
  getPageResults,
  getVisiblePages,
  paginationReducer,
} from './domain/coursePagination.js'
import {
  filterFacetOptions,
  getFacetValueCounts,
  hasCourseFacetSelection,
  keepAvailableFacetOptions,
  matchesCourseSessionFacet,
  SESSION_FACET_OPTIONS,
} from './domain/courseFacets.js'
import {
  COURSE_SORT_OPTIONS,
  sortCourses,
} from './domain/courseSorting.js'
import {
  parseCourseSearchUrl,
  serializeCourseSearchState,
} from './domain/courseSearchUrl.js'
import { searchCourses } from './domain/courseSearch.js'
import { searchCatalogueWithAi } from './services/catalogueSearchApi.js'

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

const courseByCode = new Map(
  fullCatalogueCourses.map((course) => [course.code, course]),
)

function App() {
  const [initialSearchState] = useState(() =>
    parseCourseSearchUrl(window.location.search, fullCatalogueCourses),
  )
  const [officialSearch, setOfficialSearch] = useState(initialSearchState.search)
  const [aiResultCodes, setAiResultCodes] = useState(null)
  const [aiRecommendedCodes, setAiRecommendedCodes] = useState([])
  const [aiComplementaryCodes, setAiComplementaryCodes] = useState([])
  const [aiSearchStatus, setAiSearchStatus] = useState('idle')
  const [aiSearchReason, setAiSearchReason] = useState('')
  const [aiSearchError, setAiSearchError] = useState('')
  const [showAiExplanation, setShowAiExplanation] = useState(false)
  const [sessions, setSessions] = useState([])
  const [trainingOffers, setTrainingOffers] = useState(initialSearchState.offers)
  const [trainingEntities, setTrainingEntities] = useState(initialSearchState.entities)
  const [domains, setDomains] = useState(initialSearchState.domains)
  const [themes, setThemes] = useState(initialSearchState.themes)
  const [publics, setPublics] = useState(initialSearchState.publics)
  const [courseSort, setCourseSort] = useState(initialSearchState.sort)
  const [showGettingStarted, setShowGettingStarted] = useState(true)
  const [currentPage, dispatchPagination] = useReducer(paginationReducer, 1)
  const resultsHeadingRef = useRef(null)
  const aiSearchAbortRef = useRef(null)

  async function handleAiSearch() {
    const query = officialSearch.trim()
    if (!query || aiSearchStatus === 'loading') return

    aiSearchAbortRef.current?.abort()

    const controller = new AbortController()
    aiSearchAbortRef.current = controller

    setAiSearchStatus('loading')
    setAiSearchError('')
    setAiSearchReason('')

    try {
      const data = await searchCatalogueWithAi(query, {
        signal: controller.signal,
      })

      if (controller.signal.aborted) return

      const recommendedCodes = Array.isArray(data.recommendedCodes)
        ? data.recommendedCodes
        : Array.isArray(data.codes)
          ? data.codes
          : []

      const complementaryCodes = Array.isArray(data.complementaryCodes)
        ? data.complementaryCodes
        : []

      const allCodes = Array.isArray(data.codes)
        ? data.codes
        : [...recommendedCodes, ...complementaryCodes]

      setAiResultCodes(allCodes)
      setAiRecommendedCodes(recommendedCodes)
      setAiComplementaryCodes(complementaryCodes)
      setAiSearchReason(data.reason ?? '')
      setAiSearchStatus('success')
      setShowAiExplanation(true)
    } catch (error) {
      if (error?.name === 'AbortError') return

      setAiResultCodes(null)
      setAiRecommendedCodes([])
      setAiComplementaryCodes([])
      setAiSearchReason('')
      setShowAiExplanation(false)
      setAiSearchError(
        error instanceof Error
          ? error.message
          : 'La recherche IA est momentanément indisponible.',
      )
      setAiSearchStatus('error')
    } finally {
      if (aiSearchAbortRef.current === controller) {
        aiSearchAbortRef.current = null
      }
    }
  }

  const hasPrimarySelection = trainingOffers.length > 0 || trainingEntities.length > 0
  const hasDomainSelection = domains.length > 0
  const hasCourseSelection = hasCourseFacetSelection({
    offers: trainingOffers,
    entities: trainingEntities,
    domains,
    themes,
    publics,
  })

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

  const currentFacetFilters = useMemo(
    () => ({
      search: officialSearch,
      sessions,
      offers: trainingOffers,
      entities: trainingEntities,
      domains,
      themes,
      publics,
    }),
    [
      officialSearch,
      sessions,
      trainingOffers,
      trainingEntities,
      domains,
      themes,
      publics,
    ],
  )
  useEffect(() => {
    aiSearchAbortRef.current?.abort()
    aiSearchAbortRef.current = null
    setAiResultCodes(null)
    setAiRecommendedCodes([])
    setAiComplementaryCodes([])
    setAiSearchStatus('idle')
    setAiSearchReason('')
    setAiSearchError('')
    setShowAiExplanation(false)
  }, [officialSearch])

  const hasTextSearch = officialSearch.trim() !== ''
  const isAiSearchActive =
    aiSearchStatus === 'success' && aiResultCodes !== null

  const localSearchedOfficialCourses = useMemo(
    () => searchCourses(fullCatalogueCourses, officialSearch),
    [officialSearch],
  )

  const aiSearchedOfficialCourses = useMemo(
    () =>
      aiResultCodes === null
        ? null
        : aiResultCodes
            .map((code) => courseByCode.get(code))
            .filter(Boolean),
    [aiResultCodes],
  )

  const searchedOfficialCourses =
    aiSearchedOfficialCourses ?? localSearchedOfficialCourses
  const facetCounts = useMemo(
    () => ({
      sessions: getFacetValueCounts(
        searchedOfficialCourses,
        currentFacetFilters,
        'sessions',
      ),
      offers: getFacetValueCounts(
        searchedOfficialCourses,
        currentFacetFilters,
        'offers',
      ),
      entities: getFacetValueCounts(
        searchedOfficialCourses,
        currentFacetFilters,
        'entities',
      ),
      domains: getFacetValueCounts(
        searchedOfficialCourses,
        currentFacetFilters,
        'domains',
      ),
      themes: getFacetValueCounts(
        searchedOfficialCourses,
        currentFacetFilters,
        'themes',
      ),
      publics: getFacetValueCounts(
        searchedOfficialCourses,
        currentFacetFilters,
        'publics',
      ),
    }),
    [currentFacetFilters, searchedOfficialCourses],
  )

  const displayedOfferOptions = keepAvailableFacetOptions(
    trainingOfferOptions,
    facetCounts.offers,
    trainingOffers,
  )
  const displayedEntityOptions = keepAvailableFacetOptions(
    trainingEntityOptions,
    facetCounts.entities,
    trainingEntities,
  )
  const displayedDomainOptions = keepAvailableFacetOptions(
    domainOptions,
    facetCounts.domains,
    domains,
  )
  const displayedThemeOptions = keepAvailableFacetOptions(
    themeOptions,
    facetCounts.themes,
    themes,
  )
  const displayedPublicOptions = keepAvailableFacetOptions(
    publicOptions,
    facetCounts.publics,
    publics,
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

  useEffect(() => {
    if (!hasCourseSelection) setSessions([])
  }, [hasCourseSelection])

  useEffect(() => {
    const search = serializeCourseSearchState(
      {
        search: officialSearch,
        offers: trainingOffers,
        entities: trainingEntities,
        domains,
        themes,
        publics,
        sort: courseSort,
      },
      fullCatalogueCourses,
    )
    const url = new URL(window.location.href)

    if (url.search.slice(1) === search) return
    url.search = search
    window.history.replaceState(window.history.state, '', url)
  }, [
    courseSort,
    domains,
    officialSearch,
    publics,
    themes,
    trainingEntities,
    trainingOffers,
  ])

  const matchingOfficialCourses = useMemo(
    () =>
      searchedOfficialCourses.filter(
        (course) =>
          matchesCourseSessionFacet(course, sessions) &&
          (trainingOffers.length === 0 ||
            course.catalogueOffers.some((offer) => trainingOffers.includes(offer))) &&
          (trainingEntities.length === 0 ||
            trainingEntities.includes(course.officialData.organizingEntityRaw)) &&
          (domains.length === 0 || domains.includes(course.officialData.domainRaw)) &&
          (themes.length === 0 || themes.includes(course.officialData.themeRaw)) &&
          matchesPublicFacet(course, publics),
      ),
    [
      searchedOfficialCourses,
      sessions,
      trainingOffers,
      trainingEntities,
      domains,
      themes,
      publics,
    ],
  )

  const aiRecommendedCodeSet = useMemo(
    () => new Set(aiRecommendedCodes),
    [aiRecommendedCodes],
  )

  const aiComplementaryCodeSet = useMemo(
    () => new Set(aiComplementaryCodes),
    [aiComplementaryCodes],
  )

  const matchingAiRecommendedCourses = useMemo(
    () =>
      matchingOfficialCourses.filter((course) =>
        aiRecommendedCodeSet.has(course.code),
      ),
    [aiRecommendedCodeSet, matchingOfficialCourses],
  )

  const matchingAiComplementaryCourses = useMemo(
    () =>
      matchingOfficialCourses.filter((course) =>
        aiComplementaryCodeSet.has(course.code),
      ),
    [aiComplementaryCodeSet, matchingOfficialCourses],
  )

  const sortedOfficialCourses = useMemo(
    () =>
      hasTextSearch
        ? matchingOfficialCourses
        : sortCourses(matchingOfficialCourses, courseSort),
    [courseSort, hasTextSearch, matchingOfficialCourses],
  )

  const pageCount = getPageCount(matchingOfficialCourses.length)
  const activePage = Math.min(currentPage, Math.max(1, pageCount))
  const visiblePages = getVisiblePages(activePage, pageCount)
  const paginatedOfficialCourses = getPageResults(
    sortedOfficialCourses,
    activePage,
  )

  useEffect(() => {
    dispatchPagination({ type: 'criteriaChanged' })
  }, [
    officialSearch,
    sessions,
    trainingOffers,
    trainingEntities,
    domains,
    themes,
    publics,
  ])

  const activeOfficialFilters = [
    officialSearch.trim() && {
      key: 'search',
      label: `Recherche : ${officialSearch.trim()}`,
      clear: () => setOfficialSearch(NO_FILTER),
    },
    ...sessions.map((value) => ({
      key: `session-${value}`,
      label: `Sessions : ${value}`,
      clear: () => setSessions((selected) => selected.filter((item) => item !== value)),
    })),
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
    setSessions([])
    setTrainingOffers([])
    setTrainingEntities([])
    setDomains([])
    setThemes([])
    setPublics([])
  }

  function changePage(action) {
    dispatchPagination({ ...action, pageCount })
    resultsHeadingRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function changeCourseSort(event) {
    setCourseSort(event.target.value)
    dispatchPagination({ type: 'sortChanged' })
  }

  return (
    <div
      className={isAiSearchActive ? 'site-shell ai-search-active' : 'site-shell'}
    >
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
          <form
            className="main-search-field"
            onSubmit={(event) => {
              event.preventDefault()
              handleAiSearch()
            }}
          >
            <label htmlFor="catalogue-search">Rechercher une formation</label>

            <div className="main-search-row">
              <input
                id="catalogue-search"
                type="search"
                value={officialSearch}
                onChange={(event) => setOfficialSearch(event.target.value)}
                placeholder="Décrivez votre besoin, recherchez un mot-clé ou un code..."
              />

              {officialSearch.trim() && !isAiSearchActive && (
                <button
                  className="ai-search-button"
                  type="submit"
                  disabled={aiSearchStatus === 'loading'}
                >
                  {aiSearchStatus === 'loading'
                    ? 'Analyse avec l’IA…'
                    : 'Booster ma recherche avec l’IA'}
                </button>
              )}
            </div>

            {aiSearchStatus === 'idle' && hasTextSearch && (
              <p className="classic-search-feedback" role="status">
                Résultats issus de la recherche classique du catalogue.
              </p>
            )}

            {aiSearchStatus === 'error' && (
              <p
                className="ai-search-feedback ai-search-feedback-error"
                role="alert"
              >
                Recherche avec l’IA indisponible. Les résultats de la recherche classique sont conservés.
                {aiSearchError ? ` ${aiSearchError}` : ''}
              </p>
            )}
          </form>
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

        {showAiExplanation && aiSearchStatus === 'success' && (
          <div
            className="ai-explanation-overlay"
            role="presentation"
            onClick={() => setShowAiExplanation(false)}
          >
            <section
              className="ai-explanation-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-explanation-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="ai-explanation-header">
                <div>
                  <span className="search-mode-badge search-mode-badge-ai">
                    <span className="ai-badge-icon" aria-hidden="true">✦</span>
                        Recherche boostée par l’IA
                  </span>
                  <h2 id="ai-explanation-title">
                    Comment votre demande a été interprétée
                  </h2>
                </div>

                <button
                  className="ai-explanation-close"
                  type="button"
                  onClick={() => setShowAiExplanation(false)}
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>

              <p className="ai-explanation-text">
                {aiSearchReason ||
                  'La recherche a été analysée afin de sélectionner les formations les plus pertinentes du catalogue.'}
              </p>

              {!hasCourseSelection && sessions.length === 0 && (
                <div className="ai-explanation-refinement">
                  <h3>Vous souhaitez affiner davantage ?</h3>
                  <p>
                    Utilisez les filtres disponibles pour préciser les résultats
                    par offre de formation, entité de formation, domaine, thème
                    ou public.
                  </p>
                </div>
              )}

              <div className="ai-explanation-actions">
                <button
                  className="ai-explanation-results-button"
                  type="button"
                  onClick={() => setShowAiExplanation(false)}
                  autoFocus
                >
                  Voir les résultats
                </button>
              </div>
            </section>
          </div>
        )}

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

              <section className="filter-section filter-section-courses" aria-labelledby="course-filters-title">
                <header className="filter-section-heading">
                  <h3 id="course-filters-title">Cours</h3>
                  <p>Affiner par caractéristiques de la formation.</p>
                </header>

                <FacetGroup
                  label="Offre de formation"
                help="Catalogue ou offre auxquels la formation est rattachée."
                options={displayedOfferOptions}
                counts={facetCounts.offers}
                selected={trainingOffers}
                onChange={setTrainingOffers}
                searchPlaceholder="Rechercher une offre..."
                />

                <FacetGroup
                label="Entité de formation"
                help="Entité organisatrice indiquée dans la fiche officielle."
                options={displayedEntityOptions}
                counts={facetCounts.entities}
                selected={trainingEntities}
                onChange={setTrainingEntities}
                searchPlaceholder="Rechercher une entité..."
                />

                <FacetGroup
                label="Domaine"
                help="Domaine indiqué dans la fiche officielle."
                options={displayedDomainOptions}
                counts={facetCounts.domains}
                selected={domains}
                onChange={setDomains}
                searchPlaceholder="Rechercher un domaine..."
                disabled={!hasPrimarySelection}
                disabledReason="Sélectionnez d’abord une offre ou une entité."
                />

                <FacetGroup
                label="Thème"
                help="Thème indiqué dans la fiche officielle."
                options={displayedThemeOptions}
                counts={facetCounts.themes}
                selected={themes}
                onChange={setThemes}
                searchPlaceholder="Rechercher un thème..."
                disabled={!hasDomainSelection}
                disabledReason="Sélectionnez d’abord un domaine."
                />

                <FacetGroup
                label="Public"
                help="Public indiqué dans la fiche officielle."
                options={displayedPublicOptions}
                counts={facetCounts.publics}
                selected={publics}
                onChange={setPublics}
                searchPlaceholder="Rechercher un public..."
                disabled={!hasPrimarySelection}
                disabledReason="Sélectionnez d’abord une offre ou une entité."
                />
              </section>

              <section className="filter-section filter-section-sessions" aria-labelledby="session-filters-title">
                <header className="filter-section-heading">
                  <h3 id="session-filters-title">Disponibilité des sessions</h3>
                  <p>Informations de sessions issues de la fiche officielle.</p>
                </header>

                <FacetGroup
                  label="Disponibilité des sessions"
                  options={SESSION_FACET_OPTIONS}
                  counts={facetCounts.sessions}
                  selected={sessions}
                  onChange={setSessions}
                  defaultOpen
                  searchable={false}
                  disabled={!hasCourseSelection}
                  disabledReason="Disponible après sélection de critères de cours."
                  showOptionsWhenDisabled
                  staticDisplay
                />
              </section>

              <button
                className="reset-filters"
                type="button"
                onClick={resetOfficialFilters}
              >
                Réinitialiser les filtres
              </button>
            </aside>

            <div className="official-catalog-results">
              <div className="official-results-heading" ref={resultsHeadingRef}>
                <div className="official-results-toolbar">
                  <div className="results-title-group">
                    <h2 id="official-catalog-heading">
                      {formatFormationCount(matchingOfficialCourses.length)} formation
                      {matchingOfficialCourses.length !== 1 ? 's' : ''} trouvée
                      {matchingOfficialCourses.length !== 1 ? 's' : ''}
                    </h2>

                    {isAiSearchActive && (
                      <button
                        className="search-mode-badge search-mode-badge-ai search-mode-badge-button"
                        type="button"
                        onClick={() => setShowAiExplanation(true)}
                        title="Voir l’interprétation de la recherche IA"
                      >
                        <span className="ai-badge-icon" aria-hidden="true">✦</span>
                        Recherche boostée par l’IA
                      </button>
                    )}
                  </div>
                  {hasTextSearch ? (
                    <div className="course-sort-control">Tri : Pertinence</div>
                  ) : (
                    <label className="course-sort-control">
                      <span>Trier par</span>
                      <select value={courseSort} onChange={changeCourseSort}>
                        {COURSE_SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                {hasTextSearch &&
                  matchingOfficialCourses.length > 1 &&
                  !hasCourseSelection &&
                  sessions.length === 0 && (
                    <p className="results-refinement-hint">
                      Affinez encore ces résultats à l’aide des filtres disponibles.
                    </p>
                  )}

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

              <div
                className={
                  isAiSearchActive
                    ? 'official-results-scroll ai-results-groups'
                    : 'official-results-scroll'
                }
                aria-live="polite"
              >
                {matchingOfficialCourses.length > 0 ? (
                  isAiSearchActive ? (
                    <>
                      {matchingAiRecommendedCourses.length > 0 && (
                        <section className="ai-result-group ai-result-group-primary">
                          <header className="ai-result-group-heading">
                            <h3>
                              {formatFormationCount(matchingAiRecommendedCourses.length)} formation
                              {matchingAiRecommendedCourses.length !== 1 ? 's' : ''} recommandée
                              {matchingAiRecommendedCourses.length !== 1 ? 's' : ''}
                            </h3>
                            <p>
                              Les formations qui répondent le plus directement à votre besoin.
                            </p>
                          </header>

                          {matchingAiRecommendedCourses.map((course) => (
                            <OfficialCourseCard key={course.code} course={course} />
                          ))}
                        </section>
                      )}

                      {matchingAiComplementaryCourses.length > 0 && (
                        <section className="ai-result-group ai-result-group-complementary">
                          <header className="ai-result-group-heading ai-complementary-heading">
                            <span className="ai-complementary-icon" aria-hidden="true">
                              ✦
                            </span>
                            <div>
                              <h3>Pour aller plus loin</h3>
                              <p>
                                Formations complémentaires pour approfondir ou couvrir
                                un besoin plus spécifique.
                              </p>
                            </div>
                          </header>

                          {matchingAiComplementaryCourses.map((course) => (
                            <OfficialCourseCard key={course.code} course={course} />
                          ))}
                        </section>
                      )}
                    </>
                  ) : (
                    paginatedOfficialCourses.map((course) => (
                      <OfficialCourseCard key={course.code} course={course} />
                    ))
                  )
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
              {pageCount > 1 && (
                <nav className="pagination" aria-label="Pagination des formations">
                  <button
                    type="button"
                    onClick={() => changePage({ type: 'previous' })}
                    disabled={activePage === 1}
                  >
                    Précédent
                  </button>
                  <div className="pagination-pages">
                    {visiblePages.map((page) =>
                      typeof page === 'number' ? (
                        <button
                          key={page}
                          type="button"
                          className={page === activePage ? 'is-current' : ''}
                          aria-current={page === activePage ? 'page' : undefined}
                          aria-label={`Page ${page}`}
                          onClick={() => changePage({ type: 'goTo', page })}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={page} className="pagination-ellipsis" aria-hidden="true">
                          …
                        </span>
                      ),
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => changePage({ type: 'next' })}
                    disabled={activePage === pageCount}
                  >
                    Suivant
                  </button>
                </nav>
              )}
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
  counts,
  selected,
  onChange,
  searchPlaceholder,
  defaultOpen = false,
  searchable = true,
  disabled = false,
  disabledReason,
  showOptionsWhenDisabled = false,
  staticDisplay = false,
}) {
  const [optionSearch, setOptionSearch] = useState('')
  const [isOpen, setIsOpen] = useState(defaultOpen)

  function toggleOption(value) {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  const filteredOptions = searchable ? filterFacetOptions(options, optionSearch) : options

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

  const facetContent = (
    <div className="facet-dropdown">
      {help && <p className="field-help">{help}</p>}
      {disabled && <p className="facet-status">{disabledReason}</p>}
      {searchable && (
        <input
          className="facet-search"
          type="search"
          value={optionSearch}
          onChange={(event) => setOptionSearch(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={`Rechercher dans la facette ${label}`}
        />
      )}
      <div className="facet-options" role="group" aria-label={label}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <label key={option} className="facet-option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                disabled={disabled}
                onChange={() => toggleOption(option)}
              />
              <span className="facet-option-label">{option}</span>
              <span
                className="facet-option-count"
                aria-label={`${formatFormationCount(counts.get(option) ?? 0)} formations`}
              >
                {formatFormationCount(counts.get(option) ?? 0)}
              </span>
            </label>
          ))
        ) : (
          <p className="facet-empty-search">Aucune valeur trouvée</p>
        )}
      </div>
    </div>
  )

  if (staticDisplay) {
    return (
      <div className={`facet facet-static${disabled ? ' is-disabled' : ''}`}>
        {facetContent}
      </div>
    )
  }

  if (disabled && !showOptionsWhenDisabled) {
    return (
      <div className="facet is-disabled" aria-disabled="true">
        <div className="facet-trigger">{triggerContent}</div>
        <p className="facet-status">{disabledReason}</p>
      </div>
    )
  }

  return (
    <details
      className={`facet${disabled ? ' is-disabled' : ''}`}
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="facet-trigger">{triggerContent}</summary>
      {facetContent}
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
        <p className="official-course-code">
          <strong>{course.code}</strong>
        </p>
        <h3>{course.officialData.titleRaw ?? unavailable}</h3>
        {(course.officialData.hasOpenSession || course.officialData.hasScheduledSession) && (
          <div className="course-session-statuses" aria-label="Statut des sessions">
            {course.officialData.hasOpenSession && (
              <span className="course-session-status is-open">
                <span aria-hidden="true">●</span>
                Inscriptions ouvertes
              </span>
            )}
            {course.officialData.hasScheduledSession && (
              <span className="course-session-status is-scheduled">
                <span aria-hidden="true">◷</span>
                Ouverture programmée
              </span>
            )}
          </div>
        )}
      </div>
      <div className="official-course-offers">
        <h4>Offre</h4>
        <ul>
          {course.catalogueOffers.map((offer) => (
            <li key={offer}>{offer}</li>
          ))}
        </ul>
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
      <div className="official-course-card-action">
        <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">
          Voir la formation <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default App
