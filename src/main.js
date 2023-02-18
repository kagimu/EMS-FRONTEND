import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'
import router from './config/router.js'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import Notifications from '@kyvg/vue3-notification'

localStorage.clear();

const app = createApp(App);
app.use(router);
app.config.globalProperties.$http = axios;
app.use(createPinia());
app.use(Notifications)
app.mount('#app');

