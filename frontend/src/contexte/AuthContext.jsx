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
   * Il vérifie s'il existe une session active côté backend en appelant l'API.
   * Cela permet de restaurer l'état de l'utilisateur après un rafraîchissement.
   */
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
      } catch (err) {
        // Pas d'erreur à afficher, l'utilisateur n'est simplement pas connecté
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
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
      const { user: userData } = response.data;

      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur de connexion";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  /**
   * Fonction de déconnexion. Demande au backend de détruire la session.
   */
  const logout = useCallback(async () => {
    try {
      // Demande au backend de détruire la session
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
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
