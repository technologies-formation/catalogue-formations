import { useRef, useState } from 'react'
import { buildPathway } from '../services/pathwayAssistantApi.js'

const INITIAL_PROFILE = {
  personnelCategory: 'PAT',
  entity: '',
  managerStatus: '',
  role: '',
  objective: '',
  existingSkills: '',
  timeAvailable: '',
  constraints: '',
}

function CourseSteps({ items, emptyMessage }) {
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
  const abortRef = useRef(null)

  function update(field) {
    return (event) => setProfile((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  function close() {
    abortRef.current?.abort()
    onClose()
  }

  async function submit(event) {
    event.preventDefault()
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
          <form className="pathway-form" onSubmit={submit}>
            <div className="pathway-form-grid">
              <label>
                <span>Catégorie de personnel</span>
                <select value={profile.personnelCategory} onChange={update('personnelCategory')}>
                  <option value="PAT">PAT — Personnel administratif et technique</option>
                  <option value="PE">PE — Personnel enseignant</option>
                  <option value="PU Police">Personnel en uniforme — Police</option>
                  <option value="PU Prison">Personnel en uniforme — Prison</option>
                  <option value="PJ">Personnel du Pouvoir judiciaire</option>
                </select>
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
                <input required value={profile.role} onChange={update('role')} maxLength={300} placeholder="Par exemple : chef de projet IT" />
              </label>
            </div>

            <label>
              <span>Quel est votre objectif professionnel ? *</span>
              <textarea required value={profile.objective} onChange={update('objective')} maxLength={1000} rows={3} />
            </label>
            <label>
              <span>Quelles compétences possédez-vous déjà ?</span>
              <textarea value={profile.existingSkills} onChange={update('existingSkills')} maxLength={1000} rows={2} />
            </label>
            <div className="pathway-form-grid">
              <label>
                <span>Temps disponible</span>
                <input value={profile.timeAvailable} onChange={update('timeAvailable')} maxLength={300} placeholder="Par exemple : maximum 5 jours" />
              </label>
              <label>
                <span>Contraintes ou préférences</span>
                <input value={profile.constraints} onChange={update('constraints')} maxLength={1000} placeholder="À distance, sans programmation…" />
              </label>
            </div>

            {status === 'error' && (
              <p className="pathway-error" role="alert">
                L’assistant est indisponible. La recherche directe reste utilisable. {error}
              </p>
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
                </p>
              )}
            </div>

            <CourseSteps items={result.recommendedSteps ?? result.steps} emptyMessage="Aucun parcours suffisamment fiable n’a été identifié." />

            {result.optionalSteps?.length > 0 && (
              <details className="pathway-details">
                <summary>Compléments possibles ({result.optionalSteps.length})</summary>
                <CourseSteps items={result.optionalSteps} />
              </details>
            )}

            {result.informationalCourses?.length > 0 && (
              <details className="pathway-details">
                <summary>Formations proposées pour information ({result.informationalCourses.length})</summary>
                <p className="pathway-information-note">Ces formations sont pertinentes, mais leur public ne correspond pas directement à votre profil.</p>
                <CourseSteps items={result.informationalCourses} />
              </details>
            )}

            {result.gaps?.length > 0 && (
              <details className="pathway-details pathway-gaps">
                <summary>Limites du catalogue</summary>
                <ul>{result.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
              </details>
            )}

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
