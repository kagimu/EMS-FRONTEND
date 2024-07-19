<script setup>

import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewAssessmentAreaGradingStandard from "@/main/dashboard/assessment/NewAssessmentAreaGradingStandard.vue";
import AppModal from "@/components/AppModal.vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const reportSetupStore = useReportSetupStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const routerData = useRouter()
const notificationStore  = useNotificationStore()
const assessmentStore= useAssessmentStore()
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusNumber = routerData.currentRoute.value.query.id
const assessmentAreaGradingStandardList = ref(null)
const showAssessmentGradingModal = ref(false)
const campus_level_number = ref("")
let   schoolNumber = routerData.currentRoute.value.query.sch
const campusLevelList = ref(null)
const campusClassList = ref(null)
const campus_class_number = ref("")
const gradingStandardListData = ref(null)
const grading_standard_number = ref("")
const deletionLoader = ref(undefined)


onMounted(
    async () => {
       doFetchAssessmentAreaGradingStandard()
      await classStore.fetchCampusLevel(campus_curriculum_number)
    }
)

const doFetchAssessmentAreaGradingStandard = () => {
  reportSetupStore.fetchAssessmentAreaGradingStandardInfo(grading_standard_number.value ?? "", schoolNumber)
}

watch(
    () => reportSetupStore.reportSettingsResponse,
    async (data) => {
      if(data){
        await reportSetupStore.fetchReportSettings()
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => reportSetupStore.assessmentAreaGradingStandardInfoResponse,
    async (data) => {
      if(data){
        assessmentAreaGradingStandardList.value = data.data
      }
    }
)


watch(
    () => reportSetupStore.assessmentAreaGradingStandardResponse,
    async (data) => {
      if(data){
        showAssessmentGradingModal.value = false
        await reportSetupStore.fetchAssessmentAreaGradingStandardInfo()
        notificationStore.successToast("Success",data.message)
      }
    }
)

const addAssessmentAreaGradingStandard = () =>{
  showAssessmentGradingModal.value = true
}

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)


const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}

watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)

const fetchGradingStandard = () =>{
  if(campus_class_number.value) {
    let data = {
      campus_number:campusNumber,
      campus_class_number:campus_class_number.value
    }
    assessmentStore.fetchGradingStandardData(data)
  }
}

watch(
    () => assessmentStore.gradingStandardResponse,
    async (data) => {
      if(data){
        gradingStandardListData.value = data.data
      }
    }
)

const deleteAssessmentArea = (data, index) => {
  if(!confirm("Are you sure, you want to delete this assessment area grading standard")){
    return
  }

  deletionLoader.value = index

  assessmentStore.deleteAssessmentAreaGradingStandard(data.number)
}

watch(
    () => assessmentStore.deleteAssessmentAreaGradingStandardResponse,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => assessmentStore.errorMessage,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
        notificationStore.errorToast("Error", data.message)
      }
    }
)




</script>

<template>

  <div>

    <AppModal title="Attach Assessment Area to Grading Standard" v-model="showAssessmentGradingModal" lg>
      <new-assessment-area-grading-standard></new-assessment-area-grading-standard>
    </AppModal>

    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Assessment Area On Grading Standard</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addAssessmentAreaGradingStandard">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Standard
          </button>
        </div>


        <div class="mt-[50px]">
          <div class="grid grid-cols-3 gap-2 px-2">


            <div class="mb-2">
              <div>
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
            </div>


            <div class="mb-2">
              <div>
                <label class="textColor"><small>Class</small>
                </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="campus_class_number"
                    @change="fetchGradingStandard"
                >
                  <option disabled value="">--Select Class --</option>
                  <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
                </select>
              </div>
            </div>


            <div class="mb-2">
              <div>
                <label class="textColor"><small>Grading Standards</small></label>
                <select
                    class="form-control form-select form-control-sm shadow-none"
                    v-model="grading_standard_number"
                    @change="doFetchAssessmentAreaGradingStandard"
                    aria-label="Default select example">
                  <option disabled value="">--Select Grading Standard--</option>
                  <option value="">All</option>
                  <option v-for="(lst, index) in gradingStandardListData" :key="index" :value="lst.number">
                    {{ lst.code +". "+ lst.name}}
                  </option>
                </select>
              </div>
            </div>

          </div>
        </div>


        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">Code</th>
            <th>Name</th>
            <th>Grading Standard Name</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in assessmentAreaGradingStandardList" :key="index">
            <td> {{levelInfo?.code}}</td>
            <td> {{levelInfo?.assessment_area_name}}</td>
            <td> {{levelInfo?.grading_standard_name}}</td>
            <td>

              <button type="button" @click="deleteAssessmentArea(levelInfo, index)">
                <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
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