import { useRef, useState } from 'react'
import { buildPathway } from '../services/pathwayAssistantApi.js'

const INITIAL_PROFILE = {
  personnelCategory: '',
  entity: '',
  managerStatus: '',
  role: '',
  objective: '',
  existingSkills: '',
  timeAvailable: '',
  constraints: '',
}

function CourseSteps({ items, emptyMessage, categoryLabel }) {
  if (!items?.length) return <p className="pathway-empty">{emptyMessage}</p>

  return (
    <ol className="pathway-course-list">
      {items.map((item) => (
        <li key={item.course.code} className="pathway-course-card">
          <div className="pathway-course-heading">
            <span className="pathway-course-position">{item.position}</span>
            <div>
              <span className="pathway-course-code">{item.course.code}</span>
              <h4>{item.course.title}</h4>
              {categoryLabel && (
                <span className="pathway-course-category">{categoryLabel}</span>
              )}
            </div>
          </div>
          <p>{item.rationale}</p>
          <dl>
            {item.course.duration && (
              <div><dt>Durée</dt><dd>{item.course.duration}</dd></div>
            )}
            {item.course.public && (
              <div><dt>Public</dt><dd>{item.course.public}</dd></div>
            )}
          </dl>
          {item.course.sourceUrl && (
            <a href={item.course.sourceUrl} target="_blank" rel="noreferrer">
              Voir la formation ↗
            </a>
          )}
        </li>
      ))}
    </ol>
  )
}

