import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <Link to="/" className="brand">🚌 BusBuddy LK</Link>
      <div className="links">
        <Link to="/search">Search Buses</Link>
        <Link to="/about">About</Link>
        {user?.role === 'passenger' && (
          <>
            <Link to="/passenger">My Dashboard</Link>
            <Link to="/passenger/profile">My Profile</Link>
          </>
        )}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user?.role === 'driver' && <Link to="/driver">Driver</Link>}
        {user?.role === 'conductor' && <Link to="/conductor">Conductor</Link>}
        {!user && <Link to="/login">Login</Link>}
        {user && <button onClick={handleLogout}>Logout ({user.name})</button>}
      </div>
    </div>
  );
};

export default Navbar;
