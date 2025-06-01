import { createApp } from 'vue';
import './assets/less/main.less';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';
import { ToastPlugin } from '@/utils/toast'
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(ToastPlugin);
app.use(router);
app.mount('#app');
