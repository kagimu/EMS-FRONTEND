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

const user = ref({
  name: 'Solomon Chowere',
  dob: '1999-12-31',
  email: 'chowere@gmail.com',
  profilePicture: 'https://via.placeholder.com/150'
})

const menuItems = ref([
  { name: 'profile', label: 'MY PROFILE', icon: 'bi-person' },
  { name: 'changePassword', label: 'CHANGE PASSWORD', icon: 'bi-key' },
  { name: 'applicationHistory', label: 'APPLICATION HISTORY', icon: 'bi-file-earmark-text' },
  { name: 'admissionHistory', label: 'ADMISSION HISTORY', icon: 'bi-archive' },
  { name: 'logout', label: 'LOG OUT', icon: 'bi-box-arrow-right' }
])

const activeMenu = ref('profile')

const userProfile = ref({
  Surname: 'CHOWERE',
  'Other Names': 'Solomon',
  Gender: 'Male',
  Nationality: 'UGANDAN',
  Email: 'chowere@gmail.com',
  'Phone Number': '256709112694',
  'Date of Birth': '1999-12-31',
  'Last Log in': '2024-08-29T06:25:43.000Z'
})


const reloadProfile = () => {
  console.log('Profile reloaded')
}

</script>


<template>
  

<div style="background-color: white;">
  
  <nav class="navbar navbar-expand-lg navbar-light bg-darkB sticky-top ">
    <div class="container-fluid d-flex justify-content-between align-items-center ">
      <div class="d-flex align-items-center text-[11px]">
        <router-link :to="{ name: 'client_dashboard' }" class="navbar-brand d-flex align-items-center text-white">
          <i class="bi bi-list "></i>&nbsp;
          <span class="fw-bol fs-5" style="color:#f8f8f8;">DASHBOARD</span>
        </router-link>
      </div>

      <div class="d-flex align-items-center">
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


        <div class="dropdown">
          <span
            class=" dropdown-toggle d-flex align-items-center px-1 py-1"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="color: whitesmoke; margin-right: 20px;"

          >
            {{ name }}
        </span>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="#"><i class="bi bi-person-circle"></i> My Profile</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-person-fill-lock"></i> Change Password</a></li>
            <li ><a class="dropdown-item"  href="#" @click="userLogout" ><i class="bi bi-box-arrow-right" ></i> Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <div class="row ">
    <div class="col-lg-2 " style="border-right: 1px solid rgba(0, 0, 0, 0.02);background-color:white !important; padding: 0px;">
     
            <div class="p-4" style="background-color:rgba(0, 0, 0, 0.02)">
              <img
                src="http://127.0.0.1:5173/src/assets/images/victorius-budge.png"
                alt="Logo"
                class="rounded-cirle mt-4"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
       

          <div class="shadow-s mb-4 ">
            <ul class="list-group list-group-flush">
              <li
                v-for="(item, index) in menuItems"
                :key="index"
                class="list-group-item list-group-item-action text-[13px]"
                :class="{ active: activeMenu === item.name }"
                @click="activeMenu = item.name"
              >
                <i :class="item.icon + ' me-2'"></i> {{ item.label }}
              </li>
            </ul>
          </div>
    </div>
    <div class="col-lg-10">
      <router-view></router-view>
    </div>
    
  </div>


  <footer class="absolute bottom-0 left-0 w-screen bg-[#2c2f8c] py-0">
    <div class="flex justify-between px-3 py-1">
      <div class="text-white text-sm"><small>© 2011 Wholesome Education System, All rights reserved.</small></div>
      <a  class="text-white no-underline text-sm" href="#"><small><span>Powered by</span> <b>Hamsoft</b></small></a>
    </div>
  </footer>


</div>
</template>


<style scoped>


.footer {
  position: absolute !important;
  margin-top: 20px;
  left: 0  !important;;
  bottom: 0  !important;
  width: 100%  !important;;
  background-color:  #2c2f8c !important;
  color: rgb(216, 214, 214);
  text-align: center;
  padding-left: 10px;
  font-size: 12px;
}

.btn {
  font-size: 0.70rem; 
  color: #f1f1f1;
  font-weight: 600;
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



.navbar-expand-lg .navbar-nav .nav-link{
  color:white;
}

.list-group-item-action:hover {
  background-color: #2c2f8c;
  color: white;
}

.list-group-item.active {
  background-color: #2c2f8c;
}

</style>







