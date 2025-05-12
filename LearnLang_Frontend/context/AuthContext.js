import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      
      if (response.data.status === 'Success') {
        const userInfo = {
          name: response.data.name,
          email: response.data.email,
          image: response.data.image
        };

        setUserInfo(userInfo);
        setUserToken(response.data.name); // Use a proper token in a real app
        
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        await AsyncStorage.setItem('userToken', response.data.name);
      } else {
        setError('Authentication failed');
      }
    } catch (error) {
      console.log('Login error:', error);
      setError(error.response?.data?.msg || 'An error occurred');
    }
    
    setIsLoading(false);
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/register', {
        name,
        email,
        password
      });
      
      if (response.data.status === 'Success') {
        return true;
      } else {
        setError(response.data.msg || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.log('Registration error:', error);
      setError(error.response?.data?.msg || 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const userInfo = await AsyncStorage.getItem('userInfo');
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
        setUserToken(userToken);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.log('isLogged in error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoading, 
        userToken, 
        userInfo, 
        error,
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};