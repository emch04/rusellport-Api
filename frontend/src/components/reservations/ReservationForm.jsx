import { useState, useEffect } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'

/**
 * Formulaire de gestion des réservations (Création / Édition).
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Données initiales pour l'édition
 * @param {Function} props.onSubmit - Action de soumission vers l'API
 * @param {Function} props.onCancel - Action d'annulation
 * @param {boolean} props.loading - État de chargement du bouton
 * @param {number} props.catwayNumber - Numéro du catway si pré-sélectionné
 */
function ReservationForm({ initialData, onSubmit, onCancel, loading, catwayNumber: propCatwayNumber }) {
  // État local du formulaire initialisé avec les valeurs par défaut
  const [formData, setFormData] = useState({
    catwayNumber: propCatwayNumber || '',
    clientName: '',
    boatName: '',
    startDate: '',
    endDate: '',
    checkIn: '',
    checkOut: ''
  })

  /**
   * Effet pour remplir le formulaire en mode édition.
   * Les dates sont formatées en YYYY-MM-DD pour les inputs HTML5 de type 'date'.
   */
  useEffect(() => {
    if (initialData) {
      setFormData({
        catwayNumber: initialData.catwayNumber || '',
        clientName: initialData.clientName || '',
        boatName: initialData.boatName || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        checkIn: initialData.checkIn || '',
        checkOut: initialData.checkOut || ''
      })
    }
  }, [initialData])

  /**
   * Met à jour l'état local lors de la saisie utilisateur.
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Soumission du formulaire.
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Numéro de Catway</label>
          <input
            type="number"
            name="catwayNumber"
            className="form-control"
            value={formData.catwayNumber}
            onChange={handleChange}
            required
            // Désactivé si on vient d'une page catway spécifique
            disabled={!!propCatwayNumber}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Nom du Client</label>
          <input
            type="text"
            name="clientName"
            className="form-control"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Nom du Bateau</label>
        <input
          type="text"
          name="boatName"
          className="form-control"
          value={formData.boatName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Date de début</label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Date de fin</label>
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="btn-group mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <FaSave /> {initialData ? 'Mettre à jour' : 'Créer la réservation'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <FaTimes /> Annuler
        </button>
      </div>
    </form>
  )
}

export default ReservationForm
