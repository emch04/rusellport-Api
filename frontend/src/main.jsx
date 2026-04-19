import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexte/AuthContext'
import './styles/index.css'

/**
 * Point d'entrée principal de l'application React.
 * Configure les fournisseurs globaux (Router, AuthContext) et monte l'application.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Gestionnaire de routage pour l'application SPA */}
    <BrowserRouter>
      {/* Fournisseur de l'état d'authentification global */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
