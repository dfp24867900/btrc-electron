import { createApp } from 'vue';
import App from './App.tsx';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import i18n from '@/locales';
import * as echarts from 'echarts';
import 'echarts/theme/macarons';
import 'echarts/theme/dark-bold';
import './assets/styles/default.scss';
import './assets/time-font/font.css';
import trim from './utils/trim';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.config.globalProperties.echarts = echarts;
app.config.globalProperties.trim = trim;
app.use(router);
app.use(pinia);
app.use(i18n);
app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
});
