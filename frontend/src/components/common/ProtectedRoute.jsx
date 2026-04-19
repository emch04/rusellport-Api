import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loading from './Loading'

/**
 * Composant Wrapper pour sécuriser l'accès aux routes privées.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page d'accueil.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Les composants à afficher si l'accès est autorisé
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Affichage d'un écran de chargement pendant la vérification de l'état d'authentification
  if (loading) {
    return <Loading text="Vérification de l'authentification..." />
  }

  // Redirection vers l'accueil si non authentifié, tout en gardant en mémoire la page demandée
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Si authentifié, affiche les composants enfants
  return children
}

export default ProtectedRoute
