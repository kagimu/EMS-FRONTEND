<template>
  <div>

       <!-- modal for viewing more details -->
       <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
       <GradeApplication :studenton-interviewid="studentOnInterviewId"></GradeApplication>
      </div>
    </div>
    <!-- end  -->

  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Students Scheduled For <b>Interview Title</b> </h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>School&Campus</th>
          <th>Prefered Class</th>
          <th>#</th>
        </tr>
      <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
      </thead>
      <tbody>
        <tr v-for="(studentInterList, index) in interviewStudentList" :key="index">
          <td>{{ studentInterList.User.first_name + studentInterList.User.last_name }} </td>
          <td></td>
          <td></td>
          <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" @click="setStudentOnInterviewID(studentInterList.user_number)" class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-arrow">&nbsp;Grade</i></small></button>        
            </td>
        </tr>   
          
        
      </tbody>
    </table>
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

let  interviewNumber = routerData.currentRoute.value.query.interview_id
const studentOnInterviewId= ref(null)

const setStudentOnInterviewID = (id) =>{
  studentOnInterviewId.value = id
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
        notificationStore.successToast("Success", data.message)
        interviewStudentList.value = data
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



  </script>


  
  <style scoped>
  
  </style>