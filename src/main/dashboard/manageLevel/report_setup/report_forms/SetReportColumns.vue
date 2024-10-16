<script setup>
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {onMounted, reactive, ref, watch} from "vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);
const commons = useCommonsStore()
const notificationStore = useNotificationStore()
const reportSetupStore = useReportSetupStore()

const errorMessage = ref("")
const loader = ref(false)
const loop = ref(null)
const deletionLoader = ref(null)
const reportSettingNumber = ref(null)
const form = ref([]);

const props = defineProps({
  reportSettingNumber: String,
  reportColumns: String,
})


onMounted(() => {
  getReportColumnInfo()
  initializeForm()
})


watch(
    () => props.reportSettingNumber,
    async (data) => {
      if (data) {
        getReportColumnInfo()
      }
    }
)

const getReportColumnInfo = () => {
  let reportSettingsNumber = props.reportSettingNumber
  let reportColumnsNo = props.reportColumns

  if (reportSettingsNumber) {
    reportSettingNumber.value = reportSettingsNumber
    reportSetupStore.fetchReportColumn(reportSettingsNumber)
  }

  if (reportColumnsNo) {
    loop.value = parseInt(reportColumnsNo)
  }

}

const initializeForm = (num = loop.value) => {
  for (let i = 0; i < num; i++) {
    form.value.push({code: null, name: null, percentage_share: null, report_column_number: null});
  }
};


const convertFormValuesToInt = () => {
  form.value.forEach(field => {
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
    columns: form.value
  }
  reportSetupStore.newReportColumn(formData)
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
        getReportColumnInfo()
        await reportSetupStore.fetchReportColumn(reportSettingNumber.value)
        notificationStore.successToast("Success", data.message)
      }
    }
)


watch(
    () => reportSetupStore.reportColumnListResponse,
    async (data) => {
      let draft = data?.data
      if (data && draft && draft?.length > 0) {
        let draftLength = draft?.length
        let loopLength = loop.value
        form.value = draft?.map(item => ({
          report_column_number: item?.number,
          code: item?.code,
          name: item?.name,
          percentage_share: item?.percentage_share
        }))

        if (loopLength !== draftLength) {
          initializeForm((loopLength - draftLength))
        }

      }
    }
)



const deleteColumn = async (field, index) => {
  if (field) {
    const confirmDelete = await confirmationRef.value.confirm("Are you sure, you want to delete this column?");
    if (confirmDelete) {
      deletionLoader.value = index;

      form.value.splice(index, 1);

      if (field.report_column_number) {
        await reportSetupStore.deleteReportColumn(field.report_column_number);
      }

      deletionLoader.value = null;
    }
  }
};



watch(
    () => reportSetupStore.deleteReportColumnResponse,
    async (data) => {
      if(data) {
      
        notificationStore.successToast("Success", data.message)
        deletionLoader.value = null
        
      }
    }
)

</script>

<template>
  <div>



    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <form @submit.prevent="settingReportColumn">
      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      
      <div v-for="(field, index) in form" :key="index" class="row">
        <div class="col-lg-4">
          <div class="mb-2">
            <label class="text-sm"><small>Code</small></label>
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
            <label class="text-sm"><small>Column Name</small></label>
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
            <label class="text-sm"><small>Percentage Shares</small></label>
            <div class="flex">
            <input
              maxlength="50"
              type="text"
              style="outline: none 0 !important;
                     box-shadow: none;"
              v-model="field.percentage_share"
              required
              class="form-control form-select-sm">
              <div v-if="field.report_column_number">
                <button type="button" @click="deleteColumn(field, index)">
                  <i class="bi bi-x-lg ml-2" style="color:rgb(201, 10, 10)"></i>
                </button>
              </div>
            </div>
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
