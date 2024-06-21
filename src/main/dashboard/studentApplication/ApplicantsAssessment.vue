<template>
  <div>
     <AppModal title="Attach Assessment Metrics To An Interview" v-model="showingModal" lg>
        <interview-assessment :interviewNumber="interviewNumber"></interview-assessment>
     </AppModal>
     <div class="row mt-4">
        <div class="col-lg-4">
           <div class="mb-2">
            <label style="font-size: 11px;"  class="alert alert-primary p-0">* Please Select Assessment Schedule to Enter/view Marks</label>
            <div class="input-group mt-1">
          <select
                 style="box-shadow: none;"
                 class="form-select form-select-sm"  id="inputGroupSelect02" required
                 v-model="assessmentNumber"
                 @change="fetchStudentOnInterview(assessmentNumber)"
                 >
                 <option disabled value=""> - Select Assessment Schedule- </option>
                 <option v-for="(assessment, index) in assessmentDataList" :key="index" :value="assessment.AssessmentMetric.number">{{assessment.AssessmentMetric.name  }}</option>
              </select>
  <label class="input-group-text" for="inputGroupSelect02"><i  class="bi bi-plus-circle" @click="showModal()"></i></label>
</div>
           </div>
        </div>
        <div class="col-lg-1">

        </div>
        <div class="col-lg-7">
         
        </div>
     </div>
     <div v-if="interviewStudentListData === null" class="text-center mt-4">
        <div class="spinner-border text-primary" role="status">
           <span class="visually-hidden">Loading...</span>
        </div>
     </div>
     <!-- <div class="alert alert-danger">
       {{ errorMessage }}
     </div> -->
     <table  v-if="interviewStudentListData !== null" id="data"
        class="table table-striped table-hover caption-top table-sm text-sm">
        <thead>
           <tr>
              <th>#</th>
              <th>Name</th>
              <th scope="col">Score</th>
              <th scope="col">Comment <span v-if="buttonLoader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-dark" role="status">
                 <span class="visually-hidden">Loading...</span>
                 </span></th>
              <!-- <th></th> -->
           </tr>
        </thead>
        <tbody>
           <tr v-for="(std,index) in interviewStudentListData" :key="index" >
              <td>{{ index+1}}</td>
              <td style="text-transform: capitalize;">
                 {{std.student_surname ? std.student_surname : ""}}
                 {{std.student_second_name ? " "+std.student_second_name : ""}}
                 {{std.student_other_name ? " "+std.student_other_name : ""}}
              </td>
              <td scope="col" style="width: 150px;">
                 <input type="text" class="form-control"  v-model="std.score" @keypress="commons.numbersOnlyValidator($event)"
                    maxlength="10"   v-on:blur="submitMarks(std.score, std.comment, std.number)">
              </td>
              <td scope="col">
                 <!-- <input type="text" class="form-control" v-model="comm" > -->
                 <textarea
                    style="outline: none 0 !important; box-shadow: none;"
                    type="text"
                    v-model="std.comment"
                    v-on:blur="submitMarks(std.score, std.comment, std.number)"
                    required
                    class="form-control form-select-sm h-1"></textarea>
              </td>
              <!-- <td>
                 <button type="button" @click="submitMarks(score,comm,std.number)" style="color:#0d6efd;">
                 <i class="bi bi-check-lg"></i>
                 <span v-if="buttonLoader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-dark" role="status">
                 <span class="visually-hidden">Loading...</span>
                 </span>
                 </button>
              </td> -->
           </tr>
        </tbody>
        <tbody>
           <tr>
           </tr>
        </tbody>
     </table>
  </div>
</template>
<script setup>
  import {onMounted, ref, watch,reactive} from "vue";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
  import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useRouter} from "vue-router";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import InterviewAssessment from "@/main/dashboard/studentApplication/InterviewAssessment.vue";
  import AppModal from "@/components/AppModal.vue";
  import useCommonsStore from "@/composables/useCommons.js";
  import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
  
  const reportSetupStore = useReportSetupStore()
  const commons = useCommonsStore()
  const studentsList = ref(null)
  const showingModal = ref(false)
  const assessmentNumber = ref("")
  const interviewStudentListData = ref( [])
  const assessmentStore = useAssessmentStore()
  const studentApplicationStore = useStudentApplicationStore()
  const routerData = useRouter()
  let  interviewNumber = routerData.currentRoute.value.query.interview_id
  let interviewM = routerData.currentRoute.value.query.interview_m
  const notificationStore = useNotificationStore()
  const applicationStore= useApplicationStore()
  const assessmentDataList = ref([])
  const assessment_metric_number = ref(null)
  const errorMessage = ref(null)
  const buttonLoader = ref(false)
  const comm = ref(null)
  const score = ref(null)
  const studentNumber = ref(null)

  const showModal = () => {
      showingModal.value = true
      thisDialog.value=false
  }  

  
  const fetchStudentOnInterview = (assessmentMetricNumber) =>{
   let data = {
      interview_number:interviewNumber,
      assessment_metric_number:assessmentMetricNumber
   }
      applicationStore.fetchStudentsOnInterview(data) 
  }
  
  
  watch(
      () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
      async (data) => {
        if(data){
          assessmentDataList.value = data.data
        }
      },
      {deep:true}
  )
  
  
  watch(
      () => applicationStore.StudentsOnInterviewResponse,
      async (data) => {
        if(data){
          interviewStudentListData.value = data.data
        }
      },
      {deep:true}
  )
  

  const submitMarks = (a,b,c) =>{
      buttonLoader.value=true
      const form = reactive({
      assessment_metric_number:assessmentNumber,
      comment:b,
      student_number:c,
      assessment_date:null,
      actual_score:parseInt(a)
  })
  studentApplicationStore.newInterviewAssessmentResult(form)
  }
  
  
  watch (
      () => studentApplicationStore.interviewAssessmentResultResponse,
      async (data) => {
        if(data){
          buttonLoader.value = false
          notificationStore.successToast("Success", data.message)
        }
      },
      {deep:true}
  )
  watch(
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
<style></style>