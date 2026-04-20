// Importations
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Alert from "../../components/common/Alert";
import { FaPlus, FaArrowLeft, FaSave } from "react-icons/fa";

/**
 * Composant de création d'un nouveau Catway (emplacement de bateau).
 */
function CatwayCreate() {
  const navigate = useNavigate();
  // Initialisation des données du formulaire
  const [formData, setFormData] = useState({
    catwayNumber: "",
    catwayType: "",
    catwayState: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Met à jour l'état au fur et à mesure de la saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // CORRECTION : Le backend (Catway.js) attend la propriété "type" et non "catwayType".
      // On re-mappe donc les données du formulaire avant l'envoi à l'API.
      // "catwayNumber" doit également être converti en entier.
      await api.post("/catways", {
        catwayNumber: parseInt(formData.catwayNumber),
        type: formData.catwayType,
        catwayState: formData.catwayState,
      });
      navigate("/catways", { state: { success: "Catway créé avec succès" } });
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
          <FaPlus /> Nouveau Catway
        </h1>
        <Link to="/catways" className="btn btn-secondary">
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
              <label htmlFor="catwayNumber" className="form-label">
                Numéro du catway *
              </label>
              <input
                type="number"
                id="catwayNumber"
                name="catwayNumber"
                className="form-control"
                placeholder="Ex: 1"
                value={formData.catwayNumber}
                onChange={handleChange}
                required
                min="1"
              />
              <span className="form-text">Le numéro doit être unique.</span>
            </div>

            <div className="form-group">
              <label htmlFor="catwayType" className="form-label">
                Type *
              </label>
              <select
                id="catwayType"
                name="catwayType"
                className="form-control form-select"
                value={formData.catwayType}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="long">Long</option>
                <option value="short">Court</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="catwayState" className="form-label">
                État / Description
              </label>
              <textarea
                id="catwayState"
                name="catwayState"
                className="form-control"
                placeholder="Décrivez l'état actuel du catway..."
                rows="3"
                value={formData.catwayState}
                onChange={handleChange}
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
                    <FaSave /> Créer le catway
                  </>
                )}
              </button>
              <Link to="/catways" className="btn btn-secondary">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CatwayCreate;
