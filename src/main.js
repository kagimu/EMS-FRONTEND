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
import {abilitiesPlugin} from "@casl/vue";
import abilities from "@/abilities";

// main.js
import  SetupCalendar  from 'v-calendar';

import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';

// Use calendar defaults (optional)

const globalOptions = {
    mode: 'auto',
};

const app = createApp(App);
app.use(router);
app.config.globalProperties.$http = axios;
app.use(abilitiesPlugin, abilities, {
    useGlobalProperties: true,
});
app.use(VueTelInput, globalOptions);
app.use(createPinia());
app.use(FloatingVue)
app.use(Notifications)
app.use(SetupCalendar, {})
app.mount('#app');

