<script setup>

import {onMounted, ref} from "vue";
import router from "@/config/router.js";
import {useAuthStore} from "@/main/auth/store/auth.js";
const  authStore = useAuthStore();
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

const  menuSelected = (name) =>{
  return router.currentRoute.value.name === name
}

const applyApplication = () => {
  window.localStorage.removeItem("application-id");
  router.go({name:"application"})
}

onMounted(
    async () => {
      // alert(router.currentRoute.value.name)

    } )
</script>
<template>
  <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-[#2c2f8c] sticky-top"  style="position: absolute; top: 0; left: 0; width: 100%;">
    <div class="container-fluid">
      <router-link :to="{name:'client_dashboard'}" class="navbar-brand" style="margin-left:20px;font-size:14px;
           font-weight:400"><i class="bi bi-list"></i>&nbsp;<b>Victorious Education Services</b>
      </router-link>
      <button class="navbar-toggler" data-bs-target="#navbarCollapse" data-bs-toggle="collapse" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarCollapse" class="navbar navbar-collapse">
        <div class="navbar-nav">
        </div>
        <div class="navbar-nav">
          <div
          :class="[ menuSelected('application') ? 'btn btn-outline-success nav-item nav-link text-black' : 'btn btn-outline-success nav-item nav-link text-white']"
          @click="applyApplication()"
          >
            <b>APPLY NOW</b>
          </div>
          <router-link :class="[ menuSelected('application_history') ? 'btn  btn-outline-danger nav-item nav-link' : 'btn btn-outline-success nav-item nav-link']" :to="{name:'application_history'}" style="border-radius: 0px; color:rgba(16, 54, 135, 0.751)" >
            APPLICATION HISTORY </router-link>

          <router-link :class="[ menuSelected('admission_history') ? 'btn  btn-light nav-item nav-link text-red' : 'btn btn-outline-success nav-item nav-link']" :to="{name:'admission_history'}">ADMISSION HISTORY</router-link>

          <span class="nav-item dropdown">

<a aria-expanded="false"
   aria-label="Toggle theme (light)" class="btn btn-link nav-link dropdown-toggle d-flex align-items-center" data-bs-display="static"
   data-bs-toggle="dropdown" style="border: 0px;">
    {{name}}
            </a>
<ul aria-labelledby="bd-theme-text" class="dropdown-menu dropdown-menu-end">
<li class="text-sm2">
    <i class="bi bi-person-circle"></i> &nbsp;My Profile
</li>
<li  class="text-sm2">
    <i class="bi bi-person-fill-lock"></i>&nbsp;Change Password
</li>
<li  class="text-sm2">
    <span class="text-sm2" style="cursor: pointer" @click="userLogout"><i class="bi bi-box-arrow-right"></i>&nbsp;Logout</span>
</li>
</ul>
</span>
        </div>
      </div>
    </div>
  </nav> -->


  
  <nav class="navbar navbar-expand-lg navbar-light bg-darkB sticky-top ">
    <div class="container-fluid d-flex justify-content-between align-items-center px-4 py-2">
      <!-- Left Section: Title and Toggle -->
      <div class="d-flex align-items-center">
        <router-link :to="{ name: 'client_dashboard' }" class="navbar-brand d-flex align-items-center text-white">
          <i class="bi bi-list fs-4"></i>&nbsp;
          <span class="fw-bold fs-5">Victorious Education Services</span>
        </router-link>
       
      </div>

      <!-- Right Section: Buttons and User Info -->
      <div class="d-flex align-items-center">
        <!-- Buttons -->
        <button
          :class="[
            menuSelected('application') ? 'btn btn-light me-3 text-success' : 'btn btn-outline-light me-3',
            'px-3 py-2'
          ]"
          @click="applyApplication()"
        >
          APPLY NOW
        </button>

        <router-link
          :class="[
            menuSelected('application_history') ? 'btn btn-light me-3 text-success' : 'btn btn-outline-light me-3',
            ' px-3 py-2'
          ]"
          :to="{ name: 'application_history' }"
        >
          APPLICATION HISTORY
        </router-link>

        <router-link
          :class="[
            menuSelected('admission_history') ? 'btn btn-light me-3 text-success' : 'btn btn-outline-light me-3',
            'px-3 py-2'
          ]"
          :to="{ name: 'admission_history' }"
        >
          ADMISSION HISTORY
        </router-link>

        <!-- User Dropdown -->
        <div class="dropdown">
          <span
            class=" dropdown-toggle d-flex align-items-center px-1 py-1"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="color: black; margin-right: 20px;"

          >
            {{ name }}
        </span>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="#"><i class="bi bi-person-circle"></i> My Profile</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-person-fill-lock"></i> Change Password</a></li>
            <li><a class="dropdown-item" href="#" @click="userLogout"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <div class="row">
    <div class="col-lg-4">

    </div>
    <div class="col-lg-8">
      <router-view></router-view>
    </div>
    
  </div>


  <footer class="absolute bottom-0 left-0 w-screen bg-[#2c2f8c] py-0">
    <div class="flex justify-between px-3 py-1">
      <div class="text-white text-sm"><small>© 2011 Wholesome Education System, All rights reserved.</small></div>
      <a  class="text-white no-underline text-sm" href="#"><small><span>Powered by</span> <b>Hamsoft</b></small></a>
    </div>
  </footer>



</template>



<style scoped>
.center {
  padding: 70px 0;
  /* border: 3px solid green; */
  text-align: center;
}
html, body {
  height: 100%;
}

div.card {
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  height: 180px;
  padding-top: 15px;
}
.text-gray {
  --tw-text-opacity: 1;
  color: rgba(80, 80, 80, var(--tw-text-opacity));
}
.card-title{
  font-size: 1.25rem;

}
.hr{
  display: none;
  border-top:none;
  width: 150px;
  border-bottom: 2px solid rgb(0, 123, 255);
  border-left: none;
  border-right: none;
  margin-left: 30%;
  margin-right: 30%;
}
.navbar-expand-lg .navbar-nav .nav-link{
  color:white;
}
.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  padding: 0px !important; }
.bg-primary{
  background-color: rgb(13, 86, 195) !important;
}
.navbar{
  padding: 5px;;
}
.footer {
  position: absolute !important;
  margin-top: 20px;
  left: 0  !important;;
  bottom: 0  !important;
  width: 100%  !important;;
  background-color:  rgb(13, 86, 195) !important;
  color: rgb(216, 214, 214);
  text-align: center;
  padding-left: 10px;
  font-size: 12px;
}
.nav-link {
  font-size: 12px !important;
  line-height: 0.2rem!important;
  color:rgba(236, 232, 232, 0.831) !important;
  font-weight: bold !important;
  border:1px solid rgba(244, 244, 244, 0.251);
  margin: 5px;
  border-radius: 0px;

}
.text-sm2 {
  font-size: 13px !important;
  line-height: 0.5rem!important;
  color:rgba(0, 0, 0, 0.868) !important;
  font-weight: 900px !important;
  padding: 4px;
  text-decoration: none;
}

.navbar {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand span {
  font-size: 1.25rem; 
}

.btn {
  font-size: 0.8rem; 
}

.dropdown-toggle {
  font-size: 0.9rem; 
}

.dropdown-item {
  font-size: 0.85rem;
}

.dropdown-menu {
  min-width: 200px; 
}

.dropdown-item i {
  margin-right: 8px; 
}
.bg-darkB {
  background-color: #2c2f8c;
}
</style>

