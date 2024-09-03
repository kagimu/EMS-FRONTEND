<script setup>
import {onMounted, ref, watch} from "vue"
import {useRouter} from "vue-router";
import ManageInvoices from "@/main/dashboard/invoice/ManageInvoices.vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import StudentReports from "@/main/dashboard/report-card/studentReports/StudentReports.vue"
import Comfirm from "@/main/dashboard/enrollment/Comfirm.vue"
import AppModal from "@/components/AppModal.vue";
import { useAbility } from '@casl/vue';
const { can } = useAbility()
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import router from "@/config/router.js";


import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
import StudentNarativeReport from "@/main/dashboard/profiles/studentProfile/StudentNarativeReport.vue";
const enrollmentStore = useEnrolmentStore()

const studentNum = ref(null)
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
const className= ref(null)
const dob = ref(null)
const academicYear = ref(null)
const studyPeriod=ref(null)
const stream = ref(null)
const status = ref(null)
const campus = ref(null)
const school = ref(null)
const actionType = ref(null)
const cateringStore = useCateringStore()

onMounted(
    async () => {
      await applicationStore.fetchStudent(student_number)
      await cateringStore.FeedingGroupByUserId(student_number)
      
    } )

watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {
        studentName.value = data.surname + " " + data.second_name+" "+ data.other_name
        dob.value = data.date_of_birth
        className.value = data.current_enrollment.class
        studyPeriod.value = data.current_enrollment.study_period
        stream.value = data.current_enrollment.stream
        status.value = data.current_enrollment.status
        campus.value = data.current_enrollment.campus
        school.value = data.current_enrollment.school
        academicYear.value = data.current_enrollment.academic_year
      }
    },
    { deep: true }
)

//terminate
const showActionDialog = ref(false)
const terminateEnrollment = (studentNo) =>{
  studentNum.value = studentNo
  actionType.value = "terminate"
  showActionDialog.value=true

}


const reEnroll = (studentNo) =>{
  studentNum.value = studentNo
  actionType.value="reEnroll"
  showActionDialog.value=true

}


watch (
    () => enrollmentStore.terminateEnrolmentResponse,
    async (data) => {
      if(data){
        await applicationStore.fetchStudent(student_number)
        showActionDialog.value=false
      }
    },
    {deep:true}
)

watch (
    () => enrollmentStore.reEnrolmentResponse,
    async (data) => {
      if(data){
        await applicationStore.fetchStudent(student_number)
        showActionDialog.value=false
      }
    },
    {deep:true}
)


const itemMenu = ref([
  {
    text:"Financial Records",
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
  {
    text:"Narrative Report",
    value:"narrative"
  },

])


let studentQuery = routerData.currentRoute.value.query.type ? routerData.currentRoute.value.query.type : "financial-situation"

const changeMenu = (value) => {
  router.push({ name: "student-profile-details", query:{m:value} })
}


const cancelled = (cancelled) => {
  showActionDialog.value=false
}


watch (
    () => cateringStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    }
)
</script>
<template>

   <AppModal title="Comfirm" v-model="showActionDialog" xs>
      <Comfirm :studentNumber="studentNum" :action="actionType" @nedda="cancelled"></Comfirm>
    </AppModal>


    <section style="background-color: #eee;">
        
      <div class="container py-4">
        <!-- User Profile Information -->
        <div class="row">
          <div class="col-lg-3">
            <!-- User Card -->
            <div class="border rounded-md bg-white mb-4 px-3">

              <div class="text-center">
                <i class="bi-person-circle text-[100px] text-[#8a8888]"></i>
              </div>

              <div class="mb-3">
                <div class="text-[#8a8888] text-sm mb-[10px]"><i class="bi-person-circle mr-2"></i>{{ studentName }}</div>
                <div class="text-[#8a8888] text-sm mb-[10px]"><i class="bi-calendar-date mr-2"></i>{{ dob }}</div>
              </div>

            </div>
            
                <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
                <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">

              <router-link
                  v-for="(item, idx) in  itemMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.value === studentQuery ? 'active' : ''"
                  :to="{name:'student-profile-details', query:{st_id:student_number,type:item.value}}">
                <small style="font-size:12px;">{{item.text}}</small></router-link>


              </div>
          
         
              </div>
            </div>
          </div>
          
         
          <div class="col-lg-9">
            <div class="py-2 px-3 border border-0 fw-normal bg-light card-header">
             <div style="color: green;"><span class="text-primary me-1">SCHOOL:</span>{{ school }} &nbsp;<span class="text-primary me-1">CAMPUS:</span>{{ campus }}
             <div  style="float: right;">
              <span class="text-primary">STATUS:</span><span class="badge bg-danger rounded-pill ms-2 fs-6">{{ status }}</span>
          </div>
   

</div>

</div>

<div class="border border-top-0 border-bottom-0 border-start-0 border-end-0 card">
   <div class="py-2 px-3 mb-0 card-header border-0">
      <span>
        <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status">
            <button type="button" class="text-sm text-uppercase mb-1 btn btn-dark">Class</button>
            <button type="button" class="text-sm fw-bold text-white text-uppercase mb-1 btn btn-info">{{ className }}</button>
         </div>
         <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status">
            <button type="button" class="text-sm text-uppercase mb-1 btn btn-dark">Academic YEAR.</button>
            <button type="button" class="text-sm fw-bold text-white text-uppercase mb-1 btn btn-info">{{ academicYear }}</button>
         </div>
         <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status">
            <button type="button" class="text-sm text-uppercase mb-1 btn btn-dark">STUDY PERIOD</button>
            <button type="button" class="text-sm fw-bold text-white text-uppercase mb-1 btn btn-info">{{ studyPeriod }}</button>
         </div>
         <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status">
            <button type="button" class="text-sm text-uppercase mb-1 btn btn-dark">STREAM</button>
            <button type="button" class="text-sm fw-bold text-white text-uppercase mb-1 btn btn-danger">{{ stream }}</button>
         </div>
         <div role="group" class="rounded-0 me-2 btn-group btn-group-sm academic-status" style="float: right;">
        
        <div v-if="can('re-instate_enrollment','manage')"></div>  <button v-if="status == 'TERMINATED'" class="btn btn-success btn-sm mb-2 mx-1 mb-2" @click="reEnroll(student_number)">
                <small>RE-INSTATE</small>
                </button>
               <div v-if="can('terminate_enrollment','manage')"><button v-if="status == 'ACTIVE'" class="btn btn-danger btn-sm mb-2 mx-1" @click="terminateEnrollment(student_number)">
                <small>Terminate</small>
                </button></div>
              </div>
      </span>
     
   </div>
</div>


           
            
            <!-- Project Status -->
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4 mb-md-0">
                  <div class="card-body">
                    <div class="mt-0">
            <div>
  
              <div>

                 <div v-if="studentQuery === 'financial-situation'">
                  <ManageInvoices></ManageInvoices>
                  </div>


                  <div v-if="studentQuery === 'report-cards'">
                  <StudentReports></StudentReports>
                  </div>
                  <div v-if="studentQuery === 'bio-data'">
                    <h1>Bio data</h1>
                  </div>

                  <div v-if="studentQuery === 'narrative'">
                    <StudentNarativeReport></StudentNarativeReport>
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
  
  

  