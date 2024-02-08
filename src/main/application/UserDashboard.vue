<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top"  style="position: absolute; top: 0; left: 0; width: 100%;">
        <div class="container-fluid">
          <router-link :to="{name:'client_dashboard'}" class="navbar-brand" style="margin-left:20px;font-size:14px;
           font-weight:400"><i class="bi bi-list"></i>&nbsp;<b>Wholesome ED</b>
  </router-link>
          <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav">
          </div>
          <div class="navbar-nav">
            <router-link   :class="[ menuSelected('application') ? 'btn btn-outline-success nav-item nav-link text-black' : 'btn btn-outline-success nav-item nav-link text-white']"  :to="{name:'application'}">
              <b>APPLY NOW</b> </router-link>

            <router-link :class="[ menuSelected('application_history') ? 'btn  btn-light nav-item nav-link' : 'btn btn-outline-success nav-item nav-link']" :to="{name:'application_history'}" style="border-radius: 0px; color:rgba(16, 54, 135, 0.751)" >
            APPLICATION HISTORY </router-link>

            <router-link :class="[ menuSelected('admission_history') ? 'btn  btn-light nav-item nav-link' : 'btn btn-outline-success nav-item nav-link']" :to="{name:'admission_history'}">ADMISSION HISTORY</router-link>

            <span class="nav-item dropdown">

<a class="btn btn-link nav-link dropdown-toggle d-flex align-items-center" 
 aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static"
 aria-label="Toggle theme (light)" style="border: 0px;">
    {{name}}
            </a>
<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
<li class="text-sm2">
    <i class="bi bi-person-circle"></i> &nbsp;My Profile
</li>
<li  class="text-sm2">
    <i class="bi bi-person-fill-lock"></i>&nbsp;Change Password
</li>
<li  class="text-sm2">
    <span style="cursor: pointer" @click="userLogout" class="text-sm2"><i class="bi bi-box-arrow-right"></i>&nbsp;Logout</span>
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
   
    

  <footer class="footer">
      <div class="d-flex flex-column flex-sm-row justify-content-between py-2 my-0 mx-0 border-top">
        <p style="font-size: 12px;color:rgba(255, 255, 255, 0.833) !important;">© 2023 WholeSome Ed, All rights reserved.</p>
        <ul class="list-unstyled d-flex">
          <li class="ms-3" ><a  style="text-decoration: none;color:white !important;" class="link-dark" href="#"><span style="color: rgb(215, 213, 213);">Powered by</span> <b>Hamsoft</b> </a></li>
          <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg></a></li>
          <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#facebook"></use></svg></a></li>
        </ul>
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
  