import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

// Importation des pages de l'application
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Documentation from './pages/Documentation'

// Importation des pages liées aux Catways (emplacements de bateaux)
import CatwaysIndex from './pages/catways/CatwaysIndex'
import CatwayShow from './pages/catways/CatwaysShow'
import CatwayCreate from './pages/catways/CatwaysCreate'
import CatwayEdit from './pages/catways/CatwaysEdit'

// Importation des pages liées aux Réservations
import ReservationsIndex from './pages/reservations/ReservationsIndex'
import ReservationShow from './pages/reservations/ReservationShow'
import ReservationCreate from './pages/reservations/ReservationCreate'
import ReservationEdit from './pages/reservations/ReservationEdit'

// Importation des pages liées aux Utilisateurs (membres du personnel)
import UsersIndex from './pages/users/UsersIndex'
import UserShow from './pages/users/UserShow'
import UserCreate from './pages/users/UserCreate'
import UserEdit from './pages/users/UserEdit'

/**
 * Composant principal gérant le routage de l'application.
 * Définit la structure globale avec Navbar, Main Content et Footer.
 */
function App() {
  return (
    <div className="app">
      <Navbar /> {/* Barre de navigation visible sur toutes les pages */}
      
      <main className="main-content">
        <Routes>
          {/* --- ROUTES PUBLIQUES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/documentation" element={<Documentation />} />

          {/* --- ROUTES PROTÉGÉES (Nécessitent une connexion) --- */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          {/* Gestion des Catways */}
          <Route path="/catways" element={
            <ProtectedRoute><CatwaysIndex /></ProtectedRoute>
          } />
          <Route path="/catways/create" element={
            <ProtectedRoute><CatwayCreate /></ProtectedRoute>
          } />
          <Route path="/catways/:id" element={
            <ProtectedRoute><CatwayShow /></ProtectedRoute>
          } />
          <Route path="/catways/:id/edit" element={
            <ProtectedRoute><CatwayEdit /></ProtectedRoute>
          } />

          {/* Gestion des Réservations */}
          <Route path="/reservations" element={
            <ProtectedRoute><ReservationsIndex /></ProtectedRoute>
          } />
          <Route path="/reservations/create" element={
            <ProtectedRoute><ReservationCreate /></ProtectedRoute>
          } />
          <Route path="/catways/:catwayId/reservations/create" element={
            <ProtectedRoute><ReservationCreate /></ProtectedRoute>
          } />
          <Route path="/catways/:catwayId/reservations/:id" element={
            <ProtectedRoute><ReservationShow /></ProtectedRoute>
          } />
          <Route path="/catways/:catwayId/reservations/:id/edit" element={
            <ProtectedRoute><ReservationEdit /></ProtectedRoute>
          } />

          {/* Gestion des Utilisateurs */}
          <Route path="/users" element={
            <ProtectedRoute><UsersIndex /></ProtectedRoute>
          } />
          <Route path="/users/create" element={
            <ProtectedRoute><UserCreate /></ProtectedRoute>
          } />
          <Route path="/users/:email" element={
            <ProtectedRoute><UserShow /></ProtectedRoute>
          } />
          <Route path="/users/:email/edit" element={
            <ProtectedRoute><UserEdit /></ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <Footer /> {/* Pied de page visible sur toutes les pages */}
    </div>
  )
}

export default App
