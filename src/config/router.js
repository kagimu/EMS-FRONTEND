import { createRouter, createWebHistory } from 'vue-router';
import Login from "../main/auth/Login.vue";
import Register from "../main/auth/Register.vue";
import Home from "../main/dashboard/Home.vue";
import AuthMain from "@/main/auth/AuthMain.vue";
import Dashboard from "@/main/dashboard/Dashboard.vue";
import {useAuthStore} from "@/main/auth/store/auth.js";
import ManageCampus from "@/main/dashboard/manageCampus/ManageCampus.vue";
import ManageLevel from "@/main/dashboard/manageLevel/ManageLevel.vue";
import userProfiles from "@/main/dashboard/profiles/userProfiles.vue";
import settings from "@/main/settings/Settings.vue";
import ReportCenter from "@/main/dashboard/ReportCenter/ReportCenter.vue";
import StudentAdmission from "@/main/dashboard/studentAdmission/StudentAdmission.vue";
import ManageSchool from "@/main/dashboard/manageSchool/ManageSchool.vue";
import Curriculum from "@/main/dashboard/curriculum/Curriculum.vue";
import SubjectCluster from "@/main/dashboard/curriculum/subjectCluster/SubjectCluster.vue";
import SubjectList from "@/main/dashboard/curriculum/subject/SubjectList.vue";
import StrandList from "@/main/dashboard/curriculum/strands/StrandList.vue";
import TopicList from "@/main/dashboard/curriculum/topic/TopicList.vue";
import SubTopicList from "@/main/dashboard/curriculum/subTopic/SubTopicList.vue";
import ConceptList from "@/main/dashboard/curriculum/concept/ConceptList.vue";
import ClassSetupList from "@/main/dashboard/manageLevel/class/ClassSetupList.vue";


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
                {path: 'school', component: ManageSchool, name: "school"},
                {path: 'campus', component: ManageCampus, name: "campus"},
                {path: 'level', component: ManageLevel, name: "level"},
                {path: 'reports', component: ManageCampus, name: "reports"},
                {path: 'student-admission', component: StudentAdmission, name: "student-admission"},
                {path: 'profiles', component: userProfiles, name: "profiles"},
                {path: 'accounting', component: ManageCampus, name: "accounting"},
                {path: 'time-table', component: ManageCampus, name: "time-table"},
                {path: 'report-center', component: ReportCenter, name: "report-center"},
                {path: 'settings', component: settings, name: "settings"},
                {path: 'curriculum', component: Curriculum, name: "curriculum"},
                {path: 'subject-cluster', component: SubjectCluster, name: "subject-cluster"},
                {path: 'subject', component: SubjectList, name: "subject"},
                {path: 'strands', component: StrandList, name: "strands"},
                {path: 'topic', component: TopicList, name: "topic"},
                {path: 'sub-topic', component: SubTopicList, name: "sub-topic"},
                {path: 'concept', component: ConceptList, name: "concept"},
                {path: 'class', component: ClassSetupList, name: "class"},
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: "login" }
        }
    ],
});


router.beforeEach((to, from, next) => {
    let profile = localStorage.getItem("userProfile")
    // let token = localStorage.getItem("token")

    const authStore = useAuthStore()

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // if (profile && token) {
        if (profile) {
            let user = JSON.parse(profile);
            if (user !== null) {
                // authStore.updateToken(token)
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