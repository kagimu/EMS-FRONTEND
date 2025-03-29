<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";


const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const schoolList = ref([])

const errorMessage = ref("")
const loader = ref(false)

const props = defineProps({
  reportTemplateDataInfo:{}
})

onMounted(() => {
  schoolStore.fetchSchools()
  getReportTemplateInfo()
    }
)

const form = reactive({
  status:"ACTIVE",
  name:null,
  school_number:""
})

const  getReportTemplateInfo = () =>{
  let draft  = props.reportTemplateDataInfo
  if(draft){
    form.name = draft?.name ?? ""
    form.school_number = draft?.school_number ?? ""
  }
}

const addReportTemplate = () => {
  loader.value = true
  if(props.reportTemplateDataInfo.report_template_id){
    reportSetupStore.updateReportTemplate(form)
  }else{
    reportSetupStore.addReportTemplate(form)
  }
  

}



watch (
  () => reportSetupStore.reportTemplateResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
      await reportSetupStore.fetchReportTemplate()
      loader.value=false
      form.name=null,
      form.school_number=null
    }
  },
  {deep:true}
)

watch (
  () => reportSetupStore.updateReportTemplateResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
      await reportSetupStore.fetchReportTemplate()
      loader.value=false
    }
  },
  {deep:true}
)

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
          if (data) {
            loader.value=false
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
)


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)
</script>

<template>
  <div>

  <form @submit.prevent="addReportTemplate">
    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    
<div class="mb-2">
  <label class="text-sm"><small>School</small> </label>
  <select
      v-model="form.school_number"
      class="form-select form-select-sm" required
      style="box-shadow: none;"
  >
    <option disabled value="">--Select School--</option>
    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
    </option>
  </select>
</div>


    <div class="mb-2">
      <label class="text-sm">Name</label>
      <input
          type="text"
          style="outline: none 0 !important;
               box-shadow: none;"
          v-model.trim="form.name"
          required
          class="form-control form-select-sm">
    </div>


    <div class="flex justify-content-end mt-4" style="width: 100%;">
      <button
          type="submit"
          class="btn btn-primary border-0">
        Save
        <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
      </button>
    </div>

  </form>
  </div>
</template>

<style scoped>
.text-sm{
    font-size: 13px;
}
</style>