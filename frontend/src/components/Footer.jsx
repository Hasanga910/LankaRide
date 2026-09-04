import { Link } from 'react-router-dom';
import Logo from './ui/Logo.jsx';

const Footer = () => (
  <footer className="bg-navy-950 text-gray-300 mt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <Logo size={28} tone="inverted" />
        <p className="text-sm text-gray-400 mt-2 max-w-sm">
          Role-based bus management &amp; live seat availability for Sri Lanka.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/search" className="hover:text-white transition-colors">Search Buses</Link>
        <Link to="/about" className="hover:text-white transition-colors">About</Link>
      </div>
    </div>
    <div className="border-t border-white/10">
      <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-500">
        © 2026 LankaRide.
      </p>
    </div>
  </footer>
);

export default Footer;
