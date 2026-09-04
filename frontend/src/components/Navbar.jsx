import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Logo from './ui/Logo.jsx';
import Button from './ui/Button.jsx';

const linkClasses = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${isActive ? 'text-orange-500' : 'text-navy-800 hover:text-orange-500'}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo size={32} />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user && <NavLink to="/search" className={linkClasses}>Search Buses</NavLink>}
          <NavLink to="/about" className={linkClasses}>About</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClasses}>Admin</NavLink>}
          {user?.role === 'driver' && <NavLink to="/driver" className={linkClasses}>Driver</NavLink>}
          {user?.role === 'conductor' && <NavLink to="/conductor" className={linkClasses}>Conductor</NavLink>}
          {!user && (
            <Button to="/login" variant="primary" size="sm">Login</Button>
          )}
          {user && (
            <Button onClick={handleLogout} variant="outline" size="sm">Logout ({user.name})</Button>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-navy-800 hover:bg-navy-50"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 sm:px-6 py-3 flex flex-col gap-3">
          {user && (
            <NavLink to="/search" className={linkClasses} onClick={() => setOpen(false)}>
              Search Buses
            </NavLink>
          )}
          <NavLink to="/about" className={linkClasses} onClick={() => setOpen(false)}>About</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClasses} onClick={() => setOpen(false)}>Admin</NavLink>
          )}
          {user?.role === 'driver' && (
            <NavLink to="/driver" className={linkClasses} onClick={() => setOpen(false)}>Driver</NavLink>
          )}
          {user?.role === 'conductor' && (
            <NavLink to="/conductor" className={linkClasses} onClick={() => setOpen(false)}>Conductor</NavLink>
          )}
          {!user && (
            <Button to="/login" variant="primary" size="sm" className="w-full" onClick={() => setOpen(false)}>
              Login
            </Button>
          )}
          {user && (
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
              Logout ({user.name})
            </Button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
