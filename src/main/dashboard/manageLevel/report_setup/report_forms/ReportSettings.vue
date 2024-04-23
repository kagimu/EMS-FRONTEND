<script setup>

import NewReportSettings from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportSettings.vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";

const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const reportSettingsList = ref(null)
const showReportSettingsModal = ref(false)


onMounted(
    async () => {
      await reportSetupStore.fetchReportSettings()
    }
)


watch(
    () => reportSetupStore.reportSettingsResponse,
    async (data) => {
      if(data){
        showReportSettingsModal.value = false
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



const addReportSettings = () => {
  showReportSettingsModal.value = true
}





</script>

<template>

  <div>

    <AppModal title="Add Settings" v-model="showReportSettingsModal" lg>
      <new-report-settings></new-report-settings>
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