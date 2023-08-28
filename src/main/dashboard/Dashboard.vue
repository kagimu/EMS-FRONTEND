<template>
  <div style="position: fixed; width: 100%; left: 0; right: 0; top: 0; bottom: 0;">

    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12" style="background-color: #3c8dbc;">
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

import { ref} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useRouter} from "vue-router";
const routerName = useRouter().currentRoute.value.name;
const authStore = useAuthStore()
const defaultMenuSize = ref(false)

const menuList = ref([
  {title:"Home", name:"home", icon:"bi-house"},
  {title:"Reports", name:"reports", icon:"bi-graph-up-arrow"},
  {title:"School", name:"school", icon:"bi-house-add"},
  // {title:"Campus", name:"campus", icon:"bi-house-add"},
  // {title:"Manage Level", name:"level", icon:"bi-sign-intersection"},
  {title:"Student Admission", name:"student-admission", icon:"bi-person-plus"},
  {title:"Profiles", name:"profiles", icon:"bi-people"},
  {title:"Accounting", name:"accounting", icon:"bi-receipt"},
  {title:"Time table", name:"time-table", icon:"bi-card-text"},
  {title:"Report Center", name:"report-center", icon:"bi-card-heading"},
  {title:"Settings", name:"settings", icon:"bi-gear"},
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