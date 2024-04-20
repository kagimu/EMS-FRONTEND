<template>
    <div>
      <p class=" mt-4 mb-10" style="text-align: center !important;">PREVIOUS SCHOOL RESULTS</p>
    </div>
    <div class="mt-0">
      <form @submit.prevent="savePreviousSchoolResults" enctype="multipart/form-data">
        <div style="background-color: #f8f9fa;">
          <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
              <table style="width: 100%;">
                <tr v-for="(assessmentArea, index) in formD.assessmentArea" :key="index">
                  <td>
                    <select v-model="assessmentArea.assessmentAreaNumber" class="form-select form-select-sm">
                      <option v-for="option in AsessmentListData" :key="option" :value="option.number">{{ option.name }}</option>

                    </select>
                  </td>
                  <td style="width: 26%;">
                    <input v-model="assessmentArea.score" type="number" class="form-control">
                  </td>
                  <td style="width: 2%;">
                    <button type="button" @click="removeSubject(index)" class="btn btn-danger btn-sm p-0" ><i class="bi bi-x"></i></button>
                  </td>
                </tr>
                <tr>
                    <td>
                        <button type="button" @click="addSubject" class="btn btn-primary mb-2 btn-sm" style="color:white !important"><i class="bi bi-plus"></i></button>
                    </td>
                    <td></td>
                </tr>
              </table>
              <p class="mt-3">
                <label class="textColor">Attach Latest School Report</label>
            
          <!-- <input
            ref="file"
            class="form-control form-control-sm noFocus"
            id="formFileSm"
            accept="application/pdf"
            type="file" @change="onFileChange"> -->

            <input
              ref="file"
              class="form-control form-control-sm noFocus"
              id="formFileSm"
              accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.pdf"
              type="file">

              </p>
            </div>
            <div class="col-lg-2"></div>
          </div>
          <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-7">
            </div>
            <div class="col-lg-3">
              <button type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Next
                <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
          <button @click="skipp" type="button" class="btn btn-danger mb-2 ml-1 btn-sm" style="color:white !important">SKIP
               
          </button>
            </div>
          </div>
        </div>
      </form>
    </div>

  </template>
  
  <script setup>
  import { reactive, ref, defineEmits,onMounted,watch } from 'vue';
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import useNotificationStore from "@/composables/useNotification.js";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js"
  import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
  
  const curriculumStore = useCurriculumStore()
  const emit = defineEmits()
  const assessmentStore= useAssessmentStore()
  const AsessmentListData = ref([])
  const  notificationStore  = useNotificationStore()
  const applicationStore =  useApplicationStore()
  const buttonLoader = ref(false)
  let campus_class_number = localStorage.getItem('CampusClassNumber')
  let application_number= localStorage.getItem("applicationId")
  let student_number = localStorage.getItem('studentNumber')
  const errorMessage = ref(null)
  const uploadError = ref(null)
  const file = ref(null)
  const loader = ref(false)


  onMounted(
    async () => {
      if(campus_class_number){
        await assessmentStore.fetchAssessmentAreaByClass(campus_class_number)
      } 
    } )

  watch(
    () => assessmentStore.assessmentAreaByClassResponse,
    async (data) => {
      if(data){
        AsessmentListData.value = data.data
      }
    },
    {deep:true}
)


  const formD = reactive({
    assessmentArea: [] 
  })
  
  const addSubject = () => {
    formD.assessmentArea.push({ assessmentAreaNumber: '', score: '' })
  }
  
  const removeSubject = (index) => {
    formD.assessmentArea.splice(index, 1)
  }

// const myData = reactive({
//   assessment_and_score:formD.assessmentArea,
//   student_number:student_number,
//   application_number:application_number,
// })

function savePreviousSchoolResults(){
  buttonLoader.value = true
  uploadError.value = null
  const formData = new FormData();
  formData.set("file", file.value.files[0]);
  // formData.set("assessment_and_score", formD.assessmentArea.map(assessmentArea => assessmentArea.assessmentAreaNumber));
  formData.set("student_number", student_number);
  formData.set("application_number",application_number)
  // formData.set("score", formD.assessmentArea.map(assessmentArea => parseInt(assessmentArea.score)));



  const assessmentAndScore = formD.assessmentArea.map(assessmentArea => ({
    assessment_area_number: assessmentArea.assessmentAreaNumber,
    score: parseInt(assessmentArea.score)
  }));
  
  formData.set("assessment_and_score", JSON.stringify(assessmentAndScore));



  applicationStore.createPreviousSchoolResults(formData)
}

watch (
    () => applicationStore.previousSchoolResultresponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        localStorage.removeItem('CampusClassNumber')
        notificationStore.successToast("Success application submitted", data.message)
        localStorage.removeItem('applicationId')
        file.value = null
        const input = document.getElementById('formFileSm');
        input.value = '';
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

watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        
        notificationStore.errorToast("Error",data.message)

      }
    },
    {deep:true}
)

  const skipp = () =>{
  emit("next", 5 )
  }


  </script>
  
  <style scoped>
 
  </style>
  