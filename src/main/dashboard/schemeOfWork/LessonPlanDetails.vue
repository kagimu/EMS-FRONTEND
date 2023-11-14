<template>
<div class="text-sm">
  <div> <b class="mr-5">Strand:</b> {{lessonPlanInfo.strand_name}}</div>
  <div><b class="mr-5">Topic:</b> {{lessonPlanInfo.topic_name}}</div>
  <div class="mt-3 mb-2" style="font-size: 19px;"> <b class="mr-5">Sub Topic:</b> {{lessonPlanInfo.name}}</div>
  <div><b class="mr-5">Estimated Time:</b> {{lessonPlanInfo.estimated_time}} (Min)</div>

  <div class="mt-10 mb-2" style="font-size: 17px;"><p>Lesson Plan / Concept(s)</p></div>
  <hr />
  <div v-for="(lesson, index) in lessonPlanInfo.lesson_plan" :key="index">

    <div class="row">
      <div class="col-lg-6 content">
        <div> <b class="mr-5">Concept {{lesson.code}}:</b> {{lesson.concept_name}}</div>
      </div>
      <div class="col-lg-6 content">
        <div><b>Teaching steps</b></div>
        <div class="ml-5 mt-2" v-for="(lsn, idx) in lesson.steps" :key="idx">
          {{lsn.code+". "+lsn.step}}
        </div>
      </div>
    </div>
    <hr />

  </div>


</div>
</template>

<script setup>

const props = defineProps({
  lessonPlanInfo: {}
})

</script>

<style scoped>

</style>