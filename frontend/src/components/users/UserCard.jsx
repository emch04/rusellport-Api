import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaEdit, FaTrash } from 'react-icons/fa'

/**
 * Composant de carte affichant les informations d'un utilisateur.
 * 
 * @param {Object} props
 * @param {Object} props.user - Les données de l'utilisateur
 * @param {Function} props.onDelete - Fonction de rappel pour la suppression
 */
function UserCard({ user, onDelete }) {
  return (
    <div className="card user-card fade-in">
      <div className="card-body">
        <div className="user-avatar">
          <FaUser />
        </div>
        <div className="user-info">
          <h3>{user.username}</h3>
          <p className="text-muted">
            <FaEnvelope /> {user.email}
          </p>
        </div>
        <div className="card-actions mt-3">
          {/* L'email est encodé pour être utilisé en toute sécurité dans l'URL */}
          <Link to={`/users/${encodeURIComponent(user.email)}/edit`} className="btn btn-sm btn-warning">
            <FaEdit /> Modifier
          </Link>
          <button onClick={() => onDelete(user)} className="btn btn-sm btn-danger">
            <FaTrash /> Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
