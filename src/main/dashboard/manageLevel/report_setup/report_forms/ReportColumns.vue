<script setup>

import NewReportColumn from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportColumn.vue";
import {onMounted, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useRouter} from "vue-router";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";

const reportSetupStore = useReportSetupStore()
const  notificationStore  = useNotificationStore()
const routerData = useRouter()

const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()

const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr


const reportColumnList = ref(null)
const showReportColumnsModal = ref(false)


const campus_level_number = ref("")
const campus_class_number = ref("")
const report_setting_number = ref("")

const campusLevelList  = ref([])
const campusClassList  = ref([])
const reportSettingsList  = ref([])



onMounted(
    async () => {
      fetchCampusLevel()
    }
)


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}

const fetchCampusClassNumber = (campus_level_number) => {
  academicYearStore.fetchCampusClassByLevel(campus_level_number)
}


const doFetchReportSettings = async () => {
  let data = {
    academic_year_number:"",
    study_period_number:"",
    campus_class_number:campus_class_number.value
  }
  await reportSetupStore.fetchReportSettings(data)
}

const doFetchReportColumns = async () => {
  await reportSetupStore.fetchReportColumn(report_setting_number.value)
}

watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)

watch(
    () => reportSetupStore.reportColumnResponse,
    async (data) => {
      if(data){
        showReportColumnsModal.value = false
        await reportSetupStore.fetchReportColumn()
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => reportSetupStore.reportColumnListResponse,
    async (data) => {
      if(data){
        reportColumnList.value = data.data
      }
    }
)

const addReportColumn = () => {
  showReportColumnsModal.value = true
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
    () => reportSetupStore.reportSettingsListResponse,
    async (data) => {
      if(data){
        reportSettingsList.value = data.data
      }
    }
)
</script>

<template>
  <div>


    <AppModal title="Add Report Columns" v-model="showReportColumnsModal" lg>
      <new-report-column></new-report-column>
    </AppModal>


    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Report Columns</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addReportColumn">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Column
          </button>
        </div>



        <div class="grid grid-cols-3 gap-2 px-2 mt-4">
          <div class="mb-2">
            <select
                class="form-select form-select-sm shadow-none"
                v-model="campus_level_number"
                @change="fetchCampusClassNumber(campus_level_number)"
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
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="report_setting_number"
                @change="doFetchReportColumns()"
            >
              <option disabled value="">--Filter by report Settings--</option>
              <option v-for="(list, index) in reportSettingsList" :key="index" :value="list.number">{{list.name}}</option>
            </select>
          </div>
        </div>


        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">Code</th>
            <th scope="col">Name</th>
            <th scope="col">Percentage Share (%)</th>
            <th scope="col">Report settings</th>
<!--            <th scope="col">Action</th>-->
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in reportColumnList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.name}}</td>
            <td> {{levelInfo.percentage_share}}</td>
            <td> {{levelInfo.report_setting_name}}</td>
            <td>
<!--              <div>
                <i
                    style="font-size: 13px;"
                    data-bs-toggle="modal" data-bs-target="#levelModal"
                    class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>-->
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