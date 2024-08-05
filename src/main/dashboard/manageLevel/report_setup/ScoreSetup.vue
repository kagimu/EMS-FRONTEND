<script setup>

import {useRouter} from "vue-router";
import StudentScore from "@/main/dashboard/manageLevel/report_setup/report_forms/StudentScore.vue";
import GenerateReport from "@/main/dashboard/report-card/GenerateReport.vue";
import ReportSummary from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportSummary.vue";
import router from "@/config/router.js";

const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr



const selectedPage = routerData.currentRoute.value.query.type
const selectedTab = routerData.currentRoute.value.query.tab ?? 'student-score'

const switchTabs = (tab) => {
  router.push({name: "campus-curriculum-setup", query: {id:campusNumber,sch:schoolNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:selectedPage,tab:tab}});
}


</script>

<template>
<div>

  <div class="flex border-b mt-1">
    <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'student-score' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('student-score')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Add Score
      </div>
    </div>

    <div class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'generate-report' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('generate-report')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Generate Report
      </div>
    </div>

    <div class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'report-card' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('report-card')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Report Summary
      </div>
    </div>

  </div>


  <student-score v-if="selectedTab === 'student-score'"></student-score>
  <generate-report v-if="selectedTab === 'generate-report'"></generate-report>
  <report-summary v-if="selectedTab === 'report-card'"></report-summary>
</div>
</template>

<style scoped>

</style>