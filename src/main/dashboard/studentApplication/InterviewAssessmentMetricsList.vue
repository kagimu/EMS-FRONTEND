<script setup>
import {onMounted, ref, watch} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import useNotificationStore from "@/composables/useNotification.js";


const interviewStudentList = ref( [])
const assessmentStore = useAssessmentStore()
const studentApplicationStore = useStudentApplicationStore()
const props = defineProps({
  interviewNumber: String,
})
const notificationStore = useNotificationStore()

const assessmentMetricList = ref([])
const assessment_metric_number = ref(null)
const loader = ref(false)
const errorMessage = ref(null)
const examTypeListData = ref([])


onMounted(
    () => {
      studentApplicationStore.fetchAssessmentMetricsOnInterview(props.interviewNumber)
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
    interview_number:props.interviewNumber,
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


    // examType
    onMounted(
    async () => {
      await assessmentStore.fetchExamType()
    } )

    watch(
    () => assessmentStore.examTypeResponse,
    async (data) => {
      if(data){
        examTypeListData.value = data.data
      }
    },
    {deep:true}
)

</script>

<template>
  <div>

<ul v-for="(list, index) in assessmentMetricList" :key="index" class="list-group">
  <li class="list-group-item d-flex justify-content-between align-items-start">
    
    <div class="ms-2 me-auto">
      <div class="">{{list.AssessmentMetric.name + "(" +list.AssessmentMetric.CampusClass.class_name+" )"}}</div>
    </div>
    <router-link
    class="btn btn-outline-primary btn-sm" 
    :to="{ name: 'interview-details', query: { interview_id: props.interviewNumber, assessment_metric_id: list.AssessmentMetric.number, interview_m: list.AssessmentMetric.description  }}">
    ENTER MARKS
    </router-link>
    <!-- <button class=" "><small>ENTER MARKS</small></button> -->
    
  </li>
</ul>
  </div>
</template>

<style scoped>

</style>