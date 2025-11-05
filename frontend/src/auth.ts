import { login, register } from './services/authService';

export { login, register };

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}
