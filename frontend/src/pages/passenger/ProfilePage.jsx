import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../services/userService.js';
import { useAuth } from '../../hooks/useAuth.js';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';

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

    if (!form.contact.trim()) {
      setError('Please enter your contact number.');
      return;
    }

    if (!/^\d{10}$/.test(form.contact.trim())) {
      setError('Contact number must be exactly 10 digits.');
      return;
    }

    setSaving(true);
    try {
      const updated = await userService.updateMyProfile({
        name: form.name.trim(),
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your passenger account details and preferences.</p>
      </div>

      <ErrorMessage message={error} />
      {success && <Alert variant="success">{success}</Alert>}

      {loading && <Loading />}

      {!loading && profile && (
        <>
          <Card>
            {!editing ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-navy-100 text-navy-800 font-bold text-lg flex items-center justify-center uppercase">
                      {profile.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-navy-800">{profile.name}</h2>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  <Badge variant="neutral">Passenger</Badge>
                </div>

                <div className="divide-y divide-gray-100 text-sm">
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-500">Full Name</span>
                    <span className="font-medium text-navy-800">{profile.name}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-500">Email Address</span>
                    <span className="font-medium text-navy-800">{profile.email}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-500">Contact Number</span>
                    <span className="font-medium text-navy-800">{profile.contact || 'Not set'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-500">Account Type</span>
                    <span className="font-medium text-navy-800 capitalize">{profile.role}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="sm" onClick={handleStartEdit}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <h2 className="text-lg font-bold text-navy-800 mb-2">Edit Account Information</h2>

                <Input
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

                <div>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 -mt-3 mb-4">
                    Email address is permanently linked to your account and cannot be changed.
                  </p>
                </div>

                <Input
                  label="Contact Number"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="e.g. 0712345678"
                  required
                />

                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary" size="md" loading={saving} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-100 bg-red-50/20">
            <h2 className="text-base font-bold text-danger">Delete Account</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Permanently delete your passenger account and all associated profile information. This action
              cannot be undone.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteAccount}
              loading={deleting}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete My Account'}
            </Button>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
