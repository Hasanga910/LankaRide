export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidPhone = (contact) => {
  if (!contact) return true; // optional
  return /^(?:\+94|0)?7[01245678]\d{7}$/.test(contact.trim());
};

export const isValidNIC = (nic) => {
  if (!nic) return true; // optional
  return /^(?:\d{9}[vVxX]|\d{12})$/.test(nic.trim());
};

export const isValidBusNumber = (busNumber) => {
  if (!busNumber) return false;
  return /^[a-zA-Z0-9\s-]{3,12}$/.test(busNumber.trim());
};
