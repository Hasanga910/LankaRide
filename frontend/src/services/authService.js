import api from './api.js';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registerPassenger = async (payload) => {
  const { data } = await api.post('/auth/register-passenger', payload);
  return data;
};
