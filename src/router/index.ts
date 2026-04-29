import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../auth/LoginForm.vue';
import SignupForm from '../auth/SignupForm.vue';
import ForgotPassword from '../auth/ForgotPassword.vue';
import ResetPassword from '../auth/ResetPassword.vue';
import PasswordResetSuccess from '../auth/PasswordResetSuccess.vue';
import VerifyOTP from '../auth/VerifyOTP.vue';
import { authState } from '../auth/useAuth';
import LandingPage from '../pages/landingPage.vue';
import Home from '../views/Home.vue';
import Community from '../views/Community.vue';
import OAuthCallback from '../views/OAuthCallback.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'landing', component: LandingPage },
		{ path: '/home', name: 'home', component: Home, meta: { requiresAuth: true } },
		{ path: '/community', name: 'community', component: Community, meta: { requiresAuth: true } },
		{ path: '/login', name: 'login', component: LoginForm },
		{ path: '/signup', name: 'signup', component: SignupForm },
		{ path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
		{ path: '/verify-otp-reset', name: 'verify-otp-reset', component: VerifyOTP, meta: { isPasswordReset: true } },
		{ path: '/reset-password', name: 'reset-password', component: ResetPassword, meta: { isPasswordReset: true } },
		{ path: '/password-reset-success', name: 'password-reset-success', component: PasswordResetSuccess },
		{ path: '/verify-otp', name: 'verify-otp', component: VerifyOTP },
		{ path: '/auth/callback', name: 'oauth-callback', component: OAuthCallback },
	],
});

router.beforeEach((any) => {
	const isAuthed = Boolean(authState.token.value);

	if (any.meta.requiresAuth && !isAuthed) {
		return { path: '/login', query: { redirect: any.fullPath } };
	}

	if ((any.path === '/login' || any.path === '/signup') && isAuthed) {
		return { path: '/' };
	}

	return true;
});

export default router;
