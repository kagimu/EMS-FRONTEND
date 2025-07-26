<script setup>

import router from "@/config/router.js";

import {ref, onMounted, watch} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useRouter} from "vue-router";
import { useAbility } from '@casl/vue';
import {breakpointsTailwind, useBreakpoints, useStorage} from "@vueuse/core";
import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import AppModal from "@/components/AppModal.vue";
import FiltersModal from "@/main/dashboard/FiltersModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const entityStore = useEntityStore()
const showConfigModal = ref(false)
const confirmationRef = ref(null);

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
const campusName = ref("")
const landingPageData = ref([])
const menu = ref(null);
const landingPageTitle = ref(null)

const defaultMenuSize = ref(useStorage("toggle", false))


const menuList = ref([
  {title:"Home", name:"home", icon:"bi-house",action:"view_dashboard"},
  {title:"Curriculum", name:"curriculum", icon:"bi-pen", action:"view_curriculum"},
  {title:"School", name:"school", icon:"bi-house-add" , action:"view_school"},
  // {title:"Time table", name:"timetable", icon:"bi-pen",action:"view_timetable-details"},
  {title:"Student Application", name:"student-application", icon:"bi-person-plus",action:"view_applications"},
  {title:"Student Admission", name:"admission-list", icon:"bi-database-down",action:"view_admissions"},
  {title:"Financial Records", name:"financial-records", icon:"bi-receipt",action:"view_financial_records"},
  {title:"Student Enrolment", name:"enrolment", icon:"bi-database-down",action:"view_enrollments"},
  {title:"Catering", name:"catering", icon:"bi-egg-fried",action:"view_catering_menu" },
  // {title:"Calendar", name:"general-calendar", icon:"bi-calendar3",action:"view_calendar"},
       {title:"Attendance", name:"manage-attendance", icon:"bi-journal-richtext" ,action:""},
  {title:"Account Management", name:"account-management", icon:"bi-people",action:"view_account-management"},
  {title:"Settings", name:"settings", icon:"bi-gear",action:"access_settings_menu"},
])

const phoneNumber = ref(null)
const whatsappNo = ref(null)
const email = ref(null)
const website = ref(null)
const facebook = ref(null)
const twitter = ref(null)
const instagram = ref(null)


