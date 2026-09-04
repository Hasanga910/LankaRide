import api from './api.js';

export const registerStaff = async (payload) => {
  const { data } = await api.post('/users/register-staff', payload);
  return data;
};

export const getStaffList = async () => {
  const { data } = await api.get('/users/staff');
  return data;
};
