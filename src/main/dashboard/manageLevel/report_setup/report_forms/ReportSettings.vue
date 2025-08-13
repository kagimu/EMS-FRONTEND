<script setup>

import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import SetReportColumns from "@/main/dashboard/manageLevel/report_setup/report_forms/SetReportColumns.vue";
import NewReportSettings from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportSettings.vue";
import ViewReportColumns from "@/main/dashboard/manageLevel/report_setup/report_forms/ViewReportColumns.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import SetReportSubjectGroup from "@/main/dashboard/manageLevel/report_setup/report_forms/SetReportSubjectGroup.vue";
const confirmationRef = ref(null);

const campusStore = useCampusStore()
const routerData = useRouter()
const notificationStore  = useNotificationStore()
const reportSetupStore = useReportSetupStore()
const studyPeriodStore = useStudyPeriodStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()


const campus_curriculum_number = routerData.currentRoute.value.query.crr
const schoolN = routerData.currentRoute.value.query.sch

const campusNumber = routerData.currentRoute.value.query.id


const reportSettingsList = ref(null)
const showReportSettingsModal = ref(false)

const campusLevelList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const campusClassList = ref([])


const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const campus_class_number = ref("")

const namee = ref(null)
const reportSettingsD = ref([])
const editModel = ref(false)
const openSetColumn = ref(false)
const reportSettingNumber = ref(null)
const reportColumns = ref(null)
const viewColumnsModal = ref(false)
const reportSettingNum = ref(null)
const deletionLoader = ref(undefined)
const viewReportSubjectGroupModal = ref(false)

const setReportColumn = (number,column) =>{
  reportSettingNumber.value = number
  reportColumns.value = column
  openSetColumn.value = true
}

onMounted(
    async () => {
      fetchCampusLevel()
      // await doFetchReportSettings()
    }
)

 const doFetchReportSettings = async () => {
  let data = {
     academic_year_number:academic_year_number.value,
     study_period_number:study_period_number.value,
     class_number:campus_class_number.value,
     campus_number:campusNumber
  }
   await reportSetupStore.fetchReportSettings(data)
 }


 const getStudyPeriods =  (campus_class_number) => {
   studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:academic_year_number.value,
        class_number:campus_class_number,
        school_number:schoolN
      }
  )

  doFetchReportSettings()

 }

 const addReportSettings = () => {
  reportSettingsD.value = ""
  editModel.value = false
  showReportSettingsModal.value = true
}

const editThisData = (List) => {
  editModel.value = true
  reportSettingsD.value = List
  namee.value = List.name
  showReportSettingsModal.value = true
}

const viewReportColumn = (number) =>{
  // alert(number)
  reportSettingNum.value = number
  viewColumnsModal.value = true
}


const deleteThisData = async (settings, index) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete Assessment Schedule ? ");
if (agreed) {
  deletionLoader.value = index
  await reportSetupStore.deleteReportSettings(settings.report_setting_number)
}
}


watch (
    () => reportSetupStore.deleteReportSettingsResponse,
    async (data) => {
      if (data) {
        await doFetchReportSettings()
        deletionLoader.value = undefined
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


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)

  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)

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
  () => reportSetupStore.reportColumnResponse,
  async (data) => {
    if (data) {
   openSetColumn.value=false
    }
  }
)


watch (
    () => reportSetupStore.reportSettingsUpdateResponse,
    async (data) => {
      if (data) {
        showReportSettingsModal.value = false
        await doFetchReportSettings()

      }
    }
)

watch(
    () => reportSetupStore.deleteReportColumnResponse,
    async (data) => {
      if(data) {
      
        doFetchReportSettings()
        
      }
    }
)

const setSubjectReportGroups = (reportSettingNumber) => {
  viewReportSubjectGroupModal.value = true
  reportSettingNum.value = reportSettingNumber
}

</script>

