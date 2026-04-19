import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import { FaCalendarAlt, FaArrowLeft, FaTrash, FaShip, FaUser, FaAnchor } from 'react-icons/fr'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Page de détails d'une réservation.
 * Affiche toutes les informations concernant le client, le bateau et les dates.
 */
function ReservationShow() {
  const { catwayId, id } = useParams() // id est l'identifiant technique de la réservation
  const navigate = useNavigate()
  
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await api.get(`/reservations/${id}`)
        setReservation(response.data)
      } catch (err) {
        setError('Réservation introuvable.')
      } finally {
        setLoading(false)
      }
    }
    fetchReservation()
  }, [id])

  /**
   * Supprime la réservation après confirmation.
   */
  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      try {
        await api.delete(`/reservations/${id}`)
        navigate('/reservations')
      } catch (err) {
        setError('Erreur lors de la suppression.')
      }
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <FaArrowLeft /> Retour
        </button>
        <h1><FaCalendarAlt /> Détails de la Réservation</h1>
      </div>

      {error && <Alert type="danger" message={error} />}

      {reservation && (
        <div className="card fade-in">
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label"><FaAnchor /> Emplacement</span>
                <span className="detail-value">Catway #{reservation.catwayNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FaUser /> Client</span>
                <span className="detail-value">{reservation.clientName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FaShip /> Bateau</span>
                <span className="detail-value">{reservation.boatName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Période</span>
                <span className="detail-value">
                  Du {format(new Date(reservation.startDate), 'dd/MM/yyyy')} au {format(new Date(reservation.endDate), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>

            <div className="btn-group mt-4">
              <button onClick={() => navigate(`/catways/${catwayId}/reservations/${id}/edit`)} className="btn btn-warning">
                Modifier
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                <FaTrash /> Annuler la réservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationShow
