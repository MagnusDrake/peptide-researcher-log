import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register PWA service worker with auto update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available, ready to refresh.')
  },
  onOfflineReady() {
    console.log('PeptideLog is ready for offline research use.')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
