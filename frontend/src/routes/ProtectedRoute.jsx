import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// NOTE: this only hides routes in the UI. The real security boundary is the
// backend's authorize() middleware — see AGENT_INSTRUCTIONS.md Section 13.
const ProtectedRoute = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
