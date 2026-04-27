import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const apiBaseUrl = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

export const setApiAuthToken = (accessToken: string | null) => {
  if (accessToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return;
  }

  delete api.defaults.headers.common['Authorization'];
};

export default api;
