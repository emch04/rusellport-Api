import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import { FaUsers, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa'

function UsersIndex() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.user) return

    try {
      await api.delete(`/users/${encodeURIComponent(deleteModal.user.email)}`)
      setSuccess('Utilisateur supprimé avec succès')
      setUsers(users.filter(u => u.email !== deleteModal.user.email))
      setDeleteModal({ isOpen: false, user: null })
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container">
      <div className="page-header">
        <h1><FaUsers /> Gestion des Utilisateurs</h1>
        <Link to="/users/create" className="btn btn-primary">
          <FaPlus /> Nouvel Utilisateur
        </Link>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

      <div className="card fade-in">
        <div className="card-body">
          {users.length > 0 ? (
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
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <div className="table-actions">
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
                            onClick={() => setDeleteModal({ isOpen: true, user })}
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
  )
}

export default UsersIndex
