import UserCard from './UserCard'
import EmptyState from '../common/EmptyState'
import { FaUsers, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

/**
 * Composant de liste affichant les utilisateurs sous forme de grille.
 * 
 * @param {Object} props
 * @param {Array} props.users - Liste des objets utilisateurs
 * @param {Function} props.onDelete - Fonction de suppression
 */
function UserList({ users, onDelete }) {
  // Affichage de l'état vide si aucun utilisateur n'existe
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<FaUsers />}
        title="Aucun utilisateur"
        description="Il n'y a aucun utilisateur enregistré pour le moment."
        action={
          <Link to="/users/create" className="btn btn-primary">
            <FaPlus /> Créer un utilisateur
          </Link>
        }
      />
    )
  }

  return (
    <div className="users-grid">
      {/* Rendu dynamique des cartes utilisateur */}
      {users.map(user => (
        <UserCard key={user._id} user={user} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default UserList
