<script setup>
import VictoriousReportPrimary from "@/main/dashboard/ReportCenter/victorious/VictoriousReportPrimary.vue";
import BabyClassReport_ from "@/main/dashboard/ReportCenter/BabyClassReport_.vue";
import TopClassReport_ from "@/main/dashboard/ReportCenter/TopClassReport_.vue";
import PrimaryReport_ from "@/main/dashboard/ReportCenter/PrimaryReport_.vue";

const props = defineProps({
  reportTemplateName:String
})

</script>

<template>
<div>


  <div v-if="reportTemplateName === 'noregrets-early-learning-report-one'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <baby-class-report_></baby-class-report_>
    <br />
  </div>


  <div v-else-if="reportTemplateName === 'noregrets-early-learning-report-two'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <top-class-report_></top-class-report_>
    <br />
  </div>

  <div  v-else-if="reportTemplateName === 'noregrets-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <primary-report_></primary-report_>
  </div>

  <div  v-else-if="reportTemplateName === 'victorious-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <victorious-report-primary></victorious-report-primary>
  </div>

  <div v-else>
     <div class="text-center bg-gray-300 rounded-md py-10">
       No report preview found
     </div>
  </div>

</div>
</template>

<style scoped>

</style>