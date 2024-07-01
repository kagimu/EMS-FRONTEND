<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()

const errorMessage = ref("")
const loader = ref(false)
const reportSettingsList = ref(null)

const form = reactive({
  code:null,
  report_setting_number:"",
  student_number:null,
  campus_class_number:null,
  study_period_number:null,
  grade:null,
  aggregate:null,
  comment:null,
})


onMounted(
    async () => {
      await reportSetupStore.fetchReportSettings()
    }
)




const addReportSummary = () => {
  loader.value = true
  reportSetupStore.newReportSummary(form)
}



watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)


watch(
    () => reportSetupStore.reportSettingsListResponse,
    async (data) => {
      if(data){
        reportSettingsList.value = data.data
      }
    }
)


</script>

<template>
  <div>
    <form @submit.prevent="addReportSummary">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Code</small></label>
        <input
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            type="text"
            v-model="form.code"
            @paste.prevent
            required
            class="form-control form-select-sm shadow-none">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>General Report Settings</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.report_setting_number"
        >
          <option disabled value="">--Select Settings--</option>
          <option v-for="(list, index) in reportSettingsList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Academic Year</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.academic_year_number">
          <option disabled value="">--Select Class--</option>
          <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
            {{list.code+". "+list.academic_year_name}}
          </option>
        </select>
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Columns</small></label>
        <input
            maxlength="50"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.columns"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Status</small></label>
        <input
            maxlength="50"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.status"
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

</style>