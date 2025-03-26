<script setup>

import router from "@/config/router.js";
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
import { useAbility } from '@casl/vue';
import StudentScoreByTeacher from "@/main/dashboard/manageLevel/report_setup/report_forms/StudentScoreByTeacher.vue";
import GenerateReportByTeacher from "@/main/dashboard/report-card/GenerateReportByTeacher.vue";
import ReportSummaryByTeacher from "@/main/dashboard/manageLevel/report_setup/report_forms/ReportSummaryByTeacher.vue";
import AssessmentMetrics from "@/main/dashboard/assessment/assessmentComponents/AssessmentMetrics.vue";

const { can } = useAbility()
const routerData = useRouter()
const selectedTab = routerData.currentRoute.value.query.tab ?? 'enter-marks'
const curriculumStore = useCurriculumStore()
const curriculumList = ref([])
 const curriculumNumber = ref("")
 const curriculum_number = ref(null)
 const showingModal = ref(false)
const switchTabs = (tab) => {
  router.push({name: "manage-assessment", query: {id:routerData.currentRoute.value.query.id,ccl:routerData.currentRoute.value.query.ccl,tab:tab}});
}


onMounted(
    async () => {
      await  curriculumStore.fetchCurriculum()
      if(!curriculum_number.value){
        showingModal.value = true
      }
      curriculumNumber.value = localStorage.getItem("CurriculumNum") || "";
    }
)

watch(
    () => curriculumStore.curriculumDataResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)


watch(curriculumNumber, (newValue) => {
  if (newValue) {
    curriculum_number.value = newValue
    showingModal.value = false
  }
});

</script>

<template>

  <div>
    <div class="bg-white border rounded-md py-3 px-2 mt-3">
  
  <div class="flex border-b mt-1">
    <!-- <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'assessment-schedules' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('assessment-schedules')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
      Assessment Schedules
      </div>
    </div> -->
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'enter-marks' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('enter-marks')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
       Enter Student Scores
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'generate-reports' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('generate-reports')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
       Generate Report
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'report-summary' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('report-summary')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
       Report Summary
      </div>
    </div>
  </div>

  <!-- <div v-if="selectedTab === 'assessment-schedules'">
   <AssessmentMetrics></AssessmentMetrics>
  </div> -->
  <div v-if="selectedTab === 'assessment'">
   
  </div>

  <div v-if=" selectedTab === 'enter-marks'">
              <StudentScoreByTeacher></StudentScoreByTeacher>
                </div>

                <div v-if=" selectedTab === 'generate-reports'">
                 <GenerateReportByTeacher></GenerateReportByTeacher>
                </div>

                <div v-if=" selectedTab === 'report-summary'">
                  <ReportSummaryByTeacher></ReportSummaryByTeacher>
                   </div>
</div>
  </div>
</template>

<style scoped>

</style>