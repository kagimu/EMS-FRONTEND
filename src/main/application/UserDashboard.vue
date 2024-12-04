<script setup>
import {onMounted, ref} from "vue";
import router from "@/config/router.js";
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useRouter} from "vue-router";
import ClientApplications from "@/main/application/ClientApplications.vue";
import ClientEnrollments from "@/main/application/applicationComponents/ClientEnrollments.vue";
import ClientAdmissions from "@/main/application/applicationComponents/ClientAdmissions.vue";
import ClientInvoices from "@/main/application/applicationComponents/ClientInvoices.vue";
import Application from "@/main/application/Application.vue";
import StudentProfile from '@/main/teacher/students/StudentProfile.vue';
import InvoiceDetails from "@/main/dashboard/invoice/InvoiceDetails.vue"

const routerData = useRouter()
const route = routerData.currentRoute.value.query.s
const selectedPage = route ? route : "applications"
const logoUrl = localStorage.getItem("logo")


const  authStore = useAuthStore();
const name = ref(null)
let p = authStore.profile

name.value = p.first_name+" "+p.second_name+" "+p.last_name

function userLogout(){

  let landT = localStorage.getItem("landingPageTitle")

  localStorage.clear();

  localStorage.setItem("landingPageTitle", landT)


  let r = router.resolve({
    name: "login"
  });
  window.location.assign(r.href);

}

const  menuSelected = (name) =>{
  return router.currentRoute.value.name === name
}

const applyApplication = () => {
  localStorage.removeItem("application-id");
  // router.push({name:"application"})
}

onMounted(
    async () => {


    } )

const user = ref({
  name: 'Solomon Chowere',
  dob: '1999-12-31',
  email: 'chowere@gmail.com',
  profilePicture: 'https://via.placeholder.com/150'
})

const menuItems = ref([
{ name: 'applications', label: 'Applications', icon: 'bi-book' },
{ name: 'admissions', label: 'Admissions', icon: 'bi-cash' },
{ name: 'enrollments', label: 'Enrollments', icon: 'bi-book' },
  { name: 'financial-records', label: 'financial-records', icon: 'bi-book' },
  // { name: 'changePassword', label: 'CHANGE PASSWORD', icon: 'bi-key' },
  // { name: 'applicationHistory', label: 'APPLICATION HISTORY', icon: 'bi-file-earmark-text' },
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
  <div style="display: flex; height: 100vh; background-color: white;">
    <!-- Sidebar -->
    <div style="width: 15%; background-color: white; border-right: 1px solid rgba(0, 0, 0, 0.08);">
      <div style="position: fixed; top: 0; left: 0; height: 100vh; overflow-y: auto; width: 15%;">
        <div class="p-4 mt-15">
          <img
            :src="logoUrl"
            alt="Logo"
            class="rounded-cirle mt-15"
            style="width: 130px;"
          />
        </div>
        <div class="shadow-s mb-4">
          <div class="list-group list-group-flush mb-1" style="border-radius: 0;">
            <router-link
              v-for="(item, idx) in menuItems"
              :key="idx"
              class="list-group-item list-group-item-action"
              :class="item.name === selectedPage ? 'active' : ''"
              :to="{ name: 'client_dashboard', query: { s: item.name } }"
            >
              <i :class="item.icon + ' me-2'"></i>
              <small style="font-size:12px; text-transform: capitalize;">{{ item.label }}</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div style="width: 85%; display: flex; flex-direction: column;">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-darkB sticky-top">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <router-link :to="{ name: 'client_dashboard' }" class="navbar-brand d-flex align-items-center text-white">
              <i class="bi bi-list"></i>&nbsp;
              <span class="fw-bol fs-5" style="color: #f8f8f8;">DASHBOARD</span>
            </router-link>
          </div>

          <div class="d-flex align-items-center">
            <router-link
              :class="[menuSelected('application') ? 'btn btn-light me-3 text-success' : 'btn btn-outline-light me-3', 'px-3 py-2']"
              :to="{ name: 'client_dashboard', query: { s: 'apply' } }"
            >
              APPLY NOW
            </router-link>

            <div class="dropdown">
              <span
                class="dropdown-toggle d-flex align-items-center px-1 py-1"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="color: whitesmoke; margin-right: 20px;"
              >
                {{ name }}
              </span>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <a class="dropdown-item" href="#"><i class="bi bi-person-circle"></i> My Profile</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="userLogout"><i class="bi bi-box-arrow-right"></i> Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <!-- Content -->
      <div style="flex: 1; padding: 20px; overflow-y: auto;">
        <div v-if="selectedPage === 'apply'">
          <Application></Application>
        </div>
        <div v-if="selectedPage === 'applications'">
          <ClientApplications></ClientApplications>
        </div>
        <div v-if="selectedPage === 'admissions'">
          <ClientAdmissions></ClientAdmissions>
        </div>
        <div v-if="selectedPage === 'enrollments'">
          <ClientEnrollments></ClientEnrollments>
        </div>
        <div v-if="selectedPage === 'financial-records'">
          <ClientInvoices></ClientInvoices>
        </div>
        <StudentProfile v-if="selectedPage === 'student'"></StudentProfile>
        <InvoiceDetails v-if="selectedPage === 'invoice-details'"></InvoiceDetails>
      </div>
    </div>
  </div>

  <footer class="absolute bottom-0 left-0 w-screen bg-[#2c2f8c] py-0">
    <div class="flex justify-between px-3 py-1">
      <div class="text-white text-sm">
        <small>© 2011 Wholesome Education System, All rights reserved.</small>
      </div>
      <a class="text-white no-underline text-sm" href="#">
        <small><span>Powered by</span> <b>Hamsoft</b></small>
      </a>
    </div>
  </footer>
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
  width: 100%;
}

.list-group-item.active {
  background-color: #2c2f8c;
  width: 100%;
}
</style>