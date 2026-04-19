import { useState, useCallback } from 'react'
import api from '../services/api'

/**
 * Hook personnalisé pour simplifier les appels à l'API.
 * Gère automatiquement l'état de chargement (loading) et les erreurs.
 * 
 * @returns {Object} Un objet contenant l'état et les méthodes (get, post, put, del)
 */
export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fonction générique pour effectuer une requête HTTP.
   * @param {string} method - Méthode HTTP (GET, POST, etc.)
   * @param {string} url - Point d'accès de l'API
   * @param {Object} data - Corps de la requête (optionnel)
   */
  const request = useCallback(async (method, url, data = null) => {
    setLoading(true)
    setError(null)
    
    try {
      const config = { method, url }
      if (data) {
        config.data = data
      }
      
      const response = await api(config)
      return { success: true, data: response.data }
    } catch (err) {
      // Extraction du message d'erreur renvoyé par le backend
      const message = err.response?.data?.message || 'Une erreur est survenue'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Raccourcis pour les méthodes HTTP courantes
  const get = useCallback((url) => request('GET', url), [request])
  const post = useCallback((url, data) => request('POST', url, data), [request])
  const put = useCallback((url, data) => request('PUT', url, data), [request])
  const del = useCallback((url) => request('DELETE', url), [request])

  /**
   * Efface l'erreur actuelle.
   */
  const clearError = useCallback(() => setError(null), [])

  return { loading, error, get, post, put, del, clearError }
}
