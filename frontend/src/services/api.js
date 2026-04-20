import axios from "axios";

/**
 * Configuration de l'instance Axios pour les appels API.
 * Le baseURL '/api' est redirigé vers le backend par le proxy de Vite.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Utilise la variable d'environnement en prod, sinon le proxy Vite en local
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Permet l'envoi des cookies de session si nécessaire
});

/**
 * Intercepteur de réponse pour gérer globalement les erreurs.
 * Si le serveur renvoie un code 401 (Non autorisé), on déconnecte l'utilisateur localement.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le serveur renvoie un 401 (session expirée ou invalide)
    // et que nous ne sommes pas déjà sur la page d'accueil,
    // on redirige l'utilisateur vers la page de connexion.
    if (error.response?.status === 401 && window.location.pathname !== "/") {
      // La redirection déclenchera une ré-évaluation du AuthContext
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
