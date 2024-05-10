<script setup>

import {ref, watch} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import BabyClassReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/BabyClassReport.vue";
import PrimaryReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/PrimaryReport.vue";
import TopClassReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/TopClassReport.vue";
import VictoriousReportPrimary from "@/main/dashboard/ReportCenter/victorious/VictoriousReportPrimary.vue";
const reportStore = useReportCardStore()

const reportDetails = ref(null)
// const showReport = ref(false)

watch(
    () => reportStore.reportDetailsResponse,
    async (data) => {
      if(data){
         reportDetails.value = data.data
      }
    }
)

</script>

<template>
<div>

  <div v-if="reportDetails?.report_template_name === 'noregrets-early-learning-report-one'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <baby-class-report></baby-class-report>
    <br />
  </div>


  <div v-if="reportDetails?.report_template_name === 'noregrets-early-learning-report-two'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <top-class-report></top-class-report>
    <br />
  </div>

  <div v-if="reportDetails?.report_template_name === 'noregrets-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <primary-report :reportDetails="reportDetails"></primary-report>
  </div>

  <div v-if="reportDetails?.report_template_name === 'victorious-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <victorious-report-primary></victorious-report-primary>
  </div>


</div>
</template>

<style scoped>

</style>