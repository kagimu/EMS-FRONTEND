<script setup>
import {onMounted, ref, watch} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import useNotificationStore from "@/composables/useNotification.js";
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
        assessmentMetricList.value = data.data
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


watch(
      () => studentApplicationStore.interviewAssessmentResponse,
      async (data) => {
          if (data) {
            loader.value = false
              // notificationStore.successToast("Success", data.message)
          }
      },
      {deep: true}
  )


  watch (
    () => studentApplicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        // notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


</script>

<template>
  <div>

<!-- {{ interviewNumber }} -->
    <div class="mb-2">
      <label class="textColor"><small>Assessment</small></label>
      <select class="form-control form-select form-control-sm shadow-none" v-model="assessment_metric_number" aria-label="Default select example">
        <option disabled value="">--Select Assessment--</option>
        <option v-for="(list, index) in assessmentMetricList" :key="index" :value="list.number">
          {{list.name }}</option>
      </select>
    </div>


    <div class="flex justify-content-end mt-3" style="width: 100%;">
      <button
          @click="saveInterviewAssessment()"
          type="button"
          class="btn btn-primary btn-sm mb-2 mr-4">
        <div class="mx-3">
          Save
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </div>
      </button>
    </div>


  </div>
</template>

<style scoped>

</style>