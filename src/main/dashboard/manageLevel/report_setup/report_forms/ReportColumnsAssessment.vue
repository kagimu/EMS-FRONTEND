<script setup>

import NewReportColumnsAssessment
  from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportColumnsAssessment.vue";
import {onMounted, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
const reportSetupStore = useReportSetupStore()
const  notificationStore  = useNotificationStore()
const reportColumnAssessmentList = ref(null)

onMounted(
    async () => {
      await reportSetupStore.fetchReportColumnAssessment()
    }
)



watch(
    () => reportSetupStore.reportColumnAssessmentResponse,
    async (data) => {
      if(data){
        await reportSetupStore.fetchReportColumnAssessment()
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

</script>

<template>
  <div>




    <div class="modal fade" id="levelModal" tabindex="-1" :class="{ show: levelDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2"> Add Report Column Assessment</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-report-columns-assessment></new-report-columns-assessment>
              <!--              <new-level></new-level>-->
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Report Column Assessment</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addLevel" data-bs-toggle="modal" data-bs-target="#levelModal">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Column Assessment
          </button>
        </div>



        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">Code</th>
            <th scope="col">Assessment Area</th>
            <th scope="col">Assessment Metric</th>
            <th scope="col">Report Column</th>
            <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in reportColumnAssessmentList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.assessment_area}}</td>
            <td> {{levelInfo.assessment_metric}}</td>
            <td> {{levelInfo.report_column}}</td>
            <td>
              <div>
                <i
                    style="font-size: 13px;"
                    data-bs-toggle="modal" data-bs-target="#levelModal"
                    class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
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