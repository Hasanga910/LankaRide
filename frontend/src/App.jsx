import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPassengerPage from './pages/RegisterPassengerPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import DriverDashboard from './pages/driver/DriverDashboard.jsx';
import ConductorDashboard from './pages/conductor/ConductorDashboard.jsx';
import SearchBusesPage from './pages/passenger/SearchBusesPage.jsx';
import TrackBusPage from './pages/passenger/TrackBusPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPassengerPage />} />
        <Route path="/search" element={<SearchBusesPage />} />
        <Route path="/track/:id" element={<TrackBusPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver"
          element={
            <ProtectedRoute roles={['driver']}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conductor"
          element={
            <ProtectedRoute roles={['conductor']}>
              <ConductorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
