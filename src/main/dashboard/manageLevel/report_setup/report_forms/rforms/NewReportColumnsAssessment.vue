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
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useRouter} from "vue-router";

const campusStore = useCampusStore()
const routerData = useRouter()
const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const assessmentStore= useAssessmentStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const schoolN = routerData.currentRoute.value.query.sch
let  curriculumNumberParent = routerData.currentRoute.value.query.cr

const errorMessage = ref("")
const loader = ref(false)
const reportColumnList = ref(null)
const interviewAssessmentListData = ref(null)
const assessmentMetricList = ref(null)
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const campus_class_number = ref("")
const report_setting_number = ref("")
const campusClassList = ref([])
const reportSettingsList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const assessment_area_number = ref("")

const form = reactive({
  code:null,
  report_column_number:"",
  assessment_area_number:"",
  // assessment_metric_number:"",
  assessment_schedule:[]
})



onMounted(
    async () => {
     levelStore.fetchCampusCurriculum(campusNumber)
      fetchCampusLevel()
    }
)

const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
}

const fetchAssessmentMetrics = () =>{
  if(study_period_number.value && assessment_area_number) {
    let data = {
      campus_class_number:campus_class_number.value,
      academic_year_number:academic_year_number.value,
      study_period_number:study_period_number.value,
      assessment_area_number:form.assessment_area_number
    }
    assessmentStore.fetchAssessmentMetrics(data)
  }
}

// watch(
//     () => studyPeriodStore.studyPeriodByAcademicYearResponse,
//     async (data) => {
//       if(data){
//         studyPeriodList.value = data.data
//       }
//     }
// )

 
watch(
    () => studyPeriodStore.studyPeriodResponse,
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


const addReportColumnAssessment = () => {
  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  // alert(JSON.stringify(form))
  reportSetupStore.newReportColumnAssessment(form)
}

const fetchAssessmentArea = (campus_class_number) =>{

   doFetchReportSettings(campus_class_number)
  let data = {
    curriculum_number:curriculumNumberParent,
    class_number:campus_class_number
  }
  assessmentStore.fetchAssessmentArea(data)

  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:academic_year_number.value,
        class_number:campus_class_number
      }
  )
}


const doFetchReportColumns = () => {
  // reportSetupStore.fetchReportColumn()
 reportSetupStore.fetchReportColumn(report_setting_number.value)
}

const doFetchReportSettings = async (campus_class_number) => {
  let data = {
    academic_year_number:"",
    study_period_number:"",
    campus_class_number:campus_class_number
  }
  await reportSetupStore.fetchReportSettings(data)
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
    () => reportSetupStore.reportColumnListResponse,
    async (data) => {
      if(data){
        reportColumnList.value = data.data
      }
    }
)

const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
}


watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)

watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        interviewAssessmentListData.value = data.data
      }
    }
)


watch (
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data && data.data){
        assessmentMetricList.value = data.data
      }
    }
)

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data

      }
    }
)

watch(
    () => reportSetupStore.reportColumnAssessmentResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    }
)


// watch(
//     () => academicYearStore.campusClassByLevelResponse,
//     async (data) => {
//       if(data){
//         campusClassList.value = data.data
//       }
//     }
// )

watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
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
    () => reportSetupStore.reportColumnListResponse,
    async (data) => {
      if(data){
        reportColumnList.value = data.data
      }
    }
)

</script>

<template>
  <div>
    <form @submit.prevent="addReportColumnAssessment">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="row">
        <div class="col-lg-4">

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
        >
          <option disabled value="">--Select Academic Year--</option>
          <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
            {{list.code+". "+list.academic_year_name}}
          </option>
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
          <option disabled value="">--Select Class--</option>
          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.name+" [ "+list.abbreviation+" ]"}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Report Settings</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="report_setting_number"
            @change="doFetchReportColumns()"
        >
          <option disabled value="">--Filter by report Settings--</option>
          <option v-for="(list, index) in reportSettingsList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Report Column</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.report_column_number"
        >
          <option disabled value="">--Select Report Column--</option>
          <option v-for="(list, index) in reportColumnList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Study Period</small>
        </label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="study_period_number"
            @change="fetchAssessmentMetrics"
        >
          <option disabled value="">Select</option>
          <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

        </select>
      </div>
    </div>


    <div class="col-lg-8">
   


      <div class="mb-2">
        <label class="textColor"><small>Assessment Area</small></label>
        <select
            required
            class="form-control shadow-none"
            v-model="form.assessment_area_number"
            @change="fetchAssessmentMetrics"
        >
          <option disabled value=""> - Select Assessment Area - </option>
          <option v-for="(listdata, index) in interviewAssessmentListData" :key="index" :value="listdata.number">
            {{ listdata.name}}
          </option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Assessment Schedule</small></label>
        <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" v-for="(lvl,idx) in assessmentMetricList">
            <input
                v-model="form.assessment_schedule"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="idx">
            <label class="form-check-label cursor-pointer" :for="idx" style="font-size: 13px;">
              {{lvl.description + " [ " +lvl.metric_name + " ] " + " ( "+ lvl.assessment_area +" ) "}}
            </label>
          </li>

        </ul>
      </div>

      <!-- <div class="mb-2">
        <label class="textColor"><small>Assessment Schedule</small></label>
        <select
            class="form-control form-select form-control-sm shadow-none"
            v-model="form.assessment_metric_number"
            aria-label="Default select example">
          <option disabled value="">--Select Assessment--</option>
          <option v-for="(list, index) in assessmentMetricList" :key="index" :value="list.number">
            {{list.description + " [ " +list.name + " ] " + " ( "+ list.assessment_area_name +" ) "}}</option>
        </select>
      </div> -->
      </div>

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