<template>

  <div>
    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editModel ? 'Edit ' + namee:'Add Report General Settings'"  v-model="showReportSettingsModal" lg>
      <NewReportSettings :reportSettingsD="reportSettingsD"></NewReportSettings>
    </AppModal>

    <AppModal title="Set ReportColums"  v-model="openSetColumn" lg>
      <SetReportColumns :reportSettingNumber="reportSettingNumber" :reportColumns="reportColumns"></SetReportColumns>
    </AppModal>

    <AppModal title="Report Columns"  v-model="viewColumnsModal" xl4>
    <viewReportColumns :reportSettingNum="reportSettingNum"></viewReportColumns>
    </AppModal>

    <AppModal title="Report Subject Group"  v-model="viewReportSubjectGroupModal" xl4>
      <SetReportSubjectGroup :reportSettingNum="reportSettingNum"></SetReportSubjectGroup>
    </AppModal>

    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">General Report Settings</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addReportSettings">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Add General Report Settings
          </button>
        </div>


        <div class="grid grid-cols-4 gap-2 px-2 mt-4">
          <div class="mb-2">
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_level_number"
                @change="fetchAcademicYear(campus_level_number)"
            >
              <option disabled value="">--Filter by Level--</option>
              <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>

          <div class="mb-2">
            <select
                class="form-select form-select-sm shadow-none"
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
                class="form-select form-select-sm shadow-none" required
                v-model="campus_class_number"
                @change="getStudyPeriods(campus_class_number)"
            >
              <option disabled value="">--Filter by Class--</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>

       


          <div class="mb-2">
            <!-- {{ studyPeriodList }} -->
            <select
                class="form-select form-select-sm shadow-none" required
                v-model="study_period_number"
                @change="doFetchReportSettings()"
            >
              <option disabled value="">--Filter by Study Period--</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

            </select>
          </div>

        </div>



        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[5%] text-xs" scope="col">Code</th>
            <th class="text-xs">Class</th>
            <th class="text-xs">Academic Year</th>
            <th class="text-xs">Study Period</th>
            <th class="text-xs w-[20%]">Number of Columns</th>
            <th class="text-xs">Status</th>
            <th class="text-xs">ACTION</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(settings, index) in reportSettingsList" :key="index">
            <td class="text-xs"> {{settings.code}}</td>
            <td class="text-xs"> {{settings.class}}</td>
            <td class="text-xs"> {{settings.academic_year}}</td>
            <td class="text-xs"> {{settings.study_period}}</td>
            <td class="text-xs"> {{settings.columns}}</td>
            <td class="text-xs"> {{settings.status}}</td>
            <td>

             <div class="mb-1">
              <button
                   style="border: 1px solid #2c2f8c;"
                   class="mr-2 rounded-md px-3 text-[#2c2f8c] hover:bg-primary-100 text-xs"
                   @click="editThisData(settings)">
                 <span>
                   <i  class="bi-pencil cursor-pointer"></i>
                   Update
                 </span>
               </button>

               <button
                   class="mr-2 border border-success rounded-md px-3 text-success hover:bg-success-100 text-xs"
                   style="border-width: 0px;text-decoration: none;"
                   @click="setReportColumn(settings.report_setting_number,settings.columns)">
                 <span>
                   <i  class="bi-columns cursor-pointer"></i>
                   Set Column
                 </span>
               </button>

           
             </div>

             <div>
              <button
                   class="border border-primary rounded-md px-3 text-primary hover:bg-primary-100 text-xs"
                   style="border-width: 0px;text-decoration: none;"
                   @click="viewReportColumn(settings.report_setting_number)">
                 <span>
                   <i  class="bi-eye cursor-pointer"></i>
                   View
                 </span>
               </button>
               <button
                   class="mr-2 border border-success rounded-md px-3 text-success hover:bg-success-100 text-xs"
                   style="border-width: 0px;text-decoration: none;"
                   @click="setSubjectReportGroups(settings.report_setting_number)">
                 <span>
                   <i  class="bi-columns cursor-pointer"></i>
                   Set SubjectGroups
                 </span>
               </button>

               <button
                   class="border border-danger rounded-md px-3 text-danger hover:bg-danger-100 text-xs"
                   @click="deleteThisData(settings, index)">
                <span>
                <i class="bi-trash"></i>
                <span>Delete</span>
                </span>
                 <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                   <span class="visually-hidden">Loading...</span>
                 </div>
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