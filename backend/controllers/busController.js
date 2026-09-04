import * as busService from '../services/busService.js';

export const createBus = async (req, res) => {
  try {
    const { busNumber, from, to, capacity, fare } = req.body;
    if (!busNumber || !from || !to || !capacity) {
      return res.status(400).json({ message: 'Bus number, from, to and capacity are required' });
    }
    if (Number(capacity) <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than 0' });
    }
    const bus = await busService.createBus(req.user._id, { busNumber, from, to, capacity, fare });
    res.status(201).json(bus);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getMyBuses = async (req, res) => {
  try {
    const buses = await busService.getMyBuses(req.user._id);
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    const bus = await busService.updateStatus(req.params.id, req.user._id, status);
    res.status(200).json(bus);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const updateBusDetails = async (req, res) => {
  try {
    const bus = await busService.updateBusDetails(req.params.id, req.user._id, req.body);
    res.status(200).json(bus);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const updateSeats = async (req, res) => {
  try {
    const { action, value } = req.body;
    if (!action) return res.status(400).json({ message: 'Action is required' });
    const bus = await busService.updateSeats(req.params.id, req.user._id, action, value);
    res.status(200).json(bus);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const searchBuses = async (req, res) => {
  try {
    const { from, to } = req.query;
    const buses = await busService.searchBuses(from, to);
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBusById = async (req, res) => {
  try {
    const bus = await busService.getBusById(req.params.id);
    res.status(200).json(bus);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
