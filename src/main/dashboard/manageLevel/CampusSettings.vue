<template>
  <div>
    <div class="mt-4">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="campus-level-tab" data-bs-toggle="tab" data-bs-target="#campus-level" type="button" role="tab" aria-controls="campus-level" aria-selected="false"><small>Campus Level</small></button>
          <button class="nav-link navColor" id="classes-tab" data-bs-toggle="tab" data-bs-target="#classes" type="button" role="tab" aria-controls="classes" aria-selected="false"><small>Class</small></button>
          <button class="nav-link navColor" id="academic-year-tab" data-bs-toggle="tab" data-bs-target="#academic-year" type="button" role="tab" aria-controls="academic-year" aria-selected="false"><small>Academic Year</small></button>
          <button class="nav-link navColor" id="study-period-tab" data-bs-toggle="tab" data-bs-target="#study-period" type="button" role="tab" aria-controls="study-period" aria-selected="false"><small>Study Period</small></button>
          <button class="nav-link navColor" id="assessment-metrics-tab" data-bs-toggle="tab" data-bs-target="#assessment-metrics" type="button" role="tab" aria-controls="assessment-metrics" aria-selected="false"><small>Assessment Metrics</small></button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="campus-level" role="tabpanel" aria-labelledby="campus-level-tab" tabindex="0">
          <campus-level></campus-level>
        </div>
        <div class="tab-pane fade" id="classes" role="tabpanel" aria-labelledby="classes-tab" tabindex="0">
          <class-list></class-list>
        </div>
        <div class="tab-pane fade" id="academic-year" role="tabpanel" aria-labelledby="academic-year-tab" tabindex="0">
          <academic-year></academic-year>
        </div>
        <div class="tab-pane fade" id="study-period" role="tabpanel" aria-labelledby="study-period-tab" tabindex="0">
         <study-period></study-period>
        </div>
<!--        <div class="tab-pane fade" id="grading-scale" role="tabpanel" aria-labelledby="grading-scale-tab" tabindex="0">Grading Scale</div>-->
        <div class="tab-pane fade" id="assessment-metrics" role="tabpanel" aria-labelledby="assessment-metrics-tab" tabindex="0">
          <assessment-metrics></assessment-metrics>
        </div>
<!--        <div class="tab-pane fade" id="mode-of-assessment" role="tabpanel" aria-labelledby="mode-of-assessment-tab" tabindex="0">Mode of Assessment</div>-->
<!--        <div class="tab-pane fade" id="grading-term" role="tabpanel" aria-labelledby="grading-term-tab" tabindex="0">Grading Term</div>-->
      </div>

    </div>
  </div>

</template>

<script setup>


import ClassList from "@/main/dashboard/manageLevel/class/ClassList.vue";
import StudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/StudyPeriod.vue";
import AcademicYear from "@/main/dashboard/manageLevel/academicYear/AcademicYear.vue";
import CampusLevel from "@/main/dashboard/manageLevel/class/CampusLevel.vue";
import AssessmentMetrics from "@/main/dashboard/assessment/assessmentComponents/AssessmentMetrics.vue";
</script>

<style scoped>

</style>