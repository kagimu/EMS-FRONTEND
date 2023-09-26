import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'
import router from './config/router.js'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import Notifications from '@kyvg/vue3-notification'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'


// localStorage.clear();
const user = localStorage.getItem("userProfile");
if (user != null) {
    let token = localStorage.getItem("token");
    axios.defaults.headers.common = {Authorization: `Bearer ${token}`};
}
const app = createApp(App);
app.use(router);
app.config.globalProperties.$http = axios;
app.use(createPinia());
app.use(FloatingVue)
app.use(Notifications)
app.mount('#app');

