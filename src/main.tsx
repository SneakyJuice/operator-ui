import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ── FULL OPERATOR APP MODE ──
// DSR preserved in SalesRoom.tsx + sales-room.css — restore anytime:
// import './sales-room.css' + import SalesRoom from './SalesRoom.tsx'
// To restore coming soon: import './coming-soon.css' + import ComingSoon from './ComingSoon.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