export default function PathwayAssistant({ onClose }) {
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [status, setStatus] = useState('form')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const abortRef = useRef(null)

  function update(field) {
    return (event) => {
      const value = event.target.value
      setProfile((current) => ({ ...current, [field]: value }))
      setValidationErrors((current) => {
        if (!current[field]) return current
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  function close() {
    abortRef.current?.abort()
    onClose()
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = {}

    if (!profile.personnelCategory) {
      nextErrors.personnelCategory = 'Sélectionnez votre catégorie de personnel.'
    }
    if (!profile.role.trim()) {
      nextErrors.role = 'Décrivez brièvement votre fonction ou votre situation.'
    }
    if (!profile.objective.trim()) {
      nextErrors.objective = 'Indiquez l’objectif professionnel recherché.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors)
      const firstField = Object.keys(nextErrors)[0]
      document.getElementById(`pathway-${firstField}`)?.focus()
      return
    }

    setValidationErrors({})
    const controller = new AbortController()
    abortRef.current = controller
    setStatus('loading')
    setError('')

    try {
      const data = await buildPathway(profile, { signal: controller.signal })
      if (controller.signal.aborted) return
      setResult(data)
      setStatus('result')
    } catch (requestError) {
      if (requestError?.name === 'AbortError') return
      setError(requestError instanceof Error
        ? requestError.message
        : 'L’assistant est momentanément indisponible.')
      setStatus('error')
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  return (
    <div className="pathway-overlay" role="presentation" onClick={close}>
      <section
        className="pathway-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pathway-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="pathway-header">
          <div>
            <span className="pathway-kicker">Assistant de parcours</span>
            <h2 id="pathway-title">Construire mon parcours de formation</h2>
            <p>Décrivez votre situation : l’assistant proposera un ordre réaliste à partir du catalogue.</p>
          </div>
          <button type="button" className="pathway-close" onClick={close} aria-label="Fermer">×</button>
        </header>

        {status !== 'result' ? (
          <form className="pathway-form" onSubmit={submit} noValidate>
            <p className="pathway-required-note">Les champs marqués d’un * sont obligatoires.</p>
            <div className="pathway-form-grid">
              <label>
                <span>Catégorie de personnel *</span>
                <select id="pathway-personnelCategory" required value={profile.personnelCategory} onChange={update('personnelCategory')} aria-invalid={Boolean(validationErrors.personnelCategory)} aria-describedby={validationErrors.personnelCategory ? 'pathway-personnelCategory-error' : undefined}>
                  <option value="" disabled>À renseigner</option>
                  <option value="PAT">PAT — Personnel administratif et technique</option>
                  <option value="PE">PE — Personnel enseignant</option>
                  <option value="PU Police">Personnel en uniforme — Police</option>
                  <option value="PU Prison">Personnel en uniforme — Prison</option>
                  <option value="PJ">Personnel du Pouvoir judiciaire</option>
                </select>
                {validationErrors.personnelCategory && <small id="pathway-personnelCategory-error" className="pathway-field-error">{validationErrors.personnelCategory}</small>}
              </label>
              <label>
                <span>Entité ou service <small>(facultatif)</small></span>
                <input value={profile.entity} onChange={update('entity')} maxLength={120} placeholder="Par exemple : OPE, DIP, Police…" />
              </label>
              <label>
                <span>Situation managériale <small>(facultatif)</small></span>
                <select value={profile.managerStatus} onChange={update('managerStatus')}>
                  <option value="">Non précisée</option>
                  <option value="Nouveau manager">Nouveau manager</option>
                  <option value="Manager expérimenté">Manager expérimenté</option>
                  <option value="Sans responsabilité managériale">Sans responsabilité managériale</option>
                </select>
              </label>
              <label>
                <span>Fonction ou situation *</span>
                <textarea id="pathway-role" required value={profile.role} onChange={update('role')} maxLength={300} placeholder="Par exemple : chef de projet IT" rows={2} aria-invalid={Boolean(validationErrors.role)} aria-describedby={validationErrors.role ? 'pathway-role-help pathway-role-error' : 'pathway-role-help'} />
                <small id="pathway-role-help" className="pathway-field-help">Votre métier, votre mission ou la situation professionnelle concernée.</small>
                {validationErrors.role && <small id="pathway-role-error" className="pathway-field-error">{validationErrors.role}</small>}
              </label>
            </div>

            <label>
              <span>Quel est votre objectif professionnel ? *</span>
              <textarea id="pathway-objective" required value={profile.objective} onChange={update('objective')} maxLength={1000} rows={3} aria-invalid={Boolean(validationErrors.objective)} aria-describedby={validationErrors.objective ? 'pathway-objective-help pathway-objective-error' : 'pathway-objective-help'} />
              <small id="pathway-objective-help" className="pathway-field-help">Décrivez ce que vous souhaitez savoir faire après la formation.</small>
              {validationErrors.objective && <small id="pathway-objective-error" className="pathway-field-error">{validationErrors.objective}</small>}
            </label>
            <label>
              <span>Quelles compétences possédez-vous déjà ?</span>
              <textarea value={profile.existingSkills} onChange={update('existingSkills')} maxLength={1000} rows={2} />
              <small className="pathway-field-help">Indiquez les connaissances ou expériences déjà acquises pour éviter les propositions trop élémentaires.</small>
            </label>
            <div className="pathway-form-grid">
              <label>
                <span>Temps disponible</span>
                <input value={profile.timeAvailable} onChange={update('timeAvailable')} maxLength={300} placeholder="Par exemple : maximum 5 jours" />
                <small className="pathway-field-help">Ce temps sert de repère : les formations pertinentes peuvent rester proposées au-delà.</small>
              </label>
              <label>
                <span>Contraintes ou préférences</span>
                <textarea value={profile.constraints} onChange={update('constraints')} maxLength={1000} placeholder="À distance, sans programmation…" rows={4} />
                <small className="pathway-field-help">Précisez vos préférences de format, prérequis, accessibilité ou organisation.</small>
              </label>
            </div>

            {status === 'error' && (
              <p className="pathway-error" role="alert">
                L’assistant est indisponible. La recherche directe reste utilisable. {error}
              </p>
            )}

            {status === 'loading' && (
              <div className="pathway-loading" role="status" aria-live="polite">
                <span className="pathway-loading-spinner" aria-hidden="true" />
                <div>
                  <strong>Construction de votre parcours…</strong>
                  <p>Analyse du besoin · Recherche des formations pertinentes · Organisation des étapes</p>
                </div>
              </div>
            )}

            <div className="pathway-actions">
              <button type="button" className="pathway-secondary" onClick={close}>Retour à la recherche directe</button>
              <button type="submit" className="pathway-primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Construction du parcours…' : 'Construire mon parcours'}
              </button>
            </div>
          </form>
        ) : (
          <div className="pathway-result">
            <section className="pathway-request-recap" aria-labelledby="pathway-request-title">
              <div className="pathway-request-heading">
                <h3 id="pathway-request-title">Votre demande</h3>
                <button type="button" onClick={() => setStatus('form')}>Modifier</button>
              </div>
              <dl>
                <div><dt>Profil</dt><dd>{profile.personnelCategory}{profile.entity ? ` — ${profile.entity}` : ''}</dd></div>
                {profile.managerStatus && <div><dt>Situation</dt><dd>{profile.managerStatus}</dd></div>}
                <div><dt>Fonction</dt><dd>{profile.role}</dd></div>
                <div><dt>Objectif</dt><dd>{profile.objective}</dd></div>
                {profile.existingSkills && <div><dt>Compétences</dt><dd>{profile.existingSkills}</dd></div>}
                {profile.timeAvailable && <div><dt>Temps disponible</dt><dd>{profile.timeAvailable}</dd></div>}
                {profile.constraints && <div><dt>Contraintes</dt><dd>{profile.constraints}</dd></div>}
              </dl>
            </section>

            <div className="pathway-summary">
              <h3>Votre parcours recommandé</h3>
              <p>{result.summary}</p>
              {result.durationSummary?.budgetHours !== null && (
                <p className="pathway-duration">
                  Durée recommandée : {result.durationSummary.recommendedHours} h
                  {' '}sur {result.durationSummary.budgetHours} h disponibles
                  {result.durationSummary.excessHours > 0 && (
                    <> — dépassement de {result.durationSummary.excessHours} h</>
                  )}
                </p>
              )}
            </div>

            <CourseSteps items={result.recommendedSteps ?? result.steps} emptyMessage="Aucun parcours suffisamment fiable n’a été identifié." categoryLabel="Recommandée" />

            {result.optionalSteps?.length > 0 && (
              <details className="pathway-details">
                <summary>Compléments possibles ({result.optionalSteps.length})</summary>
                <CourseSteps items={result.optionalSteps} categoryLabel="Complément" />
              </details>
            )}

            {result.informationalCourses?.length > 0 && (
              <details className="pathway-details">
                <summary>Formations proposées pour information ({result.informationalCourses.length})</summary>
                <p className="pathway-information-note">Ces formations sont pertinentes, mais leur public ne correspond pas directement à votre profil.</p>
                <CourseSteps items={result.informationalCourses} categoryLabel="Pour information — public différent" />
              </details>
            )}

            {result.gaps?.length > 0 && (
              <details className="pathway-details pathway-gaps">
                <summary>Limites du catalogue</summary>
                <ul>{result.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
              </details>
            )}

            <p className="pathway-ai-notice" role="note">
              <strong>Information</strong> — Ce parcours est proposé avec l’aide de l’intelligence artificielle à partir des informations disponibles dans le catalogue. L’IA peut commettre des erreurs. En cas de doute, vérifiez la fiche de la formation ou adressez-vous à votre responsable hiérarchique ou à votre service RH.
            </p>

            <div className="pathway-actions">
              <button type="button" className="pathway-secondary" onClick={() => setStatus('form')}>Modifier mon besoin</button>
              <button type="button" className="pathway-primary" onClick={close}>Terminer</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
