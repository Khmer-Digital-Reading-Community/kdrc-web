import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { restoreSession } from './auth/useAuth';

const app = createApp(App);
app.use(router);

restoreSession()
	.catch(() => undefined)
	.finally(() => {
		app.mount('#app');
	});
