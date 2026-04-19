import ReservationCard from './ReservationCard'
import EmptyState from '../common/EmptyState'
import { FaCalendarAlt, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

/**
 * Composant de liste affichant les réservations sous forme de grille.
 * Gère l'affichage d'un message si aucune réservation n'est trouvée.
 * 
 * @param {Object} props
 * @param {Array} props.reservations - Liste des réservations
 * @param {Function} props.onDelete - Fonction de suppression
 */
function ReservationList({ reservations, onDelete }) {
  // Affichage de l'état vide avec un bouton d'action vers la création
  if (reservations.length === 0) {
    return (
      <EmptyState
        icon={<FaCalendarAlt />}
        title="Aucune réservation"
        description="Il n'y a aucune réservation enregistrée."
        action={
          <Link to="/reservations/create" className="btn btn-primary">
            <FaPlus /> Nouvelle réservation
          </Link>
        }
      />
    )
  }

  return (
    <div className="reservations-grid">
      {/* Rendu dynamique des cartes de réservation */}
      {reservations.map(reservation => (
        <ReservationCard key={reservation._id} reservation={reservation} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default ReservationList
