// Importations
// Importations des dépendances et composants
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import UserForm from "../../components/users/UserForm";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import { FaUserEdit, FaHome } from "react-icons/fa";

/**
 * Composant pour la modification d'un utilisateur existant.
 * Il récupère les informations de l'utilisateur, les passe à un formulaire réutilisable (UserForm),
 * et gère la soumission des modifications.
 */
function UserEdit() {
  // Récupération de l'email depuis l'URL (sert d'identifiant pour l'utilisateur)
  const { email } = useParams();
  const navigate = useNavigate();

  // États locaux du composant
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Effet déclenché au montage pour récupérer les données de l'utilisateur ciblé
  useEffect(() => {
    fetchUser();
  }, [email]);

  /**
   * Récupère les données de l'utilisateur pour pré-remplir le formulaire.
   */
  const fetchUser = async () => {
    try {
      // On utilise encodeURIComponent pour gérer correctement les caractères spéciaux dans l'email (ex: @)
      const response = await api.get(`/users/${encodeURIComponent(email)}`);
      setUser(response.data);
    } catch (err) {
      setError("Impossible de charger l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère l'envoi des nouvelles données vers l'API.
   * @param {Object} formData - Les données renvoyées par le composant UserForm
   */
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await api.put(`/users/${encodeURIComponent(email)}`, formData);
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container">
      {/* En-tête de la page */}
      <div className="page-header">
        <h1>
          <FaUserEdit /> Modifier l'utilisateur
        </h1>
      </div>

      {/* Affichage des erreurs éventuelles */}
      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* Conteneur principal du formulaire */}
      <div className="card fade-in">
        <div className="card-body">
          {/* On ne rend le composant enfant UserForm que si les données de l'utilisateur sont chargées */}
          {user && (
            <UserForm
              initialData={user}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/users")}
              loading={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserEdit;
