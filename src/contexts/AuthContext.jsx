import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert credentials to form data format for OAuth2
      const formData = new URLSearchParams();
      
      // Handle both direct string parameters and object with credentials
      if (typeof email === 'string' && typeof password === 'string') {
        formData.append('username', email);
        formData.append('password', password);
      } else {
        // Handle object form
        const credentials = email;
        formData.append('username', credentials.email || credentials.username);
        formData.append('password', credentials.password);
      }
      
      const response = await authAPI.login(formData);
      
      // Get user data after successful login
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      
      return { success: true, data: response };
    } catch (error) {
      const apiError = apiUtils.handleApiError(error);
      setError(apiError.message);
      return { success: false, error: apiError };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      // Auto-login after successful registration
      const loginResult = await login(userData.email, userData.password);
      
      return loginResult;
    } catch (error) {
      const apiError = apiUtils.handleApiError(error);
      setError(apiError.message);
      return { success: false, error: apiError };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };
  
  const updateProfile = (updatedUserData) => {
    // In a real application, you would make an API call here
    // For now, we'll just update the local state
    setUser({
      ...user,
      ...updatedUserData
    });
    return { success: true };
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
