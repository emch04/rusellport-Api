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
  // Initialisation à partir du localStorage pour éviter le flash au chargement
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token } = response.data;

      // Sauvegarde du token et des infos
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur de connexion";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
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
