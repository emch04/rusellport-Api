import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa'

/**
 * Composant de notification (Alerte).
 * 
 * @param {Object} props
 * @param {string} props.type - Type d'alerte ('success', 'danger', 'warning', 'info')
 * @param {string} props.message - Message à afficher
 * @param {Function} props.onClose - Fonction optionnelle pour fermer l'alerte
 */
function Alert({ type = 'info', message, onClose }) {
  // Mapping des icônes selon le type d'alerte
  const icons = {
    success: <FaCheckCircle />,
    danger: <FaExclamationCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaInfoCircle />
  }

  // Ne rien afficher si aucun message n'est fourni
  if (!message) return null

  return (
    <div className={`alert alert-${type} fade-in`}>
      {icons[type]}
      <span>{message}</span>
      {/* Bouton de fermeture si une fonction onClose est fournie */}
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          <FaTimes />
        </button>
      )}
    </div>
  )
}

export default Alert
