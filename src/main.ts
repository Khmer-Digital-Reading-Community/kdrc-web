import { createApp } from 'vue';
// import { createPinia } from 'pinia';
import './assets/style/user.css';
import App from './App.vue';
import router from './routes';
import { restoreSession } from './services/auth';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
// const pinia = createPinia();

// app.use(pinia);
app.use(router);
app.use(Toast);

restoreSession()
	.catch(() => undefined)
	.finally(() => {
		app.mount('#app');
	});
