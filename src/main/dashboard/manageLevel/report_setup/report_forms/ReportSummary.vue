<script setup>

import {onMounted, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import AppModal from "@/components/AppModal.vue";
import ManageReportDetails from "@/main/dashboard/manageLevel/report_setup/report_forms/ManageReportDetails.vue";

const reportSetupStore = useReportSetupStore()
const reportStore = useReportCardStore()
const reportSummaryList = ref(null)
const showStudentsMarks = ref(false)

onMounted(
    async () => {
      await reportStore.fetchReportSummary()
    }
)

const showStudentReport = (summary) => {
  if(summary) {
    showStudentsMarks.value = true
    reportStore.fetchReportDetailsInfo(summary.number)
  }
}

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








    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Student Report Summary</div>
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
            <td> {{summary.student_name}}</td>
            <td> {{summary.grade}}</td>
            <td>
              <div>


                <button
                    @click="showStudentReport(summary)"
                    type="button"
                    class="bg-[#1062da] text-white rounded-sm px-3 py-1 text-[12px]">
                 View Details
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>


    <AppModal title="Preview Report" v-model="showStudentsMarks" xl6>
      <manage-report-details></manage-report-details>
    </AppModal>



  </div>
</template>

<style scoped>

</style>