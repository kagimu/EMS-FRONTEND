<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useRouter} from "vue-router";

const commons = useCommonsStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()

const studyPeriodStore = useStudyPeriodStore()
const reportSetupStore = useReportSetupStore()
const levelStore = useLevelStore()
const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()

const campus_curriculum_number = routerData.currentRoute.value.query.crr

const errorMessage = ref("")
const loader = ref(false)
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)
const campusClassList = ref(null)
const campus_level_number = ref("")

const props = defineProps({
  reportSettingsD:{}
})

const form = reactive({
  code:null,
  academic_year_number:"",
  study_period_number:"",
  campus_class_number:"",
  columns:"",
})

onMounted(
    async () => {
       fetchCampusLevel()
       getReportSettingInfo()
    }
)

const getReportSettingInfo = () => {
  if(props.reportSettingsD){
    form.code = props.reportSettingsD.code,
    form.columns = props.reportSettingsD.columns
  }
}

const addReportSettings = () => {
  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  form.columns = form.columns ? parseInt(form.columns) : form.columns
  reportSetupStore.newReportSettings(form)
}




const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


const fetchAcademicYea = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}


const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
}



watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data

      }
    }
)



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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)


watch(
    () => studyPeriodStore.studyPeriodByAcademicYearResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
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
    () => reportSetupStore.reportSettingsResponse,
    async (data) => {
      if(data){
       loader.value = false
      }
    }
)

</script>

<template>
  <div>
    <!-- {{ reportSettingsD }} -->
  <form @submit.prevent="addReportSettings">

    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>


    <div class="mb-2">
      <label class="textColor">Code</label>
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
      <label class="textColor"><small>Level</small></label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="campus_level_number"
          @change="fetchAcademicYea(campus_level_number)"
      >
        <option disabled value="">--Select Level--</option>
        <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
      </select>
    </div>


    <div class="mb-2">
      <label class="textColor">Academic Year</label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="form.academic_year_number"
          @change="fetchStudyPeriod(form.academic_year_number)"
      >
        <option disabled value="">--Select Class--</option>
        <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
          {{list.code+". "+list.academic_year_name}}
        </option>
      </select>
    </div>


    <div class="mb-2">
      <label class="textColor"><small>Study Period</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="form.study_period_number"
      >
        <option disabled value="">Select</option>
        <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

      </select>
    </div>



    <div class="mb-2">
      <label class="textColor"><small>Class</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="form.campus_class_number"
      >
        <option disabled value="">Select</option>
        <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
      </select>
    </div>

    <div class="mb-2">
      <label class="textColor">Columns</label>
      <input
          maxlength="50"
          type="text"
          style="outline: none 0 !important;
               box-shadow: none;"
          v-model="form.columns"
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