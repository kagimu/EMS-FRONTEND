<script setup>

import {onMounted, ref, watch} from "vue";
import {useUserStore} from "@/main/dashboard/profiles/store/users.js";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import AppModal from "@/components/AppModal.vue";
import NewNarrativeReport from "@/main/dashboard/profiles/studentProfile/NewNarrativeReport.vue";
import NarrativeReportList from "@/main/dashboard/profiles/studentProfile/NarrativeReportList.vue";
import { useNarrativeStore } from "@/main/dashboard/narrative/narrativeComponents/store/narrativeStore.js";

const routerData = useRouter()

const userStore = useUserStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const studyPeriodStore = useStudyPeriodStore()
const assessmentStore= useAssessmentStore()
const narrativeStore = useNarrativeStore()
// const student_number = routerData.currentRoute.value.query.st_id
const student_number = ref(null)

const school_number = ref("")
const campus_number = ref("")
const campus_curriculum_number = ref("")
const campus_level_number = ref("")
const academic_year_number = ref("")
const campus_class_number = ref("")
const study_period_number = ref("")
const assessment_area_number = ref("")
const reportDialog = ref( false)



const narrativeList = ref([])
const schoolsList = ref([])
const campusList = ref([])
const campusCurriculumDataList = ref([])
const campusLevelList = ref([])
const campusClassList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const assessmentListData = ref([])



const props = defineProps({
  studentProfileData:{},
  narrativeWithSchedule:String,
  student_number:String
})


onMounted(
    async () => {
      fetchNarrativeInfo()
      await schoolStore.fetchSchools()

      if(props.student_number){
        student_number.value = props.student_number
      }else {
        student_number.value = routerData.currentRoute.value.query.st_id
      }
    }
)

const fetchNarrativeInfo = () => {
  let data = {
    student_number:student_number.value,
    assessment_area_number:assessment_area_number.value,
    study_period_number:study_period_number.value,
    campus_class_number:campus_class_number.value,
    academic_year_number:academic_year_number.value
  }

   userStore.fetchNarrativeReport(data)
}

const fetchCampusBySchool = () => {
  campus_number.value = ""
  campusStore.fetchCampuses(school_number.value)
}

const doFetchCurriculum = (campus_number) => {
  levelStore.fetchCampusCurriculum(campus_number)
}

const fetchLevel = (campus_curriculum_number) => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchCampusClass = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  academicYearStore.fetchCampusClassByLevel(campus_level_number)

}

const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
  fetchNarrativeInfo()
}

const fetchAssessmentArea = (campus_class_number) =>{
  if(campus_class_number) {
    fetchNarrativeInfo()
    let data = {
      curriculum_number:campus_curriculum_number.value,
       class_number:campus_class_number
    }
    assessmentStore.fetchAssessmentArea(data)
  }
}

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    }
)


watch(
    () => userStore.narrativeReportResponse,
    async (data) => {
      if(data && data.data){
      narrativeList.value = data.data
      }
    }
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
         campusCurriculumDataList.value = data.data
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

watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
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
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        assessmentListData.value = data.data
      }
    }
)

const addANarrativeReport = () => {
  reportDialog.value = true
}

const closeDialog = () => {
  reportDialog.value = false
}


watch (
    () => narrativeStore.updateNarrativeReportResponse,
    async (data) => {
      if (data) {
        closeDialog()
      }
    }
)
</script>

<template>
<div>

<!-- {{ studentProfileData }} -->
  <AppModal title="Add Narrative Report" v-model="reportDialog" lg>
      <new-narrative-report :narrativeWithSchedule="narrativeWithSchedule" v-on:next="closeDialog" :studentProfileData="studentProfileData" :student_number="student_number"></new-narrative-report>
  </AppModal>


  <div class="flex justify-content-between mt-3">
    <div class="ml-4"><span v-if="!narrativeWithSchedule">Narrative Report</span></div>
    <button
        type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addANarrativeReport">
      <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
      Add a narrative report
    </button>
  </div>


  <narrative-report-list
      :studentProfileData="studentProfileData"
      :student_number="student_number"
  ></narrative-report-list>

</div>
</template>

<style scoped>

</style>