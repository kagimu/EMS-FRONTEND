<script setup>

import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import AppModal from "@/components/AppModal.vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import NarrativeReportList from "@/main/dashboard/profiles/studentProfile/NarrativeReportList.vue";

import StudentNarativeReport from "@/main/dashboard/profiles/studentProfile/StudentNarativeReport.vue";

const schoolStore = useSchoolStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()
const campusStore = useCampusStore()

const levelStore = useLevelStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const reportSetupStore = useReportSetupStore()
const assessmentStore= useAssessmentStore()
const campus_curriculum_number = routerData.currentRoute.value.query.crr
let  curriculumNumberParent = routerData.currentRoute.value.query.cr
const assessmentListData = ref([])
const metricListData = ref(null)
const assessmentMetricNumber = ref("")
const studentsList = ref([])
const campusCurriculumDataInfo = ref(null)
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const class_number = ref("")
const assessment_area_number = ref("")
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref([])
const campusClassList = ref(null)
const schoolN = routerData.currentRoute.value.query.sch
const campusNumber = routerData.currentRoute.value.query.id
const schoolList = ref([])
const school_number = ref("")
const campus_number = ref("")
const campusList = ref([])
const curriculumList = ref([])
const curriculumNumber = ref("")
const studentProfileData = ref(null)
const showDialog = ref(false)
const applicationStore = useApplicationStore()
const student_number = ref(null)



onMounted(
    async () => {
      schoolStore.fetchSchools()
      fetchCampusLevel()
      getStudentNumber()
     
    }
)


const addNarrativeReport = (number) => {
    student_number.value = number
    applicationStore.fetchStudent(number)
}



const maxScore = ref(null)

const fetchStudents = (assessmentMetricNumber) => {
  if(assessmentMetricNumber){
   let result = metricListData.value.find((item) => item.number === assessmentMetricNumber)
   maxScore.value = result.max_score
   
    reportSetupStore.fetchStudentByAssessmentMetric(assessmentMetricNumber)
  }
}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


const fetchClassesByLevel = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
}



watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {
        studentProfileData.value = data
        showDialog.value = true
      }
    },
    { deep: true }
)



watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
  )


watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)


const fetchAssessmentAreaAndStudyPeriod = (classNumber) =>{


  let data = {
    curriculum_number:curriculumNumberParent,
    class_number:classNumber
  }
  assessmentStore.fetchAssessmentArea(data)
  

  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:academic_year_number.value,
        class_number:classNumber,
        school_number:schoolN
      }
  )
  fetchStudents()
}

const fetchAssessmentMetricbyStudy = (studyP) =>{
    // let result = campusClassList.value?.find(item => item.curriculum_class_number === class_number.value);
    let data = {
      study_period_number:studyP,
      assessment_area_number:assessment_area_number.value,
      class_number:class_number.value,
      campus_number:campusNumber

    }
     assessmentStore.fetchAssessmentMetrics(data)
     fetchStudents()
  

 
}


const fetchAssessmentMetricsByArea = (assessmentArrea) =>{
 
    let data = {
      study_period_number:study_period_number.value,
      assessment_area_number:assessmentArrea,
      class_number:class_number.value,
      campus_number:campusNumber

    }
     assessmentStore.fetchAssessmentMetrics(data)
  
 
}



const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
  }


  const fetchCurriculum = (campus_level_number) => {
    levelStore.fetchCampusCurriculum(campus_level_number)
  }

watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)



watch(
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data){
        metricListData.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => reportSetupStore.studentsByAssessmentMetricResponse,
    async (data) => {
      if(data){
       studentsList.value = data.data
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
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        assessmentListData.value = data.data
      }
    }
)

watch(
    () => reportSetupStore.studentMarksResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
      }
    },
    {deep:true}
)

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


watch(
    () => campusStore.campusListResponse,
    async (data) => {
        if (data) {
            campusList.value = data.data
        }
    },
    {deep: true}
  )

  watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
  )




</script>

<template>

<AppModal title="Narrative Report" v-model="showDialog" xl6>
     <StudentNarativeReport 
     :studentProfileData="studentProfileData"
       narrativeWithSchedule="narrativeWithSchedule"
      :student_number="student_number"></StudentNarativeReport>
  </AppModal>

  <div>


    <div class="row bg-white mx-auto mt-2">

      <div class="col-3">
        <label class="text-sm"><small>Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_level_number"
            @change="fetchClassesByLevel(campus_level_number)"
        >
          <option disabled value="">--Select Level--</option>
          <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>

      <div class="col-3">
        <label class="text-sm"><small>Academic Year</small></label>
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

      <div class="col-3">
        <label class="text-sm"><small>Class</small>
        </label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="class_number"
            @change="fetchAssessmentAreaAndStudyPeriod(class_number)"

        >
          <option disabled value="">Select</option>
          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.name+" [ "+list.abbreviation+" ]"}}</option>
        </select>
      </div>

      <div class="col-2">
        <label class="text-sm"><small>Study Period</small>
        </label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="study_period_number"
            @change="fetchAssessmentMetricbyStudy(study_period_number)"
        >
          <option disabled value="">Select</option>
          <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
        </select>
      </div>
    

      <div class="col-3">
          <label class="text-sm"><small>Assessment Area</small></label>
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="assessment_area_number"
              @change="fetchAssessmentMetricsByArea(assessment_area_number)"
          >
            <option disabled value="">Select</option>
            <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
      </div>

      <div class="col-3">
        <div class="mb-2">
          <label class="text-sm"><small>Assessment Schedule</small></label>
          <select
              style="box-shadow: none;"
              class="form-select py-10"
              v-model="assessmentMetricNumber"
              @change="fetchStudents(assessmentMetricNumber)">
            <option class="text-[13px]" disabled value="">--Select Assessment Schedule--</option>
        
            <option class="text-[13px]" v-for="(list, index) in metricListData" :key="index" :value="list.number">
              {{list.description + " [ " +list.metric_name + " ] " + " ( "+ list.assessment_area +" ) "}}
            </option>
          </select>
        </div>
      </div>

    </div>

    <hr />

    <div class="row">

      <div class="col-12">
        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Narrative Report</div>
        </div>


        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[2%]">#</th>
            <th class="w-[80%]">Name</th>
            <th>#</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(std, index) in studentsList" :key="index">
            <td> {{(index + 1)}}</td>
            <td class="uppercase text-sm">
              {{std.student_surname ? std.student_surname : ""}}
              {{std.student_second_name ? " "+std.student_second_name : ""}}
              {{std.student_other_name ? " "+std.student_other_name : ""}}
            </td>
          
            <td>
              <button class="btn btn-success btn-sm mb-2" 
              @click="addNarrativeReport(std.number)"> Narrative Report</button>
            </td>
          </tr>        
          </tbody>
     
        </table>
        <p class="alert alert-danger m-2 p-3" v-if="assessmentMetricNumber && studentsList.length  === 0 ">
        No Student data found !

          </p>

      </div>
    </div>



  </div>

</template>

<style scoped>

</style>