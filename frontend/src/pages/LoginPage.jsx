import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import ErrorMessage from '../components/ErrorMessage.jsx';

const roleHome = { admin: '/admin', driver: '/driver', conductor: '/conductor', passenger: '/search' };

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(roleHome[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px' }}>
      <h2>Login</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} className="card">
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        <button className="btn" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
      </form>
      <p className="muted">
        New passenger? <Link to="/register">Create an account</Link>
      </p>
      <p className="muted">
        Driver and Conductor accounts are created by the Admin — see the README for sample logins.
      </p>
    </div>
  );
};

export default LoginPage;
