<script setup>

import {onMounted, ref, watch} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
const reportStore = useReportCardStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const notificationStore  = useNotificationStore()


const campusCurriculumDataInfo = ref(null)
const campus_curriculum_number = ref("")
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const campus_class_number = ref("")
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)
const campusClassList = ref(null)
const studentReportList = ref(null)
const loader = ref(undefined)

onMounted(
    async () => {
      await filterReportSummary()

    }
)


const filterReportSummary = () => {
  let data = {
    study_period_number:study_period_number.value,
    campus_class_number:campus_class_number.value,
    studentNumber:""
  }
  reportStore.fetchReportSummary(data)
}


watch(
    () => reportStore.reportSummaryResponse,
    async (data) => {
      if(data){
        studentReportList.value = data.data
      }
    },
    {deep:true}
)

const fetchCampusLevel = (campus_curriculum_number) => {
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

const doGenerate = (studentInfo) => {
  loader.value = studentInfo.enrollment_number
  let data = {
    study_period_number:study_period_number.value,
    campus_class_number:studentInfo.campus_class_number,
    student_number:studentInfo.student_number
  }
  reportStore.generateReport(data)
}


watch(
    () => reportStore.generateReportResponse,
    async (data) => {
      if(data){
        loader.value = undefined
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => reportStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = undefined
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
        <label class="textColor">Curriculum</label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_curriculum_number"
            @change="fetchCampusLevel(campus_curriculum_number)"
        >
          <option disabled value="">--Select Curriculum--</option>
          <option v-for="(list, index) in campusCurriculumDataInfo" :key="index" :value="list.number">{{list.name}}</option>
        </select>
    </div>


    <div class="col-3">
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

    <div class="col-3">
      <label class="textColor">Academic Year</label>
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
    <div class="col-3">
      <label class="textColor"><small>Study Period</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="study_period_number"
          @change="filterReportSummary"
      >
        <option disabled value="">Select</option>
        <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

      </select>
    </div>
    <div class="col-3">
      <label class="textColor"><small>Class</small>
      </label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="campus_class_number"
          @change="filterReportSummary"
      >
        <option disabled value="">Select</option>
        <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
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
          <th scope="col">Class</th>
          <th scope="col" class="w-[20%]">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(studentInfo, index) in studentReportList" :key="index">
          <td> {{(index + 1)}}</td>
          <td> {{studentInfo.student}}</td>
          <td> {{studentInfo.grade}}</td>
          <td> {{studentInfo.aggregate}}</td>
          <td> {{studentInfo.class}}</td>
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