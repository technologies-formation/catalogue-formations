import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { entities } from './config/entities.js'
import { personnelCategories } from './config/personnelCategories.js'
import { fullCatalogueCourses } from './data/fullCatalogueCourses.js'
import { getFilteredOfficialCourses } from './domain/officialCourseSelection.js'

const NO_FILTER = ''
const LONG_AUDIENCE_THRESHOLD = 220

const officialOrganizers = [
  ...new Set(
    fullCatalogueCourses
      .map((course) => course.officialData.organizingEntityRaw)
      .filter((organizer) => organizer !== null),
  ),
]

function App() {
  const [officialSearch, setOfficialSearch] = useState(NO_FILTER)
  const [officialPersonnelCategory, setOfficialPersonnelCategory] =
    useState(NO_FILTER)
  const [officialEntity, setOfficialEntity] = useState(NO_FILTER)
  const [officialDomain, setOfficialDomain] = useState(NO_FILTER)
  const [officialOrganizer, setOfficialOrganizer] = useState(NO_FILTER)
  const [showGettingStarted, setShowGettingStarted] = useState(true)

  const hasDomainPrerequisite = Boolean(
    officialSearch.trim() ||
      officialPersonnelCategory ||
      officialEntity ||
      officialOrganizer,
  )

  const coursesWithoutDomain = useMemo(
    () =>
      getFilteredOfficialCourses(fullCatalogueCourses, {
        search: officialSearch,
        personnelCategory: officialPersonnelCategory,
        entity: officialEntity,
        domain: NO_FILTER,
        organizingEntity: officialOrganizer,
      }),
    [
      officialEntity,
      officialOrganizer,
      officialPersonnelCategory,
      officialSearch,
    ],
  )

  const availableOfficialDomains = useMemo(
    () => [
      ...new Set(
        coursesWithoutDomain
          .map((course) => course.officialData.domainRaw)
          .filter((domainValue) => domainValue !== null),
      ),
    ],
    [coursesWithoutDomain],
  )

  useEffect(() => {
    if (
      officialDomain &&
      (!hasDomainPrerequisite ||
        !availableOfficialDomains.includes(officialDomain))
    ) {
      setOfficialDomain(NO_FILTER)
    }
  }, [availableOfficialDomains, hasDomainPrerequisite, officialDomain])

  const matchingOfficialCourses = useMemo(
    () =>
      getFilteredOfficialCourses(fullCatalogueCourses, {
        search: officialSearch,
        personnelCategory: officialPersonnelCategory,
        entity: officialEntity,
        domain: officialDomain,
        organizingEntity: officialOrganizer,
      }),
    [
      officialDomain,
      officialEntity,
      officialOrganizer,
      officialPersonnelCategory,
      officialSearch,
    ],
  )

  const activeOfficialFilters = [
    officialSearch.trim() && {
      key: 'search',
      label: `Recherche : ${officialSearch.trim()}`,
      clear: () => setOfficialSearch(NO_FILTER),
    },
    officialPersonnelCategory && {
      key: 'category',
      label: officialPersonnelCategory,
      clear: () => setOfficialPersonnelCategory(NO_FILTER),
    },
    officialEntity && {
      key: 'entity',
      label:
        entities.find((item) => item.id === officialEntity)?.label ??
        officialEntity,
      clear: () => setOfficialEntity(NO_FILTER),
    },
    officialDomain && {
      key: 'domain',
      label: officialDomain,
      clear: () => setOfficialDomain(NO_FILTER),
    },
    officialOrganizer && {
      key: 'organizer',
      label: officialOrganizer,
      clear: () => setOfficialOrganizer(NO_FILTER),
    },
  ].filter(Boolean)

  function resetOfficialFilters() {
    setOfficialSearch(NO_FILTER)
    setOfficialPersonnelCategory(NO_FILTER)
    setOfficialEntity(NO_FILTER)
    setOfficialDomain(NO_FILTER)
    setOfficialOrganizer(NO_FILTER)
  }

  return (
    <div className="site-shell">
      <main>
        <section className="search-hero" aria-labelledby="page-title">
          <div className="search-hero-topbar">
            <div className="institutional-identity">
              <div className="brand-mark" aria-hidden="true">GE</div>
              <div className="institutional-wordmark">
                <span className="brand-name">RÉPUBLIQUE ET CANTON DE GENÈVE</span>
                <span className="brand-service">Formation du personnel</span>
              </div>
              <div className="application-identity">
                <h1 id="page-title">Outil de recherche</h1>
                <span className="application-subtitle">
                  En lien avec l’espace de formation de l’État de Genève
                </span>
              </div>
            </div>
            <button
              className="help-button"
              type="button"
              onClick={() => setShowGettingStarted(true)}
            >
              Aide
            </button>
          </div>
          <label className="main-search-field">
            <span>Rechercher dans le catalogue</span>
            <input
              type="search"
              value={officialSearch}
              onChange={(event) => setOfficialSearch(event.target.value)}
              placeholder="Rechercher une formation, un mot-clé, un code..."
            />
          </label>
          <p className="search-examples">
            Exemples : communication, projet, intelligence artificielle, FP173...
          </p>
          <p className="prototype-note">
            Catalogue importé — {fullCatalogueCourses.length} formations uniques.
            {' '}Prototype de démonstration — ne remplace pas le catalogue officiel.
          </p>
        </section>

        {showGettingStarted && (
          <section className="getting-started" aria-labelledby="getting-started-title">
            <div>
              <h2 id="getting-started-title">Premiers pas</h2>
              <p>
                Utilisez la recherche ci-dessus ou les filtres pour trouver les
                formations qui correspondent à votre situation professionnelle
                et à vos besoins.
              </p>
              <p>Les résultats s’adaptent automatiquement à vos choix.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowGettingStarted(false)}
              aria-label="Fermer l’aide Premiers pas"
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

              <ReferenceSelect
                label="Catégorie de personnel"
                help="Votre catégorie professionnelle."
                emptyLabel="Toutes les catégories"
                value={officialPersonnelCategory}
                options={personnelCategories}
                onChange={setOfficialPersonnelCategory}
              />

              <ReferenceSelect
                label="Appartenance"
                help="L’entité dans laquelle vous travaillez."
                emptyLabel="Toutes les entités"
                value={officialEntity}
                options={entities}
                onChange={setOfficialEntity}
              />

              <p className="targeting-coverage-note">
                Le ciblage par catégorie de personnel et appartenance est
                progressivement enrichi. Certaines formations peuvent ne pas
                apparaître lorsque ces filtres sont utilisés.
              </p>

              <label className="field">
                <span>Entité organisatrice</span>
                <small className="field-help">L’entité qui propose la formation.</small>
                <select
                  value={officialOrganizer}
                  onChange={(event) => setOfficialOrganizer(event.target.value)}
                >
                  <option value={NO_FILTER}>Tous les organisateurs</option>
                  {officialOrganizers.map((organizer) => (
                    <option key={organizer} value={organizer}>
                      {organizer}
                    </option>
                  ))}
                </select>
              </label>

              <label className={`field ${!hasDomainPrerequisite ? 'is-disabled' : ''}`}>
                <span>Domaine de formation</span>
                {!hasDomainPrerequisite && (
                  <small className="field-help">
                    Sélectionnez d’abord un autre critère.
                  </small>
                )}
                <select
                  value={officialDomain}
                  onChange={(event) => setOfficialDomain(event.target.value)}
                  disabled={!hasDomainPrerequisite}
                >
                  <option value={NO_FILTER}>
                    {hasDomainPrerequisite
                      ? 'Tous les domaines disponibles'
                      : 'Sélectionnez d’abord un autre critère'}
                  </option>
                  {availableOfficialDomains.map((domainValue) => (
                    <option key={domainValue} value={domainValue}>
                      {domainValue}
                    </option>
                  ))}
                </select>
              </label>

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
                  {matchingOfficialCourses.length} formation
                  {matchingOfficialCourses.length !== 1 ? 's' : ''} trouvée
                  {matchingOfficialCourses.length !== 1 ? 's' : ''}
                </h2>
                <p>
                  Catalogue importé : {fullCatalogueCourses.length} formations uniques
                </p>
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

function ReferenceSelect({ label, help, emptyLabel, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      {help && <small className="field-help">{help}</small>}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value={NO_FILTER}>{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.id} — {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function OfficialCourseCard({ course }) {
  const unavailable = 'Information officielle non disponible'
  const targetAudience = course.officialData.targetAudienceRaw
  const hasLongTargetAudience =
    typeof targetAudience === 'string' &&
    targetAudience.length > LONG_AUDIENCE_THRESHOLD

  return (
    <article className="official-course-card">
      <div className="official-course-card-heading">
        <h3>{course.officialData.titleRaw ?? unavailable}</h3>
        <p className="official-course-code">Code {course.code}</p>
      </div>
      <dl>
        <div className="official-course-domain">
          <dt>Domaine</dt>
          <dd>{course.officialData.domainRaw ?? unavailable}</dd>
        </div>
        <div>
          <dt>Entité organisatrice</dt>
          <dd>{course.officialData.organizingEntityRaw ?? unavailable}</dd>
        </div>
        <div>
          <dt>Public</dt>
          <dd>{course.officialData.publicRaw ?? unavailable}</dd>
        </div>
        <div className="official-course-target-audience">
          <dt>Public visé</dt>
          <dd>
            {hasLongTargetAudience ? (
              <details className="target-audience-details">
                <summary>Afficher le public visé</summary>
                <p>{targetAudience}</p>
              </details>
            ) : (
              targetAudience ?? unavailable
            )}
          </dd>
        </div>
      </dl>
      <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">
        Voir la fiche officielle <span aria-hidden="true">↗</span>
      </a>
    </article>
  )
}

export default App
