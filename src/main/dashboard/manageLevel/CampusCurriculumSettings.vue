<script setup>

import {useRouter} from "vue-router";
import StudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/StudyPeriod.vue";
import AcademicYear from "@/main/dashboard/manageLevel/academicYear/AcademicYear.vue";
import CampusLevel from "@/main/dashboard/manageLevel/class/CampusLevel.vue";
import ClassList from "@/main/dashboard/manageLevel/class/ClassList.vue";
import StudyPeriodGroup from "@/main/dashboard/manageLevel/studyPeriod/StudyPeriodGroup.vue";
import router from "@/config/router.js";
const routerData = useRouter()

const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr



const selectedPage = routerData.currentRoute.value.query.type
const selectedTab = routerData.currentRoute.value.query.tab ?? 'campus-level'

const switchTabs = (tab) => {
   router.push({name: "campus-curriculum-setup", query: {id:campusNumber,sch:schoolNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:selectedPage,tab:tab}});
}

</script>
<template>
  <div>


    <div class="flex border-b mt-1">
      <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'campus-level' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('campus-level')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Levels
        </div>
      </div>
      <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'class-data' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('class-data')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
           Classes
        </div>
      </div>
      <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'academic-year' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('academic-year')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Academic Years
        </div>
      </div>

      <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'study-period-group' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('study-period-group')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Study Period Group Names
        </div>
      </div>

      <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'study-period' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('study-period')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Study Periods
        </div>
      </div>
    </div>


    <div class="card-body" style="padding: 0;">
      <div>
        <div v-if="selectedTab === 'campus-level'">
          <campus-level></campus-level>
        </div>

        <div v-if="selectedTab === 'class-data'">
          <class-list></class-list>
        </div>

        <div v-if="selectedTab === 'academic-year'">
          <academic-year></academic-year>
        </div>

        <div v-if="selectedTab === 'study-period'">
          <study-period></study-period>
        </div>
        <div v-if="selectedTab === 'study-period-group'">
          <study-period-group></study-period-group>
        </div>



      </div>

    </div>





















  </div>
</template>



<style scoped>

input:focus {
  box-shadow: none;
}


</style>