// Importations
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Alert from "../../components/common/Alert";
import { FaUserPlus, FaArrowLeft, FaSave, FaHome } from "react-icons/fa";

/**
 * Composant permettant de créer un nouvel utilisateur avec validation du formulaire.
 */
function UserCreate() {
  const navigate = useNavigate();

  // État local du formulaire d'inscription
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Champ spécifique au frontend pour validation
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gestion générique des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Validation de la longueur minimale du mot de passe
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Envoi de la requête API (sans envoyer confirmPassword qui est inutile pour le backend)
      await api.post("/users", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/users", {
        state: { success: "Utilisateur créé avec succès" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <FaUserPlus /> Nouvel Utilisateur
        </h1>
        <Link to="/users" className="btn btn-secondary">
          <FaArrowLeft /> Retour
        </Link>
      </div>

      <div className="card fade-in" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          {error && (
            <Alert
              type="danger"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Ex: jean.dupont"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Adresse email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Ex: jean@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="form-text">
                L'adresse email doit être unique.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Minimum 6 caractères"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="Répétez le mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-sm"></span>
                    Création...
                  </>
                ) : (
                  <>
                    <FaSave /> Créer l'utilisateur
                  </>
                )}
              </button>
              <Link to="/users" className="btn btn-secondary">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserCreate;
