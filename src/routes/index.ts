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
// import LandingPage from "../pages/user/landingPage.vue";
// import { computed } from 'vue';
// import { token } from '../stores/useAuth';
// import OAuthCallback from '../views/OAuthCallback.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		// Redirect root to user home
		// { path: '/', redirect: 'landingpage' },
		// { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
		{ path: '/chatbox', name: 'chatbox', component: ChatBox },
		{ path: '/auth/callback', name: 'oauth-callback', component: OAuthCallback },
		{ path: '/login', name: 'login', component: LoginForm },
		{ path: '/signup', name: 'signup', component: SignupForm },
		{ path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
		{ path: '/reset-password', name: 'reset-password', component: ResetPassword },
		{ path: '/verify-otp', name: 'verify-otp', component: VerifyOTP },
		{ path: '/chatbox', name: 'chatbox', component: ChatBox },

		...adminRoutes,
		...userRoutes,
	],
});

// router.beforeEach((to) => {
// 	const isAuthed = computed(() => Boolean(token.value))
// 	console.log('Navigating to %s, requiresAuth: %s, isAuthed: %s', to.fullPath, to.meta.requiresAuth, isAuthed.value);
// 	if (to.meta.requiresAuth && !isAuthed) {
// 		return { path: '/login', query: { redirect: to.fullPath } };
// 	}

// 	if ((to.path === '/login' || to.path === '/signup') && isAuthed) {
// 		return { path: '/home' };
// 	}

// 	return true;
// });

export default router;
