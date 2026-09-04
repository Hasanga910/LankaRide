import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/ui/Logo.jsx';

const roleDashboard = {
  admin: { to: '/admin', label: 'Go to Admin Dashboard' },
  driver: { to: '/driver', label: 'Go to Driver Dashboard' },
  conductor: { to: '/conductor', label: 'Go to Conductor Dashboard' },
};

const features = [
  {
    title: 'Live Seat Availability',
    copy: 'See real seat counts before you reach the stop, updated manually by the conductor as passengers board and alight.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4M9 17H5a2 2 0 01-2-2V7a2 2 0 012-2h9l4 4v6a2 2 0 01-2 2h-1M9 17a2 2 0 104 0" />
      </svg>
    ),
  },
  {
    title: 'Role-Based Dashboards',
    copy: 'Admins onboard staff, drivers register buses, conductors track seats — each role gets a purpose-built workspace.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 3a4 4 0 10-8 0" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Trip Status',
    copy: 'Know at a glance whether a bus hasn’t started, is en route, or has already arrived.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const dash = user && roleDashboard[user.role];

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-800">
        <div className="pointer-events-none absolute -right-24 -top-24 opacity-10 sm:opacity-15">
          <Logo size={420} tone="inverted" variant="mark" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 text-orange-300 text-xs font-bold px-3 py-1 mb-5">
              Built for Sri Lanka's roads
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Bus travel, without the guesswork.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-navy-100">
              Role-based bus management &amp; live seat availability for Sri Lanka. Search buses and see
              live seat counts and trip status before you even reach the stop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user && (
                <Button to="/search" variant="primary" size="md">Search Buses</Button>
              )}
              {!user && (
                <Button to="/login" variant="outline-white" size="md">Login</Button>
              )}
            </div>
            {dash && (
              <Link to={dash.to} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-orange-300 hover:text-orange-200">
                {dash.label}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
              <div className="h-11 w-11 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-navy-800">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
