import axios from 'axios'

/**
 * Configuration de l'instance Axios pour les appels API.
 * Le baseURL '/api' est redirigé vers le backend par le proxy de Vite.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Permet l'envoi des cookies de session si nécessaire
})

/**
 * Intercepteur de réponse pour gérer globalement les erreurs.
 * Si le serveur renvoie un code 401 (Non autorisé), on déconnecte l'utilisateur localement.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Nettoyage des données de session en cas d'expiration du token
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/' // Redirection vers la page d'accueil/connexion
    }
    return Promise.reject(error)
  }
)

export default api
