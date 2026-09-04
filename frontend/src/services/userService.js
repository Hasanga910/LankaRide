import api from './api.js';

export const registerStaff = async (payload) => {
  const { data } = await api.post('/users/register-staff', payload);
  return data;
};

export const getStaffList = async () => {
  const { data } = await api.get('/users/staff');
  return data;
};

export const getMyProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

export const updateMyProfile = async (profile) => {
  const { data } = await api.put('/users/me', profile);
  return data;
};

export const deleteMyAccount = async () => {
  const { data } = await api.delete('/users/me');
  return data;
};

