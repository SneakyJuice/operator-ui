import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sales-room.css'
import SalesRoom from './SalesRoom.tsx'

// ── DIGITAL SALES ROOM MODE ──
// Replacing the Coming Soon placeholder with the Sun Life DSR.
// To restore full app: import './index.css' + import App from './App.tsx'
// To restore coming soon: import './coming-soon.css' + import ComingSoon from './ComingSoon.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SalesRoom />
  </StrictMode>,
)
