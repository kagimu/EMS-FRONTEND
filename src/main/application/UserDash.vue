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
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import router from "@/config/router.js";
import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
import StudentNarativeReport from "@/main/dashboard/profiles/studentProfile/StudentNarativeReport.vue";

const enrollmentStore = useEnrolmentStore()
const { can } = useAbility()
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
let profile = localStorage.getItem("userProfile")

onMounted(
    async () => {
      getUserProfileInfo()
     
    } )

    const getUserProfileInfo = () => {

      if (profile) {
        let user = JSON.parse(profile)
        // alert(JSON.stringify(user.number))
        applicationStore.fetchStudent(user.number)
        cateringStore.FeedingGroupByUserId(user.number)  
      }
    }

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

  <section class="student-profile bg-light py-14">
    <div class="container">
      <!-- Profile Header -->
      <div class="row">
        <!-- Left Sidebar -->
        <div class="col-lg-3">
          <div class="card shadow-sm mb-4">
            <div class="card-body text-center">
              <i class="bi-person-circle display-4 text-muted"></i>
              <h5 class="card-title mt-3">{{ studentName }}</h5>
              <p class="card-text text-muted">
                <i class="bi-calendar-date"></i> {{ dob }}
              </p>
            </div>
          </div>

          <div class="card shadow-sm">
            <ul class="list-group list-group-flush">
              <router-link
                v-for="(item, idx) in itemMenu"
                :key="idx"
                class="list-group-item list-group-item-action"
                :class="{ active: item.value === studentQuery }"
                :to="{ name: 'student-profile-details', query: { st_id: student_number, type: item.value } }">
                <small>{{ item.text }}</small>
              </router-link>
            </ul>
          </div>
        </div>

        <!-- Right Content -->
        <div class="col-lg-9">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white d-flex justify-content-between">
              <span>
                <strong>SCHOOL:</strong> {{ school }} &nbsp;
                <strong>CAMPUS:</strong> {{ campus }}
              </span>
              <span>
                <strong>STATUS:</strong> <span class="badge bg-danger">{{ status }}</span>
              </span>
            </div>

            <div class="card-body">
              <div class="d-flex flex-wrap mb-3">
                <div class="btn-group btn-group-sm me-2 mb-2">
                  <button class="btn btn-dark">Class</button>
                  <button class="btn btn-info fw-bold">{{ className }}</button>
                </div>

                <div class="btn-group btn-group-sm me-2 mb-2">
                  <button class="btn btn-dark">Academic YEAR</button>
                  <button class="btn btn-info fw-bold">{{ academicYear }}</button>
                </div>

                <div class="btn-group btn-group-sm me-2 mb-2">
                  <button class="btn btn-dark">Study PERIOD</button>
                  <button class="btn btn-info fw-bold">{{ studyPeriod }}</button>
                </div>

                <div class="btn-group btn-group-sm me-2 mb-2">
                  <button class="btn btn-dark">Stream</button>
                  <button class="btn btn-danger fw-bold">{{ stream }}</button>
                </div>

                <div class="ms-auto">
                  <button
                    v-if="status === 'TERMINATED'"
                    class="btn btn-success btn-sm mb-2"
                    @click="reEnroll(student_number)">
                    RE-INSTATE
                  </button>

                  <button
                    v-if="status === 'ACTIVE'"
                    class="btn btn-danger btn-sm mb-2"
                    @click="terminateEnrollment(student_number)">
                    Terminate
                  </button>
                </div>
              </div>

              <div>
                <div v-if="studentQuery === 'financial-situation'">
                  <ManageInvoices />
                </div>

                <div v-if="studentQuery === 'report-cards'">
                  <StudentReports />
                </div>

                <div v-if="studentQuery === 'bio-data'">
                  <h1>Bio data</h1>
                </div>

                <div v-if="studentQuery === 'narrative'">
                  <StudentNarativeReport />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>


  </template>
  
  
  <style scoped>
.student-profile {
  background-color: #f7f7f7;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  border-bottom: none;
}

.card-body {
  padding: 1.5rem;
}

.list-group-item.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.btn-group-sm .btn {
  min-width: 100px;
}

.academic-status .btn {
  min-width: 120px;
}
</style>


  