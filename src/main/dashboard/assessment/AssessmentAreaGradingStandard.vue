<script setup>

import NewReportSettings from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportSettings.vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewAssessmentAreaGradingStandard from "@/main/dashboard/assessment/NewAssessmentAreaGradingStandard.vue";

const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const reportSettingsList = ref(null)


onMounted(
    async () => {
      await reportSetupStore.fetchReportSettings()
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




    <div class="modal fade" id="levelModal" tabindex="-1" :class="{ show: levelDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Standard</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-assessment-area-grading-standard></new-assessment-area-grading-standard>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Assessment Area Grading Standard</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addLevel" data-bs-toggle="modal" data-bs-target="#levelModal">
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
            <th>Status</th>
            <!--            <th scope="col">Action</th>-->
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in reportSettingsList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.name}}</td>
            <td> {{levelInfo.columns}}</td>
            <td> {{levelInfo.status}}</td>
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