import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api, { apiBaseUrl, setApiAuthToken } from '../services/api';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  provider?: string;
}

const user = ref<AuthUser | null>(null);
const token = ref<string | null>(localStorage.getItem('token'));
const isRestoring = ref(false);

const setSession = (accessToken: string, userData?: AuthUser | null) => {
  token.value = accessToken;
  if (userData) {
    user.value = userData;
  }
  localStorage.setItem('token', accessToken);
  setApiAuthToken(accessToken);
};

const clearSession = () => {
  token.value = null;
  user.value = null;
  localStorage.removeItem('token');
  setApiAuthToken(null);
};

const parseApiError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    return typeof message === 'string' && message.trim().length > 0
      ? message
      : fallback;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

const fetchProfile = async () => {
  const response = await api.get('/auth/me');
  user.value = response.data;
};

if (token.value) {
  setApiAuthToken(token.value);
}

export const authState = { user, token, isRestoring };

export const restoreSession = async () => {
  if (!token.value) {
    return;
  }

  isRestoring.value = true;

  try {
    await fetchProfile();
  } catch (error) {
    clearSession();
    throw error;
  } finally {
    isRestoring.value = false;
  }
};

export function useAuth() {
  const router = useRouter();

  const login = async (
    credentials: { email: string; password: string },
    redirectTo?: string,
  ) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, user: userData } = response.data || {};
      if (!accessToken) {
        throw new Error('Login failed. Missing access token from server.');
      }

      setSession(accessToken, userData ?? null);
      await router.push(redirectTo || '/');
    } catch (error) {
      throw new Error(parseApiError(error, 'Login failed. Please try again.'));
    }
  };

  const signup = async (userData: { name: string; email: string; password: string }) => {
    try {
      await api.post('/auth/signup', userData);
      await router.push({ path: '/login', query: { registered: '1' } });
    } catch (error) {
      throw new Error(parseApiError(error, 'Signup failed. Please try again.'));
    }
  };

  const completeOAuth = async (accessToken: string) => {
    try {
      setSession(accessToken);
      await fetchProfile();
      await router.push('/');
    } catch (error) {
      clearSession();
      throw new Error(parseApiError(error, 'OAuth login failed.'));
    }
  };

  const startGoogleLogin = () => {
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  const logout = async () => {
    clearSession();
    await router.push('/login');
  };

  return {
    user,
    token,
    isRestoring,
    login,
    signup,
    logout,
    startGoogleLogin,
    completeOAuth,
  };
}
