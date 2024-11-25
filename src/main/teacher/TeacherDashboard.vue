<script setup>
   import router from "@/config/router.js";
   import {ref, onMounted, watch,onUnmounted,reactive} from 'vue'
   import {useAuthStore} from "@/main/auth/store/auth.js";
   import {useRouter} from "vue-router";
   import { useAbility } from '@casl/vue';
   import {breakpointsTailwind, useBreakpoints, useStorage} from "@vueuse/core";
   import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"
   import Breadcrumbs from "@/components/Breadcrumbs.vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
   import SelectSchoolDetails from "@/main/auth/SelectSchoolDetails.vue"
   
   
   const currentSchool = ref(null)
   const currentSchoolName = ref(null)
   const currentSchoolInfoData = ref([]);
   const notificationStore = useNotificationStore()
   const classStore = useClassesStore()
   const studyPeriodStore = useStudyPeriodStore()
   const campusList = ref([])
    const schoolList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const levelStore = useLevelStore()
    const academicYearStore = useAcademicYearStore()
    const academicYearList = ref([])
    const curriculumList  = ref([])
    const levelList  = ref([])
    const studyPeriodList = ref([])
    const schoolDetails = ref([])
   
     const form = reactive({
     academic_year: "",
     study_period_number: "",
     campus_class_number: "",
     campus_number: "",
     stream_number:"",
     interview_number:"",
     statusData:"",
     school_number:"",
     academic_year_number:"",
     curriculumNumber:"",
     level:""
     })
   
   const isOpen = ref(true)
   const handleKeydown = (event) => {
     if (event.key === 'Escape') {
       event.preventDefault(); 
     }
   }
   
   
   
   const entityStore = useEntityStore()
   
   let routerName = ""
    routerName = useRouter().currentRoute.value.name;
   
   
   if((routerName === "campus") || routerName === "campus-setup" || routerName === "campus-curriculum-setup"){
     routerName = "school"
   }
   
   
   if((routerName === "curriculum-setup")){
     routerName = "curriculum"
   }
   
   
   
   const authStore = useAuthStore()
   const { can } = useAbility();
   
   const breakpoints = useBreakpoints(breakpointsTailwind)
   const xs = breakpoints.smaller('sm')
   const sm = breakpoints.between('sm', 'md')
   const md = breakpoints.between('md', 'lg')
   let entityName = localStorage.getItem("entity_name")
   const schoolName = ref("")
   const schoolLists = ref([])
   const campusName = ref("Campus Name")
   const landingPageData = ref([])
   const menu = ref(null);
   const landingPageTitle = ref(null)
   const campusListData = ref([])
   
   const defaultMenuSize = ref(useStorage("toggle", false))
   const IsSchoolSelected = ref(null)
   
   
   const menuList = ref([
     {title:"Dashboard", name:"teacher-dashboard", icon:"bi-house",action:"view_dashboard"},
     // {title:"Time Table", name:"", icon:"bi-clock" ,action:""},//my shedule and General timetable
     {title:"Class Routines", name:"my-classes", icon:"bi-files" ,action:"my-classes"}, //streams, students,  
     // {title:"Students", name:"students", icon:"bi-people" ,action:"view_students"},
    //  {title:"My Subjects", name:"manage-subjects", icon:"bi-bookmarks-fill" ,action:"manage-subjects"},
     {title:"Scheme Of Work", name:"manage-scheme-and-sessions", icon:"bi-journals" ,action:"manage-scheme-and-sessions"}, //create scheme of work, ...etc
     {title:"Attendance", name:"", icon:"bi-journal-richtext" ,action:""}, //Daily Attendance, Subject Attendance,
     {title:"Calendar", name:"", icon:"bi-calendar" ,action:""}, //Daily Attendance, Subject Attendance,
     {title:"Assessment", name:"manage-assessment", icon:"bi-file-earmark-spreadsheet" ,action:"manage-assessment"}, //exams, entermarks,reports, marksheet, 
    //  {title:"My Profile", name:"", icon:"bi-person-lines-fill" ,action:""},
   ])
   
   
   onMounted(
       async () => {
         schoolStore.fetchSchools()
         updateOnlineStatus()
         checkDynamicClass()
         landingPageTitle.value = localStorage.getItem("landingPageTitle")
   
         if(localStorage.getItem("SchoolInfo")){
           let data =  JSON.parse(localStorage.getItem("SchoolInfo")) 
           schoolLists.value =data
         }
         currentSchoolInfoData.value = JSON.parse(localStorage.getItem("currentSchoolInfo"))
         if(currentSchoolInfoData.value){
           isOpen.value = false
           let draft = currentSchoolInfoData.value
           currentSchoolName.value = draft.name
         }
   
         campusListData.value = JSON.parse(localStorage.getItem("Campus"))

         IsSchoolSelected.value = localStorage.getItem("schoolSelectStatus")

       

       }
   
   )
   
   
   watch (
       () => entityStore.landPageResponse,
       async (data) => {
         if(data){
          landingPageData.value = data.data
         }
       }
   )
   
   watch(
       () => xs,
       async (data) => {
         if(data){
           checkDynamicClass()
         }
       },
       {deep:true}
   )
   
   watch(
       () => breakpoints,
       async (data) => {
         if(data){
           checkDynamicClass()
         }
       },
       {deep:true}
   )
   
   const checkDynamicClass = () => {
     if(md.value){
       defaultMenuSize.value = true
     }
     if(sm.value){
       defaultMenuSize.value = false
     }
   
     if(xs.value){
       defaultMenuSize.value = false
     }
   }
   
   const name = ref(null)
   let p = authStore.profile
   
   name.value = p.first_name+" "+p.second_name+" "+p.last_name
   
   
   const userLogout = () =>{
   
     localStorage.clear();
   
     let r = router.resolve({
       name: "login"
     });
     window.location.assign(r.href);
   
   }
   
   const online = ref(navigator.onLine);
   window.addEventListener('online', updateOnlineStatus);
   window.addEventListener('offline', updateOnlineStatus);
   const offline = ref(null)
   
   
   function updateOnlineStatus() {
     online.value = navigator.onLine;
     if (!online.value) {
       offline.value = "offline.";
     }else{
       offline.value = "Online.";
     }
   }
   const goToEntities = () => {
     router.push({name:'entity-dashboard'})
   }
   
   watch (
       () => navigator.onLine,
       async (data) => {
         if(data){
           updateOnlineStatus()
         }
       }
   )
   
   
   onUnmounted(() => {
     window.removeEventListener('keydown', handleKeydown);
   })
   
   const setSchool = (Sch) => {
   currentSchool.value = JSON.stringify(Sch)
   }
   
   const goToDashboard = () => {
   
    //  let logoInfoData = {
    //  academic_year_number: form.academic_year_number,
    //  study_period_number: form.study_period_number,
    //  campus_class_number: form.campus_class_number,
    //  campus_number: form.campus_number,
    //  school_number:form.school_number,
    //  curriculum_number:form.curriculumNumber,
    //  level_number:form.level
    //  }

     if(form.school_number){
      schoolStore.fetchSchoolData(form.school_number)
     }
    // 

    //  localStorage.setItem("logoInfoData",JSON.stringify(logoInfoData)) 
     localStorage.setItem("currentSchoolInfo",currentSchool.value) 
     isOpen.value = false
     let draft = JSON.parse(currentSchool.value)
         currentSchoolName.value = draft.name
   } 
   
  //  watch(
  //    () => currentSchoolInfoData.value,
  //    async (data) => {
  //      if (data) {
  //         isOpen.value = false
  //         let draft = JSON.parse(currentSchoolInfoData.value)
  //         currentSchoolName.value = draft.name
  //      }
  //    }
  //  )
 
   // Prevent Event Propagation
   const stopPropagation = (event) => {
     event.stopPropagation();
     if (!currentSchool.value) {
       notificationStore.errorToast("error","select school to continue please !")
     }
   }
   
   watch(
       () => schoolStore.schoolsResponse,
       async (data) => {
           if (data) {
               schoolList.value = data.data
           }
       },
       {deep: true}
     )
   
     const fetchCampuses = (school_number) => {
       campusStore.fetchCampuses(school_number)
     }
   
   
     watch(
       () => campusStore.campusListResponse,
       async (data) => {
           if (data) {
               campusList.value = data.data
           }
       }
     )
   
     const fetchClasses = (campus_number) => {
       campusStore.fetchClassesByCampus(campus_number)
       levelStore.fetchCampusCurriculum(campus_number)
     }
   
     const fetchCampusLevel = (curriculumNumber) => {
      classStore.fetchCampusLevel(curriculumNumber)
   }
    
   
   watch(
       () => levelStore.campusCurriculumResponse,
       async (data) => {
         if(data){
           curriculumList.value = data.data
         }
       },
       {deep:true}
   )
   
   
   watch(
       () => classStore.campusLevelResponse,
       async (data) => {
         if(data){
           levelList.value = data.data 
         }
       }
   )
   
   
   const fetchLevelClasses = (levelNumber) => {
      classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
      academicYearStore.fetchAcademicYearByLevel(levelNumber)
   }
   
   
   watch(
       () => campusStore.campusClassesResponse,
       async (data) => {
           if (data) {
               classList.value = data.data
           }
       },
       {deep: true}
     )
     
     watch(
       () => classStore.classLevelInfoResponse,
       async (data) => {
         if(data){
           classList.value = data.data
         }
       },
       {deep:true}
   )
   
   watch(
        () => academicYearStore.academicYearByLevelResponse,
        async (data) => {
          if(data){
            academicYearList.value = data.data
          }
        }
      )
   
      const fetchStreamsAndStudyPeriod = (classNumber) =>{
   
        studyPeriodStore.fetchStudyPeriod(
         {
           academic_year_number:form.academic_year_number,
           class_number:classNumber,
           school_number:form.school_number
         } )
      }
   
   
      watch(
       () => studyPeriodStore.studyPeriodResponse,
       async (data) => {
         if(data){
           studyPeriodList.value = data.data
         }
       }
   )
   

