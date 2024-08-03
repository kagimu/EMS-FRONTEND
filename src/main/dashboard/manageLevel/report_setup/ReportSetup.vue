<script setup>

import ReportSettings from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportSettings.vue";
import ReportColumns from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportColumns.vue";
import ReportColumnsAssessment
  from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportColumnsAssessment.vue";
import ReportSummary from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportSummary.vue";
import ReportScore from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportScore.vue";
import ReportScoreSummary from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportScoreSummary.vue";
import ReportTemplates from "@/main/dashboard/manageLevel/report_setup/reportTemplate/ReportTemplates.vue";
import TeacherComment from "@/main/dashboard/manageLevel/report_setup/comments/TeacherComment.vue";


import {useRouter} from "vue-router";
import router from "@/config/router.js";
import {ref} from "vue";


const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr



const selectedPage = routerData.currentRoute.value.query.type
const selectedTab = routerData.currentRoute.value.query.tab ?? 'report-setting'

const switchTabs = (tab) => {
  router.push({name: "campus-curriculum-setup", query: {id:campusNumber,sch:schoolNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:selectedPage,tab:tab}});
}


const reportSettingsMenu = ref([
  {
    name:"HeadTeacher Comments",
    router_name:"teachers-comments"
  },
])


</script>

<template>
<div>


  <div class="flex border-b">

    <div class="cursor-pointer text-sm" :class="selectedTab === 'report-setting' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('report-setting')">
      <div class="py-2 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        General report settings
      </div>
    </div>

    <div class="cursor-pointer text-sm" :class="selectedTab === 'report-columns-assessment' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('report-columns-assessment')">
      <div class="py-2 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Report Columns Assessment
      </div>
    </div>

    <div class="cursor-pointer text-sm" :class="selectedTab === 'report-templates' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('report-templates')">
      <div class="py-2 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Report Templates
      </div>
    </div>

    <div class="cursor-pointer text-sm" :class="selectedTab === 'teachers-comments' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('teachers-comments')">
      <div class="py-2 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
         HeadTeacher Comments
      </div>
    </div>



  </div>


  <report-settings v-if="selectedTab === 'report-setting'"></report-settings>
  <report-columns v-if="selectedTab === 'report-columns'"></report-columns>
  <report-columns-assessment v-if="selectedTab === 'report-columns-assessment'"></report-columns-assessment>
  <report-summary v-if="selectedTab === 'report-card'"></report-summary>
  <report-score v-if="selectedTab === 'report-score'"></report-score>
  <report-score-summary v-if="selectedTab === 'report-score-summary'"></report-score-summary>
  <report-templates v-if="selectedTab === 'report-templates'"></report-templates>
  <teacher-comment v-if="selectedTab === 'teachers-comments'"></teacher-comment>

</div>
</template>

<style scoped>

</style>