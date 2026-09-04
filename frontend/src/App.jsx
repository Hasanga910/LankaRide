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
import BusDetailsPage from './pages/passenger/BusDetailsPage.jsx';
import ProfilePage from './pages/passenger/ProfilePage.jsx';
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
        <Route
          path="/passenger"
          element={
            <ProtectedRoute roles={['passenger']}>
              <SearchBusesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/buses/:id"
          element={
            <ProtectedRoute roles={['passenger']}>
              <BusDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/profile"
          element={
            <ProtectedRoute roles={['passenger']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
