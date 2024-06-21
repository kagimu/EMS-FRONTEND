<script setup>
import {onMounted, ref, watch} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
import AppModal from "@/components/AppModal.vue";

const showingModal = ref(false)
const showModal = () => {
    showingModal.value = true
    thisDialog.value=false
}

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


watch (
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data && data.data){
        // assessmentMetricList.value = data.data
      }
    },
    {deep:true}
)

// watch (
//     () => studentApplicationStore.interviewAssessmentResponse,
//     async (data) => {
//       if(data){
//         loader.value = false
//       }
//     },
//     {deep:true}
// )


// watch(
//       () => studentApplicationStore.interviewAssessmentResponse,
//       async (data) => {
//           if (data) {
//               notificationStore.successToast("Success", data.message)
//           }
//       },
//       {deep: true}
//   )


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

    
const deleteThisData = (id,name) => {

if(!confirm("Are you sure, you want to remove: " + name)){
  return
}
}

</script>

<template>
  <div>

        
  <AppModal title="Attach Assessment Schedule To An Interview" v-model="showingModal" lg>
    <interview-assessment :interviewNumber="interviewNumber"></interview-assessment>
    </AppModal>




<div class="row">
  <div class="col-lg-8">

  </div>
  <div class="col-lg-4">
    <button
class="btn btn-primary btn-sm mb-2 mt-4"
@click="showModal()"
>  <small>Attach Assessment Schedule To this Interview</small></button>
  </div>

</div>

    <table id="data"
      class="table table-striped  table-hover caption-top table-sm text-sm" style="font-size: 14px;">
    <thead>
    <tr>
      <th>#</th>
      <th scope="col">Assessment Schedule</th>
      <!-- <th>Class</th> -->
      <th scope="col">Scheduled On</th>
      <th scope="col">Description</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
   
    <tr v-for="(list, index) in assessmentMetricList" :key="index">
      <td>{{ index+1 }}</td>
        <td>{{ list.AssessmentMetric.name }}</td>
        <!-- <td>{{ list.AssessmentMetric.CampusClass.class_name }}</td> -->
        <td>{{ list.AssessmentMetric.scheduled_on }}</td>
        <td>{{ list.AssessmentMetric.description }}</td>
        
        <td>
          <button type="button" @click="deleteThisData(list.number,list.AssessmentMetric.name)"> 
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