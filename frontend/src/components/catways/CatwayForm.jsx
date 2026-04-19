import { useState, useEffect } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'

/**
 * Formulaire réutilisable pour la création et l'édition de Catways.
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Données initiales (en cas d'édition)
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission
 * @param {Function} props.onCancel - Fonction appelée lors de l'annulation
 * @param {boolean} props.loading - État de chargement du bouton de soumission
 */
function CatwayForm({ initialData, onSubmit, onCancel, loading }) {
  // État local pour gérer les champs du formulaire
  const [formData, setFormData] = useState({
    catwayNumber: '',
    catwayType: 'short',
    catwayState: ''
  })

  /**
   * Effet pour pré-remplir le formulaire si des données initiales sont fournies (Mode Édition).
   */
  useEffect(() => {
    if (initialData) {
      setFormData({
        catwayNumber: initialData.catwayNumber || '',
        catwayType: initialData.catwayType || 'short',
        catwayState: initialData.catwayState || ''
      })
    }
  }, [initialData])

  /**
   * Gère les changements dans les champs de saisie.
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
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Numéro du Catway</label>
        <input
          type="number"
          name="catwayNumber"
          className="form-control"
          value={formData.catwayNumber}
          onChange={handleChange}
          required
          // Désactivation du champ numéro en édition pour préserver l'intégrité
          disabled={!!initialData} 
        />
      </div>

      <div className="form-group">
        <label className="form-label">Type de Catway</label>
        <select
          name="catwayType"
          className="form-control form-select"
          value={formData.catwayType}
          onChange={handleChange}
          required
        >
          <option value="short">Court (Petit bateau)</option>
          <option value="long">Long (Grand bateau)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">État / Description</label>
        <textarea
          name="catwayState"
          className="form-control"
          placeholder="Ex: Bon état, à réparer..."
          value={formData.catwayState}
          onChange={handleChange}
          required
        />
      </div>

      <div className="btn-group mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <FaSave /> {initialData ? 'Mettre à jour' : 'Créer le catway'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <FaTimes /> Annuler
        </button>
      </div>
    </form>
  )
}

export default CatwayForm
