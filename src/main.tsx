import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sales-room.css'
import SalesRoom from './SalesRoom.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SalesRoom />
  </StrictMode>,
)
