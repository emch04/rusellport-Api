import axios from "axios";

/**
 * Configuration de l'instance Axios pour les appels API.
 * Le baseURL '/api' est redirigé vers le backend par le proxy de Vite.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Intercepteur de requête : ajoute le token JWT si présent
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Intercepteur de réponse pour gérer globalement les erreurs.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
