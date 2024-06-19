<script setup>

import NewReportSettings from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportSettings.vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";

const routerData = useRouter()
const notificationStore  = useNotificationStore()
const reportSetupStore = useReportSetupStore()
const studyPeriodStore = useStudyPeriodStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()


const campus_curriculum_number = routerData.currentRoute.value.query.crr




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


onMounted(
    async () => {

      fetchCampusLevel()
      await doFetchReportSettings()
    }
)

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


// -------


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


const editThisData = (List) => {
  editModel.value = true
  reportSettingsD.value = List
  namee.value = List.name
  showReportSettingsModal.value = true
}

const deleteThisData = (id,name) => {
  if(!confirm("Are you sure, you want to delete: " + name)){
    return
  }else{

  }

}



const addReportSettings = () => {
  showReportSettingsModal.value = true
}





</script>

<template>

  <div>

    <AppModal :title="editModel ? 'Edit ' + namee:'Add Settings'"  v-model="showReportSettingsModal" lg>
      <new-report-settings :reportSettingsD="reportSettingsD"></new-report-settings>
    </AppModal>



    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Report Settings</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addReportSettings">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Add Settings
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
                class="form-select form-select-sm shadow-none" required
                v-model="campus_class_number"
                @change="doFetchReportSettings()"
            >
              <option disabled value="">--Filter by Class--</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>

          <div class="mb-2">
            <select
                class="form-select form-select-sm shadow-none"
                v-model="academic_year_number"
                @change="fetchStudyPeriod(academic_year_number)"
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
                v-model="study_period_number"
                @change="doFetchReportSettings()"
            >
              <option disabled value="">--Filter by Study Period--</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>

            </select>
          </div>

        </div>



        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">Code</th>
            <th>Class</th>
            <th>Academic Year</th>
            <th>Study Period</th>
<!--            <th>Name</th>-->
            <th>Number of Columns</th>
            <th>Status</th>
            <th>#</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in reportSettingsList" :key="index">
            <td class="text-sm"> {{levelInfo.code}}</td>
            <td class="text-sm"> {{levelInfo.class}}</td>
            <td class="text-sm"> {{levelInfo.academic_year}}</td>
            <td class="text-sm"> {{levelInfo.study_period}}</td>
<!--            <td class="text-sm"> {{levelInfo.name}}</td>-->
            <td class="text-sm"> {{levelInfo.columns}}</td>
            <td class="text-sm"> {{levelInfo.status}}</td>
            <td>
              <button  class="link-primary" style="border-width: 0px;text-decoration: none;" @click="editThisData(levelInfo)"><small><i  style="font-size: 13px;color:rgb(5, 32, 171)" class="bi-pencil mr-2 cursor-pointer"></i></small></button>
              <button @click="deleteThisData(levelInfo.number,levelInfo.columns)"><i style="font-size: 13px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer"></i></button>
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