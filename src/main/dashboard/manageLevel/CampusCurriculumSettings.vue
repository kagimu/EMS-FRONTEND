<template>
  <div>

    <div class="card-body" style="padding: 0;">
      <div>
        <div v-if="selectedPage === 'campus-level'">
          <campus-level></campus-level>
        </div>

        <div v-if="selectedPage === 'class-data'">
          <class-list></class-list>
        </div>

        <div v-if="selectedPage === 'academic-year'">
          <academic-year></academic-year>
        </div>

        <div v-if="selectedPage === 'study-period'">
          <study-period></study-period>
        </div>

        <div v-if="selectedPage === 'assessment-metrics'">
          <assessment-metrics></assessment-metrics>
        </div>

      </div>

    </div>





















  </div>
</template>

<script setup>

import {useRouter} from "vue-router";
import AssessmentMetrics from "@/main/dashboard/assessment/assessmentComponents/AssessmentMetrics.vue";
import StudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/StudyPeriod.vue";
import AcademicYear from "@/main/dashboard/manageLevel/academicYear/AcademicYear.vue";
import CampusLevel from "@/main/dashboard/manageLevel/class/CampusLevel.vue";
import ClassList from "@/main/dashboard/manageLevel/class/ClassList.vue";
const routerData = useRouter()

const selectedPage = routerData.currentRoute.value.query.type










</script>

<style scoped>

input:focus {
  box-shadow: none;
}


</style>