<script setup>

import NewReportSummary from "@/main/dashboard/manageLevel/report_setup/report_forms/rforms/NewReportSummary.vue";
import {onMounted, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import AppModal from "@/components/AppModal.vue";

const reportSetupStore = useReportSetupStore()
const reportStore = useReportCardStore()
const reportSummaryList = ref(null)
const showStudentsMarks = ref(true)

onMounted(
    async () => {
      await reportStore.fetchReportSummary()
    }
)


watch(
    () => reportStore.reportSummaryResponse,
    async (data) => {
      if(data){
       reportSummaryList.value = data.data
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
            <h6 class="modal-title ml-3 mt-2 mb-2"> Add Report Summary</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-report-summary></new-report-summary>
              <!--              <new-level></new-level>-->
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Report Summary</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addLevel" data-bs-toggle="modal" data-bs-target="#levelModal">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add Summary
          </button>
        </div>



        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th scope="col" style="width: 30%;">Code</th>
            <th scope="col">Student Name</th>
            <th scope="col">Grade</th>
            <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(summary, idx) in reportSummaryList" :key="idx">
            <td> {{(idx + 1)}}</td>
            <td> {{summary.StudentName}}</td>
            <td> {{summary.Grade}}</td>
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


    <AppModal title="Abandon Reservation" v-model="showStudentsMarks" xl6>
      This Dialog works for now
    </AppModal>

    

  </div>
</template>

<style scoped>

</style>