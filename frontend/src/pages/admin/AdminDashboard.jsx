import { useEffect, useState } from 'react';
import * as userService from '../../services/userService.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';

const emptyForm = { name: '', email: '', password: '', role: 'driver', nic: '', contact: '', licenseNo: '' };

const AdminDashboard = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadStaff = async () => {
    setLoading(true);
    try {
      setStaff(await userService.getStaffList());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.contact && !/^(?:\+94|0)?7[01245678]\d{7}$/.test(form.contact.trim())) {
      setError('Contact number must be a valid 10-digit Sri Lankan phone number (e.g. 0771234567).');
      return;
    }
    if (form.nic && !/^(?:\d{9}[vVxX]|\d{12})$/.test(form.nic.trim())) {
      setError('NIC must be a valid Sri Lankan NIC (e.g. 901234567V or 199012345678).');
      return;
    }
    setSubmitting(true);
    try {
      await userService.registerStaff(form);
      setSuccess(`${form.role === 'driver' ? 'Driver' : 'Conductor'} registered successfully.`);
      setForm(emptyForm);
      loadStaff();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div className="grid-2">
        <div className="card">
          <h3>Register Driver / Conductor</h3>
          <ErrorMessage message={error} />
          {success && <div className="success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} />
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="driver">Bus Driver</option>
              <option value="conductor">Conductor</option>
            </select>
            <label>NIC / ID</label>
            <input name="nic" value={form.nic} onChange={handleChange} />
            <label>Contact Number</label>
            <input name="contact" value={form.contact} onChange={handleChange} />
            {form.role === 'driver' && (
              <>
                <label>License No.</label>
                <input name="licenseNo" value={form.licenseNo} onChange={handleChange} />
              </>
            )}
            <button className="btn" disabled={submitting}>
              {submitting ? 'Registering…' : 'Register Staff'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Registered Staff</h3>
          {loading ? (
            <Loading />
          ) : staff.length === 0 ? (
            <p className="muted">No staff registered yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{s.role}</td>
                    <td>{s.contact || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
