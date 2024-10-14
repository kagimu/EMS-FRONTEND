<script setup>
import router from "@/config/router.js";
import {ref, onMounted, watch,onUnmounted} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useRouter} from "vue-router";
import { useAbility } from '@casl/vue';
import {breakpointsTailwind, useBreakpoints, useStorage} from "@vueuse/core";
import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import useNotificationStore from "@/composables/useNotification.js";

const currentSchool = ref(null)
const currentSchoolName = ref(null)
const currentSchoolInfoData = ref(null);
const notificationStore = useNotificationStore()

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


const menuList = ref([
  {title:"Dashboard", name:"teacher-dashboard", icon:"bi-house",action:"view_dashboard"},
  // {title:"Time Table", name:"", icon:"bi-clock" ,action:""},//my shedule and General timetable
  {title:"Class Routines", name:"my-classes", icon:"bi-files" ,action:"my-classes"}, //streams, students,  
  // {title:"Students", name:"students", icon:"bi-people" ,action:"view_students"},
  {title:"My Subjects", name:"", icon:"bi-bookmarks-fill" ,action:""},//learning area,concept, etc
  {title:"Scheme Of Work", name:"", icon:"bi-journals" ,action:""}, //create scheme of work, ...etc
  {title:"Attendance", name:"", icon:"bi-journal-richtext" ,action:""}, //Daily Attendance, Subject Attendance,
  {title:"Calendar", name:"", icon:"bi-calendar" ,action:""}, //Daily Attendance, Subject Attendance,
  {title:"Assessment", name:"", icon:"bi-file-earmark-spreadsheet" ,action:""}, //exams, entermarks,reports, marksheet, 
  {title:"My Profile", name:"", icon:"bi-person-lines-fill" ,action:""},
])


onMounted(
    async () => {
      updateOnlineStatus()
      checkDynamicClass()
      landingPageTitle.value = localStorage.getItem("landingPageTitle")

      if(localStorage.getItem("SchoolInfo")){
        let data =  JSON.parse(localStorage.getItem("SchoolInfo")) 
        schoolLists.value =data
      }
      currentSchoolInfoData.value = localStorage.getItem("currentSchoolInfo")
      if(currentSchoolInfoData.value){
        isOpen.value = false
        let draft = JSON.parse(currentSchoolInfoData.value)
        currentSchoolName.value = draft.name
      }

      campusListData.value = JSON.parse(localStorage.getItem("Campus"))
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
  localStorage.setItem("currentSchoolInfo",currentSchool.value) 
  isOpen.value = false
  let draft = JSON.parse(currentSchool.value)
      currentSchoolName.value = draft.name
}

watch(
  () => currentSchoolInfoData.value,
  async (data) => {
    if (data) {
       isOpen.value = false
       let draft = JSON.parse(currentSchoolInfoData.value)
       currentSchoolName.value = draft.name
    }
  }
)
// const stopPropagation = (event) => {
//   event.stopPropagation();
// }


// Prevent Event Propagation
const stopPropagation = (event) => {
  event.stopPropagation();
  if (!currentSchool.value) {
    notificationStore.errorToast("error","select school to continue please !")
  }
};
</script>
<template>

<div class="overlay" v-if="isOpen" @click.self="stopPropagation">
    <div class="dialog">
      <p>Please select a school to continue.</p>
      <select class="form-select " v-model="schoolName" @change="setSchool(schoolName)">
        <option disabled value=""> -select-</option>
        <option v-for="(school, index) in schoolLists" :key="index" :value="school">
          {{ school.name }}
        </option>
      </select>
      <button @click="goToDashboard" :disabled="!schoolName" class="btn btn-primary btn-sm ml-2 mt-2 ">continue <i class="bi bi-arrow-right-circle"></i></button>
    </div>
  </div>


<div class="p-0 h-screen w-screen dark">

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
              <router-link class="navbar-brand text-white" :to="{name:'home'}"><div class="text-[17px]">
             
                <!-- <span v-for="(lt, index) in schoolLists" :key="index">{{ lt.name }}</span>  -->
                 {{ currentSchoolName }}
              </div> </router-link>
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
                      <li><hr class="dropdown-divider"></li>
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
        <div> <breadcrumbs></breadcrumbs></div>
         <div class="text-gray-600 text-[13px]">
           {{currentSchoolName}} /<span v-for="(cm,index) in campusListData" :key="index">{{ cm.campus_name }}</span>
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
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure overlay is on top */
}

.dialog {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
