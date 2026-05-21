import axios from 'axios';
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackBaseUrl = 'http://localhost:3001';

if (!rawBaseUrl) {
  console.warn(
    `VITE_API_BASE_URL is not set. Falling back to ${fallbackBaseUrl}. ` +
      'Create a .env file in kdrc-web to override this.',
  );
}

export const apiBaseUrl = (rawBaseUrl || fallbackBaseUrl).replace(/\/+$/, '');

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
