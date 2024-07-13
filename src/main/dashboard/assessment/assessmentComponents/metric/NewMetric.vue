<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
const assessmentStore= useAssessmentStore()

const routerData = useRouter()
let  curriculumNumber = routerData.currentRoute.value.query.id
const   notificationStore  = useNotificationStore()

const props = defineProps({
  metricInfo:{}
})

const   buttonLoader = ref(false)
const   metricNumber = ref(null)
let     errorMessage = ref(null)


const formData = reactive({
  name:null,
  exam_type:null,
  curriculum_number:curriculumNumber
})


onMounted(()=>{
  checkMetricInfo()
})

watch (
    () => props.metricInfo,
    async (data) => {
      if(data){
        checkMetricInfo()
      }
    }
)

const checkMetricInfo = () => {
let draft = props.metricInfo
  if(draft){
    formData.name = draft?.name
    metricNumber.value = draft?.number
  }
}


const addMetric = () => {
  buttonLoader.value = true
  if(metricNumber.value){
    assessmentStore.updateMetric(formData, metricNumber.value)
  }else {
    assessmentStore.createMetric(formData)
  }

}

watch (
    () => assessmentStore.newMetricResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        formData.name = null
      }
    }
)


watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
      }
    }
)

</script>

<template>
<div>
  <form @submit.prevent="addMetric">

    <div class="mb-2">
      <label class="textColor"><small>Name</small></label>
      <input v-model="formData.name"  type="text" required class="form-control shadow-none" placeholder="eg. Exam or Group work or Tests">
    </div>


    <div class="text-right mt-4">
      <button  style="float: right"
               type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"
                 >
        <i class="bi bi-arrow-right-circle"></i>&nbsp;<small>{{metricNumber ? "Edit" : "submit"}}</small>
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
          <span class="visually-hidden">Loading...</span>
        </div></button>
    </div>
  </form>
</div>
</template>

<style scoped>

</style>