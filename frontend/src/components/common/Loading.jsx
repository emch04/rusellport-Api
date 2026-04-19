/**
 * Composant de retour visuel pour les opérations asynchrones.
 * Affiche un spinner et un texte informatif.
 * 
 * @param {Object} props
 * @param {string} props.text - Texte à afficher sous le spinner (défaut: 'Chargement...')
 */
function Loading({ text = 'Chargement...' }) {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>{text}</p>
    </div>
  )
}

export default Loading
