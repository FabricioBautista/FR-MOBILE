import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = 'http://127.0.0.1:8080';

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  await SecureStore.setItemAsync('token', response.data.token);
  return response.data;
};

export const fetchExperiences = async (filters) => {
  const response = await api.get('/experiences', { params: filters });
  return response.data;
};

export const fetchExperienceDetails = async (id) => {
  const response = await api.get(`/experiences/${id}`);
  return response.data;
};

// Otros métodos según los endpoints de tu backend
