<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

import {useRouter} from "vue-router";

const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()
const schoolStore = useSchoolStore()
const schoolList = ref([])
const campusNumber = routerData.currentRoute.value.query.id
let schoolNumber = routerData.currentRoute.value.query.id

const errorMessage = ref("")
const loader = ref(false)
const classList = ref([])

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
  if(props.reportTemplateDataInfo){
    form.name = props.reportTemplateDataInfo.name
    form.school_number = props.reportTemplateDataInfo.school_number
  }
}

const addReportTemplate = () => {
  loader.value = true
  if(props.reportTemplateDataInfo){
  alert("Halleluyah")
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

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
          if (data) {
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
    <!-- {{ reportTemplateDataInfo }} -->
  <form @submit.prevent="addReportTemplate">
    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    
<div class="mb-2">
  <label class="textColor"><small>School</small> </label>
  <select
      v-model="form.school_number"
      class="form-select form-select-sm" required
      style="box-shadow: none;"
  >
    <option disabled :value="null">Select School</option>
    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
    </option>
  </select>
</div>


    <div class="mb-2">
      <label class="textSize">Name</label>
      <input
          type="text"
          style="outline: none 0 !important;
               box-shadow: none;"
          v-model="form.name"
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
.textSize{
    font-size: 13px;
}
</style>