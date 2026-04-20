// Importations des hooks React et React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import { FaShip, FaArrowLeft, FaEdit, FaCalendarPlus } from "react-icons/fa";

/**
 * Page de détails d'un Catway spécifique.
 * Affiche les informations techniques et permet d'accéder aux actions liées.
 */
function CatwaysShow() {
  const { id } = useParams(); // Récupère le numéro du catway depuis l'URL
  const navigate = useNavigate();

  // États locaux
  const [catway, setCatway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charge les données du catway au montage du composant
  useEffect(() => {
    /**
     * Appel API pour récupérer les détails du catway courant
     */
    const fetchCatway = async () => {
      try {
        const response = await api.get(`/catways/${id}`);
        setCatway(response.data);
      } catch (err) {
        setError("Impossible de trouver ce catway.");
      } finally {
        setLoading(false);
      }
    };
    fetchCatway();
  }, [id]);

  // Affichage du composant de chargement en attendant les données
  if (loading) return <Loading />;

  return (
    <div className="container">
      {/* En-tête avec bouton retour */}
      <div className="page-header">
        <button
          onClick={() => navigate("/catways")}
          className="btn btn-secondary"
        >
          <FaArrowLeft /> Retour
        </button>
        <h1>
          <FaShip /> Détails du Catway #{id}
        </h1>
      </div>

      {/* Affichage d'une erreur si la récupération a échoué */}
      {error && <Alert type="danger" message={error} />}

      {/* Rendu des informations uniquement si les données sont chargées */}
      {catway && (
        <div className="card fade-in">
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Numéro</span>
                <span className="detail-value">#{catway.catwayNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type d'emplacement</span>
                {/* Formatage du type pour une meilleure lisibilité */}
                <span className="detail-value">
                  {catway.catwayType === "long"
                    ? "Long (Grand bateau)"
                    : "Court (Petit bateau)"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">État actuel</span>
                <span className="detail-value">{catway.catwayState}</span>
              </div>
            </div>

            {/* Actions rapides depuis la fiche détaillée */}
            <div className="btn-group mt-4">
              <button
                onClick={() => navigate(`/catways/${id}/edit`)}
                className="btn btn-warning"
              >
                <FaEdit /> Modifier les infos
              </button>
              <button
                onClick={() => navigate(`/catways/${id}/reservations/create`)}
                className="btn btn-primary"
              >
                <FaCalendarPlus /> Créer une réservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CatwaysShow;
