import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5267/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const apiKey = import.meta.env.VITE_AWS_API_GATEWAY_KEY;
  if (apiKey && config.headers) {
    config.headers['x-api-key'] = apiKey;
  }
  return config;
});

export default api;
