<script setup>

import {useRouter} from "vue-router";
import StudentScore from "@/main/dashboard/manageLevel/report_setup/report_forms/StudentScore.vue";
import GenerateReport from "@/main/dashboard/report-card/GenerateReport.vue";
const routerData = useRouter()
let reportSettingsQuery = routerData.currentRoute.value.query.rp

</script>

<template>
<div>
  <student-score v-if="reportSettingsQuery === 'student-score'"></student-score>
  <generate-report v-if="reportSettingsQuery === 'generate-report'"></generate-report>
</div>
</template>

<style scoped>

</style>