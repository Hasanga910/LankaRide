import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPassengerPage from './pages/RegisterPassengerPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import DriverDashboard from './pages/driver/DriverDashboard.jsx';
import ConductorDashboard from './pages/conductor/ConductorDashboard.jsx';
import SearchBusesPage from './pages/passenger/SearchBusesPage.jsx';
import BusDetailsPage from './pages/passenger/BusDetailsPage.jsx';
import ProfilePage from './pages/passenger/ProfilePage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterPassengerPage /></PublicLayout>} />
      <Route path="/search" element={<PublicLayout><SearchBusesPage /></PublicLayout>} />
      <Route path="/track/:id" element={<PublicLayout><TrackBusPage /></PublicLayout>} />

      <Route

        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout title="Admin Dashboard">
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver"
        element={
          <ProtectedRoute roles={['driver']}>
            <AdminLayout title="Driver Dashboard">
              <DriverDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/conductor"
        element={
          <ProtectedRoute roles={['conductor']}>
            <AdminLayout title="Conductor Dashboard">
              <ConductorDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/passenger/buses/:id"
        element={
          <ProtectedRoute roles={['passenger']}>
            <PublicLayout>
              <BusDetailsPage />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/passenger/profile"
        element={
          <ProtectedRoute roles={['passenger']}>
            <PublicLayout>
              <ProfilePage />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
