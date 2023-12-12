<template>

  <div>
    <form @submit.prevent="addStudyPeriod">

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
        <label class="textColor"><small>Study period name</small></label>
        <input
            maxlength="20"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.study_period_name"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Academic Year</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.academic_year_number">
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
            {{list.code+". "+list.academic_year_name}}
          </option>
        </select>
      </div>



        <div class="mb-2">
          <label class="textColor"><small>Select Date Range</small></label>
          <VueDatePicker
              style="font-size: 7px;"
              v-model="form.study_period_date_range"
              range
              :preview-format="format"
              :multi-calendars="{ solo: true }"></VueDatePicker>
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
<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
const commons = useCommonsStore()
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const campusStore = useCampusStore()
const academicYearStore = useAcademicYearStore()
const studyPeriodStore = useStudyPeriodStore()
const campusLevel = routerData.currentRoute.value.query.l
const campusNumber = routerData.currentRoute.value.query.id
const errorMessage = ref(null)
const campusLevelInfo = ref([])
const academicYearList = ref([])
const loader = ref(false)


import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";

const date = ref();




const form = reactive({
  code:"",
  study_period_name:"",
  academic_year_number:"",
  study_period_date_range:"",
})


const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
}

onMounted(
    () =>{
      campusStore.fetchCampusLevel(campusNumber)
    }
)

const addStudyPeriod = () => {
  loader.value = true
  errorMessage.value = ""
  studyPeriodStore.newStudyPeriod(form)
}

watch(
    () => campusStore.campusLevelListResponse,
    async (data) => {
      if(data){
        campusLevelInfo.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => studyPeriodStore.newStudyPeriodResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.code = ""
        form.study_period_name = ""
        form.academic_year_number = ""
        form.study_period_date_range = ""
      }
    },
    {deep:true}
)

watch(
    () => academicYearStore.academicYearResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => studyPeriodStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


</script>

<style scoped>

</style>