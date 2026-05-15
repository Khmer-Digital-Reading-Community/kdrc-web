import { useRouter } from 'vue-router';
import {
  authState,
  completeOAuth as completeOAuthSession,
  login as loginUser,
  logout as logoutUser,
  parseApiError,
  restoreSession as restoreAuthSession,
  signup as signupUser,
  startFacebookLogin,
  startGoogleLogin,
} from '../services/auth.service';

export function useAuth() {
  const router = useRouter();
  const { user, token, isRestoring } = authState;

  const login = async (
    credentials: { email: string; password: string },
    redirectTo?: string,
  ) => {
    try {
      await loginUser(credentials);
      await router.push(redirectTo || '/home');
    } catch (error) {
      throw new Error(parseApiError(error, 'Login failed. Please try again.'));
    }
  };

  const signup = async (userData: { name: string; email: string; password: string }) => {
    try {
      await signupUser(userData);
      await router.push({ path: '/login', query: { registered: '1' } });
    } catch (error) {
      throw new Error(parseApiError(error, 'Signup failed. Please try again.'));
    }
  };

  const completeOAuth = async (accessToken: string) => {
    try {
      await completeOAuthSession(accessToken);
      await router.push('/home');
    } catch (error) {
      throw new Error(parseApiError(error, 'OAuth login failed.'));
    }
  };

  const logout = async () => {
    await logoutUser();
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
    startFacebookLogin,
    completeOAuth,
  };
}

export { authState };
export const restoreSession = restoreAuthSession;
// Export token ref directly for components that need reactive access
export { token } from '../services/auth.service';
