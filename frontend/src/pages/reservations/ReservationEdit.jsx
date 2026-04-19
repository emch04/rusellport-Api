import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import { FaEdit, FaArrowLeft, FaSave } from 'react-icons/fa'

function ReservationEdit() {
  const { catwayId, id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    clientName: '',
    boatName: '',
    startDate: '',
    endDate: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReservation()
  }, [catwayId, id])

  const fetchReservation = async () => {
    try {
      const response = await api.get(`/catways/${catwayId}/reservations/${id}`)
      const res = response.data
      setFormData({
        clientName: res.clientName,
        boatName: res.boatName,
        startDate: res.startDate.split('T')[0],
        endDate: res.endDate.split('T')[0]
      })
    } catch (err) {
      setError('Réservation non trouvée')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await api.put(`/catways/${catwayId}/reservations/${id}`, formData)
      navigate(`/catways/${catwayId}/reservations/${id}`, { 
        state: { success: 'Réservation modifiée avec succès' } 
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container">
      <div className="page-header">
        <h1><FaEdit /> Modifier la réservation</h1>
        <Link to={`/catways/${catwayId}/reservations/${id}`} className="btn btn-secondary">
          <FaArrowLeft /> Retour
        </Link>
      </div>

      <div className="card fade-in" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Catway</label>
              <input
                type="text"
                className="form-control"
                value={`#${catwayId}`}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientName" className="form-label">
                Nom du client *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                className="form-control"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="boatName" className="form-label">
                Nom du bateau *
              </label>
              <input
                type="text"
                id="boatName"
                name="boatName"
                className="form-control"
                value={formData.boatName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Date de début *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                Date de fin *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-sm"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FaSave /> Enregistrer
                  </>
                )}
              </button>
              <Link to={`/catways/${catwayId}/reservations/${id}`} className="btn btn-secondary">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReservationEdit
