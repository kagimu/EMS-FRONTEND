import Vue from "vue";
import { createRouter, createWebHistory } from 'vue-router';
import Login from "../main/auth/Login.vue";
import Register from "../main/auth/Register.vue";

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const DEFAULT_TITLE = "Dashboard | Base ";
router.afterEach(to => {
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
});

export default router;