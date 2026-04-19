import CatwayCard from './CatwayCard'
import EmptyState from '../common/EmptyState'
import { FaShip, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

/**
 * Composant de liste pour afficher une grille de Catways.
 * Gère l'affichage d'un état vide si la liste est vide.
 * 
 * @param {Object} props
 * @param {Array} props.catways - Liste des objets catways
 * @param {Function} props.onDelete - Fonction transmise aux cartes pour la suppression
 */
function CatwayList({ catways, onDelete }) {
  // Rendu de l'état vide si aucune donnée
  if (catways.length === 0) {
    return (
      <EmptyState
        icon={<FaShip />}
        title="Aucun catway"
        description="Il n'y a aucun catway enregistré pour le moment."
        action={
          <Link to="/catways/create" className="btn btn-primary">
            <FaPlus /> Ajouter un catway
          </Link>
        }
      />
    )
  }

  return (
    <div className="catways-grid">
      {/* Itération sur la liste des catways pour générer les cartes */}
      {catways.map(catway => (
        <CatwayCard key={catway._id} catway={catway} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default CatwayList
