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
  const assessment_numberumber = ref("")
  const interviewStudentList = ref( [])
  const assessmentStore = useAssessmentStore()
  const studentApplicationStore = useStudentApplicationStore()
  const routerData = useRouter()
  let  interviewNumber = routerData.currentRoute.value.query.interview_id
  let interviewM = routerData.currentRoute.value.query.interview_m
  const notificationStore = useNotificationStore()
  const applicationStore= useApplicationStore()
  const assessmentDataData = ref([])
  const assessment_metric_number = ref(null)
  const errorMessage = ref(null)
  const buttonLoader = ref(false)
  const comm = ref(null)
  const score = ref(null)
  const studentNumber = ref(null)
  const errM = ref(false)

  const showModal = () => {
      showingModal.value = true
  }  

  const form = reactive({
   assessment_number : ""
  })

  
  const fetchStudentOnInterviewDetails = (assNumber) => {
   let data = reactive({
      interview_number:interviewNumber,
      assessment_metric_number:assNumber
   })
      applicationStore.fetchStudentsOnInterview(data) 
  }
  
  
  watch(
      () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
      async (data) => {
        if(data){
          assessmentDataData.value = data.data
        }
      },
      {deep:true}
  )
  
  
  watch(
      () => applicationStore.StudentsOnInterviewResponse,
      async (data) => {
        if(data){
         errM.value = false
          interviewStudentList.value = data.data
        }
      }
  )
  

  const submitMarks = (a,b,c) =>{
      buttonLoader.value=true
      let formDat = reactive({
      assessment_metric_number:form.assessment_number,
      comment:b,
      student_number:c,
      assessment_date:null,
      actual_score:parseInt(a)
  })
  studentApplicationStore.newInterviewAssessmentResult(formDat)
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
      () => applicationStore.errorMessage,
      async (data) => {
        if(data){
         errM.value = true
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
      )
  
      watch(
      () => studentApplicationStore.errorMessage,
      async (data) => {
        if(data){
          buttonLoader.value = false
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
        }
      }
      )
      


</script>


<template>
  <div>
     <AppModal title="Attach Assessment Schedules To An Interview" v-model="showingModal" lg>
        <interview-assessment :interviewNumber="interviewNumber"></interview-assessment>
     </AppModal>
     <div class="row mt-4">
        <div class="col-lg-4">
           <div class="mb-2">
            <label style="font-size: 11px;"  class="alert alert-primary p-0">* Please Select Assessment Schedule to Enter/view Marks</label>
            <div class="input-group mt-1">
          <select
                 class="form-select form-select-sm shadow-none"  id="inputGroupSelect02" required
                 v-model="form.assessment_number"
                 @change="fetchStudentOnInterviewDetails(form.assessment_number)"
                 >
                 <option disabled value=""> - Select Assessment Schedule- </option>
                 <option v-for="(assessment, index) in assessmentDataData" :key="index" :value="assessment.number">{{assessment.metric_name  }} - [{{ assessment.assessment_area }}]</option>
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

     <div>

      
     <div class="alert alert-danger p-1 mt-3 mb-3 textColor" v-if="errM" >
       {{ errorMessage }}
     </div>
      
     <div v-else>
     <table   id="data"
        class="table table-striped table-hover caption-top table-sm text-sm">
        <thead>
           <tr>
              <th>Name</th>
              <th scope="col">Score</th>
              <th scope="col">Comment <span v-if="buttonLoader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-dark" role="status">
                 <span class="visually-hidden">Loading...</span>
                 </span></th>
           </tr>
        </thead>
        <tbody>
           <tr v-for="(std,index) in interviewStudentList.students" :key="index" >
              <td style="text-transform: capitalize;">
                 {{std.student_surname +" " +std.student_second_name + " "+ std.student_other_name}}
              </td>
              <td scope="col" style="width: 150px;">
                 <input
                     type="text"
                     class="form-control shadow-none"
                     v-model="std.score"
                     @keypress="commons.numbersOnlyValidator($event)"
                      maxlength="10"
                     v-on:blur="submitMarks(std.score, std.comment, std.number)">
              </td>
              <td scope="col">
                 <textarea
                    type="text"
                    v-model="std.comment"
                    v-on:blur="submitMarks(std.score, std.comment, std.number)"
                    required
                    class="form-control form-select-sm h-1 shadow-none"></textarea>
              </td>
           </tr>
        </tbody>
     </table>
   </div>

   </div>
  </div>
</template>

<style></style>