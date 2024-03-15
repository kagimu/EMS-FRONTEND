<template>
  <div>


             <!-- Popup warning Modal -->
             <div class="modal fade" id="enterMarkModal" :class="{ show: enterScoreDialog }" tabindex="-1" aria-labelledby="removeRoleConfirmationLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="removeRoleConfirmationLabel">Please Enter Score !</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <enter-assessment-marks :studentNumber="studentNumber"></enter-assessment-marks>
          </div>
        </div>
      </div>
    </div>


    <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: gradeDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
        
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <GradeApplication :stud="studentData"  :studenton-interviewid="studentOnInterviewId"></GradeApplication>
            </div>
          </div>

        </div>
      </div>
    </div>

<form onsubmit="">
    <!-- end  -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body" style="padding: 0;">
  <div class="container mt-4">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <ul>
                <h5 style="font-size: 14px;margin-top: 2px;">ASSESSMENT FOR INTERVIEW APPLICANTS </h5>
                <li>Interview : Primary One Interviews </li>
                <li>Exam Type: Interview</li>
                <li>
                  <div class="row">
                    <div class="col-lg-2">Assessment Metric </div>
                    <div class="col-lg-4">
                      <!-- <form >
                    <div class="">
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required 
                      onchange="getStudentsOnMetrics()">
                  <option>Select</option>
                  <option v-for="(metricsList,index) in assessmentMetricsData" :key="index" :value="metricsList.AssessmentMetric.number">{{ metricsList.AssessmentMetric.number }}</option>
              </select>
          </div>
                  </form> -->
                  {{ interviewM}}

                    </div>
                    <div class="col-lg-6">

</div>

                  </div>
                 

                </li>
              </ul>

              <!-- <button style="float: right;" class="btn btn-primary"> Publish </button> -->
            </div>
          </div>
        </div>
      </div>
      

    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Gender</th>
          <th>Action</th>
        </tr>
  <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
      </thead>
      <tbody>
        <tr v-for="(student, index) in interviewStudentList" :key="index">
          <td>{{ student.Student.surname + " " + student.Student.second_name + " " + student.Student.other_name}} </td>
          <td>
            <!-- <input type="number" class="form-control" style="width:100px"> -->
            {{  student.Student.gender }}
          </td>
          <td>
            <!-- <input type="text" class="form-control"> -->
            <button type="button"
                  class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white"
                  @click="showD(student.Student.number)"
                  data-bs-toggle="modal"
                  data-bs-target="#enterMarkModal"
              >ENTER ACTUAL SCORE</button>  <button type="button"
                  class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white"
                  @click="viewMark(student.Student.number,assessmentricsNumber)"
              ><i class="bi bi-eye"></i> VIEW SCORE</button>
             
             <span v-for="(listD, index) in scoreDataList " :key="index">
            <span>{{ listD.actual_score }}</span></span>
            
          </td>
        </tr>   
          
        
      </tbody>
    </table>
  </div>
  </div>
  </div>
  </div>
  </div>
</form>



  </div>
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import GradeApplication from './GradeApplication.vue';
import {useRouter} from "vue-router";
import EnterAssessmentMarks from "./EnterAssessmentMarks.vue";
import { useStudentApplicationStore } from "./store/student_application"


const interviewStudentList = ref( [])
let errorMessage = ref(null)
const buttonLoader = ref(false)
const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const routerData = useRouter()
const gradeDialog = ref( false)

let  interviewNumber = routerData.currentRoute.value.query.interview_id
let assessmentricsNumber = routerData.currentRoute.value.query.assessment_metric_id
let interviewM = routerData.currentRoute.value.query.interview_m
const studentOnInterviewId= ref(null)
const studentData=ref(null)

const studentNumber = ref(null)
const studentApplicationStore = useStudentApplicationStore()
const assessmentMetricsData = ref([])

const enterScoreDialog = ref(false)
const scoreDataList = ref([])
const setStudentOnInterviewID = (id,studa) =>{
  studentOnInterviewId.value = id
  studentData.value=studa
  
}
const ScoreData = reactive ({
  score:null
})

onMounted(
    () => {
      applicationStore.fetchStudentsOnInterview(interviewNumber)
    }
)

onMounted(
    () => {
      studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber)
    }
)

watch(
    () => applicationStore.StudentsOnInterviewResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        interviewStudentList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
      }
    },
    {deep:true}
)

watch (
      () => applicationStore.interviewResultesponse,
      async (data) => {
        if(data){     
          gradeDialog.value = false
          applicationStore.fetchStudentsOnInterview(interviewNumber)

        }
      },
      {deep:true}
  )


  watch(
    () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        assessmentMetricsData.value = data.data
      }
    },
    {deep:true}
)
const showD = (student) => {
  studentNumber.value = student
  // alert(studentNumber.value)
  enterScoreDialog.value = true
  // endpoint ===========

}



watch (
    () => studentApplicationStore.interviewAssessmentResultResponse,
    async (data) => {
      if(data){
        enterScoreDialog.value = false
      }
    },
    {deep:true}
)

const viewMark = (student,a) => {
  studentNumber.value = student
  // alert(studentNumber.value)
  ScoreData.score = student
  // endpoint ===========for view assessment
  studentApplicationStore.fetchAssessmentByStudent(ScoreData.score,assessmentricsNumber)
}
watch (
    () => studentApplicationStore.assessmentByStudentResponse,
    async (data) => {
      if(data){
       
          scoreDataList.value = data.data
      
      
      }
    },
    {deep:true}
)
  </script>


  
  <style scoped>
  
  </style>