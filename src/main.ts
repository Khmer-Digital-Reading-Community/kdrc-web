import { createApp } from 'vue';
// import { createPinia } from 'pinia';
import './assets/style/style.css';
import App from './App.vue';
import router from './routes';
import { restoreSession } from './auth/useAuth';

const app = createApp(App);
// const pinia = createPinia();

// app.use(pinia);
app.use(router);

restoreSession()
	.catch(() => undefined)
	.finally(() => {
		app.mount('#app');
	});
