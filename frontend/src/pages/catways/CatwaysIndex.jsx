import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { FaShip, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

function CatwaysIndex() {
  const [catways, setCatways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    catway: null,
  });

  // Chargement des catways dès que le composant est monté à l'écran
  useEffect(() => {
    fetchCatways();
  }, []);

  const fetchCatways = async () => {
    try {
      setLoading(true);
      const response = await api.get("/catways");
      setCatways(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des catways");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.catway) return;

    try {
      await api.delete(`/catways/${deleteModal.catway.catwayNumber}`);
      setSuccess("Catway supprimé avec succès");
      setCatways(
        catways.filter(
          (c) => c.catwayNumber !== deleteModal.catway.catwayNumber,
        ),
      );
      setDeleteModal({ isOpen: false, catway: null });
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <FaShip /> Gestion des Catways
        </h1>
        <Link to="/catways/create" className="btn btn-primary">
          <FaPlus /> Nouveau Catway
        </Link>
      </div>

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}
      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      <div className="card fade-in">
        <div className="card-body">
          {catways.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Numéro</th>
                    <th>Type</th>
                    <th>État</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catways.map((catway) => (
                    <tr key={catway._id}>
                      <td>
                        <span className="badge badge-primary">
                          #{catway.catwayNumber}
                        </span>
                      </td>
                      <td>
                        {/* CORRECTION : Utilisation de catway.type tel que renvoyé par le backend */}
                        <span
                          className={`badge ${catway.type === "long" ? "badge-success" : "badge-warning"}`}
                        >
                          {catway.type === "long" ? "Long" : "Court"}
                        </span>
                      </td>
                      <td>{catway.catwayState || "Non spécifié"}</td>
                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/catways/${catway.catwayNumber}`}
                            className="btn btn-sm btn-secondary"
                            title="Voir"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/catways/${catway.catwayNumber}/edit`}
                            className="btn btn-sm btn-warning"
                            title="Modifier"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, catway })
                            }
                            className="btn btn-sm btn-danger"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<FaShip />}
              title="Aucun catway"
              description="Commencez par ajouter votre premier catway."
              action={
                <Link to="/catways/create" className="btn btn-primary">
                  <FaPlus /> Ajouter un catway
                </Link>
              }
            />
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, catway: null })}
        title="Confirmer la suppression"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ isOpen: false, catway: null })}
            >
              Annuler
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <FaTrash /> Supprimer
            </button>
          </>
        }
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le catway
          <strong> #{deleteModal.catway?.catwayNumber}</strong> ?
        </p>
        <p className="text-muted">Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}

export default CatwaysIndex;
