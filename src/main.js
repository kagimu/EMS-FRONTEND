import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './config/router.js'
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"



const app = createApp(App);
app.use(router);
app.config.globalProperties.axios = axios;
app.mount('#app');

// createApp(App).mount('#app')