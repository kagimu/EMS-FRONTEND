<script setup>

import router from "@/config/router.js";

import {ref, onMounted, watch} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useRouter} from "vue-router";
import { useAbility } from '@casl/vue';
import {breakpointsTailwind, useBreakpoints, useStorage} from "@vueuse/core";
const routerName = useRouter().currentRoute.value.name;
const authStore = useAuthStore()

const { can } = useAbility();

const breakpoints = useBreakpoints(breakpointsTailwind)
const xs = breakpoints.smaller('sm')
const sm = breakpoints.between('sm', 'md')
const md = breakpoints.between('md', 'lg')


const defaultMenuSize = ref(useStorage("toggle", false))


const menuList = ref([
  {title:"Home", name:"home", icon:"bi-house",action:"view_dashboard"},
  {title:"School", name:"school", icon:"bi-house-add" , action:"view_school"},
  {title:"Curriculum", name:"curriculum", icon:"bi-pen", action:"view_curriculum"},
  {title:"Time table", name:"timetable", icon:"bi-pen",action:"view_timetable"},
  {title:"Student Application", name:"student-application", icon:"bi-person-plus",action:"view_student-application"},
  {title:"Student Admission", name:"admission-list", icon:"bi-database-down",action:"view_admissions"},
  {title:"Student Enrolment", name:"enrolment", icon:"bi-database-down",action:"view_enrolment"},
  // {title:"Student Promotions", name:"promotions", icon:"bi-database-down",action:"view_promotions"},
  // {title:"Invoices", name:"invoices", icon:"bi-receipt-cutoff",action:"view_invoices"},
  {title:"Catering", name:"catering", icon:"bi-egg-fried",action:"view_catering_menu" },
  {title:"Calendar", name:"general-calendar", icon:"bi-calendar3",action:"view_general-calendar"},
  // {title:"Report Center", name:"report-center", icon:"bi-card-heading",action:"view_report-center"},
  {title:"Account Management", name:"account-management", icon:"bi-people",action:"view_account-management"},
  {title:"Settings", name:"settings", icon:"bi-gear",action:"view_settings"},
])

onMounted(
    async () => {
      await  updateOnlineStatus()
      checkDynamicClass()
    }
)

const menu = ref(null);

const handleClickOutside = (event) => {
  if (menu.value && !menu.value.contains(event.target)) {
    defaultMenuSize.value = false;
  }
};


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



function userLogout(){

  localStorage.clear();

  let r = router.resolve({
    name: "login"
  });
  window.location.assign(r.href);

}




const online = ref(navigator.onLine);
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  online.value = navigator.onLine;
  if (!online.value) {
    alert("You are currently offline. Please check your internet connection.");
  }
}
</script>
<template>

<div class="p-0 h-screen w-screen">
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
              <router-link class="navbar-brand text-white" :to="{name:'home'}"><div class="text-[17px]">Victorious Education Services</div> </router-link>
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



    <div class="flex-1 h-screen overflow-y-scroll scrollbar-thin pb-[120px] bg-[#ecf0f5]">
      <div class="px-3 pt-[50px]">
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
              Copyright © 2011 Wholesome Education System . All rights reserved.
            </div>
            <div class="col-2 text-end">Powered by Hamsoft</div>
          </div>
        </footer>
      </div>
    </div>



  </div>
</template>



<style scoped>

</style>