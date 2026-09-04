import { createContext, useState } from 'react';
import * as authService from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bb_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem('bb_token', data.token);
    localStorage.setItem('bb_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => persist(await authService.login(email, password));

  const registerPassenger = async (payload) => persist(await authService.registerPassenger(payload));

  const logout = () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const userObj = {
      id: updatedUser._id || updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
    localStorage.setItem('bb_user', JSON.stringify(userObj));
    setUser(userObj);
  };

  return (
    <AuthContext.Provider value={{ user, login, registerPassenger, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
