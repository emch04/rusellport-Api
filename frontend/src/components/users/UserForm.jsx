import { useState, useEffect } from 'react'
import { FaSave, FaTimes, FaLock } from 'react-icons/fa'

/**
 * Formulaire de gestion des utilisateurs (Création / Édition).
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Données initiales pour l'édition
 * @param {Function} props.onSubmit - Action de soumission vers l'API
 * @param {Function} props.onCancel - Action d'annulation
 * @param {boolean} props.loading - État de chargement du bouton
 */
function UserForm({ initialData, onSubmit, onCancel, loading }) {
  // État local du formulaire
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  /**
   * Effet pour pré-remplir le formulaire en mode édition.
   */
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || '',
        password: '' // Sécurité : on ne renvoie jamais le mot de passe existant depuis l'API
      })
    }
  }, [initialData])

  /**
   * Met à jour l'état lors de la saisie utilisateur.
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Gère la soumission du formulaire.
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const dataToSend = { ...formData }
    // En mode édition, si le mot de passe est vide, on ne l'envoie pas pour ne pas l'écraser
    if (initialData && !dataToSend.password) {
      delete dataToSend.password
    }
    onSubmit(dataToSend)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Nom d'utilisateur</label>
        <input
          type="text"
          name="username"
          className="form-control"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Adresse Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          required
          // L'email servant d'identifiant unique, il est verrouillé en mode édition
          disabled={!!initialData} 
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {initialData ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
        </label>
        <div className="input-with-icon">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            // Obligatoire uniquement à la création
            required={!initialData}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="btn-group mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <FaSave /> {initialData ? 'Mettre à jour' : 'Créer l\'utilisateur'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <FaTimes /> Annuler
        </button>
      </div>
    </form>
  )
}

export default UserForm
