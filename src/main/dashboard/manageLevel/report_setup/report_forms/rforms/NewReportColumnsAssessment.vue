<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const assessmentStore= useAssessmentStore()

const errorMessage = ref("")
const loader = ref(false)
const reportColumnList = ref(null)
const interviewAssessmentListData = ref(null)
const assessmentMetricList = ref(null)

const form = reactive({
  code:null,
  report_column_number:"",
  assessment_area_number:"",
  assessment_metric_number:"",
})



onMounted(
    async () => {
      await reportSetupStore.fetchReportColumn()
      await assessmentStore.fetchAssessmentArea()
      await assessmentStore.fetchAssessmentMetrics()
    }
)



const addReportColumnAssessment = () => {
  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  reportSetupStore.newReportColumnAssessment(form)
}



watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)



watch(
    () => reportSetupStore.reportColumnListResponse,
    async (data) => {
      if(data){
        reportColumnList.value = data.data
      }
    }
)



watch(
    () => assessmentStore.assesmentAreaResponse,
    async (data) => {
      if(data){
        interviewAssessmentListData.value = data.data
      }
    },
    {deep:true}
)


watch (
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data && data.data){
        assessmentMetricList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => reportSetupStore.reportColumnAssessmentResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    }
)

</script>

<template>
  <div>
    <form @submit.prevent="addReportColumnAssessment">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Code</small></label>
        <input
            @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.code"
            required
            class="form-control form-select-sm">
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Report Column</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.report_column_number"
        >
          <option disabled value="">--Select Report Column--</option>
          <option v-for="(list, index) in reportColumnList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Assessment Area</small></label>
        <select
            required
            class="form-control"
            v-model="form.assessment_area_number" >
          <option disabled value=""> - Select Interview - </option>
          <option v-for="(listdata, index) in interviewAssessmentListData" :key="index" :value="listdata.number">
            {{ listdata.name}}
          </option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Assessment Metric</small></label>
        <select
            class="form-control form-select form-control-sm shadow-none"
            v-model="form.assessment_metric_number"
            aria-label="Default select example">
          <option disabled value="">--Select Assessment--</option>
          <option v-for="(list, index) in assessmentMetricList" :key="index" :value="list.number">
            {{list.description + " [ " +list.name + " ] " + " ( "+ list.assessment_area_name +" ) "}}</option>
        </select>
      </div>





      <div class="flex justify-content-end mt-4" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
          Save
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>
  </div>
</template>

<style scoped>

</style>