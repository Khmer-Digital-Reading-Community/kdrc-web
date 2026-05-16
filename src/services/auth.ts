import axios from 'axios';
import { ref } from 'vue';
import api, { apiBaseUrl, setApiAuthToken } from './api';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  provider?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

const token = ref<string | null>(localStorage.getItem('token'));
const user = ref<AuthUser | null>(null);
const isRestoring = ref(false);

const parseApiError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    // backend returns { status: 'error', data: { message, errors }}
    const apiPayload = error.response?.data;
    const nested = apiPayload && typeof apiPayload === 'object' ? (apiPayload as any).data : null;
    const message =
      (nested && nested.message) ||
      apiPayload?.message ||
      apiPayload?.error ||
      error.message;

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }

    if (nested && nested.errors) {
      // If validation errors array, join for a simple string fallback
      if (Array.isArray(nested.errors)) return nested.errors.join('; ');
      return String(nested.errors);
    }

    return fallback;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

const unwrapResponseData = <T>(responseData: unknown): T => {
  if (responseData && typeof responseData === 'object') {
    const rd = responseData as any;
    if ('data' in rd) return rd.data as T;
  }

  return responseData as T;
};

const setSession = (accessToken: string, userData?: AuthUser | null) => {
  console.log('setSession called with token:', !!accessToken);
  token.value = accessToken;

  if (userData) {
    user.value = userData;
  }

  localStorage.setItem('token', accessToken);
  setApiAuthToken(accessToken);
  console.log('Token set in localStorage and state. token.value:', !!token.value);
};

const clearSession = () => {
  token.value = null;
  user.value = null;
  localStorage.removeItem('token');
  setApiAuthToken(null);
};

const fetchProfile = async () => {
  const response = await api.get<AuthUser>('/auth/me');
  const profile = unwrapResponseData<AuthUser>(response.data);
  user.value = profile;
  return profile;
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
    throw new Error(parseApiError(error, 'Unable to restore session.'));
  } finally {
    isRestoring.value = false;
  }
};

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken, user: userData } = unwrapResponseData<{
      accessToken?: string;
      refreshToken?: string;
      user?: AuthUser;
    }>(response.data) || {};

    if (!accessToken) {
      throw new Error('Login failed. Missing access token from server.');
    }

    setSession(accessToken, userData ?? null);
    return { accessToken, refreshToken, user: userData ?? null };
  } catch (error) {
    throw new Error(parseApiError(error, 'Login failed. Please try again.'));
  }
};

export const signup = async (userData: SignupData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { accessToken, user } = unwrapResponseData<{
      accessToken?: string;
      user?: AuthUser;
    }>(response.data) || {};
    
    // If backend returns access token on signup, optionally auto-login
    // Otherwise, user will need to login on the next page
    if (accessToken) {
      setSession(accessToken, user ?? null);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, 'Signup failed. Please try again.'));
  }
};

export const logout = async () => {
  try {
    // Call backend logout endpoint if it exists
    await api.post('/auth/logout', {});
  } catch (error) {
    // Even if logout fails, clear local session
    console.warn('Logout API call failed:', error);
  } finally {
    clearSession();
  }
};

export const completeOAuth = async (accessToken: string) => {
  try {
    setSession(accessToken);
    return await fetchProfile();
  } catch (error) {
    clearSession();
    throw new Error(parseApiError(error, 'OAuth login failed.'));
  }
};

export const startGoogleLogin = () => {
  window.location.href = `${apiBaseUrl}/auth/google`;
};

export const startFacebookLogin = () => {
  window.location.href = `${apiBaseUrl}/auth/facebook`;
};

export { clearSession, parseApiError, setSession, token, user, isRestoring };
