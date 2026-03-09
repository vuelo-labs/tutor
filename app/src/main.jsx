import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ThinkFirstEngine from './ThinkFirstEngine'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThinkFirstEngine />
  </StrictMode>,
)
