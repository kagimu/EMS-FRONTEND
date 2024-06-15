<script setup>

import {onMounted, ref, watch,reactive} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {useRouter} from "vue-router";


const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()
const commons = useCommonsStore()
const routerData = useRouter()
const reportSetupStore = useReportSetupStore()
const studyPeriodStore = useStudyPeriodStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const campus_curriculum_number = routerData.currentRoute.value.query.crr

const reportSettingsList = ref(null)

const campusLevelList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const campusClassList = ref([])

const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const campus_class_number = ref("")


const commentsList = ref(null)
const loader = ref(false)

const form = reactive({
min_aggregate: 0,
max_aggregate : 0,
comment : null,
report_setting_number:""
})

onMounted(
    async () => {
        teacherCommentStore.fetchTeacherComments()
        await doFetchReportSettings()
        fetchCampusLevel()
    }
)

const addComments = () => {
    loader.value = true
//  alert(JSON.stringify(form))
let formData = {
min_aggregate : parseInt(form.min_aggregate),
max_aggregate : parseInt(form.max_aggregate),
comment : form.comment,
report_setting_number : form.report_setting_number
 }
 teacherCommentStore.newTeacherComment(formData)
}

const doFetchReportSettings = async () => {
  let data = {
     academic_year_number:academic_year_number.value,
     study_period_number:study_period_number.value,
     campus_class_number:campus_class_number.value
  }
   await reportSetupStore.fetchReportSettings(data)
 }

const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}


const fetchStudyPeriod = (academic_num) =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_num)
  doFetchReportSettings()
}



watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
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
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)


watch(
    () => reportSetupStore.reportSettingsResponse,
    async (data) => {
      if(data){
        showReportSettingsModal.value = false
        await doFetchReportSettings()
        notificationStore.successToast("Success",data.message)
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
    () => teacherCommentStore.newTeacherCommentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        loader.value=false
      }
    }
)

watch(
    () => teacherCommentStore.teacherCommentResponse,
    async (data) => {
      if(data){
       commentsList.value = data.data
      }
    }
)

watch(
    () => teacherCommentStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
)
</script>

<template>
  <div>
  <form @submit.prevent="addComments">

    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>

<div class="row">
 
          <div class="mb-2">
            <label class="textColor">Level</label>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_level_number"
                @change="fetchAcademicYear(campus_level_number)"
            >
              <option disabled value="">--select--</option>
              <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>

          <div class="mb-2">
            <label class="textColor">Class</label>
            <select
                class="form-select form-select-sm shadow-none" required
                v-model="campus_class_number"
                @change="doFetchReportSettings()"
            >
              <option disabled value="">--select--</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>

          <!-- <div class="mb-2">
            <label class="textColor">Academic Year</label>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="academic_year_number"
                @change="fetchStudyPeriod(academic_year_number)"
            >
              <option disabled value="">--select--</option>
              <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                {{list.code+". "+list.academic_year_name}}
              </option>
            </select>
          </div> -->


          <!-- <div class="mb-2">
            <label class="textColor">Study Period</label>
            <select
                class="form-select form-select-sm shadow-none" required
                v-model="study_period_number"
                @change="doFetchReportSettings()"
            >
              <option disabled value="">--Select--</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

            </select>
          </div> -->

          <div class="mb-2">
            <label class="textColor">ReportSetting</label>
            <select
                class="form-select form-select-sm shadow-none"
                v-model="form.report_setting_number"
            >
              <option disabled value="">--select--</option>
              <option v-for="(list, index) in reportSettingsList" :key="index" :value="list.number">{{list.name}}</option>
            </select>
          </div>

        </div>
   <div class="row">
    <div class="col-6">
        <div class="mb-2">
      <label class="textColor">Minimum Aggregate</label>
      <input
          @keypress="commons.numbersOnlyValidator($event)"
          maxlength="10"
          type="text"
          style="outline: none 0 !important;
               box-shadow: none;"
               v-model="form.min_aggregate"
          required
          class="form-control form-select-sm">
    </div>
    </div>

    <div class="col-6">
        <div class="mb-2">
      <label class="textColor">Maximum Aggregate</label>
      <input
          @keypress="commons.numbersOnlyValidator($event)"
          maxlength="10"
          type="text"
          style="outline: none 0 !important;
               box-shadow: none;"
               v-model="form.max_aggregate"
          required
          class="form-control form-select-sm">
    </div>
    </div>
  </div>

    <div class="mb-2">
      <label class="textColor"><small>Comment</small></label>
    <textarea class="form-control" v-model="form.comment"></textarea>
    </div>


    <div class="flex justify-content-end mt-4" style="width: 100%;">
      <button
          type="submit"
          class="btn btn-primary border-0">
        Submit
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