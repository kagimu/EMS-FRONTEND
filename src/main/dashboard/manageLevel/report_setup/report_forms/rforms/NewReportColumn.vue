<script setup>
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {onMounted, reactive, ref, watch} from "vue";

const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()

const errorMessage = ref("")
const loader = ref(false)
const reportSettingsList = ref(null)

const form = reactive({
  code:null,
  report_setting_number:null,
  name:null,
  percentage_share:null
})


onMounted(
    async () => {
      await reportSetupStore.fetchReportSettings()
    }
)


const addReportColumn = () => {
  loader.value = true
  reportSetupStore.newReportColumn(form)
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


watch(
    () => reportSetupStore.reportColumnResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    }
)

</script>

<template>
  <div>
    <form @submit.prevent="addReportColumn">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Code</small></label>
        <input
            @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.code"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Name</small></label>
        <input
            maxlength="50"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.name"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Report Settings</small></label>
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
        <label class="textColor"><small>Percentage Share</small></label>
        <input
            maxlength="50"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.percentage_share"
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