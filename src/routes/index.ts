import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../auth/LoginForm.vue';
import SignupForm from '../auth/SignupForm.vue';
import ForgotPassword from '../auth/ForgotPassword.vue';
import ResetPassword from '../auth/ResetPassword.vue';
import VerifyOTP from '../auth/VerifyOTP.vue';
import ChatBox from '../components/chat/ChatBox.vue';
import adminRoutes from './admin';
import userRoutes from './user';
import OAuthCallback from '../auth/OAuthCallback.vue';
import { user, token, isRestoring } from '../services/auth';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/chatbox', name: 'chatbox', component: ChatBox },
		{ path: '/auth/callback', name: 'oauth-callback', component: OAuthCallback },
		{ path: '/login', name: 'login', component: LoginForm },
		{ path: '/signup', name: 'signup', component: SignupForm },
		{ path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
		{ path: '/reset-password', name: 'reset-password', component: ResetPassword },
		{ path: '/verify-otp', name: 'verify-otp', component: VerifyOTP },
		{ path: '/exchange-v2/manage/:id', name: 'ManageTrade', component: () => import('../pages/ManageTrade.vue') },

		...adminRoutes,
		...userRoutes,
	],
});

const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-otp', '/auth/callback'];

router.beforeEach(async (to) => {
	// Wait for session restoration to complete before checking auth
	if (isRestoring.value) {
		await new Promise<void>((resolve) => {
			const unwatch = setInterval(() => {
				if (!isRestoring.value) {
					clearInterval(unwatch);
					resolve();
				}
			}, 50);
		});
	}

	const isAuthenticated = Boolean(token.value);
	const userRole = user.value?.role;

	// Redirect authenticated users away from public auth pages
	if (isAuthenticated && publicPaths.includes(to.path)) {
		const target = userRole === 'ADMIN' ? '/admin/dashboard' : '/home';
		return { path: target };
	}

	// Check if route requires authentication
	if (to.meta.requiresAuth && !isAuthenticated) {
		return { path: '/login', query: { redirect: to.fullPath } };
	}

	// Check if route requires specific roles
	const requiredRoles = to.meta.roles as string[] | undefined;
	if (isAuthenticated && requiredRoles && requiredRoles.length > 0) {
		if (!userRole || !requiredRoles.includes(userRole)) {
			// User does not have the required role — redirect to their home
			const fallback = userRole === 'ADMIN' ? '/admin/dashboard' : '/home';
			return { path: fallback };
		}
	}

	return true;
});

export default router;
