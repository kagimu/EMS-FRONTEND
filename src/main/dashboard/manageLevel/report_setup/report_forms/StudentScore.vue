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
const campus_class_number = ref("")
const assessment_area_number = ref("")
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref([])
const campusClassList = ref(null)
const schoolN = routerData.currentRoute.value.query.sch



onMounted(
    async () => {
      fetchCampusLevel()
    }
)



const fetchStudents = (assessmentMetricNumber) => {
  if(assessmentMetricNumber){
    reportSetupStore.fetchStudentByAssessmentMetric(assessmentMetricNumber)
  }
}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


const fetchAcademicYea = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  // academicYearStore.fetchCampusClassByLevel(campus_level_number)

  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
}



watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)



// const fetchStudyPeriod = (academic_num) =>{
//   studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
// }




const fetchAssessmentAreaAndStudyPeriod = (campus_class_number) =>{
  // if(campus_class_number) {
  //   assessmentStore.fetchAssessmentArea(campus_class_number)
  // }

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

const fetchAssessmentMetrics = () =>{
  if(study_period_number.value && assessment_area_number.value) {

    let result = campusClassList.value?.find(item => item.curriculum_class_number === campus_class_number.value);

    let data = {
      study_period_number:study_period_number.value,
      assessment_area_number:assessment_area_number.value,
      campus_class_number:campus_class_number.value
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


const onlyNumberValidator = (event) => {
  const validChars = /^[0-9+\-*/.\s]+$/;
  if (!validChars.test(event.key)) return event.preventDefault();
}

const addMarks = (score, comment, number) => {

  if(score && comment){
    let data = {
      student_number:number,
      assessment_metric_number:assessmentMetricNumber.value,
      actual_score:parseInt(score),
      comment:comment
    }
    reportSetupStore.addStudentMarks(data)
  }

}

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

// watch(
//     () => academicYearStore.campusClassByLevelResponse,
//     async (data) => {
//       if(data){
//         campusClassList.value = data.data
//       }
//     }
// )

</script>

<template>

  <div>


    <div class="row bg-white mx-auto mt-2">

      <div class="col-3">
        <label class="text-sm"><small>Level</small></label>
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
            v-model="campus_class_number"
            @change="fetchAssessmentAreaAndStudyPeriod(campus_class_number)"

        >
          <option disabled value="">Select</option>
<!--          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>-->
          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.name+" [ "+list.abbreviation+" ]"}}</option>
        </select>
      </div>

      <div class="col-3">
        <label class="text-sm"><small>Study Period</small>
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
    

      <div class="col-3">
          <label class="text-sm"><small>Assessment Area</small></label>
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="assessment_area_number"
              @change="fetchAssessmentMetrics"
          >
            <option disabled value="">Select</option>
            <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
      </div>

      <div class="col-3">
        <div class="mb-2">
          <label class="text-sm"><small>Assessment Schedule</small></label>
          <!-- {{ metricListData }} -->
          <select
              style="box-shadow: none;"
              class="form-select py-10"
              v-model="assessmentMetricNumber"
              @click="fetchStudents(assessmentMetricNumber)">
            <option class="text-[13px]" disabled value="">--Select Assessment Schedule--</option>
            <option class="text-[13px]" v-for="(list, index) in metricListData" :key="index" :value="list.number">{{list.metric_name}}</option>
          </select>
        </div>
      </div>

    </div>





    <hr />

    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Student Score</div>
        </div>


        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]">#</th>
            <th class="w-[30%]">Name</th>
            <th>Score</th>
            <th>Comment</th>
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
              <input
                  @keypress="onlyNumberValidator($event)"
                  style="outline: none 0 !important; box-shadow: none;"
                  type="text"
                  v-model="std.score"
                  v-on:blur="addMarks(std.score, std.comment, std.number)"
                  required
                  class="form-control h-[35px]">
            </td>
            <td>
               <textarea
                   style="outline: none 0 !important; box-shadow: none;"
                   type="text"
                   v-model="std.comment"
                   v-on:blur="addMarks(std.score, std.comment, std.number)"
                   required
                   class="form-control form-select-sm h-1"></textarea>
            </td>

          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>

</template>

<style scoped>

</style>