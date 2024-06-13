<script setup>
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {onMounted, reactive, ref, watch} from "vue";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";

const routerData = useRouter()
const commons = useCommonsStore()
const notificationStore  = useNotificationStore()
const reportSetupStore = useReportSetupStore()
const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()

const campus_curriculum_number = routerData.currentRoute.value.query.crr

const errorMessage = ref("")
const loader = ref(false)
const reportSettingsList = ref(null)


const campusLevelList = ref([])
const campusClassList = ref([])

const campus_level_number = ref("")
const campus_class_number = ref("")

const form = reactive({
  code:null,
  report_setting_number:null,
  name:null,
  percentage_share:null
})


onMounted(
    async () => {
      fetchCampusLevel()
    }
)

const doFetchReportSettings = async () => {
  let data = {
    academic_year_number:"",
    study_period_number:"",
    campus_class_number:campus_class_number.value
  }
  await reportSetupStore.fetchReportSettings(data)
}

const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchCampusClassNumber = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}


const addReportColumn = () => {
  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  form.percentage_share = form.percentage_share ? parseInt(form.percentage_share) : form.percentage_share
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

watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)


watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
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
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            type="text"
            v-model="form.code"
            @paste.prevent
            required
            class="form-control form-select-sm shadow-none">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Name</small></label>
        <input
            placeholder="eg. Mid Term, End of Term"
            maxlength="50"
            type="text"
            style="outline: none 0 !important;
            box-shadow: none;"
            v-model="form.name"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Level</small></label>
        <select
            class="form-select form-select-sm shadow-none"
            v-model="campus_level_number"
            @change="fetchCampusClassNumber(campus_level_number)"
        >
          <option disabled value="">--Filter by Level--</option>
          <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Class</small></label>
        <select
            class="form-select form-select-sm shadow-none" required
            v-model="campus_class_number"
            @change="doFetchReportSettings()"
        >
          <option disabled value="">--Filter by Class--</option>
          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
        </select>
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