import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const roleDashboard = {
  admin: { to: '/admin', label: 'Go to Admin Dashboard' },
  driver: { to: '/driver', label: 'Go to Driver Dashboard' },
  conductor: { to: '/conductor', label: 'Go to Conductor Dashboard' },
  passenger: { to: '/passenger', label: 'Go to Passenger Dashboard' },
};

const HomePage = () => {
  const { user } = useAuth();
  const dash = user && roleDashboard[user.role];

  return (
    <div className="container">
      <h1>Welcome to BusBuddy LK</h1>
      <p>
        Role-based bus management &amp; live seat availability for Sri Lanka. Search buses and see live
        seat counts and trip status before you even reach the stop.
      </p>
      <div className="card">
        <Link to="/search" className="btn">Search Buses</Link>{' '}
        {!user && (
          <Link to="/login" className="btn btn-secondary" style={{ marginLeft: '0.6rem' }}>
            Login
          </Link>
        )}
      </div>
      {dash && (
        <p>
          <Link to={dash.to}>{dash.label} →</Link>
        </p>
      )}
    </div>
  );
};

export default HomePage;
