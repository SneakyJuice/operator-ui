import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './sales-room.css'
import SalesRoom from './SalesRoom.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SalesRoom />
  </StrictMode>,
)
