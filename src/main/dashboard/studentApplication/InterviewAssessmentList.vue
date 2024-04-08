<script setup>
import {onMounted, ref, watch} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";


const interviewStudentList = ref( [])
const assessmentStore = useAssessmentStore()
const studentApplicationStore = useStudentApplicationStore()
const routerData = useRouter()
let  interviewNumber = routerData.currentRoute.value.query.interview_id
let interviewM = routerData.currentRoute.value.query.interview_m


const notificationStore = useNotificationStore()

const assessmentMetricList = ref([])
const assessment_metric_number = ref(null)
const loader = ref(false)
const errorMessage = ref(null)


onMounted(
    () => {
      studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber)
    }
)

watch(
    () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        assessmentMetricList.value = data.data
      }
    },
    {deep:true}
)



onMounted(
    async () => {
      await  assessmentStore.fetchAssessmentMetrics()
    }
)

const saveInterviewAssessment = () => {
  
  let data = {
    assessment_metric_number:assessment_metric_number.value,
    interview_number:interviewNumber,
  }
  // alert(JSON.stringify(data))
  studentApplicationStore.newInterviewAssessment(data)
}

watch (
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data && data.data){
        // assessmentMetricList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => studentApplicationStore.interviewAssessmentResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    },
    {deep:true}
)


watch(
      () => studentApplicationStore.interviewAssessmentResponse,
      async (data) => {
          if (data) {
              notificationStore.successToast("Success", data.message)
          }
      },
      {deep: true}
  )


  watch (
    () => studentApplicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

    
</script>

<template>
  <div>

    <div class="modal fade" id="interviewAssessmentModal"  tabindex="-1"  aria-labelledby="" aria-hidden="true">
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



<div class="row">
  <div class="col-lg-10">

  </div>
  <div class="col-lg-2">
    <button
class="btn btn-primary btn-sm mb-4 mt-4"
@click="showInterviewAssessmentDialog()"
data-bs-toggle="modal"
data-bs-target="#interviewAssessmentModal"
>  Add Assessment</button>
  </div>

</div>

    <table id="data"
      class="table table-striped" >
    <thead>
    <tr>
      <th scope="col">Assessment</th>
      <th>Class</th>
      <th scope="col">Scheduled On</th>
      <th scope="col">No.Students</th>
      <th scope="col">Description</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
   
    <tr v-for="(list, index) in assessmentMetricList" :key="index">
        <td>{{ list.AssessmentMetric.name }}</td>
        <td>{{ list.AssessmentMetric.CampusClass.class_name }}</td>
        <td>{{ list.AssessmentMetric.scheduled_on }}</td>
        <td>100</td>
        <td>{{ list.AssessmentMetric.description }}</td>
        
        <td>
          <button type="button">
            <i class="bi bi-x" style="color:rgb(201, 10, 10)"></i>
          </button>
    </td>
    </tr>
  
    </tbody>
  </table>
  </div>
</template>

<style scoped>

</style>