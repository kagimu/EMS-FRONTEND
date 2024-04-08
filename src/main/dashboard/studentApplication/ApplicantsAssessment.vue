<template>
    <div>


    <div class="row">
<div class="col-lg-3">
    <div class="mb-2">
            <label class="textColor"><small>Assessment</small> 
            </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="assessmentNumber"
                    @change="fetchStudentOnInterview(assessmentNumber,interviewNumber)"
            >
                <option disabled value="">Select</option>
                <option v-for="(assessment, index) in assessmentDataList" :key="index" :value="assessment.AssessmentMetric.number">{{assessment.AssessmentMetric.name  }}</option>
            </select>
        </div>
</div>
<div class="col-lg-8">

</div>
    </div>

      <table id="data"
        class="table table-striped">
        <thead>
      <tr>
        <th scope="col">Adn</th>
        <th>Name</th>
        <th scope="col">Score</th>
        <th scope="col">Comment</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
    
      <tr v-for="(studentList , index) in interviewStudentList" :key="index" >
        <td scope="col">{{ studentList.Student.adn }}</td>
        <td>{{ studentList.Student.surname + " " + studentList.Student.second_name + " " + studentList.Student.other_name}}</td>
        <td scope="col">
            <input type="number" class="form-control" v-model="score">
        </td>
        <td scope="col">
            <textarea class="form-control" v-model="comm"></textarea>
        </td>
        <td>
            <button type="button" @click="submitMarks(score,comm,studentList.Student.number)" style="color:#0d6efd;">
            <i class="bi bi-check-lg"></i> save
            <span v-if="buttonLoader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
              </span>
          </button>
        </td>
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

const assessmentNumber = ref(null)
const interviewStudentList = ref( [])
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


onMounted(
    () => {
      studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber)
    }
)
watch(
    () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
    async (data) => {
      if(data){
        assessmentDataList.value = data.data
      }
    },
    {deep:true}
)

const fetchStudentOnInterview = (a,b) =>{
    assessmentNumber.value = a
    let  interviewNum = b

    applicationStore.fetchStudentsOnInterview(interviewNum)
}



watch(
    () => applicationStore.StudentsOnInterviewResponse,
    async (data) => {
      if(data){
        interviewStudentList.value = data.data
      }
    },
    {deep:true}
)

//entering marks
const comm = ref(null)
const score = ref(null)
const studentNumber = ref(null)

const submitMarks = (a,b,c) =>{
    buttonLoader.value=true
    const form = reactive({
    assessment_metric_number:assessmentNumber,
    comment:b,
    student_number:c,
    assessment_date:null,
    actual_score:a
})

alert(JSON.stringify(form))
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