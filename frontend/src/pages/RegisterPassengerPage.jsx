import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/ui/Logo.jsx';

const RegisterPassengerPage = () => {
  const { registerPassenger } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', contact: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await registerPassenger(form);
      navigate('/passenger');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-800 flex-col justify-center px-16 relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 -bottom-16 opacity-10">
          <Logo size={320} tone="inverted" variant="mark" />
        </div>
        <div className="relative">
          <Logo size={40} tone="inverted" />
          <h2 className="mt-8 text-3xl font-extrabold text-white leading-tight max-w-sm">
            Join thousands of daily commuters.
          </h2>
          <p className="mt-4 text-navy-100 max-w-sm">
            Create a passenger account to search routes and check live seat availability in seconds.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size={36} />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-800">Create Passenger Account</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">It only takes a minute.</p>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} autoComplete="name" />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <Input
              label="Contact Number"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              autoComplete="tel"
            />
            <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={loading}>
              {loading ? 'Creating…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-navy-800 hover:text-orange-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPassengerPage;
