<script setup>

import ReportSettings from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportSettings.vue";
import {useRouter} from "vue-router";
const routerData = useRouter()
let reportSettingsQuery = routerData.currentRoute.value.query.rp

</script>

<template>
<div>
  <report-settings v-if="reportSettingsQuery === 'student-score'"></report-settings>
</div>
</template>

<style scoped>

</style>