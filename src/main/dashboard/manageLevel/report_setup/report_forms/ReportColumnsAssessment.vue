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
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import useCommonsStore from "@/composables/useCommons.js";

const confirmationRef = ref(null);
const campusStore = useCampusStore()
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const reportSetupStore = useReportSetupStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const studyPeriodStore = useStudyPeriodStore()
const assessmentStore= useAssessmentStore()
const schoolN = routerData.currentRoute.value.query.sch
let  curriculumNumberParent = routerData.currentRoute.value.query.cr
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const useCommon = useCommonsStore()


const reportColumnAssessmentList = ref(null)
const deletionLoader = ref(undefined)

const showReportColumn = ref(false)
const campusLevelList = ref(null)
const campusClassList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref(null)
const assessmentMetricList = ref(null)
const interviewAssessmentListData = ref(null)
const reportColumnList = ref([])
const reportSettingsList = ref([])
const campus_level_number  = ref("")
const academic_year_number  = ref("")
const study_period_number  = ref("")
const class_number  = ref("")
const assessment_area_number  = ref("")
const assessment_metric_number  = ref("")
const report_setting_number  = ref("")
const report_column_number  = ref("")
const reportColumnAssData = ref([])


onMounted(
    async () => {
      fetchCampusLevel()
    }
)

const doFetchReportColumnAssessment = () => {
  let data = {
    academic_year_number:academic_year_number.value,
    study_period_number:study_period_number.value,
    class_number:class_number.value,
    assessment_area_number:assessment_area_number.value,
    assessment_metric_number:assessment_metric_number.value,
    report_setting_number:report_setting_number.value,
    report_column_number:report_column_number.value,
    campus_number:campusNumber,
    campus_curriculum_number:campus_curriculum_number

  }
  reportSetupStore.fetchReportColumnAssessment(data)
}



const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const addReportColumn = () => {
  reportColumnAssData.value = ""
  showReportColumn.value = true
}


const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  // academicYearStore.fetchCampusClassByLevel(campus_level_number)

  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)

}


const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)

  // fetch report column assessment
  doFetchReportColumnAssessment()
}

const fetchAssessmentMetricsBystudyPeriod = (studyPeriod) =>{

    let data = {
      study_period_number:studyPeriod,
      assessment_area_number:assessment_area_number.value,
      class_number:class_number.value,
      campus_number:campusNumber,
      campus_curriculum_number:campus_curriculum_number
    }
    assessmentStore.fetchAssessmentMetrics(data)


    // fetch report column assessment
    doFetchReportColumnAssessment()

}


const fetchAssessmentMetricsByAssessArea = (Area) =>{

let data = {
  study_period_number:study_period_number.value,
  assessment_area_number:Area,
  class_number:class_number.value,
  campus_number:campusNumber,
  campus_curriculum_number:campus_curriculum_number
}
assessmentStore.fetchAssessmentMetrics(data)


// fetch report column assessment
doFetchReportColumnAssessment()

}


const fetchAssessmentArea = (class_number) =>{

    doFetchReportSettings(class_number)
    doFetchReportColumnAssessment()
    // fetch report column assessment
    // doFetchReportColumnAssessment()

    let data = {
 curriculum_number:curriculumNumberParent,
 class_number:class_number
}
assessmentStore.fetchAssessmentArea(data)

studyPeriodStore.fetchStudyPeriod(
   {
     campus_curriculum_number:campus_curriculum_number,
     academic_year_number:academic_year_number.value,
     class_number:class_number,
     school_number:schoolN
   } 
  )
  
}




const doFetchReportColumns = async () => {
  await reportSetupStore.fetchReportColumn(report_setting_number.value)

  // fetch report column assessment
  doFetchReportColumnAssessment()
}

watch(
    () => reportSetupStore.reportColumnListResponse,
    async (data) => {
      if(data){
        reportColumnList.value = data.data
      }
    }
)

const doFetchReportSettings = async (class_number) => {
  let data = {
    academic_year_number:"",
    study_period_number:"",
    class_number:class_number,
    campus_number:campusNumber

  }
  await reportSetupStore.fetchReportSettings(data)
}

