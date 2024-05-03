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
// const campus_curriculum_number = routerData.currentRoute.value.query.crr

const errorMessage = ref("")
const loader = ref(false)
const classList = ref([])


onMounted(() => {
        schoolStore.fetchSchools()
    }
)

const form = reactive({
  status:"ACTIVE",
  name:null,
  school_number:null
})


const addReportTemplate = () => {
  loader.value = true
//   alert(JSON.stringify(form))
  reportSetupStore.addReportTemplate(form)
}

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)

watch (
  () => reportSetupStore.reportTemplateResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
      reportSetupStore.fetchReportTemplate()
    }
  },
  {deep:true}
)

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
              reportSetupStore.fetchReportTemplate()
          }
    },
    {deep: true}
)

</script>

<template>
  <div>
  <form @submit.prevent="addReportTemplate">
    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div class="mb-2">
            <label class="textSize"><small>School</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.SchoolNumber"
            >
                <option disabled value="">Select School</option>
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