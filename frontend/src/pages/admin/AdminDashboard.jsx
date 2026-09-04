import { useEffect, useState } from 'react';
import * as userService from '../../services/userService.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Table from '../../components/ui/Table.jsx';

const emptyForm = { name: '', email: '', password: '', role: 'driver', nic: '', contact: '', licenseNo: '' };

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 3a4 4 0 10-8 0" />
  </svg>
);

const WheelIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4M9 17H5a2 2 0 01-2-2V7a2 2 0 012-2h9l4 4v6a2 2 0 01-2 2h-1M9 17a2 2 0 104 0" />
  </svg>
);

const TicketIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h2m6-14h2a2 2 0 012 2v3a2 2 0 100 4v3a2 2 0 01-2 2h-2M9 5v14" />
  </svg>
);

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
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
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

  const driverCount = staff.filter((s) => s.role === 'driver').length;
  const conductorCount = staff.filter((s) => s.role === 'conductor').length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Staff" value={staff.length} icon={<UsersIcon />} />
        <StatCard label="Drivers" value={driverCount} icon={<WheelIcon />} />
        <StatCard label="Conductors" value={conductorCount} icon={<TicketIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        <Card>
          <h3 className="text-base font-bold text-navy-800 mb-4">Register Driver / Conductor</h3>
          <ErrorMessage message={error} />
          {success && <Alert variant="success">{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
            <Select label="Role" name="role" value={form.role} onChange={handleChange}>
              <option value="driver">Bus Driver</option>
              <option value="conductor">Conductor</option>
            </Select>
            <Input label="NIC / ID" name="nic" value={form.nic} onChange={handleChange} />
            <Input label="Contact Number" name="contact" value={form.contact} onChange={handleChange} />
            {form.role === 'driver' && (
              <Input label="License No." name="licenseNo" value={form.licenseNo} onChange={handleChange} />
            )}
            <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={submitting}>
              {submitting ? 'Registering…' : 'Register Staff'}
            </Button>
          </form>
        </Card>

        <Card padded={false}>
          <h3 className="text-base font-bold text-navy-800 px-5 sm:px-6 pt-5 sm:pt-6">Registered Staff</h3>
          <div className="p-5 sm:p-6 pt-3">
            {loading ? (
              <Loading />
            ) : staff.length === 0 ? (
              <p className="text-sm text-gray-500">No staff registered yet.</p>
            ) : (
              <Table columns={['Name', 'Role', 'Contact']}>
                {staff.map((s) => (
                  <tr key={s._id}>
                    <td className="px-3 py-2.5 text-sm font-medium text-navy-800">{s.name}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={s.role === 'driver' ? 'info' : 'orange'}>{s.role}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500">{s.contact || '-'}</td>
                  </tr>
                ))}
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
