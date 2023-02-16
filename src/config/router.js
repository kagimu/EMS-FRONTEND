import { createRouter, createWebHistory } from 'vue-router';
import Login from "../main/auth/Login.vue";
import Register from "../main/auth/Register.vue";
import HelloWorld from "../components/HelloWorld.vue";

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
    {
        path: '/test',
        name: 'test',
        component: HelloWorld,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const DEFAULT_TITLE = "Wholesome Education";
router.afterEach(to => {
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
});

export default router;