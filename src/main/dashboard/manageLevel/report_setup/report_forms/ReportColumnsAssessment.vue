<script setup>

import NewReportColumnsAssessment
  from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportColumnsAssessment.vue";
import {onMounted, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";


const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const reportSetupStore = useReportSetupStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const studyPeriodStore = useStudyPeriodStore()
const assessmentStore= useAssessmentStore()


const campus_curriculum_number = routerData.currentRoute.value.query.crr


const reportColumnAssessmentList = ref(null)

const showReportColumn = ref(false)
const campusLevelList = ref(null)
const campusClassList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)
const assessmentMetricList = ref(null)
const interviewAssessmentListData = ref(null)


const campus_level_number  = ref("")
const academic_year_number  = ref("")
const study_period_number  = ref("")
const campus_class_number  = ref("")
const assessment_area_number  = ref("")
const assessment_metric_number  = ref("")

onMounted(
    async () => {
      doFetchReportColumnAssessment()
      fetchCampusLevel()
    }
)

const doFetchReportColumnAssessment = () => {
  let data = {
    campus_level_number:campus_level_number.value,
    academic_year_number:academic_year_number.value,
    study_period_number:study_period_number.value,
    campus_class_number:campus_class_number.value,
    assessment_area_number:assessment_area_number.value,
    assessment_metric_number:assessment_metric_number.value
  }
  reportSetupStore.fetchReportColumnAssessment(data)
}



const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const addReportColumn = () => {
  showReportColumn.value = true
}


const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}


const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
}

const fetchAssessmentMetrics = () =>{
  if(study_period_number.value && assessment_area_number.value) {
    let data = {
      study_period_number:study_period_number.value,
      assessment_area_number:assessment_area_number.value
    }
    assessmentStore.fetchAssessmentMetrics(data)
  }
}


const fetchAssessmentArea = (campus_class_number) =>{
  if(campus_class_number) {
    assessmentStore.fetchAssessmentArea(campus_class_number)
  }
}

watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        interviewAssessmentListData.value = data.data
      }
    }
)

watch(
    () => reportSetupStore.reportColumnAssessmentResponse,
    async (data) => {
      if(data){
        await reportSetupStore.fetchReportColumnAssessment()
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => reportSetupStore.reportColumnAssessmentListResponse,
    async (data) => {
      if(data){
        reportColumnAssessmentList.value = data.data
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

watch (
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data && data.data){
        assessmentMetricList.value = data.data
      }
    }
)

</script>

<template>
  <div>


    <AppModal v-model="showReportColumn" title="Add Report Column Assessment" lg>
      <new-report-columns-assessment></new-report-columns-assessment>
    </AppModal>


    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Report Column Assessment</div>
          <button
              type="button"
              class="btn btn-sm buttonStyle btn-primary mr-2"
              @click="addReportColumn">
                <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                Add Column Assessment
          </button>
        </div>


        <div class="grid grid-cols-6 gap-2 px-2 mt-4">
          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="campus_level_number"
                @change="fetchAcademicYear(campus_level_number)"
            >
              <option disabled value="">--Filter by Level--</option>
              <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>


          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="academic_year_number"
                @change="fetchStudyPeriod(academic_year_number)"
            >
              <option disabled value="">--Filter by Class--</option>
              <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                {{list.code+". "+list.academic_year_name}}
              </option>
            </select>
          </div>


          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="study_period_number"
                @change="fetchAssessmentMetrics"
            >
              <option disabled value="">Filter by Study Period</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

            </select>
          </div>


          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="campus_class_number"
                @change="fetchAssessmentArea(campus_class_number)"
            >
              <option disabled value="">Filter by Class</option>
              <!--          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>-->
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.curriculum_class_number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>




          <div class="mb-2">
            <select
                required
                class="form-select form-select-sm shadow-none"
                v-model="assessment_area_number"
                @change="fetchAssessmentMetrics"
            >
              <option disabled value=""> --Filter by Assessment Area-- </option>
              <option v-for="(listdata, index) in interviewAssessmentListData" :key="index" :value="listdata.number">
                {{ listdata.name}}
              </option>
            </select>
          </div>


          <div class="mb-2">
            <select
                class="form-select form-select-sm shadow-none"
                v-model="assessment_metric_number"
                @change="doFetchReportColumnAssessment"
               >
              <option disabled value="">--Filter by Assessment Metric--</option>
              <option v-for="(list, index) in assessmentMetricList" :key="index" :value="list.number">
                {{list.description + " [ " +list.name + " ] " + " ( "+ list.assessment_area_name +" ) "}}</option>
            </select>
          </div>

        </div>





        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">Code</th>
            <th scope="col">Assessment Area</th>
            <th scope="col">Assessment Metric</th>
            <th scope="col">Report Column</th>
            <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in reportColumnAssessmentList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.assessment_area}}</td>
            <td> {{levelInfo.assessment_metric}}</td>
            <td> {{levelInfo.report_column}}</td>
            <td>
              <div>
                <i
                    style="font-size: 13px;"
                    data-bs-toggle="modal" data-bs-target="#levelModal"
                    class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
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