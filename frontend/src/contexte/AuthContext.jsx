import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

/**
 * Contexte d'authentification pour l'application.
 * Permet de partager l'état de l'utilisateur et les fonctions de connexion/déconnexion
 * dans toute l'arborescence des composants.
 */
export const AuthContext = createContext(null);

/**
 * Fournisseur du contexte d'authentification.
 * Gère la persistance de la session et les appels API liés à l'authentification.
 */
export function AuthProvider({ children }) {
  // État stockant les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);
  // État indiquant si l'authentification est en cours de chargement (vérification du token)
  const [loading, setLoading] = useState(true);
  // État stockant les erreurs éventuelles liées à l'authentification
  const [error, setError] = useState(null);

  /**
   * Effet exécuté au premier montage de l'application.
   * Il vérifie si une session (token) est présente dans le localStorage 
   * pour restaurer l'état de l'utilisateur après un rafraîchissement de la page.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Injection systématique du token dans les en-têtes des futures requêtes API
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  /**
   * Fonction de connexion.
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Object} - Résultat de l'opération { success: boolean, error?: string }
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token } = response.data;

      // Persistance des données dans le localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      
      // Mise à jour de l'instance API pour inclure le nouveau token
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur de connexion";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  /**
   * Fonction de déconnexion.
   * Nettoie le localStorage et réinitialise l'état de l'application.
   */
  const logout = useCallback(async () => {
    try {
      // Notification optionnelle au backend pour la déconnexion
      await api.get("/auth/logout");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      // Nettoyage impératif des données de session côté client
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, []);

  /**
   * Réinitialise l'état d'erreur.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Objet de valeur exposé par le contexte
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
