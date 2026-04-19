import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FaAnchor, FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt, FaShip, FaCalendarAlt, FaUsers, FaBook, FaHome } from 'react-icons/fa'

/**
 * Composant de barre de navigation globale.
 * S'adapte dynamiquement selon l'état d'authentification de l'utilisateur.
 */
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  /**
   * Gère la déconnexion de l'utilisateur.
   */
  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  // Bascule l'affichage du menu mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  // Ferme le menu mobile (utilisé lors d'un clic sur un lien)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo / Nom du site redirigeant vers le dashboard ou l'accueil */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
          <FaAnchor />
          <span>Port de Russell</span>
        </Link>

        {/* Bouton pour menu burger sur mobile */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Liste des liens de navigation */}
        <ul className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              {/* Liens pour utilisateurs connectés */}
              <li>
                <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                  <FaTachometerAlt />
                  <span>Tableau de bord</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/catways" className="nav-link" onClick={closeMenu}>
                  <FaShip />
                  <span>Catways</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/reservations" className="nav-link" onClick={closeMenu}>
                  <FaCalendarAlt />
                  <span>Réservations</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/users" className="nav-link" onClick={closeMenu}>
                  <FaUsers />
                  <span>Utilisateurs</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/documentation" className="nav-link" onClick={closeMenu}>
                  <FaBook />
                  <span>Documentation</span>
                </NavLink>
              </li>
              {/* Informations utilisateur et bouton déconnexion */}
              <li className="nav-user">
                <div className="nav-user-info">
                  <span className="nav-user-name">{user?.username}</span>
                  <span className="nav-user-email">{user?.email}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-light">
                  <FaSignOutAlt />
                  <span>Déconnexion</span>
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Liens pour utilisateurs non connectés */}
              <li>
                <NavLink to="/" className="nav-link" onClick={closeMenu}>
                  <FaHome />
                  <span>Accueil</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/documentation" className="nav-link" onClick={closeMenu}>
                  <FaBook />
                  <span>Documentation</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
