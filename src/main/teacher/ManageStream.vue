<script setup>

import router from "@/config/router.js";
import {useRouter} from "vue-router";
import Students from "@/main/teacher/students/Students.vue";
import StudentAssessment from "@/main/teacher/students/StudentAssessment.vue";
import { useAbility } from '@casl/vue';
const { can } = useAbility()
const routerData = useRouter()
const selectedTab = routerData.currentRoute.value.query.tab ?? 'students'
 
const switchTabs = (tab) => {
  router.push({name: "manage-stream", query: {id:routerData.currentRoute.value.query.id,ccl:routerData.currentRoute.value.query.ccl,tab:tab}});
}


</script>

<template>
  <div>
    <div class="bg-white border rounded-md py-3 px-2 mt-4">

  <div class="flex border-b mt-1">
    <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'students' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('students')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
       Students 
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === '' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('assessment')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Class Schedule/Timetable
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === '' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('assessment')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Class Attendance
      </div>
    </div>
  </div>

  <div v-if="selectedTab === 'students'">
   <Students></Students>
  </div>
  <div v-if="selectedTab === 'assessment'">
    <StudentAssessment></StudentAssessment>
  </div>


</div>
  </div>
</template>

<style scoped>

</style>