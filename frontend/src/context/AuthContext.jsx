import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'user';

const publicUser = (user) => ({
  id: user.id || user._id,
  name: user.name,
  email: user.email,
  tel: user.tel,
  role: user.role,
});

const readCachedUser = () => {
  try {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const saveUser = (user) => {
  const cleanUser = publicUser(user);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
  return cleanUser;
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem(USER_STORAGE_KEY);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let retrySession = false;
    const syncSession = async (initial = false) => {
      const token = localStorage.getItem('token');
      if (!token) {
        clearSession();
        if (mounted) { setUser(null); setLoading(false); }
        return;
      }

      const cachedUser = readCachedUser();
      if (initial && cachedUser && mounted) setUser(cachedUser);
      if (initial && mounted) setLoading(true);

      try {
        const res = await api.get('/auth/me');
        retrySession = false;
        if (mounted) setUser(saveUser(res.data.data));
      } catch (error) {
        if (error.response?.status === 401) {
          retrySession = false;
          clearSession();
          if (mounted) setUser(null);
        } else {
          // Network errors, server errors and rate limits do not mean the token is invalid.
          retrySession = true;
          if (mounted && cachedUser) setUser(cachedUser);
          else if (mounted) setUser(null);
        }
      } finally {
        if (mounted && initial) setLoading(false);
      }
    };

    const retryIfNeeded = () => {
      if (retrySession && localStorage.getItem('token')) syncSession();
    };
    syncSession(true);
    window.addEventListener('online', retryIfNeeded);
    window.addEventListener('focus', retryIfNeeded);
    return () => {
      mounted = false;
      window.removeEventListener('online', retryIfNeeded);
      window.removeEventListener('focus', retryIfNeeded);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem('token', token);
    const cleanUser = saveUser(userData);
    setUser(cleanUser);
    return cleanUser;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const { token, ...userData } = res.data.data;
    localStorage.setItem('token', token);
    const cleanUser = saveUser(userData);
    setUser(cleanUser);
    return cleanUser;
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } finally {
      clearSession();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
