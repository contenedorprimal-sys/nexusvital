import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, usersAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      setError(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const register = async (userData) => {
    try {
      setError(null);
      const res = await authAPI.register(userData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const res = await authAPI.login(credentials);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await usersAPI.updateProfile(data);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar perfil';
      throw new Error(message);
    }
  };

  const updateSubscription = async (subscriptionType) => {
    try {
      const res = await usersAPI.updateSubscription({ subscription: subscriptionType });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar suscripción';
      throw new Error(message);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updateSubscription,
    refreshUser,
    isAuthenticated: !!user,
    isPremium: user?.subscription === 'monthly' || user?.subscription === 'annual',
    isAnnual: user?.subscription === 'annual',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
