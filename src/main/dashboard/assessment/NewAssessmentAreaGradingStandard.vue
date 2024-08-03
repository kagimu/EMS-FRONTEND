<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const assessmentStore= useAssessmentStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
let   schoolNumber = routerData.currentRoute.value.query.sch

const errorMessage = ref("")
const loader = ref(false)
const interviewAssessmentListData = ref(null)
const gradingStandardListData = ref(null)
const campusLevelList = ref(null)
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const campus_class_number = ref("")
const campusClassList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)

const form = reactive({
  code:null,
  assessment_area_number:"",
  grading_standard_number:"",
})


onMounted(
    async () => {
       fetchCampusLevel()
    }
)



const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
}

const fetchGradingStandard = () =>{
  let data = {
    campus_number:campusNumber,
    campus_class_number:campus_class_number.value
  }
    assessmentStore.fetchGradingStandardData(data)
}



watch(
    () => assessmentStore.gradingStandardResponse,
    async (data) => {
      if(data){
        gradingStandardListData.value = data.data
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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)


const addAssessmentAreaGradingStandard = () => {
  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  form.school_number = schoolNumber
  reportSetupStore.newAssessmentAreaGradingStandard(form)
}




const fetchAssessmentArea = (campus_class_number) =>{
  if(campus_class_number) {
    let curriculumClassNumber = campusClassList.value.find(list => list.number === campus_class_number).curriculum_class_number
    assessmentStore.fetchAssessmentArea(curriculumClassNumber)
    fetchGradingStandard()
  }
}


watch(
    () => reportSetupStore.assessmentAreaGradingStandardResponse,
    async (data) => {
      if(data){
        loader.value = false
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




const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}


watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        interviewAssessmentListData.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => reportSetupStore.reportColumnAssessmentResponse,
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

</script>

<template>
  <div>
    <form @submit.prevent="addAssessmentAreaGradingStandard">

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
        <label class="textColor"><small>Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_level_number"
            @change="fetchAcademicYear(campus_level_number)"
        >
          <option disabled value="">--Select Level--</option>
          <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Academic Year</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="academic_year_number"
            @change="fetchStudyPeriod(academic_year_number)"
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
            v-model="study_period_number"
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
            v-model="campus_class_number"
            @change="fetchAssessmentArea(campus_class_number)"
        >
          <option disabled value="">Select</option>
                    <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
<!--          <option v-for="(list, index) in campusClassList" :key="index" :value="list.curriculum_class_number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>-->
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Assessment Area</small></label>
        <select
            required
            class="form-control"
            v-model="form.assessment_area_number"
        >
          <option disabled value=""> - Select Assessment Area - </option>
          <option v-for="(listdata, index) in interviewAssessmentListData" :key="index" :value="listdata.number">
            {{ listdata.name}}
          </option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Grading Standards</small></label>
        <select
            class="form-control form-select form-control-sm shadow-none"
            v-model="form.grading_standard_number"
            aria-label="Default select example">
          <option disabled value="">--Select Grading Standard--</option>
          <option v-for="(lst, index) in gradingStandardListData" :key="index" :value="lst.number">
            {{ lst.code+". "+lst.name}}
          </option>
        </select>
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