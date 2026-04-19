import { Link } from 'react-router-dom'
import { FaShip, FaEye, FaEdit, FaTrash } from 'react-icons/fa'

/**
 * Composant de carte affichant un résumé d'un Catway.
 * 
 * @param {Object} props
 * @param {Object} props.catway - Les données du catway à afficher
 * @param {Function} props.onDelete - Fonction de rappel pour la suppression
 */
function CatwayCard({ catway, onDelete }) {
  return (
    <div className="card catway-card fade-in">
      <div className="card-body">
        <div className="catway-icon">
          <FaShip />
        </div>
        <div className="catway-info">
          <h3>Catway #{catway.catwayNumber}</h3>
          <div className="catway-badges">
            {/* Affichage du badge de type avec couleur dynamique */}
            <span className={`badge ${catway.catwayType === 'long' ? 'badge-success' : 'badge-warning'}`}>
              {catway.catwayType === 'long' ? 'Long' : 'Court'}
            </span>
            <span className="badge badge-primary">{catway.catwayState}</span>
          </div>
        </div>
        <div className="card-actions mt-3">
          {/* Liens vers les pages de détails et d'édition */}
          <Link to={`/catways/${catway.catwayNumber}`} className="btn btn-sm btn-secondary">
            <FaEye /> Voir
          </Link>
          <Link to={`/catways/${catway.catwayNumber}/edit`} className="btn btn-sm btn-warning">
            <FaEdit /> Modifier
          </Link>
          {/* Bouton de suppression déclenchant la modale de confirmation parente */}
          <button onClick={() => onDelete(catway)} className="btn btn-sm btn-danger">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CatwayCard
