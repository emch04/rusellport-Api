// Importations des hooks React et composants nécessaires
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { FaUsers, FaPlus, FaEye, FaEdit, FaTrash, FaHome } from "react-icons/fa";

/**
 * Page listant tous les utilisateurs (personnel de la capitainerie).
 * Permet d'afficher, modifier et supprimer des utilisateurs existants.
 */
function UsersIndex() {
  // États locaux
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs API
  const [success, setSuccess] = useState(null); // Message de succès (ex: suppression)
  // État de la modale de confirmation pour la suppression
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  // Déclenche la récupération des utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Récupère la liste de tous les utilisateurs depuis l'API.
   */
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Supprime un utilisateur après confirmation dans la modale.
   * L'email est utilisé comme identifiant (encodé pour éviter les erreurs d'URL).
   */
  const handleDelete = async () => {
    if (!deleteModal.user) return;

    try {
      // Envoi de la requête de suppression
      await api.delete(`/users/${encodeURIComponent(deleteModal.user.email)}`);
      setSuccess("Utilisateur supprimé avec succès");
      // Mise à jour de la liste locale pour retirer l'utilisateur supprimé
      setUsers(users.filter((u) => u.email !== deleteModal.user.email));
      setDeleteModal({ isOpen: false, user: null });
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  // Affichage du composant Loading pendant la récupération des données
  if (loading) return <Loading />;

  return (
    <div className="container">
      {/* En-tête de la page */}
      <div className="page-header">
        <h1>
          <FaUsers /> Gestion des Utilisateurs
        </h1>
        <Link to="/users/create" className="btn btn-primary">
          <FaPlus /> Nouvel Utilisateur
        </Link>
      </div>

      {/* Affichage des alertes (succès ou erreur) */}
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
          {users.length > 0 ? (
            // Tableau des utilisateurs
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom d'utilisateur</th>
                    <th>Email</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Boucle d'affichage pour chaque utilisateur */}
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <div className="table-actions">
                          {/* Liens d'actions : Voir, Modifier, Supprimer */}
                          <Link
                            to={`/users/${encodeURIComponent(user.email)}`}
                            className="btn btn-sm btn-secondary"
                            title="Voir"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/users/${encodeURIComponent(user.email)}/edit`}
                            className="btn btn-sm btn-warning"
                            title="Modifier"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, user })
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
            // Composant affiché si aucun utilisateur n'est trouvé
            <EmptyState
              icon={<FaUsers />}
              title="Aucun utilisateur"
              description="Commencez par créer votre premier utilisateur."
              action={
                <Link to="/users/create" className="btn btn-primary">
                  <FaPlus /> Créer un utilisateur
                </Link>
              }
            />
          )}
        </div>
      </div>

      <div className="mt-4 hide-on-mobile">
        <Link to="/dashboard" className="btn btn-secondary">
          <FaHome /> Retour 
        </Link>
      </div>

      {/* Modale de confirmation de suppression */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        title="Confirmer la suppression"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ isOpen: false, user: null })}
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
          Êtes-vous sûr de vouloir supprimer l'utilisateur
          <strong> {deleteModal.user?.username}</strong> ?
        </p>
        <p className="text-muted">Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}

export default UsersIndex;
