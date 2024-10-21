import { createRouter, createWebHistory } from 'vue-router';
import Login from "../main/auth/Login.vue";
import Register from "../main/auth/Register.vue";
import Home from "../main/dashboard/home/Home.vue";
import AuthMain from "@/main/auth/AuthMain.vue";
import Dashboard from "@/main/dashboard/Dashboard.vue";
import {useAuthStore} from "@/main/auth/store/auth.js";
import ManageCampus from "@/main/dashboard/manageCampus/ManageCampus.vue";
import userProfiles from "@/main/dashboard/profiles/userProfiles.vue";
import settings from "@/main/settings/Settings.vue";
import ReportCenter from "@/main/dashboard/ReportCenter/ReportCenter_.vue";
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
import UserDashboard from "../main/application/UserDashboard.vue";
import UserDash from "../main/application/UserDash.vue";
import ApplicationGuide from "../main/auth/ApplicationGuide.vue";
import StudentApplication from "@/main/dashboard/studentApplication/StudentApplication.vue";
import ClientApplications from "@/main/application/ClientApplications.vue";
import InterviewDetails from "@/main/dashboard/studentApplication/InterviewDetails.vue";
import Services from "@/main/dashboard/servicesAndProducts/Services.vue";
import AdmitStudent from "@/main/dashboard/studentApplication/AdmitStudent.vue";
import InterviewAssessmentAreas from "@/main/dashboard/assessment/assessmentComponents/AssesmentAreas.vue"
import Invoice from "@/main/dashboard/invoice/Invoice.vue"
import NewInvoice from "@/main/dashboard/invoice/NewInvoice.vue"
import InvoiceDetails from "@/main/dashboard/invoice/InvoiceDetails.vue"
import NewAdmission from "@/main/dashboard/studentAdmission/NewAdmission.vue"
import Products from "@/main/dashboard/servicesAndProducts/Products.vue";
import Designsidework from "../main/dashboard/Designsidework.vue";
import CampusSetup from "@/main/dashboard/manageLevel/CampusSetup.vue";
import AssessmentList from "@/main/dashboard/assessment/assessmentComponents/AssessmentList.vue"
import ExamType from "@/main/dashboard/assessment/assessmentComponents/ExamType.vue"
import Account from "@/main/dashboard/account/Account.vue"
import UserManagement from "@/main/dashboard/account/accountComponents/UserManagement.vue"
import GradingStandard from "@/main/dashboard/assessment/assessmentComponents/GradingStandards.vue"
import GradingScale from "@/main/dashboard/assessment/assessmentComponents/GradingScale.vue"
import Classes from "@/main/dashboard/classes/Classes.vue"
import ClassList from "@/main/dashboard/classes/classesComponents/ClassList.vue"
import ClassAttendance from "@/main/dashboard/classes/classesComponents/ClassAttendance.vue"
import SubjectAttendance from "@/main/dashboard/classes/classesComponents/SubjectAttendance.vue"
import ManageClassList from "@/main/dashboard/classes/classesComponents/ManageClassList.vue"
import AssessmentMetrics from "@/main/dashboard/assessment/assessmentComponents/AssessmentMetrics.vue"
import InterviewAssessmentResults from '../main/dashboard/studentApplication/InterviewAssessmentResults.vue';
import InterviewLearnersList from "@/main/dashboard/studentApplication/InterviewLearnersList.vue";
import InterviewLearnersDetails from '@/main/dashboard/studentApplication/InterviewLearnersDetails.vue';
import AdmissionList from '@/main/dashboard/studentAdmission/AdmissionList.vue';
import Enrollment from '@/main/dashboard/enrollment/Enrollment.vue';
import SetPassword from "@/main/auth/SetPassword.vue";
import ResetPassword from "@/main/auth/ResetPassword.vue";
import Promotions from "@/main/dashboard/promotions/Promotions.vue"
import InterviewManagement from "@/main/dashboard/studentApplication/InterviewManagement.vue"
import Catering from "@/main/dashboard/catering/Catering.vue"
import FoodMenuItem  from "@/main/dashboard/catering/cateringComponents/FoodMenuItem.vue"
import FeedingGroupUserDetails  from "@/main/dashboard/catering/cateringComponents/FeedingGroupUserDetails.vue"
import ApplicationSuccessPage from "@/main/application/applicationComponents/ApplicationSuccessPage.vue"
import CampusCurriculumSetup from "@/main/dashboard/manageLevel/CampusCurriculumSetup.vue";
import StudentProfileDetails from "@/main/dashboard/profiles/studentProfile/StudentProfileDetails.vue"
import AdmissionDetails from '@/main/dashboard/studentAdmission/newAdmissionComponents/AdmissionDetails.vue';
import EntityDashboard from "@/main/dashboard/EntityDashboard.vue";
import InvoiceAndTransactions from "@/main/dashboard/invoice/InvoiceAndTransactions.vue";
import TeacherDashboard from "@/main/teacher/TeacherDashboard.vue";
import HelloTeacher from "@/main/teacher/HelloTeacher.vue";
import Students from "@/main/teacher/students/Students.vue";
import ManageStream from "@/main/teacher/ManageStream.vue";
import TeacherClasses from '@/main/teacher/class/TeacherClasses.vue';
import StudentProfile from '@/main/teacher/students/StudentProfile.vue';
import Subjects from '@/main/teacher/Subjects.vue';
import ManageSchemeOfWork from '@/main/teacher/ManageSchemeOfWork.vue';
import ManageAssessment from '@/main/teacher/ManageAssessment.vue';

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: '/',
            component: AuthMain,
            redirect:{ name: 'login' },
            children:[
                {path: 'welcome', component: Welcome, name:'welcome'},
                {path: 'login', component: Login, name:'login'},
                {path: 'register', component: Register, name:'register'},
                {path: 'user-dashboard', component: UserDash, name:'user-dashboard'},
                {path: 'application-guide', component: ApplicationGuide, name:'application-guide'},
                { path: 'set-password/:id', component: SetPassword, name:'set-password'},
                { path: 'reset-password', component: ResetPassword, name:'reset-password'},
            ]
        },
      

        // {
        //     path: '/client-dashboard',
        //     component: UserDashboard,
        //     name :"client_dashboard",
        //     redirect:{ name: 'application' },
        //     meta: {
        //         requiresAuth: true,
        //     },
        //     children:[
        //         {path: 'user-dash', component: UserDash, name:'user-dash'},
        //         {path: 'application', component: Application, name:'application'},
        //         {path: 'start', component: Application, name:'application'},
        //         {path: 'admission', component: Application, name:'admission_history'},
        //         {path: 'applications', component: ClientApplications, name:'application_history'},
        //         {path: 'application-success', component: ApplicationSuccessPage, name: "application-success",},
        //     ]
        // },
        {
            path: '/main',
            component: Dashboard,
            name :"dashboard",
            redirect:{ name: 'home' },
            meta: {
                requiresAuth: true,
                resource: "dashboard",
                action: "access_dashboard",
            },
            children:[
                {path: 'home', component: Home, name: "home"},
                {path: 'school', component: ManageSchool, name: "school",
                    meta: {
                        resource: "school",
                        action: "view_schools",

                    }
                },



                {path: 'campus', component: ManageCampus, name: "campus",
                    meta: {
                        resource: "campus",
                        action: "view_campuses",

                    }
                },
                {path: 'campus-setup', component: CampusSetup, name: "campus-setup",
                    meta: {
                        resource: "campus-setup",
                        action: "view_campus-setup",
                    }
                },
                {
                    path: 'campus-curriculum-setup',
                    component: CampusCurriculumSetup,
                    name: "campus-curriculum-setup",
                    meta: {
                        resource: "campus-setup",
                        action: "view_campus-setup",

                    }
                },
                {path: 'reports', component: ManageCampus, name: "reports",
                    meta: {
                        resource: "reports",
                        action: "view_reports",

                    }},
                {
                    path: 'student-admission', component: StudentAdmission, name: "student-admission",
                    meta: {
                        resource: "student-admission",
                        action: "view_student-admission",

                    }},
                {
                        path: 'admission-list',
                        component: AdmissionList,
                        name: "admission-list",
                        meta: {
                            resource: "admission-list",
                            action: "view-admission-list",

                        }
                    },
                {
                        path: 'financial-records',
                        component: InvoiceAndTransactions,
                        name: "financial-records",
                        meta: {
                            resource: "admission-list",
                            action: "view_financial_records",

                        }
                    },
                {path: 'admission-details', component: AdmissionDetails, name: "admission-details",
                    meta: {
                        resource: "admission-details",
                        action: "view-admission-detials",

                    }},

                {
                    path: 'student-application',
                    component: StudentApplication,
                    name: "student-application",
                    meta: {
                        resource: "student-application",
                        action: "view_student-application",

                    }
                    },
                {path: 'profiles', component: userProfiles, name: "profiles",
                    meta: {
                        resource: "profiles",
                        action: "view_profiles",

                    }},
                {path: 'accounting', component: ManageCampus, name: "accounting",
                    meta: {
                        resource: "accounting",
                        action: "view_accounting",

                    }},
                {path: 'report-center', component: ReportCenter, name: "report-center",
                    meta: {
                        resource: "report-center",
                        action: "view_report-center",
                    }
                },
                {path: 'settings', component: settings, name: "settings",
                    meta: {
                        resource: "settings",
                        action: "view_settings",
                    }},
                {path: 'curriculum', component: Curriculum, name: "curriculum",
                    meta: {
                        resource: "campus",
                        action: "view_curriculum",

                    }},
                {path: 'curriculum-setup', component: CurriculumSetup, name: "curriculum-setup",
                    meta: {
                        resource: "curriculum-setup",
                        action: "view_curriculum-setup",

                    }},
                {path: 'subject-cluster', component: SubjectCluster, name: "subject-cluster",
                    meta: {
                        resource: "subject-cluster",
                        action: "view_subject-cluster",

                    }},
                {path: 'subject', component: SubjectList, name: "subject",
                    meta: {
                        resource: "subject",
                        action: "view_subject",

                    }},
                {path: 'strands', component: StrandList, name: "strands",
                    meta: {
                        resource: "strands",
                        action: "view_strands",

                    }},
                {path: 'topic', component: TopicList, name: "topic",
                    meta: {
                        resource: "topic",
                        action: "view_topic",

                    }},
                {path: 'sub-topic', component: SubTopicList, name: "sub-topic",
                    meta: {
                        resource: "sub-topic",
                        action: "view_sub-topic",

                    }},
                {path: 'concept', component: ConceptList, name: "concept",
                    meta: {
                        resource: "concept",
                        action: "view_concept",

                    }},
                {path: 'class', component: ClassSetupList, name: "class",
                    meta: {
                        resource: "class",
                        action: "view_class",

                    }},
                {path: 'time-table', component: AllTimeTables, name: "timetable",
                    meta: {
                        resource: "time-table",
                        action: "view_time-table",

                    }},
                {path: 'time-table-details/:timetable_id', component: Timetable, name: "timetable-details",
                    meta: {
                        resource: "timetable-details",
                        action: "view_timetable-details",

                    }},
                {path: 'scheme-of-work', component: SchemeOfWork, name: "scheme-of-work",
                    meta: {
                        resource: "scheme-of-work",
                        action: "view_scheme-of-work",

                    }},
                {path:'calendar', component: GeneralCalendar, name: "general-calendar",
                    meta: {
                        resource: "calendar",
                        action: "view_calendar",

                    }},
                {path:'calendar/:calendar_id', component: CalendarDetails, name: "calendar-details",
                    meta: {
                        resource: "calendar-details",
                        action: "view_calendar-details",

                    } },
                {path: 'interview-details', component: InterviewDetails, name: "interview-details",
                    meta: {
                        resource: "interview-details",
                        action: "view_interview-details",

                    }
                    },
                {path: 'admit-student', component: AdmitStudent, name: "admit-student",
                    meta: {
                        resource: "admit-student",
                        action: "view_admit-student",

                    }},
                {path: 'services', component: Services, name: "services",
                    meta: {
                        resource: "services",
                        action: "view_services",

                    }},
                {path: 'assessment-areas', component: InterviewAssessmentAreas, name: "assessment-areas",
                    meta: {
                        resource: "assessment-areas",
                        action: "view_assessment-areas",

                    }},
                {path: 'invoices', component: Invoice, name: "invoices",
                    meta: {
                        resource: "invoices",
                        action: "view_invoices",

                    }},
                {path: 'new-invoice', component: NewInvoice, name: "new-invoice",
                    meta: {
                        resource: "new-invoice",
                        action: "view_new-invoice",

                    }},
                {path: 'invoice-details', component: InvoiceDetails, name: "invoice-details",
                    meta: {
                        resource: "invoice-details",
                        action: "view_invoice-details",

                    }},
                {path: 'new-admission', component: NewAdmission, name: "new-admission",
                    meta: {
                        resource: "new-admission",
                        action: "view_new-admission",

                    }},
                {path: 'products', component: Products, name: "products",
                    meta: {
                        resource: "products",
                        action: "view_products",

                    }},
                {path: 'let-us-design', component: Designsidework, name: "let-us-design",
                    meta: {
                        resource: "let-us-design",
                        action: "view_let-us-design",

                    }},
                /*  {path: 'assessment', component: Assessment, name: "assessment",
                  meta: {
                      resource: "assessment",
                      action: "view_assessment",

                  }},*/
                {path: 'assessment-list', component: AssessmentList, name: "assessment-list",
                    meta: {
                        resource: "assessment-list",
                        action: "view_assessment-list",

                    }},
                {path: 'examtype', component: ExamType, name: "examtype",
                    meta: {
                        resource: "examtype",
                        action: "view_examtype",

                    }},
                {path: 'account-management', component: Account, name: "account-management",
                    meta: {
                        resource: "account-management",
                        action: "view_account-management",

                    }},
                {path: 'user-management', component: UserManagement, name: "user-management",
                    meta: {
                        resource: "user-management",
                        action: "view_user-management",

                    }},
                {path: 'grade-scale', component: GradingScale, name: "grade-scale",
                    meta: {
                        resource: "grade-scale",
                        action: "view_grade-scale",

                    }},
                {path: 'grade-standard', component: GradingStandard, name: "grade-standard",
                    meta: {
                        resource: "grade-standard",
                        action: "view_grade-standard",

                    }},
                {path: 'classes', component: Classes, name: "classes",
                    meta: {
                        resource: "classes",
                        action: "view_classes",

                    }},
                {path: 'class-list', component: ClassList, name: "class-list",
                    meta: {
                        resource: "class-list",
                        action: "view_class-list",

                    }},
                {path: 'class-attendance', component: ClassAttendance, name: "class-attendance",
                    meta: {
                        resource: "class-attendance",
                        action: "view_class-attendance",

                    }},
                {path: 'subject-attendance', component: SubjectAttendance, name: "subject-attendance",
                    meta: {
                        resource: "subject-attendance",
                        action: "view_subject-attendance",

                    }},
                {path: 'manage-class-list', component: ManageClassList, name: "manage-class-list",
                    meta: {
                        resource: "manage-class-list",
                        action: "view_manage-class-list",

                    }},
                {path: 'assessment-metrics', component: AssessmentMetrics, name: "assessment-metrics",
                    meta: {
                        resource: "assessment-metrics",
                        action: "view_manage-assessment-metrics",

                    }},

                {path: 'assessment-results', component: InterviewAssessmentResults, name: "assessment-results",
                    meta: {
                        resource: "assessmtnt-results",
                        action: "view_assessment-results",

                    }},
                {path: 'interview-learners-list', component: InterviewLearnersList, name: "interview-learners-list",
                    meta: {
                        resource: "interview-learners-list",
                        action: "interview-learners-list",

                    }},
                {path: 'interview-learners-details', component: InterviewLearnersDetails, name: "interview-learners-details",
                    meta: {
                        resource: "interview-learners-details",
                        action: "interview-learners-details",

                    }},

                {path: 'enrolment', component: Enrollment, name: "enrolment",
                    meta: {
                        resource: "enrolment",
                        action: "view-enrolment",

                    }},

                {path: 'promotions', component: Promotions, name: "promotions",
                    meta: {
                        resource: "promotions",
                        action: "view-promotions",

                    }},

                {path: 'manage-interviews', component: InterviewManagement, name: "manage-interviews",
                    meta: {
                        resource: "manage-interviews",
                        action: "view-manage-interviews",


                    }},


                {
                    path: 'catering',
                    component: Catering,
                    name: "catering",
                    meta: {
                        resource: "manage-catering",
                        action: "view_catering_menu",


                    }},

                {path: 'food-menu-items', component: FoodMenuItem, name: "food-menu-items",
                    meta: {
                        resource: "manage-food-menu-items",
                        action: "view-manage-food-menu-items",


                    }},
                {path: 'feeding-group-user-details', component: FeedingGroupUserDetails, name: "feeding-group-user-details",
                    meta: {
                        resource: "feeding-group-user-details",
                        action: "feeding-group-user-details",
                    }},
                {
                    path: 'student-profile-details',
                    component: StudentProfileDetails,
                    name: "student-profile-details",
                    meta: {
                        resource: "manage-student-profile-details",
                        action: "wiew-student-profile-details",
                    }},
            ]
        },
        {path: '/entity-dashboard', component: EntityDashboard, name: "entity-dashboard",
            meta: {
                requiresAuth: true,
                resource: "entity-dashboard",
                action: "view_entity-dashboard",

            }
        },

        {
            path: '/client-dashboard',
            component: UserDashboard,
            name :"client_dashboard",
            redirect:{ name: 'application' },
            meta: {
                requiresAuth: true,
            },
            children:[
                {path: 'user-dash', component: UserDash, name:'user-dash'},
                {path: 'application', component: Application, name:'application'},
                {path: 'start', component: Application, name:'application'},
                {path: 'admission', component: Application, name:'admission_history'},
                {path: 'applications', component: ClientApplications, name:'application_history'},
                {path: 'application-success', component: ApplicationSuccessPage, name: "application-success"},
                {path: 'student-profile', component: StudentProfile, name:'student-profile'}
            ]
        },

        
        {
            path: '/admin',
            component: TeacherDashboard,
            name :"teacher",
            redirect:{ name: 'teacher-dashboard' },
            meta: {
                requiresAuth: true,
            },
            children:[
                {path: 'teacher-dashboard', component: HelloTeacher, name:'teacher-dashboard'},
                {path: 'students', component: Students, name:'students'},
                {path: 'manage-stream', component: ManageStream, name:'manage-stream'},
                {path: 'my-classes', component: TeacherClasses, name:'my-classes'},
                {path: 'manage-subjects', component: Subjects, name:'manage-subjects'},
                {path: 'manage-scheme-of-work', component: ManageSchemeOfWork, name:'manage-scheme-of-work'},
                {path: 'manage-assessment', component: ManageAssessment, name:'manage-assessment'},
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
    // alert(JSON.stringify(to.name))
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // if (profile && token) {
        if (profile) {
            let user = JSON.parse(profile);

            if(!localStorage.getItem("entity_number") && to.name !== "entity-dashboard" && user.type !== "User" && user.type !== "Staff"){
                next({ name: "entity-dashboard" });
            }

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