<template>
  <div>

    <form ref="form" @submit.prevent="saveExcelImport">

      <div>

        <div class="row mx-auto mt-5 mb-5">
          <div class="col-lg-6 content">

            <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="uploadError">
              {{ uploadError }}
            </div>


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

const subtopicStore = useSubtopicStore()
const uploadError = ref(null)
const excel_file = ref(null)
const loader = ref(false)
const notificationStore  = useNotificationStore()
const routerData = useRouter()
const schemeInfo = ref(null)


function saveExcelImport(){
  loader.value = true
  uploadError.value = null

   if(validateForm(schemeInfo.value)){
     notificationStore.warningToast("Warning",validateForm(schemeInfo.value))
     return
   }

  const formData = new FormData();
  formData.set("scheme_excel_file", excel_file.value.files[0]);
  formData.set("name", (schemeInfo.value.name).trim());
  formData.set("class_number", schemeInfo.value.class_number);
  formData.set("subject_number", schemeInfo.value.subject_number);
  formData.set("academic_year_number", schemeInfo.value.academic_year_number);
  subtopicStore.importSchemeOfWork(formData)
}

const validateForm = (schemeInfo) => {
  let message = ""
  if(!schemeInfo.name){
    message = "Scheme title is required!"
  }

  if(!schemeInfo.class_number){
    message = "Class is required!"
  }

  if(!schemeInfo.subject_number){
    message =  "Subject is required!"
  }

  if(!schemeInfo.academic_year_number){
    message =  "Academic year is required!"
  }

  if(!excel_file.value.files[0]){
    message = "Attach a file!"
  }

  return message;

}

const props = defineProps({
  schemeDetailsForm: {},
})


onMounted(
    async () => {
      filterDraftData()
    }
)

const filterDraftData = () => {
  if(props.schemeDetailsForm) {
    schemeInfo.value = props.schemeDetailsForm
  }
}

watch(
    () => subtopicStore.importSchemeResponse,
    async (data) => {
      if(data){
        loader.value = false
        excel_file.value = null
        const input = document.getElementById('formFileSm');
        input.value = '';

      }
    },
    {deep:true}
)

watch(
    () => subtopicStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => props.schemeDetailsForm,
    async (data) => {
      if(data){
        // schemeInfo.value = data
        filterDraftData()
      }
    },
    {deep:true}
)



</script>

<style scoped>

</style>