watch(
    () => reportSetupStore.reportSettingsListResponse,
    async (data) => {
      if(data){
        reportSettingsList.value = data.data
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

watch(
    () => reportSetupStore.reportColumnAssessmentResponse,
    async (data) => {
      if(data){
        showReportColumn.value = false
        doFetchReportColumnAssessment()
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
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)


watch(
    () => studyPeriodStore.studyPeriodResponse,
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



const deleteThisData = async (column, index) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete this report column assessment?");
  if (agreed) {
    deletionLoader.value = index
    await reportSetupStore.deleteReportColumnAssessment(column.number)
  }
}



watch(
    () => reportSetupStore.deleteReportColumnAssessmentResponse,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
        doFetchReportColumnAssessment()
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
        notificationStore.errorToast("Error", data.message)
      }
    }
)

const closeDialog = () => {
  showReportColumn.value = false
}


const showEditModal = (data) => {

    reportColumnAssData.value = {
    report_column_assessment_number:data.number,
    study_period_number:study_period_number.value,
    academic_year_number:academic_year_number.value,
    class_number:class_number,
    campus_level_number:campus_level_number.value,
    assessment_area_number:assessment_area_number.value,
    report_setting_number:report_setting_number.value,
    report_column_number:report_column_number.value,
    assessment_metric_number:assessment_metric_number.value
  }

  showReportColumn.value = true

}

</script>

<template>
  <div>
    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal v-model="showReportColumn" title="Add Report Column Assessment" xl4>
      <new-report-columns-assessment @closeDialog="closeDialog" :reportColumnAssData="reportColumnAssData"></new-report-columns-assessment>
    </AppModal>


    <!-- {{reportColumnAssessmentList  }} -->
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
            >
              <option disabled value="">--Filter by Academic Year--</option>
              <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                {{list.code+". "+list.academic_year_name}}
              </option>
            </select>
          </div>



          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="class_number"
                @change="fetchAssessmentArea(class_number)"
            >
              <option disabled value="">Filter by Class</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>



          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="report_setting_number"
                @change="doFetchReportColumns()"
            >
              <option disabled value="">--Filter by report Settings--</option>
              <option v-for="(list, index) in reportSettingsList" :key="index" :value="list.report_setting_number">{{list.name}}</option>
            </select>
          </div>

          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="report_column_number"
                @change="doFetchReportColumnAssessment()"
            >
              <option disabled value="">--Filter by Report Column--</option>
              <option v-for="(list, index) in reportColumnList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>

          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="study_period_number"
                @change="fetchAssessmentMetricsBystudyPeriod(study_period_number)"
            >
              <option disabled value="">Filter by Study Period</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

            </select>
          </div>


          <div class="mb-2">
            <select
                required
                class="form-select form-select-sm shadow-none"
                v-model="assessment_area_number"
                @change="fetchAssessmentMetricsByAssessArea(assessment_area_number)"
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
              <option disabled value="">--Filter by Assessment Schedule--</option>
              <option v-for="(list, index) in assessmentMetricList" :key="index" :value="list.number">
               {{list.description + " [ " +list.metric_name + " ] " + " ( "+ list.assessment_area +" ) "}}</option>
            </select>
          </div>

        </div>





        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[5%]" scope="col">#</th>
            <th scope="col">Assessment Area</th>
            <th scope="col">Assessment Schedule</th>
            <th scope="col">Scheduled On</th>
            <th scope="col">Report Column</th>
            <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(column, index) in reportColumnAssessmentList" :key="index">
            <td> {{index+1}}</td>
            <td> {{column.assessment_area}}</td>
            <td> {{column.assessment_metric}} - {{ column.academic_year }} - {{ column.study_period }}</td>
            <td>{{ useCommon.wellFormatedDate(column.scheduled_on) }}</td>
            <td> {{column.report_column}}</td>
            <td>
              <button @click="showEditModal(column, index)">
                <b><i style="color:rgb(3, 85, 148)" class="bi bi-pencil-square mr-2"></i></b>
              </button>
              <button @click="deleteThisData(column, index)">
                <i style="font-size: 12px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </button>
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