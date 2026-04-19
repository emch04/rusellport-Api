import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

/**
 * Composant de fenêtre modale réutilisable.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture de la modale
 * @param {Function} props.onClose - Fonction de fermeture
 * @param {string} props.title - Titre de la modale
 * @param {React.ReactNode} props.children - Contenu principal de la modale
 * @param {React.ReactNode} props.footer - Contenu optionnel pour le pied de page
 */
function Modal({ isOpen, onClose, title, children, footer }) {
  
  /**
   * Effet pour empêcher le défilement du corps de la page 
   * lorsque la modale est ouverte.
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Nettoyage lors de la destruction du composant
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Si la modale n'est pas ouverte, on ne rend rien
  if (!isOpen) return null

  return (
    <div className="modal-overlay active" onClick={onClose}>
      {/* stopPropagation empêche la fermeture si on clique à l'intérieur de la modale */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

export default Modal
