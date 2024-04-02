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
                <tr v-for="(subject, index) in formData.subjects" :key="index">
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
                <input type="file" class="form-control">
              </p>
            </div>
            <div class="col-lg-2"></div>
          </div>
          <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
            </div>
            <div class="col-lg-2">
              <button type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, defineEmits,onMounted,watch } from 'vue';
//   import {onMounted,reactive, ref, watch} from "vue";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import useNotificationStore from "@/composables/useNotification.js";
  
  const emit = defineEmits()
  const assessmentStore= useAssessmentStore()
  const AsessmentListData = ref([])
  const  notificationStore  = useNotificationStore()


  onMounted(
    async () => {
      await assessmentStore.fetchAssesmentArea()
    } )


  watch(
    () => assessmentStore.assesmentAreaResponse,
    async (data) => {
      if(data){
        AsessmentListData.value = data.data
       // notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

  const formData = reactive({
    subjects: [] 
  })
  
  const subjectOptions = ['Mathematics', 'SST', 'Luganda']
  
  const addSubject = () => {
    formData.subjects.push({ subjectName: '', score: '' })
  }
  
  const removeSubject = (index) => {
    formData.subjects.splice(index, 1)
  }
  


  const addSchoolResults = () => {
    alert(JSON.stringify(formData))
  }
  

  </script>
  
  <style scoped>
 
  </style>
  