</script>
<template>

    <!-- <div class="overlay" v-if="isOpen" @click.self="stopPropagation">
      <div class="dialog">
         <p>Select Options</p>
         <select class="form-select " v-model="schoolName" @change="setSchool(schoolName)">
            <option disabled value=""> -select-</option>
            <option v-for="(school, index) in schoolLists" :key="index" :value="school">
               {{ school.name }}
            </option>
         </select>
         <button @click="goToDashboard" :disabled="!schoolName" class="btn btn-primary btn-sm ml-2 mt-2 ">continue <i class="bi bi-arrow-right-circle"></i></button>
      </div>
   </div>  -->


   <div class="p-0 h-screen w-screen dark" >
      <div class="row fixed w-screen mx-auto z-50">
         <div class="col-12 col-sm-12 col-md-12 col-lg-12 bg-[#2c2f8c]">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
               <div class="container-fluid">
                  <div class="flex" style="width: 12%; margin-right: 4%; color: #ffffff;">
                     <i
                        @click="defaultMenuSize = !defaultMenuSize"
                        style="font-size: 27px; cursor: pointer;"
                        class="bi-list mr-2"
                        :class="defaultMenuSize ? 'transition ease-in-out rotate-0 duration-700' : 'transition ease-in-out -rotate-180 duration-700'"
                        ></i>
                     <router-link class="navbar-brand text-white" :to="{name:'home'}">
                        <div class="text-[17px]">
                           <!-- <span v-for="(lt, index) in schoolLists" :key="index">{{ lt.name }}</span>  -->
                           <span v-for="(sch,index) in currentSchoolInfoData" :key="index">{{sch.name}}</span>
                        </div>
                     </router-link>
                  </div>
                  <div class="navbar-collapse">
                     <ul class="navbar-nav me-auto my-lg-0 navbar-nav-scroll" style="font-size: 13px;">
                     </ul>
                     <div class="d-flex">
                        <ul class="navbar-nav me-auto mb-lg-0" style="font-size: 13px;">
                           <li class="nav-item dropdown">
                              <a style="color: #ffffff;" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <span>
                              <i class="bi-person-circle"></i>
                              {{name}}
                              </span>
                              </a>
                              <ul class="dropdown-menu" style="font-size: 13px;">
                                 <li><a class="dropdown-item" style="cursor: pointer;">Profile</a></li>
                                 <li>
                                    <hr class="dropdown-divider">
                                 </li>
                                 <li><a class="dropdown-item" style="cursor: pointer;" @click="userLogout">Logout</a></li>
                              </ul>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </nav>
         </div>
      </div>
      <div class="flex w-screen h-screen overflow-hidden">
         <div
            v-if="!xs && !sm"
            :class="defaultMenuSize ? 'w-[4%] group hover:w-[16%]' : 'w-[16%]'"
            class="bg-white border-[#dfdfdf] border-r h-screen duration-700">
            <div class="overflow-y-scroll scrollbar-thin bg-white h-screen mt-[56px]">
               <div
                  class="list-group list-group-flush text-[13px] pb-[100px] mt-1"
                  :class="defaultMenuSize ? 'flex justify-center group-hover:text-left' : ''"
                  >
                  <router-link
                     v-for="(lst,idx) in menuList" :key="idx"
                     :class="(lst.name === routerName) ? 'active' : ''"
                     class="list-group-item list-group-item-action"
                     :to="{name:lst.name}">
                     <div
                        v-tooltip.right="lst.name"
                        >
                        <i :class="[lst.icon, (defaultMenuSize ? 'text-[17px] group-hover:text-[13px]' : 'text-[13px]')]"  class="mr-2 duration-700 pl-1"></i>
                        <small :class="{'inline-block': !defaultMenuSize, 'hidden group-hover:inline-block':defaultMenuSize}" class="duration-700">{{lst.title}}</small>
                     </div>
                  </router-link>
               </div>
            </div>
         </div>
         <div
            v-else
            class="bg-white border-[#dfdfdf] border-r h-screen duration-700 flex-none"
            >
            <Transition
               enter-from-class="-translate-x-0"
               enter-active-class="transition-all duration-100 ease-in-out"
               leave-to-class="translate-x-0"
               leave-active-class="transition-all duration-100 ease-in-out"
               >
               <div
                  ref="menu"
                  v-if="defaultMenuSize"
                  class="absolute top-0 left-0 h-screen z-50 w-[240px] bg-white border-r border-[#dfdfdf] duration-700"
                  style="font-size: 13px;">
                  <div class="flex justify-between">
                     &nbsp;
                     <i
                        @click="defaultMenuSize = !defaultMenuSize"
                        style="font-size: 15px; cursor: pointer;"
                        class="fa fa-times mr-2 text-black"
                        :class="!defaultMenuSize ? 'transition ease-in-out rotate-0 duration-700' : 'transition ease-in-out -rotate-180 duration-700'"
                        ></i>
                  </div>
                  <div
                     class="list-group list-group-flush text-[13px] pb-[100px]"
                     :class="defaultMenuSize ? 'flex justify-center group-hover:text-left' : ''"
                     >
                     <router-link
                        v-for="(lst,idx) in menuList" :key="idx"            
                        :class="(lst.name === routerName) ? 'active' : ''"
                        class="list-group-item list-group-item-action"
                        :to="{name:lst.name}">
                        <div
                           v-tooltip.right="lst.name"
                           >
                           <i :class="[lst.icon,'text-[13px]']"  class="mr-2 duration-700 pl-1"></i>
                           <small>{{lst.title}}</small>
                        </div>
                     </router-link>
                  </div>
               </div>
            </Transition>
         </div>
         <div class="flex-1 h-screen overflow-y-scroll scrollbar-thin pb-[120px] bg-[#ecf0f5]">
            <div class="px-3 pt-[50px]">
               <div class="mt-3 flex justify-between">
                  <div>
                     <breadcrumbs></breadcrumbs>
                  </div>
                  <div class="text-gray-600 text-[13px]">
                    <span v-for="(sch,index) in currentSchoolInfoData" :key="index">{{sch.name}}</span> /<span v-for="(cm,index) in campusListData" :key="index">{{ cm.campus_name }}</span>
                  </div>
               </div>
               <router-view></router-view>
            </div>
         </div>
      </div>
      <div class="row mx-auto" style="position: fixed; width: 100%; bottom: 0; left: 0; right: 0;">
         <div class="col-12 col-sm-12 col-md-12 col-lg-12" style="background-color: #ffffff; border-top: 1px solid #dfe1e3;">
            <!-- Footer -->
            <footer style="padding: 10px;">
               <div class="row" style="font-size: 13px;">
                  <div class="col-10 text-center">
                     Copyright © 2011 Wholesome Education System . All rights reserved. &nbsp;
                     Status: <span class="alert alert-warning p-1" v-if="!online">
                     {{ offline  }}
                     </span>
                     <span class="alert alert-success p-1" v-if="online">
                     Online
                     </span>
                  </div>
                  <div class="col-2 text-end">Powered by Hamsoft</div>
               </div>
            </footer>
         </div>
      </div>
   </div>
</template>
<style scoped>
   .overlay {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: white;
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
   }
   .dialog {
   background-color: white;
   padding: 20px;
   border-radius: 8px;
   width: 400px;
   text-align: center;
   }
   button:disabled {
   opacity: 0.5;
   cursor: not-allowed;
   }
</style>