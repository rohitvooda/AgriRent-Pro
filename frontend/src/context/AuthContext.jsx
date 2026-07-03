import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logoutUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      
      // Fetch user profile after setting token
      const profile = await authService.getMe();
      setUser(profile);
      return profile;
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      await authService.register(userData);
      // Automatically log user in after successful registration
      return await loginUser(userData.email, userData.password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isOwner: user?.role === 'owner',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
