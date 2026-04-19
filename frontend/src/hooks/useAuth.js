import { useContext } from 'react'
import { AuthContext } from '../contexte/AuthContext'

/**
 * Hook personnalisé pour accéder facilement au contexte d'authentification.
 * @returns {Object} Les données utilisateur et les fonctions login/logout.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  // Sécurité : Vérifie que le hook est bien utilisé à l'intérieur d'un AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
