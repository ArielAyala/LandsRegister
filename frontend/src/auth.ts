import api from './api';

export async function login(username: string, password: string) {
  const res = await api.post('/auth/login', { username, password });
  const token = res.data?.token;
  if (token) localStorage.setItem('token', token);
  return token;
}

export async function register(username: string, email: string, password: string) {
  const res = await api.post('/auth/register', { username, email, password });
  return res.data;
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}
