import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import {
  FaShip,
  FaCalendarAlt,
  FaUsers,
  FaPlus,
  FaEye,
  FaClock,
  FaBolt,
  FaBook,
  FaUserPlus,
  FaCalendarPlus,
} from "react-icons/fa";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ catways: 0, reservations: 0, users: 0 });
  const [currentReservations, setCurrentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Exécution des requêtes API en parallèle via Promise.all pour optimiser drastiquement le temps de chargement global
      const [catwaysRes, reservationsRes, usersRes] = await Promise.all([
        api.get("/catways"),
        api.get("/reservations"), // Route correcte pour toutes les réservations
        api.get("/users"),
      ]);

      const catways = catwaysRes.data;
      const allReservations = reservationsRes.data || [];
      const users = usersRes.data;

      setStats({
        catways: catways.length,
        reservations: allReservations.length,
        users: users.length,
      });

      // Filtrer les réservations en cours
      const now = new Date();
      const current = allReservations.filter((res) => {
        const start = new Date(res.startDate);
        const end = new Date(res.endDate);
        return now >= start && now <= end;
      });

      setCurrentReservations(current);
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-welcome">
            <h1>Bonjour, {user?.username} 👋</h1>
            <p className="dashboard-date">
              <FaCalendarAlt />
              <span style={{ textTransform: "capitalize" }}>{today}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {error && (
          <Alert type="danger" message={error} onClose={() => setError(null)} />
        )}

        {/* Statistiques */}
        <div className="dashboard-stats">
          <div className="stat-card fade-in">
            <div className="stat-icon catways">
              <FaShip />
            </div>
            <div className="stat-info">
              <h3>{stats.catways}</h3>
              <p>Catways</p>
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-icon reservations">
              <FaCalendarAlt />
            </div>
            <div className="stat-info">
              <h3>{stats.reservations}</h3>
              <p>Réservations</p>
            </div>
          </div>

          <div className="stat-card fade-in">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.users}</h3>
              <p>Utilisateurs</p>
            </div>
          </div>
        </div>

        {/* Réservations en cours */}
        <div className="card reservations-today fade-in">
          <div className="card-header">
            <h3>
              <FaClock /> Réservations en cours
            </h3>
            <Link to="/reservations" className="btn btn-sm btn-outline">
              Voir tout
            </Link>
          </div>
          <div className="card-body">
            {currentReservations.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Catway</th>
                      <th>Client</th>
                      <th>Bateau</th>
                      <th>Début</th>
                      <th>Fin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td>
                          <span className="badge badge-primary">
                            #{reservation.catwayNumber}
                          </span>
                        </td>
                        <td>{reservation.clientName}</td>
                        <td>{reservation.boatName}</td>
                        <td>
                          {format(
                            new Date(reservation.startDate),
                            "dd/MM/yyyy",
                          )}
                        </td>
                        <td>
                          {format(new Date(reservation.endDate), "dd/MM/yyyy")}
                        </td>
                        <td>
                          <Link
                            to={`/catways/${reservation.catwayNumber}/reservations/${reservation._id}`}
                            className="btn btn-sm btn-secondary"
                          >
                            <FaEye />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <FaCalendarAlt className="empty-state-icon" />
                <h3>Aucune réservation en cours</h3>
                <p>Il n'y a pas de réservation active pour le moment.</p>
                <Link to="/reservations/create" className="btn btn-primary">
                  <FaPlus /> Créer une réservation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Accès rapides */}
        <div className="card mt-4 fade-in">
          <div className="card-header">
            <h3>
              <FaBolt /> Accès rapides
            </h3>
          </div>
          <div className="card-body">
            <div className="btn-group">
              <Link to="/catways/create" className="btn btn-primary">
                <FaPlus /> Nouveau Catway
              </Link>
              <Link to="/reservations/create" className="btn btn-success">
                <FaCalendarPlus /> Nouvelle Réservation
              </Link>
              <Link to="/users/create" className="btn btn-info">
                <FaUserPlus /> Nouvel Utilisateur
              </Link>
              <Link to="/documentation" className="btn btn-secondary">
                <FaBook /> Documentation API
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
