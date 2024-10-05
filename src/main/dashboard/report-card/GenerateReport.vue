<script setup>

import {onMounted, ref, watch} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"

const campusStore = useCampusStore()
const reportStore = useReportCardStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()

const campus_curriculum_number = routerData.currentRoute.value.query.crr
const schoolN = routerData.currentRoute.value.query.sch
const campusNumber = routerData.currentRoute.value.query.id
const campusCurriculumDataInfo = ref(null)
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const class_number = ref("")
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)
const campusClassList = ref(null)
const studentReportList = ref(null)
const loader = ref(undefined)

onMounted(
    async () => {
      //  filterGeneratedReport()
      fetchCampusLevel()
    }
)


const filterGeneratedReport = (cla) => {
 
    let data = {
      study_period_number: study_period_number.value,
      class_number: cla,
      campus_number:campusNumber,
      campus_curriculum_number:campus_curriculum_number
    }
    reportStore.fetchGeneratedReport(data)
  

  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:academic_year_number.value,
        class_number:class_number.value,
        school_number:schoolN
      } 
    )


}

const filterGeneratedReportByPeriod = (studyperiodnumber) => {

    let data = {
      study_period_number: studyperiodnumber,
      class_number: class_number.value,
      campus_number:campusNumber,
      campus_curriculum_number:campus_curriculum_number
    }
    reportStore.fetchGeneratedReport(data)
  
}


watch(
    () => reportStore.reportGeneratedReportResponse,
    async (data) => {
      if(data){
        studentReportList.value = data.data
      }
    },
    {deep:true}
)

const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchAcademicYea = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)

  filterGeneratedReportByPeriod()
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
    },
    {deep:true}
)


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
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)

const campusClassNumber = ref(null)
const studentNumber = ref(null)
const doGenerate = (studentInfo) => {

  loader.value = studentInfo.enrollment_number
  studentNumber.value = studentInfo.campus_class_number
  campusClassNumber.value = studentInfo.student_number

  let data = {
    study_period_number:study_period_number.value,
    campus_class_number:studentInfo.campus_class_number,
    student_number:studentInfo.student_number
  }
  reportStore.generateReport(data)
}

const doRefreshAfterReportGenerated = () =>{
  let data = {
      study_period_number: study_period_number.value,
      class_number: class_number.value,
      campus_number:campusNumber,
      campus_curriculum_number:campus_curriculum_number
    }
    reportStore.fetchGeneratedReport(data)
}


watch(
    () => reportStore.generateReportResponse,
    async (data) => {
      if(data){
        loader.value = false
        doRefreshAfterReportGenerated()
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => reportStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = true
        notificationStore.errorToast("Error", data.message)
      }
    }
)



</script>

<template>
<div>


  <div class="flex justify-content-between mt-3">
    <div class="ml-4">Generate Report</div>
  </div>

<hr />

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
      <label class="text-sm">Academic Year</label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="academic_year_number"
      >
        <option disabled value="">--Select Class--</option>
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
          @change="filterGeneratedReport(class_number)"
      >
        <option disabled value="">Select</option>
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
          @change="filterGeneratedReportByPeriod(study_period_number)"
      >
        <option disabled value="">Select</option>
        <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

      </select>
    </div>
  

  </div>

<hr />
  <div class="row bg-white mx-auto mt-2">

    <div class="col-12">





      <table class="table table-hover caption-top mt-4 table-sm" style="font-size: 14px;">
        <thead>
        <tr>
          <th scope="col" style="width: 10%;">#</th>
          <th scope="col" class="w-[30%]">Student Name</th>
          <th scope="col">Grade</th>
          <th scope="col">Aggregate</th>
          <!-- <th scope="col">Class</th> -->
          <th scope="col" class="w-[20%]">Action</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(studentInfo, index) in studentReportList" :key="index">
          <td> {{(index + 1)}}</td>
          <td style="text-transform: capitalize;"> {{studentInfo.student}}</td>
          <td> {{studentInfo.grade}}</td>
          <td> {{studentInfo.aggregate}}</td>
          <!-- <td> {{studentInfo.class}}</td> -->
          <td>
            <div>

              <button
                  class="bg-[#0d6efd] text-white text-sm rounded-sm px-2 py-[1px]"
                  @click="doGenerate(studentInfo)" >
                <small>
                  <i class="fa fa-refresh" aria-hidden="true"></i>
                  Generate Report

                  <div class="spinner-border spinner-border-sm" role="status" v-if="loader === studentInfo.enrollment_number">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </small>
              </button>


            </div>
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