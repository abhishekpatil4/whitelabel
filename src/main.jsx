import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ResponsiveMessage from './components/ResponsiveMessage.jsx'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider maxSnack={3}>
      <ResponsiveMessage />
      <App />
    </SnackbarProvider>
  </StrictMode>
)
