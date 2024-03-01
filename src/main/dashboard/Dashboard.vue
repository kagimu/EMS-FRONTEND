<template>
<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12" style="background-color: #1062da;">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <div class="flex" style="width: 12%; margin-right: 4%; color: #ffffff;">
              <i @click="toggleMenu" style="font-size: 27px; cursor: pointer;" class="bi-list mr-2"></i>
              <router-link class="navbar-brand" :to="{name:'home'}" style="color: #ffffff;">Wholesome ED</router-link>
            </div>
            <div class="navbar-collapse">
              <ul class="navbar-nav me-auto my-lg-0 navbar-nav-scroll" style="font-size: 13px;">
<!--                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#" style="color: #ffffff;">Home</a>
                </li>-->
<!--                <li class="nav-item dropdown">
                  <a style="color: #ffffff;" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Link
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li>-->
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


      <div class="row mx-auto">
        <div :class="defaultMenuSize ? 'col-12 col-sm-1 col-md-0.5 col-lg-0.5' : 'col-12 col-sm-1 col-md-2 col-lg-2'" style="background-color: #ffffff; border-right: 1px solid #dedede; padding: 0; height: 90vh;">


          <div
              class="list-group list-group-flush"
              :class="defaultMenuSize ? 'text-center' : ''"
              style="font-size: 13px;">
             <router-link
                 v-for="(lst,idx) in menuList" :key="idx"
                 v-show="can(lst.action, 'general')"
                 :class="(lst.name === routerName) ? 'active' : ''"
                 class="list-group-item list-group-item-action"
                 :to="{name:lst.name}">
                   <div
                       v-tooltip.right="lst.name"
                   >
                        <i :class="lst.icon" :style="defaultMenuSize ? 'font-size:17px;' : 'font-size:13px;'" class="mr-2"></i>
                        <small v-if="!defaultMenuSize">{{lst.title}}</small>
                   </div>
             </router-link>
          </div>


        </div>
        <div :class="defaultMenuSize ? 'col-12 col-sm-11 col-md-11 col-lg-11 mx-auto pb-10' : 'col-12 col-sm-11 col-md-10 col-lg-10 mx-auto pb-10'" style="background-color: #ecf0f5; height: 90vh; overflow-y: scroll; scrollbar-width: thin;">

            <router-view></router-view>

        </div>
      </div>


    <div class="row mx-auto" style="position: fixed; width: 100%; bottom: 0; left: 0; right: 0;">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12" style="background-color: #ffffff; border-top: 1px solid #dfe1e3;">
        <!-- Footer -->
        <footer style="padding: 10px;">

          <div class="row" style="font-size: 13px;">
            <div class="col-10 text-center">
              Copyright © 2017 Wholesome ED . All rights reserved.
            </div>
            <div class="col-2 text-end">Powered by Hamsoft</div>
          </div>

        </footer>
      </div>
    </div>



  </div>
</template>

<script setup>

import router from "@/config/router.js";

import {getCurrentInstance, ref} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useRouter} from "vue-router";
import { useAbility } from '@casl/vue';
const routerName = useRouter().currentRoute.value.name;
const authStore = useAuthStore()
const defaultMenuSize = ref(false)
const { can } = useAbility();

const menuList = ref([
  {title:"Home", name:"home", icon:"bi-house"},
  // {title:"Reports", name:"reports", icon:"bi-graph-up-arrow"},
  {title:"School", name:"school", icon:"bi-house-add" , action:"can_view_school"},
  {title:"Classes", name:"classes", icon:"bi-person-lines-fill",  action: "can_view_classes"},
  {title:"Curriculum", name:"curriculum", icon:"bi-pen", action:"can_view_curriculum"},
  // {title:"Classes", name:"class", icon:"bi-pen"},
  // {title:"Scheme Of Work", name:"scheme-of-work", icon:"bi-receipt"},
  {title:"Time table", name:"timetable", icon:"bi-pen",action:"can_view_timetable"},
  {title:"Assessment", name:"assessment", icon:"bi-book",action:"can_view_assessment"},
  {title:"Student Admission", name:"student-admission", icon:"bi-database-down",action:"can_view_student-admission"},
  {title:"Student Application", name:"student-application", icon:"bi-person-plus",action:"can_view_student-application"},
  {title:"Invoices", name:"invoices", icon:"bi-receipt-cutoff",action:"can_view_invoices"},
  {title:"Profiles", name:"profiles", icon:"bi-people",action:"can_view_profiles"},
  // {title:"Accounting", name:"accounting", icon:"bi-receipt"},
  {title:"Calendar", name:"general-calendar", icon:"bi-calendar3",action:"can_view_general-calendar"},
  {title:"Report Center", name:"report-center", icon:"bi-card-heading",action:"can_view_report-center"},
  {title:"Account Management", name:"account-management", icon:"bi-people",action:"can_view_account-management"},
  {title:"Settings", name:"settings", icon:"bi-gear",action:"can_view_settings"},
])




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

function toggleMenu(){
  defaultMenuSize.value = !defaultMenuSize.value
}

</script>

<style scoped>

</style>