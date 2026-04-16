'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const USERS = {
  admin: { id: 'admin', name: 'Admin User', role: 'admin', email: 'admin@salesbot.com' },
  user: { id: 'user1', name: 'Sales Rep', role: 'user', email: 'rep@salesbot.com' },
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sb_user');
    if (saved) setCurrentUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (role) => {
    const user = USERS[role];
    setCurrentUser(user);
    localStorage.setItem('sb_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sb_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
