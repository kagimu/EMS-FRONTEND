<script setup>

import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewAssessmentAreaGradingStandard from "@/main/dashboard/assessment/NewAssessmentAreaGradingStandard.vue";
import AppModal from "@/components/AppModal.vue";

const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const assessmentAreaGradingStandardList = ref(null)
const showAssessmentGradingModal = ref(false)


onMounted(
    async () => {
      await reportSetupStore.fetchAssessmentAreaGradingStandardInfo()
    }
)


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




        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">Code</th>
            <th>Name</th>
            <th>Number of Columns</th>
            <!--            <th scope="col">Action</th>-->
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in assessmentAreaGradingStandardList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.assessment_area_name}}</td>
            <td> {{levelInfo.grading_standard_name}}</td>
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