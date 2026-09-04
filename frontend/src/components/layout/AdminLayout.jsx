import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Logo from '../ui/Logo.jsx';
import Badge from '../ui/Badge.jsx';

const roleNav = {
  admin: [{ to: '/admin', label: 'Dashboard' }],
  driver: [{ to: '/driver', label: 'Dashboard' }],
  conductor: [{ to: '/conductor', label: 'Dashboard' }],
};

const roleBadgeVariant = { admin: 'orange', driver: 'info', conductor: 'success' };

const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const AdminLayout = ({ title, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = (user && roleNav[user.role]) || [];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <Link to="/" onClick={() => setSidebarOpen(false)}>
          <Logo size={28} tone="inverted" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold bg-white/10 text-white"
          >
            <DashboardIcon />
            {item.label}
          </Link>
        ))}
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-navy-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          View Public Site
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            {user?.role && <Badge variant={roleBadgeVariant[user.role] || 'neutral'}>{user.role}</Badge>}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm font-medium text-navy-200 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-navy-900">
        <div className="fixed w-64 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile off-canvas sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-navy-900 h-full">{sidebarContent}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="h-16 sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-navy-800 hover:bg-navy-50"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-navy-800">{title}</h1>
          </div>
          {user?.role && (
            <Badge variant={roleBadgeVariant[user.role] || 'neutral'} className="hidden sm:inline-flex">
              {user.role}
            </Badge>
          )}
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
