import Bus from '../models/Bus.js';

const populated = (query) =>
  query.populate('driver', 'name contact').populate('conductor', 'name contact');

// --- Driver actions -------------------------------------------------------

export const createBus = async (driverId, { busNumber, from, to, capacity, fare }) => {
  const exists = await Bus.findOne({ busNumber });
  if (exists) {
    const error = new Error('A bus with this number is already registered');
    error.statusCode = 400;
    throw error;
  }
  return Bus.create({
    busNumber,
    from,
    to,
    capacity,
    fare: fare || 0,
    freeSeats: capacity, // starts full of free seats until the conductor updates it
    driver: driverId,
  });
};

export const getMyBuses = async (driverId) => Bus.find({ driver: driverId }).sort({ createdAt: -1 });

export const updateStatus = async (busId, driverId, status) => {
  const bus = await Bus.findById(busId);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }
  if (String(bus.driver) !== String(driverId)) {
    const error = new Error('You can only update the status of your own bus');
    error.statusCode = 403;
    throw error;
  }
  if (!['Not Started', 'En Route', 'Arrived'].includes(status)) {
    const error = new Error('Status must be one of: Not Started, En Route, Arrived');
    error.statusCode = 400;
    throw error;
  }
  bus.status = status;
  await bus.save();
  return bus;
};

// --- Conductor actions ------------------------------------------------

export const updateBusDetails = async (busId, conductorId, { from, to, capacity, fare }) => {
  const bus = await Bus.findById(busId);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }

  if (from) bus.from = from;
  if (to) bus.to = to;
  if (fare !== undefined && fare !== '') bus.fare = Number(fare);

  if (capacity !== undefined && capacity !== '') {
    const newCapacity = Number(capacity);
    const occupied = bus.capacity - bus.freeSeats;
    if (newCapacity < occupied) {
      const error = new Error('New capacity cannot be less than the seats already occupied');
      error.statusCode = 400;
      throw error;
    }
    bus.freeSeats += newCapacity - bus.capacity;
    bus.capacity = newCapacity;
  }

  bus.conductor = conductorId; // the conductor editing the bus becomes its assigned conductor
  await bus.save();
  return bus;
};

// Manual seat-count update — no e-ticketing, the conductor is the sole
// source of truth for how many free seats a bus currently has.
export const updateSeats = async (busId, conductorId, action, value) => {
  const bus = await Bus.findById(busId);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }

  let newCount = bus.freeSeats;
  if (action === 'increment') {
    newCount += 1;
  } else if (action === 'decrement') {
    newCount -= 1;
  } else if (action === 'set') {
    newCount = Number(value);
    if (Number.isNaN(newCount)) {
      const error = new Error('Free seat count must be a number');
      error.statusCode = 400;
      throw error;
    }
  } else {
    const error = new Error('Action must be one of: increment, decrement, set');
    error.statusCode = 400;
    throw error;
  }

  if (newCount < 0) {
    const error = new Error('No free seats left — cannot go below 0');
    error.statusCode = 400;
    throw error;
  }
  if (newCount > bus.capacity) {
    const error = new Error('Cannot exceed the bus\'s total capacity');
    error.statusCode = 400;
    throw error;
  }

  bus.freeSeats = newCount;
  bus.conductor = conductorId;
  await bus.save();
  return bus;
};

// --- Passenger / public actions ---------------------------------------

export const searchBuses = async (from, to) => {
  const query = {};
  if (from) query.from = new RegExp(from.trim(), 'i');
  if (to) query.to = new RegExp(to.trim(), 'i');
  return populated(Bus.find(query)).sort({ createdAt: -1 });
};

export const getBusById = async (id) => {
  const bus = await populated(Bus.findById(id));
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }
  return bus;
};

// --- Live Location Tracking -------------------------------------------

export const updateLocation = async (busId, conductorId, { latitude, longitude }) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    const error = new Error('Valid latitude between -90 and 90 is required');
    error.statusCode = 400;
    throw error;
  }
  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    const error = new Error('Valid longitude between -180 and 180 is required');
    error.statusCode = 400;
    throw error;
  }

  const bus = await Bus.findById(busId);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }

  bus.conductor = conductorId;
  bus.trackingActive = true;
  bus.currentLocation = {
    latitude: lat,
    longitude: lng,
    updatedAt: new Date(),
  };

  await bus.save();
  return {
    _id: bus._id,
    busNumber: bus.busNumber,
    route: `${bus.from} → ${bus.to}`,
    from: bus.from,
    to: bus.to,
    trackingActive: bus.trackingActive,
    currentLocation: bus.currentLocation,
  };
};

export const stopTracking = async (busId, conductorId) => {
  const bus = await Bus.findById(busId);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }

  bus.conductor = conductorId;
  bus.trackingActive = false;
  if (bus.currentLocation) {
    bus.currentLocation.updatedAt = new Date();
  }

  await bus.save();
  return {
    _id: bus._id,
    busNumber: bus.busNumber,
    route: `${bus.from} → ${bus.to}`,
    from: bus.from,
    to: bus.to,
    trackingActive: bus.trackingActive,
    currentLocation: bus.currentLocation,
  };
};

export const getBusLocation = async (busId) => {
  const bus = await Bus.findById(busId).select('busNumber from to trackingActive currentLocation status');
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    _id: bus._id,
    busNumber: bus.busNumber,
    route: `${bus.from} → ${bus.to}`,
    from: bus.from,
    to: bus.to,
    status: bus.status,
    trackingActive: Boolean(bus.trackingActive),
    currentLocation: bus.currentLocation || null,
  };
};

