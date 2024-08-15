<script setup>
import { reactive, ref, defineEmits,onMounted,watch } from 'vue';
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import useNotificationStore from "@/composables/useNotification.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js"
import useCommonsStore from "@/composables/useCommons.js";


const emit = defineEmits()
const assessmentStore= useAssessmentStore()
const AsessmentListData = ref([])
const  notificationStore  = useNotificationStore()
const applicationStore =  useApplicationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const uploadError = ref(null)
const file = ref(null)
const applicationId = ref(null)
const commons = useCommonsStore()

onMounted(
    async () => {

    } )

watch(
    () => assessmentStore.assessmentAreaByClassResponse,
    async (data) => {
      if(data){
        AsessmentListData.value = data.data
      }
    }
)


const formD = reactive({
  assessmentArea: [{ assessmentAreaNumber: '', score: '' }]
})

const addSubject = () => {
  formD.assessmentArea.push({ assessmentAreaNumber: '', score: '' })
}

const removeSubject = (index) => {
  formD.assessmentArea.splice(index, 1)
}



function savePreviousSchoolResults(){
  buttonLoader.value = true
  uploadError.value = null
  const formData = new FormData();
  formData.set("attachment", file.value.files[0]);
  const assessmentAndScore = formD.assessmentArea.map(assessmentArea => ({
    assessment_area_number: assessmentArea.assessmentAreaNumber,
    score: parseInt(assessmentArea.score)
  }));

  formData.set("assessment_and_score", JSON.stringify(assessmentAndScore));
  formData.set("student_number", localStorage.getItem('studentNumber'));
  formData.set("application_number",localStorage.getItem("applicationId"))

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

        emit("next", {id:applicationId.value, step:5})
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
  emit("next", {id:applicationId.value, step:5})
}

const goBack = () =>{
  emit("next", {id:applicationId.value, step:3})
}


watch (
    () => applicationStore.applicationByIdResponse,
    async (data) => {
      if(data){
        applicationId.value = data.number
        let campusClassNo = data?.student?.campus_class_number
        if(campusClassNo) {
          await assessmentStore.fetchAssessmentAreaByClass(campusClassNo)
        }
      }
    }
)


</script>
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
              <label class="textColor">Provide Previous Marks</label>
              <table style="width: 100%;">
                <tr v-for="(assessmentArea, index) in formD.assessmentArea" :key="index">
                  <td>
                    <select
                        v-model="assessmentArea.assessmentAreaNumber"
                        class="form-select form-select-sm shadow-none">
                      <option disabled value="">--filter by Subject--</option>
                      <option v-for="option in AsessmentListData" :key="option" :value="option.number">{{ option.name }}</option>
                    </select>
                  </td>
                  <td style="width: 26%;">
                    <input
                        @keypress="commons.numbersOnlyValidator($event)"
                        maxlength="4"
                        v-model="assessmentArea.score"
                        type="text"
                        class="form-control shadow-none">
                  </td>
                  <td style="width: 2%;">
                    <button v-if="index > 0" type="button" @click="removeSubject(index)" class="btn btn-danger btn-sm p-0" ><i class="bi bi-x"></i></button>
                  </td>
                </tr>
                <tr>
                    <td>
                        <button type="button" @click="addSubject" class="btn btn-primary mb-2 btn-sm" style="color:white !important">
                        <div class="text-xs">
                          <i class="bi bi-plus"></i>
                          Add Marks
                        </div>
                        </button>
                    </td>
                    <td></td>
                </tr>
              </table>
              <p class="mt-3">
                <label class="textColor">Attach Latest School Report</label>

            <input
              ref="file"
              class="form-control form-control-sm shadow-none"
              id="formFileSm"
              accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.pdf"
              type="file">

              </p>
            </div>
            <div class="col-lg-2"></div>
          </div>
          <div class="flex flex-grow justify-between px-3">

            <div>
              <button @click="goBack()" type="button" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
                <small><i class="bi bi-box-arrow-in-left"></i> Back</small>
              </button>
            </div>


            <div class="flex">
              <button type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Next
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </button>
              <button
                  @click="skipp"
                  type="button"
                  class="btn btn-danger mb-2 ml-1 btn-sm"
                  style="color:white !important">
                SKIP
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

  </template>
  

  
  <style scoped>
 
  </style>
  