<template>
    <div>
      <p class=" mt-4 mb-10" style="text-align: center !important;">PREVIOUS SCHOOL RESULTS</p>
    </div>
    <div class="mt-0">
      <form @submit.prevent="addSchoolResults">
        <div style="background-color: #f8f9fa;">
          <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
              <table style="width: 100%;">
                <tr v-for="(subject, index) in formD.assessmentArea" :key="index">
                  <td>
                    <select v-model="subject.subjectName" class="form-select form-select-sm">
                      <option v-for="option in AsessmentListData" :key="option" :value="option.number">{{ option.name }}</option>

                    </select>
                  </td>
                  <td style="width: 26%;">
                    <input v-model="subject.score" type="number" class="form-control">
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
                <!-- <input ref="fileInput" type="file" class="form-control" @change="onFileChange"
                accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf"> -->
          <input
            ref="file"
            class="form-control form-control-sm noFocus"
            id="formFileSm"
            accept="application/pdf"
            type="file" @change="onFileChange">

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
  
  const emit = defineEmits()
  const assessmentStore= useAssessmentStore()
  const AsessmentListData = ref([])
  const  notificationStore  = useNotificationStore()
  const applicationStore =  useApplicationStore()
  const buttonLoader = ref(false)
  const file = ref(null)

  onMounted(
    async () => {
      await assessmentStore.fetchAssesmentArea()
    } )

  watch(
    () => assessmentStore.assesmentAreaResponse,
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
    formD.assessmentArea.push({ subjectName: '', score: '' })
  }
  
  const removeSubject = (index) => {
    formD.assessmentArea.splice(index, 1)
  }


  
// Define reactive variables to store the selected file and its name
const selectedFile = ref(null);
const fileName = ref(null);

const onFileChange = (event) => {
  const file = event.target.files[0];
  selectedFile.value = file;
  fileName.value = file ? file.name : null;
};


  const addSchoolResults = () => {
    emit("next", 5 )
  // let student_number = localStorage.getItem('studentNumber')
  // buttonLoader.value = true

  // const formData = new FormData();
  // formData.set("file", file.value.files[0]);
  // formData.set("assessment_area_number", formD.assessmentArea.map(subject => subject.subjsectName));
  // formData.set("student_number", student_number);
  // formData.set("score", formD.assessmentArea.map(subject => parseInt(subject.score)));

  // applicationStore.createPreviousSchoolResults(formData)
  }

  watch (
    () => applicationStore.previousSchoolResultresponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success application submitted", data.message)
        localStorage.removeItem('applicationId')
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
        emit("next", 5 )
      }
    },
    {deep:true}
)

  

  </script>
  
  <style scoped>
 
  </style>
  