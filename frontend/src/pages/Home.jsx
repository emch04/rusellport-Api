// Importations des hooks React et de React Router
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Alert from "../components/common/Alert";
import {
  FaAnchor,
  FaShip,
  FaCalendarCheck,
  FaUsersCog,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

/**
 * Page d'accueil et d'authentification de l'application.
 * Fait office de "Landing Page" et permet de se connecter ou de créer un compte.
 */
function Home() {
  // États locaux pour gérer le formulaire (Mode Connexion vs Mode Inscription)
  const [isLogin, setIsLogin] = useState(true); // Détermine si on affiche le formulaire de connexion (true) ou d'inscription (false)
  const [username, setUsername] = useState(""); // Utilisé uniquement pour l'inscription
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // État de chargement du bouton de validation
  const [successMessage, setSuccessMessage] = useState(""); // Message affiché après une inscription réussie

  // Récupération des méthodes et variables du contexte d'authentification global
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection automatique de sécurité :
  // Si l'utilisateur est déjà connecté, on l'empêche de voir la page de login et on l'envoie sur le Dashboard.
  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  /**
   * Gère la soumission du formulaire selon le mode actuel (Connexion ou Inscription).
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    setSuccessMessage("");

    if (isLogin) {
      // Logique de connexion
      const result = await login(email, password);
      if (result.success) {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    } else {
      // Logique d'inscription
      try {
        await api.post("/users", { username, email, password });
        setSuccessMessage(
          "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
        );
        setIsLogin(true); // Rebasculer vers la connexion
        setUsername("");
        setPassword("");
      } catch (err) {
        // L'erreur sera gérée localement ou via un état si nécessaire
        console.error(err);
      }
    }

    setLoading(false);
  };

  return (
    <div className="home-page">
      {/* Section Héro (Bannière principale d'accueil) */}
      <section className="hero">
        <div className="container">
          <FaAnchor className="hero-icon" />
          <h1>Port de Plaisance de Russell</h1>
          <p>
            Système de gestion des réservations. Connectez-vous ou créez un
            compte pour accéder à la capitainerie.
          </p>
        </div>
      </section>

      {/* Section du formulaire (Connexion / Inscription) */}
      <section className="login-section">
        <div className="container">
          <div className="card login-card fade-in">
            <div className="card-header">
              <h3>
                {/* Titre dynamique selon le mode actif (Connexion ou Inscription) */}
                {isLogin ? (
                  <>
                    <FaSignInAlt /> Connexion
                  </>
                ) : (
                  <>
                    <FaUserPlus /> Inscription
                  </>
                )}
              </h3>
            </div>
            <div className="card-body">
              {/* Affichage des alertes d'erreur de connexion/inscription */}
              {error && (
                <Alert type="danger" message={error} onClose={clearError} />
              )}
              {/* Affichage du message de succès après création du compte */}
              {successMessage && (
                <Alert
                  type="success"
                  message={successMessage}
                  onClose={() => setSuccessMessage("")}
                />
              )}

              {/* Formulaire gérant les deux modes de manière dynamique */}
              <form onSubmit={handleSubmit}>
                {/* Champ "Nom d'utilisateur" affiché uniquement en mode inscription */}
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Nom d'utilisateur</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Champ Email commun aux deux modes */}
                <div className="form-group">
                  <label className="form-label">Adresse email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Champ Mot de passe commun aux deux modes */}
                <div className="form-group">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Bouton de soumission avec libellé et état de chargement dynamiques */}
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={loading}
                >
                  {loading
                    ? "Traitement..."
                    : isLogin
                      ? "Se connecter"
                      : "Créer un compte"}
                </button>
              </form>

              {/* Bouton de bascule permettant de passer de la connexion à l'inscription (et inversement) */}
              <div className="text-center mt-3">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    clearError();
                    setSuccessMessage("");
                  }}
                >
                  {isLogin
                    ? "Pas encore de compte ? S'inscrire"
                    : "Déjà un compte ? Se connecter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section présentant les fonctionnalités principales de l'application */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="card feature-card">
              <FaShip className="feature-icon" />
              <h3>Catways</h3>
              <p>Gérez vos emplacements.</p>
            </div>
            <div className="card feature-card">
              <FaCalendarCheck className="feature-icon" />
              <h3>Réservations</h3>
              <p>Planifiez les séjours.</p>
            </div>
          </div>
        </div>
      </section>
           
    </div>
  );
}

export default Home;
