import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadCatalogueCourses } from './services/catalogueApi.js'

const courses = await loadCatalogueCourses()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App courses={courses} />
  </StrictMode>,
)
