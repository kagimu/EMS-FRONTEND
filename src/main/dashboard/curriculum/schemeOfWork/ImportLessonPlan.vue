<template>
    <div>
    
  
      <form ref="form" @submit.prevent="saveExcelImport">
  
        <div>
  
          <div class="row mx-auto mt-5 mb-5">
            <div class="col-lg-6 content">
  
              <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="uploadError">
                {{ uploadError }}
              </div>
  
  
              <!-- {{ subTopicNumber }}s -->
              <div class="mb-3">
                <label for="formFileSm" class="form-label">Upload file</label>
                <input
                    ref="excel_file"
                    class="form-control form-control-sm noFocus"
                    id="formFileSm"
                    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    type="file">
              </div>
  
            </div>
          </div>
                    <hr class="mb-2 mt-3" />
  
        </div>
  
        <div class="flex justify-content-end" style="width: 100%;">
          <button
              type="submit"
              class="btn btn-primary">
            <small>Import</small>
            <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
          </button>
        </div>
  
      </form>
    </div>
  </template>
  
  <script setup>
  
  
  import {onMounted, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useRouter} from "vue-router";
  import {useSubtopicStore} from "@/main/dashboard/curriculum/curriculumSetup/subTopic/store/subTopic.js";
  import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";

  const schemeOfWorkStore = useSchemeOfWorkStore()
  const subtopicStore = useSubtopicStore()
  const uploadError = ref(null)
  const excel_file = ref(null)
  const loader = ref(false)
  const notificationStore  = useNotificationStore()
  const routerData = useRouter()
  const lessonPlanInfo = ref(null)

  const props = defineProps({
    lessonPlanDetailsForm: {},
    subTopicNumber:String
  })
  


  function saveExcelImport(){
  
    uploadError.value = null
  
     if(validateForm(lessonPlanInfo.value)){
       notificationStore.warningToast("Warning",validateForm(lessonPlanInfo.value))
       return
     }
  
    loader.value = true
  
    const formData = new FormData();
    formData.set("file", excel_file.value.files[0]);
    formData.set("scheme_sub_topic_number", props.subTopicNumber);
    schemeOfWorkStore.importLessonPlan(formData)
  }
  
  const validateForm = (lessonPlanInfo) => {
    let message = ""
    // if(!lessonPlanInfo.name){
    //   message = "Scheme title is required!"
    // }
  
    // if(!lessonPlanInfo.class_number){
    //   message = "Class is required!"
    // }
  
    // if(!lessonPlanInfo.subject_number){
    //   message =  "Subject is required!"
    // }
  
    // if(!lessonPlanInfo.academic_year_number){
    //   message =  "Academic year is required!"
    // }
  
    if(!excel_file.value.files[0]){
      message = "Attach a file!"
    }
  
    return message;
  
  }
  
 
  
  onMounted(
      async () => {
        filterDraftData()
      }
  )
  
  const filterDraftData = () => {
    if(props.lessonPlanDetailsForm) {
      lessonPlanInfo.value = props.lessonPlanDetailsForm
    }
  }
  
  watch(
      () => schemeOfWorkStore.importLessonPlanResponse,
      async (data) => {
        if(data){
          loader.value = false
          excel_file.value = null
          const input = document.getElementById('formFileSm');
          input.value = '';
          notificationStore.successToast("Success", data.message)
        }
      },
      {deep:true}
  )
  
  watch(
      () => schemeOfWorkStore.errorMessage,
      async (data) => {
        if(data){
          loader.value = false
          notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
  )
  
  watch(
      () => props.lessonPlanDetailsForm,
      async (data) => {
        if(data){
          // lessonPlanInfo.value = data
          filterDraftData()
        }
      },
      {deep:true}
  )
  
  
  
  </script>
  
  <style scoped>
  
  </style>