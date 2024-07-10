<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchool from "@/main/dashboard/manageSchool/NewSchool.vue";
import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
import InterviewAssessmentMetricsList from "@/main/dashboard/studentApplication/InterviewAssessmentMetricsList.vue"
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import AppModal from "@/components/AppModal.vue";
import NewInterview from "@/main/dashboard/studentApplication/NewInterview.vue"


const showingModal = ref(false)
const interviewList = ref( [])
let errorMessage = ref(null)

const buttonLoader = ref(false)
const interviewNumber = ref(null)
const studentApplicationStore = useStudentApplicationStore()
const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const interviewAssessmentDialog = ref(false)
const assesssmentMetricsDialog = ref(false)
const thisDialog = ref(false)
const loading = ref(false)

const showModal = () => {
    showingModal.value = true
    thisDialog.value=false
}


onMounted(
    async () => {
     loading.value = true
    applicationStore.fetchInterviewList().finally(() => {
    loading.value = false; 
  })
    } )

    watch(
    () => applicationStore.interviewListResponse,
    async (data) => {
      if(data){
        assesssmentMetricsDialog.value = false
        interviewList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        assesssmentMetricsDialog.value = false
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

const showInterviewAssessmentDialog = (interview) =>{
  interviewNumber.value = interview.number
  interviewAssessmentDialog.value = true

}

const formData = reactive({ 
name:null,
interview_date:null,
venue:null,
message:null,
assessment:[]
})


const createInterview = () => {
// alert(JSON.stringify(formData))
applicationStore.createNewInterview(formData)
}

watch(
      () => applicationStore.newInterviewResponse,
      async (data) => {
          if (data) {
              buttonLoader.value = false
              assesssmentMetricsDialog.value = false
              notificationStore.successToast("Success", data.message)
              await applicationStore.fetchInterviewList()

          }
      },
      {deep: true}
  )

  const showAssesssmentMetricsDialog = (interview) =>{
  interviewNumber.value = interview.number

}

watch(
          () => applicationStore.newInterviewResponse,
          async (data) => {
              if (data) {
                showingModal.value = false
              }
          },
          {deep: true}
      )
  </script>

<template>
  <div>

    <div class="modal fade" id="assesssmentMetricsModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">Assessment</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <!-- <interview-assessment :interviewNumber="interviewNumber"></interview-assessment> -->
              <interview-assessment-metrics-list :interviewNumber="interviewNumber"></interview-assessment-metrics-list>
          </div>
          </div>

        </div>
      </div>
    </div>
    
    
    <AppModal title="Create Interview" v-model="showingModal" xl4>
      <NewInterview></NewInterview>
    </AppModal>


    <div class="modal fade" id="interviewAssessmentModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Interview Assessment </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <interview-assessment :interviewNumber="interviewNumber"></interview-assessment>
            </div>
          </div>

        </div>
      </div>
    </div>

  <div class="container mt-1">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview List

      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      @click="showModal" >
      <i class="bi bi-plus"></i>&nbsp;<small>Create An Interview</small>
      </button>

      <hr style="width:30px;"></h6>
      <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
        </div>

      <div v-else-if="interviewList.length === 0" class="text-center my-4">
                <p>There is no data found</p>
       </div>

 <div v-else>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>ScheduledOn</th>
          <th>Venue</th>
          <th>Comment</th>
          <th>Actions</th>
        </tr>

      </thead>
      <tbody>
        <tr v-for="(interview, index) in interviewList" :key="index">
          <td>{{ index+1 }}</td>
          <td>{{ interview.name}}</td>
          <td>{{ interview.interview_date }}</td>
          <td>{{ interview.venue }}</td>
          <td class="w-[25%]">{{ interview.message }}</td>
          <td>
        

            <div>
            
       
              <router-link style="display:non"
                  class="text-decoration-none"
                  :to="{name:'manage-interviews', query:{interview_id:interview.number, interview:interview.name}}">
                <button class="text-[#0d6efd] border border-primary p-1 rounded-sm hover:bg-[#0d6efd] hover:text-white">
                <small>Manage Applicants</small>
                </button>
              </router-link>
            </div>


            </td>
        </tr>        
        
      </tbody>
    </table>
  </div>

  </div>

  

  </div>
  </template>
  

<style scoped>
  
</style>
 