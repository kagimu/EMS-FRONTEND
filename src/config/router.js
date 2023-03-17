import { createRouter, createWebHistory } from 'vue-router';
import Login from "../main/auth/Login.vue";
import Register from "../main/auth/Register.vue";
import Home from "../main/dashboard/Home.vue";
import AuthMain from "@/main/auth/AuthMain.vue";
import Dashboard from "@/main/dashboard/Dashboard.vue";
import {useAuthStore} from "@/store/auth.js";
import ManageCampus from "@/main/dashboard/manageCampus/ManageCampus.vue";
import ManageLevel from "@/main/dashboard/manageLevel/ManageLevel.vue";
import userProfiles from "@/main/dashboard/profiles/userProfiles.vue";
import settings from "@/main/settings/Settings.vue";


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
                {path: 'manage-campus', component: ManageCampus, name: "manage-campus"},
                {path: 'level', component: ManageLevel, name: "level"},
                {path: 'reports', component: ManageCampus, name: "reports"},
                {path: 'student-admission', component: ManageCampus, name: "student-admission"},
                {path: 'profiles', component: userProfiles, name: "profiles"},
                {path: 'accounting', component: ManageCampus, name: "accounting"},
                {path: 'time-table', component: ManageCampus, name: "time-table"},
                {path: 'report-center', component: ManageCampus, name: "report-center"},
                {path: 'settings', component: settings, name: "settings"},
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