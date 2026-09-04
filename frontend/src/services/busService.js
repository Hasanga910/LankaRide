import api from './api.js';

export const searchBuses = async (from, to) => {
  const { data } = await api.get('/buses/search', { params: { from, to } });
  return data;
};

export const getMyBuses = async () => {
  const { data } = await api.get('/buses/mine');
  return data;
};

export const createBus = async (payload) => {
  const { data } = await api.post('/buses', payload);
  return data;
};

export const updateStatus = async (id, status) => {
  const { data } = await api.put(`/buses/${id}/status`, { status });
  return data;
};

export const updateBusDetails = async (id, payload) => {
  const { data } = await api.put(`/buses/${id}/details`, payload);
  return data;
};

export const updateSeats = async (id, action, value) => {
  const { data } = await api.put(`/buses/${id}/seats`, { action, value });
  return data;
};
