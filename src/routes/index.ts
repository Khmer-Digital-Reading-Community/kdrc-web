import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../auth/LoginForm.vue';
import SignupForm from '../auth/SignupForm.vue';
import ForgotPassword from '../auth/ForgotPassword.vue';
import ResetPassword from '../auth/ResetPassword.vue';
import VerifyOTP from '../auth/VerifyOTP.vue';
import adminRoutes from './admin';
import userRoutes from './user';
// import OAuthCallback from '../views/OAuthCallback.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		// { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
		{ path: '/login', name: 'login', component: LoginForm },
		{ path: '/signup', name: 'signup', component: SignupForm },
		{ path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
		{ path: '/reset-password', name: 'reset-password', component: ResetPassword },
		{ path: '/verify-otp', name: 'verify-otp', component: VerifyOTP },
		...adminRoutes,
		...userRoutes,
	],
});

// router.beforeEach((to) => {
// 	const isAuthed = Boolean(authState.token.value);

// 	if (to.meta.requiresAuth && !isAuthed) {
// 		return { path: '/login', query: { redirect: to.fullPath } };
// 	}

// 	if ((to.path === '/login' || to.path === '/signup') && isAuthed) {
// 		return { path: '/' };
// 	}

// 	return true;
// });

export default router;
