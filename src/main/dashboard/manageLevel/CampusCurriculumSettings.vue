<script setup>

import {useRouter} from "vue-router";
import StudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/StudyPeriod.vue";
import AcademicYear from "@/main/dashboard/manageLevel/academicYear/AcademicYear.vue";
import CampusLevel from "@/main/dashboard/manageLevel/class/CampusLevel.vue";
import ClassList from "@/main/dashboard/manageLevel/class/ClassList.vue";
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


    <div class="flex border-b">
      <div class="cursor-pointer text-sm" :class="selectedTab === 'campus-level' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('campus-level')">
        <div class="py-2 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Levels
        </div>
      </div>
      <div class="cursor-pointer text-sm" :class="selectedTab === 'class-data' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('class-data')">
        <div class="py-2 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
           Classes
        </div>
      </div>
      <div class="cursor-pointer text-sm" :class="selectedTab === 'academic-year' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('academic-year')">
        <div class="py-2 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Academic Years
        </div>
      </div>

      <div class="cursor-pointer text-sm" :class="selectedTab === 'study-period' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('study-period')">
        <div class="py-2 px-3">
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



      </div>

    </div>





















  </div>
</template>



<style scoped>

input:focus {
  box-shadow: none;
}


</style>