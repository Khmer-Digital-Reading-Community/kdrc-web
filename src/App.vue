<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from './auth/useAuth';

const route = useRoute();
const { user, token, logout } = useAuth();
const isAuthed = computed(() => Boolean(token.value));
const isAuthRoute = computed(() => ['/login', '/signup', '/auth/callback'].includes(route.path));
</script>

<template>
	<div class="app-shell">
		<header v-if="!isAuthRoute" class="site-header">
			<div class="brand">
				<router-link to="/">KDRC</router-link>
				<span class="brand-tag">Khmer Digital Reading Circle</span>
			</div>
			<nav class="site-nav">
				<router-link to="/community">Community</router-link>
				<template v-if="!isAuthed">
					<router-link to="/login">Login</router-link>
					<router-link class="cta" to="/signup">Sign Up</router-link>
				</template>
				<template v-else>
					<span class="user-pill">{{ user?.name || user?.email }}</span>
					<button class="ghost" type="button" @click="logout">Logout</button>
				</template>
			</nav>
		</header>

		<main class="site-main" :class="{ 'is-auth': isAuthRoute }">
			<router-view />
		</main>
	</div>
</template>

<style scoped>
.app-shell {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: linear-gradient(135deg, #f7f1e6 0%, #fef7ed 55%, #f2f6ff 100%);
}

.site-header {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	justify-content: space-between;
	align-items: center;
	padding: 20px 6vw;
}

.brand {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.brand a {
	font-size: 24px;
	font-weight: 700;
	text-decoration: none;
	color: #1f2d20;
}

.brand-tag {
	font-size: 12px;
	letter-spacing: 1.6px;
	text-transform: uppercase;
	color: #7a5b3e;
}

.site-nav {
	display: flex;
	align-items: center;
	gap: 14px;
}

.site-nav a {
	text-decoration: none;
	color: #2f3e34;
	font-weight: 600;
}

.site-nav .cta {
	padding: 8px 16px;
	border-radius: 999px;
	background: #0f6d5f;
	color: #fff;
}

.user-pill {
	padding: 6px 14px;
	border-radius: 999px;
	background: rgba(15, 109, 95, 0.12);
	color: #0f6d5f;
	font-weight: 600;
}

.ghost {
	padding: 8px 16px;
	border-radius: 999px;
	border: 1px solid #0f6d5f;
	background: transparent;
	color: #0f6d5f;
	font-weight: 600;
	cursor: pointer;
}

.site-main {
	flex: 1;
	padding: 10px 6vw 60px;
}

.site-main.is-auth {
	padding: 24px 4vw 40px;
	background: linear-gradient(135deg, #f4f5f6 0%, #fbfbfc 40%, #f2f6f8 100%);
}

@media (max-width: 720px) {
	.site-header {
		padding: 16px 5vw;
	}

	.site-nav {
		flex-wrap: wrap;
	}
}
</style>
