import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sales-room.css'
import SalesRoom from './SalesRoom.tsx'

// ── DIGITAL SALES ROOM MODE ──
// Full operator app preserved in App.tsx — restore anytime:
// import './index.css' + import App from './App.tsx'
// To restore coming soon: import './coming-soon.css' + import ComingSoon from './ComingSoon.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SalesRoom />
  </StrictMode>,
)
