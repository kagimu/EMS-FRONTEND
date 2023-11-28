<template>
  <div>
    <form ref="form" @submit.prevent="saveExcelImport">

      <div>


        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="uploadError">
          {{ uploadError }}
        </div>

        <div class="mb-3">
          <label for="formFileSm" class="form-label">Choose file</label>
          <input
              ref="excel_file"
              class="form-control form-control-sm noFocus"
              id="formFileSm"
              accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              type="file">
        </div>




      </div>

      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
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
import {ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";


const uploadError = ref(null)
const excel_file = ref(null)
const loader = ref(false)
const notificationStore  = useNotificationStore()
const routerData = useRouter()


const curriculumStore = useCurriculumStore()
let  curriculumNumber = routerData.currentRoute.value.query.id

function saveExcelImport(){
  loader.value = true
  uploadError.value = null

  const formData = new FormData();
  const excelFileBlob = new Blob([excel_file.value.files[0]]);
  formData.set("excel_file", excelFileBlob);
  formData.set("curriculum_number", curriculumNumber);
   curriculumStore.uploadExcelFile(formData)
}


watch(
    () => curriculumStore.importResponse,
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
    () => curriculumStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)



</script>

<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>