import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../auth/LoginForm.vue';
import SignupForm from '../auth/SignupForm.vue';
import ResetPassword from '../auth/ResetPassword.vue';
import VerifyOTP from '../auth/VerifyOTP.vue';
import { authState } from '../auth/useAuth';
import Home from '../views/Home.vue';
import Community from '../views/Community.vue';
import OAuthCallback from '../views/OAuthCallback.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
		{ path: '/community', name: 'community', component: Community, meta: { requiresAuth: true } },
		{ path: '/login', name: 'login', component: LoginForm },
		{ path: '/signup', name: 'signup', component: SignupForm },
		{ path: '/reset-password', name: 'reset-password', component: ResetPassword },
		{ path: '/verify-otp', name: 'verify-otp', component: VerifyOTP },
		{ path: '/auth/callback', name: 'oauth-callback', component: OAuthCallback },
	],
});

router.beforeEach((to) => {
	const isAuthed = Boolean(authState.token.value);

	if (to.meta.requiresAuth && !isAuthed) {
		return { path: '/login', query: { redirect: to.fullPath } };
	}

	if ((to.path === '/login' || to.path === '/signup') && isAuthed) {
		return { path: '/' };
	}

	return true;
});

export default router;
