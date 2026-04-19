import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import { FaEdit, FaArrowLeft, FaSave, FaInfoCircle } from "react-icons/fa";

function CatwayEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catway, setCatway] = useState(null);
  const [catwayState, setCatwayState] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCatway();
  }, [id]);

  const fetchCatway = async () => {
    try {
      const response = await api.get(`/catways/${id}`);
      setCatway(response.data);
      setCatwayState(response.data.catwayState || "");
    } catch (err) {
      setError("Catway non trouvé");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put(`/catways/${id}`, { catwayState });
      navigate(`/catways/${id}`, {
        state: { success: "Catway modifié avec succès" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!catway)
    return (
      <div className="container">
        <Alert type="danger" message="Catway non trouvé" />
        <Link to="/catways" className="btn btn-secondary">
          <FaArrowLeft /> Retour aux catways
        </Link>
      </div>
    );

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <FaEdit /> Modifier Catway #{catway.catwayNumber}
        </h1>
        <Link
          to={`/catways/${catway.catwayNumber}`}
          className="btn btn-secondary"
        >
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

          <Alert
            type="info"
            message="Seul l'état du catway peut être modifié. Le numéro et le type sont fixes."
          />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Numéro du catway</label>
              <input
                type="text"
                className="form-control"
                value={catway.catwayNumber}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <input
                type="text"
                className="form-control"
                value={catway.type === "long" ? "Long" : "Court"}
                disabled
              />
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
                rows="4"
                value={catwayState}
                onChange={(e) => setCatwayState(e.target.value)}
              />
            </div>

            <div className="btn-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-sm"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FaSave /> Enregistrer
                  </>
                )}
              </button>
              <Link
                to={`/catways/${catway.catwayNumber}`}
                className="btn btn-secondary"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CatwayEdit;
