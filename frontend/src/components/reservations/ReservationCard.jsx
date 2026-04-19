import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaEye, FaEdit, FaTrash, FaShip, FaUser } from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Composant de carte affichant un résumé d'une réservation.
 * Utilise date-fns pour le formatage des dates en français.
 * 
 * @param {Object} props
 * @param {Object} props.reservation - Les données de la réservation
 * @param {Function} props.onDelete - Fonction de rappel pour la suppression
 */
function ReservationCard({ reservation, onDelete }) {
  const startDate = new Date(reservation.startDate)
  const endDate = new Date(reservation.endDate)

  return (
    <div className="card reservation-card fade-in">
      <div className="card-body">
        <div className="reservation-header">
          {/* Badge affichant le numéro du catway concerné */}
          <span className="badge badge-primary">#{reservation.catwayNumber}</span>
          {/* Formatage des dates : "dd MMM" (ex: 12 jan) */}
          <span className="reservation-dates">
            {format(startDate, 'dd MMM', { locale: fr })} - {format(endDate, 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
        
        <div className="reservation-details mt-3">
          <p><FaUser /> <strong>{reservation.clientName}</strong></p>
          <p><FaShip /> <em>{reservation.boatName}</em></p>
        </div>

        <div className="card-actions mt-3">
          {/* Lien vers les détails de la réservation spécifique au catway */}
          <Link 
            to={`/catways/${reservation.catwayNumber}/reservations/${reservation._id}`} 
            className="btn btn-sm btn-secondary"
          >
            <FaEye />
          </Link>
          <Link 
            to={`/catways/${reservation.catwayNumber}/reservations/${reservation._id}/edit`} 
            className="btn btn-sm btn-warning"
          >
            <FaEdit />
          </Link>
          {/* Bouton de suppression déclenchant la modale de confirmation */}
          <button onClick={() => onDelete(reservation)} className="btn btn-sm btn-danger">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReservationCard
