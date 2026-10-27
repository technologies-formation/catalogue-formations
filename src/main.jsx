import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadCatalogue } from './services/catalogueApi.js'

const { courses, snapshotDate } = await loadCatalogue()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App courses={courses} catalogueDate={snapshotDate} />
  </StrictMode>,
)
