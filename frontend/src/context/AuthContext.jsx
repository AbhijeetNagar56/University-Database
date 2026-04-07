/**
 * AuthContext — manages login state across the app.
 * Uses session-based auth (cookie sent by backend).
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user was previously logged in (persisted in localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('uao_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await apiLogin(username, password);
    const userData = { username };
    setUser(userData);
    localStorage.setItem('uao_user', JSON.stringify(userData));
    return res;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore logout errors
    }
    setUser(null);
    localStorage.removeItem('uao_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
