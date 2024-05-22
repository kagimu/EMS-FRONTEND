<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-[#2c2f8c] sticky-top"  style="position: absolute; top: 0; left: 0; width: 100%;">
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
          <router-link   :class="[ menuSelected('application') ? 'btn btn-outline-success nav-item nav-link text-black' : 'btn btn-outline-success nav-item nav-link text-white']"  :to="{name:'application'}">
            <b>APPLY NOW</b> </router-link>

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
  </nav>

  <div class="row">
    <router-view></router-view>
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
/* .cd{
  padding:20px;
  width:300px;
  box-shadow: black;
} */
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
  padding: 0px;;
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
</style>

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

function  menuSelected(name){
  return router.currentRoute.value.name === name
}

onMounted(
    async () => {
      // alert(router.currentRoute.value.name)

    } )
</script>
