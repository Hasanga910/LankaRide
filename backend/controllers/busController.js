import * as busService from '../services/busService.js';
import { isValidBusNumber } from '../utils/validators.js';

export const createBus = async (req, res) => {
  try {
    const { busNumber, route, from, to, capacity, fare } = req.body;
    if (!busNumber || !route || !from || !to || !capacity) {
      return res.status(400).json({ message: 'Bus number, route, from, to and capacity are required' });
    }
    if (!isValidBusNumber(busNumber)) {
      return res.status(400).json({ message: 'Please enter a valid bus number (e.g. NB-4521 or 62-1020)' });
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      return res.status(400).json({ message: 'Departure (From) and Destination (To) cannot be the same city' });
    }
    if (Number(capacity) <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than 0' });
    }
    if (fare !== undefined && Number(fare) < 0) {
      return res.status(400).json({ message: 'Fare cannot be negative' });
    }
    const bus = await busService.createBus(req.user._id, { busNumber, route, from, to, capacity, fare });
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
    const { from, to, fare } = req.body;
    if (from && to && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      return res.status(400).json({ message: 'Departure (From) and Destination (To) cannot be the same city' });
    }
    if (fare !== undefined && Number(fare) < 0) {
      return res.status(400).json({ message: 'Fare cannot be negative' });
    }
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

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    const result = await busService.updateLocation(req.params.id, req.user._id, { latitude, longitude });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const stopTracking = async (req, res) => {
  try {
    const result = await busService.stopTracking(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getBusLocation = async (req, res) => {
  try {
    const result = await busService.getBusLocation(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