onMounted(
    async () => {
      updateOnlineStatus()
      checkDynamicClass()
      landingPageTitle.value = localStorage.getItem("landingPageTitle")
      
      if(localStorage.getItem("schoolName")){
      schoolName.value = localStorage.getItem("schoolName")
      }
      if(localStorage.getItem("campusName")){
      campusName.value = localStorage.getItem("campusName")
      }
      if(localStorage.getItem("entityInfo")){
       let draft = JSON.parse(localStorage.getItem("entityInfo"))
      facebook.value = draft?.facebook
      email.value = draft?.email
      twitter.value = draft?.twitter
      phoneNumber.value = draft?.phone
      whatsappNo.value =  draft?.whatsapp
      instagram.value = draft?.instagram
      website.value = draft?.website
      }
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
  let landT = localStorage.getItem("landingPageTitle")

  localStorage.clear();

  localStorage.setItem("landingPageTitle", landT)

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

const showContactDetails = ref(false);

const toggleContactDetails = () => {
  showContactDetails.value = !showContactDetails.value;
}

const openConfigModal = () => {
  showConfigModal.value = true
}

const closeDialog = () => {
  showConfigModal.value = false
}

const switchUser = async () => {
  const agreed = await confirmationRef.value.confirm("Confirm that you want to switch to Teachers Portal!");
  if (agreed) {
    await router.push({name: 'teacher-dashboard'})
  }
}

</script>
<template>

  <ConfirmationModal removeBorder="remove" ref="confirmationRef"></ConfirmationModal>

<AppModal title="Switch" v-model="showConfigModal" xl6>
  <FiltersModal @closeDialog="closeDialog"></FiltersModal>
</AppModal>

<div class="p-0 h-screen w-screen dark">

    <div class="row fixed w-screen mx-auto z-50">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12 bg-[#2c2f8c]">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <div class="flex" style="margin-right: 4%; color: #ffffff;">
              <i
                  @click="defaultMenuSize = !defaultMenuSize"
                  style="font-size: 27px; cursor: pointer;"
                  class="bi-list mr-2"
                  :class="defaultMenuSize ? 'transition ease-in-out rotate-0 duration-700' : 'transition ease-in-out -rotate-180 duration-700'"
              ></i>
              <router-link class="navbar-brand text-white" :to="{name:'home'}"><div class="text-[17px]">{{ entityName }}</div> </router-link>
              <div>
                        <span v-if="can('can_serve_as_teacher_and_admin','general')">
                      <button
                          class="text-[#2c2f8c] bg-white text-xs rounded-sm ml-4 px-2 py-1 cursor-pointer mt-2" type="button"  @click="switchUser">
                        <i class="bi bi-plus"></i>Switch to Teacher
                      </button>
                    </span>
              </div>
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
                      <li @click="goToEntities"><a class="dropdown-item" style="cursor: pointer;" >My Entities</a></li>
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
          class="list-group list-group-flush text-[13px] pb-[100px]"
          :class="defaultMenuSize ? 'flex justify-center group-hover:text-left' : ''"
      >
        <router-link
            v-for="(lst,idx) in menuList" :key="idx"
            v-show="can(lst.action, 'general')"
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
        <div class="floating-help-button text-xs p-2 ml-3" @click="toggleContactDetails">
      Need Help ?
    </div>


<!--    <div class="floating-setup-button text-xs p-2 ml-3" @click="openConfigModal">-->
<!--  <i class="bi bi-nintendo-switch"></i> <small>Quick Switch</small>-->
<!--</div>-->

    <div v-if="showContactDetails" class="contact-details ">
      <div class="row" style="border-bottom: 1px  #f1f1f1 solid;">
      <div class="col-lg-6">
      <h5 class="text-xs">Contact us</h5>
      </div>
      <div class="col-lg-6">
      <button @click="toggleContactDetails" class="close-btn">
      <i class="bi bi-x-lg"></i>
      </button>
      </div>
      </div>
      <p><i class="bi bi-phone mr-2" style="color:orange;font-size: 20px;"></i> {{ phoneNumber }}</p>
      <p> <i class="bi bi-envelope mr-2" style="color:blue;font-size: 18px;"></i>{{ email }}</p>
      <p> <i class="bi bi-whatsapp mr-2" style="color:green;font-size: 20px;"></i> {{ whatsappNo }}</p>
      <p> <i class="bi bi-globe mr-2" style="color:green;font-size: 20px;"></i> {{ website }}</p>
      </div>

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
              v-show="can(lst.action, 'general')"
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



    <div class="flex-1 h-screen overflow-y-scroll scrollbar-thin pb-[120px]">
      <div class="px-3 pt-[50px]">


       <div class="mt-3 flex justify-between">
        <div> <breadcrumbs></breadcrumbs></div>
         <div class="text-gray-600 text-[13px]">
           {{schoolName}} / {{campusName}}
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
.floating-help-button {
  position: fixed;
  bottom: 45px;
  /* right: 1180px; */
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  font-weight: bold;
  z-index: 1100;
  transition: background-color 0.3s;
}
.floating-help-button:hover {
  background-color: #0056b3;
}
/* Contact Details Box */
.contact-details {
  position: fixed;
  bottom: 80px;
  left: 40px;
  /* right: 990px; */
  background-color: #fff;
  color: #333;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1100;
  width: 250px;
  font-size: 11px;

}

/* Close Button inside Contact Box */
.close-btn {
  /* background-color: red; */
  color: rgb(13, 13, 13);
  border: none;
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
  /* font-size: 20px; */
}

.floating-setup-button {
  position: fixed;
  bottom: 45px;
  left: 1100px;
  background-color: #043a10;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  font-weight: bold;
  z-index: 1100;
  transition: background-color 0.3s;
}
.floating-setup-button:hover {
  background-color: #0056b3;
}
.spinning-gear {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>