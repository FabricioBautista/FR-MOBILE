import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// api.js
const API_URL = 'http://192.168.0.4:8080';

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    await SecureStore.setItemAsync('token', response.data.token);
    return response.data;
  };




