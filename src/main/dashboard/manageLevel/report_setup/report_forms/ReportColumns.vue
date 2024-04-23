<script setup>

import NewReportColumn from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportColumn.vue";
import {onMounted, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useRouter} from "vue-router";

const reportSetupStore = useReportSetupStore()
const  notificationStore  = useNotificationStore()
const routerData = useRouter()

const reportColumnList = ref(null)
const showReportColumnsModal = ref(false)
const campusNumber = routerData.currentRoute.value.query.id

onMounted(
    async () => {
      await reportSetupStore.fetchReportColumn(campusNumber)
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