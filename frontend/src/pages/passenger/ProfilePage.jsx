import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../services/userService.js';
import { useAuth } from '../../hooks/useAuth.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';

const ProfilePage = () => {
  const { logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getMyProfile();
      setProfile(data);
      setForm({
        name: data.name || '',
        email: data.email || '',
        contact: data.contact || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStartEdit = () => {
    setError('');
    setSuccess('');
    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      contact: profile?.contact || '',
    });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setError('');
    setEditing(false);
    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      contact: profile?.contact || '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!form.email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!form.contact.trim()) {
      setError('Please enter your contact number.');
      return;
    }

    setSaving(true);
    try {
      const updated = await userService.updateMyProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        contact: form.contact.trim(),
      });
      setProfile(updated);
      if (updateUser) {
        updateUser(updated);
      }
      setEditing(false);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    setDeleting(true);
    setError('');
    try {
      await userService.deleteMyAccount();
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '560px' }}>
      <h2>My Profile</h2>

      <ErrorMessage message={error} />
      {success && <div className="success">{success}</div>}

      {loading && <Loading />}

      {!loading && profile && (
        <>
          <div className="card">
            {!editing ? (
              <>
                <table style={{ marginBottom: '1.2rem' }}>
                  <tbody>
                    <tr>
                      <th style={{ width: '35%' }}>Full Name</th>
                      <td>{profile.name}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{profile.email}</td>
                    </tr>
                    <tr>
                      <th>Contact Number</th>
                      <td>{profile.contact || 'Not set'}</td>
                    </tr>
                    <tr>
                      <th>Account Role</th>
                      <td style={{ textTransform: 'capitalize' }}>{profile.role}</td>
                    </tr>
                  </tbody>
                </table>

                <button className="btn" onClick={handleStartEdit}>
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSave}>
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />

                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />

                <label>Contact Number</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="e.g. 0712345678"
                />

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button className="btn" type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="card" style={{ border: '1px solid #f8d7da', marginTop: '1.5rem' }}>
            <h3 style={{ color: 'var(--red)', marginTop: 0 }}>Delete Account</h3>
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              Permanently delete your passenger account and all associated profile information. This action
              cannot be undone.
            </p>
            <button
              className="btn"
              style={{ background: 'var(--red)' }}
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete Account'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
