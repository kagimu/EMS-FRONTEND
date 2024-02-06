<template>
  <div>

       <!-- modal for viewing more details -->
       <!-- <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true"  :class="{ show: gradeDialog }">
      <div class="modal-dialog modal-xl">
       <GradeApplication :stud="studentData"  :studenton-interviewid="studentOnInterviewId"></GradeApplication>
      </div>
    </div> -->


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


    <!-- end  -->
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Students On Interview<b></b> 
      <hr style="color:rgba(192, 192, 192, 0.781); width:200px"></h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Reason</th>
          <th>Prefered Class</th>
          <th>#</th>
        </tr>
      <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
      </thead>
      <tbody>
        <tr v-for="(student, index) in interviewStudentList" :key="index">
          <td>{{ student.Student.surname + " " + student.Student.second_name }} </td>
          <td>{{ student.Student.reason_for_choosing_school}}</td>
          <td>{{ student.Student.preferred_type_of_enrollment }}</td>
          <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" @click="setStudentOnInterviewID(student.interview_number,student)" class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-arrow">&nbsp;Grade</i></small></button>        
            </td>
        </tr>   
          
        
      </tbody>
    </table>
  </div>
  </div>
  </div>
  </div>
  </div>




  </div>
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import GradeApplication from './GradeApplication.vue';
import {useRouter} from "vue-router";

const interviewStudentList = ref( [])
let errorMessage = ref(null)
const buttonLoader = ref(false)
const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const routerData = useRouter()
const gradeDialog = ref( false)

let  interviewNumber = routerData.currentRoute.value.query.interview_id
const studentOnInterviewId= ref(null)
const studentData=ref(null)

const setStudentOnInterviewID = (id,studa) =>{
  studentOnInterviewId.value = id
  studentData.value=studa
  
}


onMounted(
    () => {
      applicationStore.fetchStudentsOnInterview(interviewNumber)
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



  </script>


  
  <style scoped>
  
  </style>