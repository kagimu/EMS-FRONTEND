<template>
  <div>

    <div class="modal fade" id="assesssmentMetricsModal" tabindex="-1" :class="{ show: assesssmentMetricsDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">Assessment Metrics</h6>
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
    


    <div class="modal fade" id="interviewAssessmentModal" tabindex="-1" :class="{ show: interviewAssessmentDialog }" aria-labelledby="" aria-hidden="true">
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

  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview List

      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" data-bs-target="#rolesDialogg" aria-controls="rolesDialogg">
      <i class="bi bi-plus"></i>&nbsp;<small>Add Interview</small>
      </button>

      <hr style="width:30px;"></h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Scheduled_on</th>
          <th>Venue</th>
          <th>Message</th>
          <th>#</th>
        </tr>

      </thead>
      <tbody>
        <tr v-for="(interview, index) in interviewList" :key="index">
          <td>{{ interview.name}}</td>
          <td>{{ interview.interview_date }}</td>
          <td>{{ interview.venue }}</td>
          <td class="w-[25%]">{{ interview.message }}</td>
          <td class="w-[35%]">
            <div class="mb-1">
              <router-link style=""
                  class="text-decoration-none"
                  :to="{name:'interview-learners-list', query:{interview_id:interview.number}}">
                <button class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
                <i class="bi bi-eye text-[15px]"></i>&nbsp;<small>View Applicants</small>
                </button>
              </router-link>
            </div>

            <div>
              <button
                  class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white"
                  @click="showAssesssmentMetricsDialog(interview)"
                  data-bs-toggle="modal"
                  data-bs-target="#assesssmentMetricsModal"
              > <i class="bi bi-eye textColor"></i>&nbsp;Assessement Metrics</button>
              

              <button
                  class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white"
                  @click="showInterviewAssessmentDialog(interview)"
                  data-bs-toggle="modal"
                  data-bs-target="#interviewAssessmentModal"
              > <i class="bi bi-plus textColor"></i>&nbsp; Add Interview Assessment</button>


            </div>


            </td>
        </tr>        
        
      </tbody>
    </table>
  </div>

  <!-- schedule interview -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" aria-labelledby="offcanvasRightLabel" >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Create Interview</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <form @submit.prevent="createInterview">
              <div class="mb-2">
                <label class="textColor"><small>Title</small></label>
                <input v-model="formData.name" type="text" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Interview Date</small></label>
                <input v-model="formData.interview_date"  type="date" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Venue</small></label>
                <input v-model="formData.venue"  type="text" required class="form-control" >
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Description</small></label>
                <textarea v-model="formData.message"  required class="form-control noFocus" id="floatingTextarea2" style="height: 100px"></textarea>
              </div>
              <div class="text-right mt-4">
                <button style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                    <span class="visually-hidden">Loading...</span>
                  </div></button>
              </div>
            </form>
          </div>
        </div>
<!-- wnd  -->

  </div>
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchool from "@/main/dashboard/manageSchool/NewSchool.vue";
import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
import InterviewAssessmentMetricsList from "@/main/dashboard/studentApplication/InterviewAssessmentMetricsList.vue"

const interviewList = ref( [])
let errorMessage = ref(null)

const buttonLoader = ref(false)
const interviewNumber = ref(null)

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const interviewAssessmentDialog = ref(false)
const assesssmentMetricsDialog = ref(false)
onMounted(
    async () => {
      await applicationStore.fetchInterviewList()
    } )

    watch(
    () => applicationStore.interviewListResponse,
    async (data) => {
      if(data){
        interviewList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
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
              notificationStore.successToast("Success", data.message)
              await applicationStore.fetchInterviewList()

          }
      },
      {deep: true}
  )


  const showAssesssmentMetricsDialog = (interview) =>{
 
  interviewNumber.value = interview.number
  // alert(interviewNumber.value)
  assesssmentMetricsDialog.value = true

}

 
  </script>


  
  <style scoped>
  
  </style>