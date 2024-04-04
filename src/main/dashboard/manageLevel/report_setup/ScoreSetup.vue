<script setup>

import {useRouter} from "vue-router";
import StudentScore from "@/main/dashboard/manageLevel/report_setup/report_forms/StudentScore.vue";
const routerData = useRouter()
let reportSettingsQuery = routerData.currentRoute.value.query.rp

</script>

<template>
<div>
  <student-score v-if="reportSettingsQuery === 'student-score'"></student-score>
</div>
</template>

<style scoped>

</style>