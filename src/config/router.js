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
import Curriculum from "@/main/dashboard/curriculum/curriculumSetup/Curriculum.vue";
import SubjectCluster from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/SubjectCluster.vue";
import SubjectList from "@/main/dashboard/curriculum/curriculumSetup/subject/SubjectList.vue";
import StrandList from "@/main/dashboard/curriculum/curriculumSetup/strands/StrandList.vue";
import TopicList from "@/main/dashboard/curriculum/curriculumSetup/topic/TopicList.vue";
import SubTopicList from "@/main/dashboard/curriculum/curriculumSetup/subTopic/SubTopicList.vue";
import ConceptList from "@/main/dashboard/curriculum/curriculumSetup/concept/ConceptList.vue";
import ClassSetupList from "@/main/dashboard/manageLevel/class/ClassSetupList.vue";
import Timetable from "@/main/dashboard/curriculum/timetable/Timetable.vue";
import SchemeOfWork from "@/main/dashboard/curriculum/schemeOfWork/SchemeOfWork.vue";
import GeneralCalendar from "@/main/dashboard/eos/GeneralCalendar.vue";
import CalendarDetails from "@/main/dashboard/eos/CalendarDetails.vue";
import AllTimeTables from "@/main/dashboard/curriculum/timetable/AllTimeTables.vue";
import CurriculumSetup from "@/main/dashboard/curriculum/curriculumSetup/CurriculumSetup.vue";
import Application from "../main/application/Application.vue";
import Welcome from "../main/welcome/Welcome.vue";


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: '/',
            component: AuthMain,
            redirect:{ name: 'welcome' },
            children:[
                {path: 'login', component: Login, name:'login'},
                {path: 'register', component: Register, name:'register'},
                {path: 'application', component: Application, name:'application'},
                {path: 'welcome', component: Welcome, name:'welcome'},
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
                {path: 'report-center', component: ReportCenter, name: "report-center"},
                {path: 'settings', component: settings, name: "settings"},
                {path: 'curriculum', component: Curriculum, name: "curriculum"},
                {path: 'curriculum-setup', component: CurriculumSetup, name: "curriculum-setup"},
                {path: 'subject-cluster', component: SubjectCluster, name: "subject-cluster"},
                {path: 'subject', component: SubjectList, name: "subject"},
                {path: 'strands', component: StrandList, name: "strands"},
                {path: 'topic', component: TopicList, name: "topic"},
                {path: 'sub-topic', component: SubTopicList, name: "sub-topic"},
                {path: 'concept', component: ConceptList, name: "concept"},
                {path: 'class', component: ClassSetupList, name: "class"},
                {path: 'time-table', component: AllTimeTables, name: "timetable"},
                {path: 'time-table-details/:timetable_id', component: Timetable, name: "timetable-details"},
                {path: 'scheme-of-work', component: SchemeOfWork, name: "scheme-of-work"},
                {path:'calendar', component: GeneralCalendar, name: "general-calendar"},
                {path:'calendar/:calendar_id', component: CalendarDetails, name: "calendar-details" },
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: "login" }
        }
    ],
});



// lesson plan
// class
// check subtopic list
// teacher

//sort the concept



router.beforeEach((to, from, next) => {
    let profile = localStorage.getItem("userProfile")
    let token = localStorage.getItem("token");

    // let token = localStorage.getItem("token")

    const authStore = useAuthStore()

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // if (profile && token) {
        if (profile) {
            let user = JSON.parse(profile);
            if (user !== null) {
                authStore.updateProfile(profile)
                authStore.updateToken(token)
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