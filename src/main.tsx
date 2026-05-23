import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './coming-soon.css'
import ComingSoon from './ComingSoon.tsx'

// ── COMING SOON MODE ──
// The operator platform is temporarily disabled pending the June 18 demo.
// To re-enable the full app, swap the import/component below back to App.
// import './index.css'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComingSoon />
  </StrictMode>,
)
