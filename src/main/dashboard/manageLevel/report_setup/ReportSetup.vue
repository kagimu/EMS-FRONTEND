<script setup>

import ReportSettings from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportSettings.vue";
import ReportColumns from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportColumns.vue";
import ReportColumnsAssessment
  from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportColumnsAssessment.vue";
import ReportSummary from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportSummary.vue";
import ReportScore from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportScore.vue";
import ReportScoreSummary from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportScoreSummary.vue";
import {useRouter} from "vue-router";
const routerData = useRouter()
let reportSettingsQuery = routerData.currentRoute.value.query.rp

</script>

<template>
<div>
  <report-settings v-if="reportSettingsQuery === 'report-setting'"></report-settings>
  <report-columns v-if="reportSettingsQuery === 'report-columns'"></report-columns>
  <report-columns-assessment v-if="reportSettingsQuery === 'report-columns-assessment'"></report-columns-assessment>
  <report-summary v-if="reportSettingsQuery === 'report-card'"></report-summary>
  <report-score v-if="reportSettingsQuery === 'report-score'"></report-score>
  <report-score-summary v-if="reportSettingsQuery === 'report-score-summary'"></report-score-summary>
</div>
</template>

<style scoped>

</style>