import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import ErrorMessage from '../components/ErrorMessage.jsx';

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
    <div className="container" style={{ maxWidth: '420px' }}>
      <h2>Create Passenger Account</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} className="card">
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        <label>Contact Number</label>
        <input name="contact" value={form.contact} onChange={handleChange} />
        <button className="btn" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
      </form>
    </div>
  );
};

export default RegisterPassengerPage;
