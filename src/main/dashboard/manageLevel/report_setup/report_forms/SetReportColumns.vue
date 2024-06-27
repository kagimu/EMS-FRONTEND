<script setup>
import useCommonsStore from "@/composables/useCommons.js";
import { useReportSetupStore } from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import { onMounted, reactive, ref, watch } from "vue";

const commons = useCommonsStore()
const notificationStore = useNotificationStore()
const reportSetupStore = useReportSetupStore()

const errorMessage = ref("")
const loader = ref(false)
const loop = ref(null)
const reportSettingNumber = ref(null)

const props = defineProps({
  reportSettingNumber: String,
  reportColumns: String,
})


onMounted(() => {

  getReportColumnInfo()
})

const getReportColumnInfo = () =>{
  if(props.reportColumns){
  loop.value=parseInt(props.reportColumns)
  }
  if(props.reportSettingNumber){
  reportSettingNumber.value=props.reportSettingNumber
  }
}

const form = reactive([]);

const initializeForm = () => {
  for (let i = 0; i < loop.value; i++) {
    form.push({ code: null, name: null, percentage_share: null })
  }
}
const convertFormValuesToInt = () => {
  form.forEach(field => {
    if (field.code !== null) {
      field.code = parseInt(field.code);
    }
    if (field.percentage_share !== null) {
      field.percentage_share = parseInt(field.percentage_share);
    }
  });
};

const settingReportColumn = () => {
  loader.value = true
  convertFormValuesToInt()
  let formData = {
    report_setting_number: reportSettingNumber.value,
    columns:form
  }
  reportSetupStore.newReportColumn(formData)
  // alert(JSON.stringify(formData));
}

watch(
  () => reportSetupStore.errorMessage,
  async (data) => {
    if (data) {
      loader.value = false;
      notificationStore.errorToast("Error", data.message);
    }
  }
)

watch(
  () => reportSetupStore.reportColumnResponse,
  async (data) => {
    if (data) {
      loader.value = false;
      notificationStore.successToast("Success",data.message)
    }
  }
)

onMounted(() => {
  initializeForm()
})


</script>

<template>
  <div>
    <!-- {{ reportSettingNumber }} - {{ reportColumns }} -->
    <form @submit.prevent="settingReportColumn">
      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      
      <div v-for="(field, index) in form" :key="index" class="row">
        <div class="col-lg-4">
          <div class="mb-2">
            <label class="textColor"><small>Code</small></label>
            <input
              @keypress="commons.codeValidator($event)"
              maxlength="10"
              type="text"
              v-model="field.code"
              @paste.prevent
              required
              class="form-control form-select-sm shadow-none">
          </div>
        </div>
        <div class="col-lg-4">
          <div class="mb-2">
            <label class="textColor"><small>Column Name</small></label>
            <input
              placeholder="eg. Mid Term, End of Term"
              maxlength="50"
              type="text"
              style="outline: none 0 !important;
                     box-shadow: none;"
              v-model="field.name"
              required
              class="form-control form-select-sm">
          </div>
        </div>
        <div class="col-lg-4">
          <div class="mb-2">
            <label class="textColor"><small>Percentage Shares</small></label>
            <input
              maxlength="50"
              type="text"
              style="outline: none 0 !important;
                     box-shadow: none;"
              v-model="field.percentage_share"
              required
              class="form-control form-select-sm">
          </div>
        </div>
      </div>
      
      <div class="flex justify-content-end mt-4" style="width: 100%;">
        <button type="submit" class="btn btn-primary border-0">
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
