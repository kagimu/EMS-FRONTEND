import { createRouter, createWebHistory } from 'vue-router';
import Login from "../main/auth/Login.vue";
import Register from "../main/auth/Register.vue";
import Home from "../main/dashboard/Home.vue";
import AuthMain from "@/main/auth/AuthMain.vue";
import Dashboard from "@/main/dashboard/Dashboard.vue";
import {useAuthStore} from "@/store/auth.js";


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: '/',
            component: AuthMain,
            redirect:{ name: 'login' },
            children:[
                {path: 'login', component: Login, name:'login'},
                {path: 'register', component: Register, name:'register'},
            ]
        },
        {
            path: '/main',
            component: Dashboard,
            name :"dashboard",
            redirect:{ name: 'home' },
            meta: {
                requiresAuth: true,
            },
            children:[
                {path: 'home', component: Home, name: "home"},
            ]
        },
    ],
});


router.beforeEach((to, from, next) => {
    let profile = localStorage.getItem("userProfile")
    let token = localStorage.getItem("token")

    const authStore = useAuthStore()

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (profile && token) {
            let user = JSON.parse(profile);
            if (user !== null) {
                authStore.updateToken(token)
                authStore.updateProfile(profile)
                next();
            } else {
                next({ name: "dashboard" });
            }
        }else {
            next({
                name: "login"
            });
        }
    } else {

        if (profile === null) {
            next();
        } else {
            next({name: "dashboard"});
        }
    }
});


/*const DEFAULT_TITLE = "Wholesome Education";
router.afterEach(to => {
  Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
});*/

export default router;