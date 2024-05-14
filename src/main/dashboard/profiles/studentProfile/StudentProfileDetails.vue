<template>
    <section style="background-color: #eee;">
        
      <div class="container py-2">
        <!-- User Profile Information -->
        <div class="row">
          <div class="col-lg-3">
            <!-- User Card -->
            <div class="card mb-4">
              <div class="card-body text-center">
                <center><img :src="user.avatar" :alt="user.name" class="rounded-circle img-fluid" style="width: 120px;"></center>
                <h5 class="my-3">{{ studentName }}</h5>
                <p class="text-muted mb-1">{{ user.role }}</p>
              </div>
            </div>
            
                <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
                <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                  <div
                    v-for="(item, idx) in itemMenu" :key="idx"
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="item.value === menuSelected ? 'active' : ''"
                    @click="changeMenu(item.value)">
                  <small style="font-size:12px;">{{item.text}}</small>
                </div>
              </div>
           
          
         
              </div>
            </div>
          </div>
          
         
          <div class="col-lg-9">
            <div class="py-2 px-3 border border-0 fw-normal bg-light card-header">
   <div style="color: green;"><span class="text-primary me-1">CLASS:</span>Primary One [P1]
   <div  style="float: right;"><span class="text-primary">STATUS:</span><span class="badge bg-danger rounded-pill ms-2 fs-6">ENROLLED</span></div>

</div>

</div>

<div class="border border-top-0 border-bottom-0 border-start-0 border-end-0 card">
   <div class="py-2 px-3 mb-0 card-header border-0">
      <span>
         <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status">
            <button type="button" class="text-sm text-uppercase mb-1 btn btn-dark">Academic YEAR.</button>
            <button type="button" class="text-sm fw-bold text-white text-uppercase mb-1 btn btn-info">2024</button>
         </div>
         <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status">
            <button type="button" class="text-sm text-uppercase mb-1 btn btn-dark">STUDY PERIOD</button>
            <button type="button" class="text-sm fw-bold text-white text-uppercase mb-1 btn btn-info">TERM ONE [T1]</button>
         </div>
         <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status">
            <button type="button" class="text-sm text-uppercase mb-1 btn btn-dark">STREAM</button>
            <button type="button" class="text-sm fw-bold text-white text-uppercase mb-1 btn btn-danger">EAST</button>
         </div>
        
      </span>
     
   </div>
</div>


            <div class="card mb-4">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-2">
                    <p class="mb-0">Full Name</p>
                  </div>
                  <div class="col-sm-9" style="float: left;">
                    <p class="text-muted mb-0">{{ studentName }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-2">
                    <p class="mb-0">DOB</p>
                  </div>
                  <div class="col-sm-9" style="float: left;">
                    <p class="text-muted mb-0">{{ dob }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Project Status -->
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4 mb-md-0">
                  <div class="card-body">
                    <div class="mt-0">
            <div  style="padding: 0;">
  
              <div>

                 <div v-if="menuSelected === 'financial-situation'">
                  <ManageInvoices></ManageInvoices>
                  </div>


                  <div v-if="menuSelected === 'report-cards'">
                  <StudentReports></StudentReports>
                  </div>
                  <div v-if="menuSelected === 'bio-data'">
                <h1>Bio data</h1>
                  </div>
                
              </div>
  
            </div>
          </div>

                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  </template>
  
  
  <script setup> 
import {onMounted, ref, watch} from "vue"
import {useRouter} from "vue-router";
import ManageInvoices from "@/main/dashboard/invoice/ManageInvoices.vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import StudentReports from "@/main/dashboard/report-card/studentReports/StudentReports.vue"

  const routerData = useRouter()
  const menuSelected = ref("financial-situation")
  const student_number = routerData.currentRoute.value.query.st_id
  const applicationStore = useApplicationStore()
  const notificationStore = useNotificationStore()
  const studentName = ref(null)
  const Sex = ref(null)
  const School= ref(null)
  const Campus= ref(null)
  const Level= ref(null)
  const Class= ref(null)
  const dob = ref(null)
  
onMounted(
    async () => {
      await applicationStore.fetchStudent(student_number)
    } )


    watch (
  () => applicationStore.studentDataResponse,
  async (data) => {
    if (data) {
      studentName.value = data.surname + " " + data.second_name+" "+ data.other_name
      dob.value = data.date_of_birth
    }
  },
  { deep: true }
)


  const itemMenu = ref([
   {
      text:"Financial Situation",
      value:"financial-situation"
    },
    {
      text:"Services",
      value:"services"
    },
    {
      text:"Report Cards",
      value:"report-cards"
    },
    {
      text:"Academic Calendar",
      value:"academic-year"
    },
    {
      text:"Meals",
      value:"meals"
    },


   
  ])

  const changeMenu = (value) => {
  menuSelected.value = value
}

  const user = ref({
    avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp',
    name: 'Collins Mpiima',
    role: 'Student',
    location: 'Bay Area, San Francisco, CA',
    socialLinks: [
      { icon: 'fas fa-globe', color: '#FFC107', url: 'https://mdbootstrap.com' },
      { icon: 'fab fa-github', color: '#333333', url: 'mdbootstrap' },
      { icon: 'fab fa-twitter', color: '#55acee', url: '@mdbootstrap' },
      { icon: 'fab fa-instagram', color: '#ac2bac', url: 'mdbootstrap' },
      { icon: 'fab fa-facebook-f', color: '#3b5998', url: 'mdbootstrap' }
    ],
    details: [
      { label: 'Full Name', value: 'Mpiima Collins' },
      { label: 'Sex', value: 'Male' },
      { label: 'School', value: 'MySChool P/s' },
      { label: 'Campus', value: 'Main Campus' },
      { label: 'Level', value: 'Primary' },
      { label: 'Class', value: 'Primary One [P1] ' }
    ],
  
  });
  </script>
  