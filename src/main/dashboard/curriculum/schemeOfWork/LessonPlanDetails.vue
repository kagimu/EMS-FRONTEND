<template>
<div class="text-sm">
  <table class="mt-4">
    <tr>
      <td style="width: 20%;"><b class="mr-5">Strand:</b></td>
      <td> <div> {{lessonPlanInfo.strand_name}}</div></td>
    </tr>
    <tr>
      <td><b class="mr-5">Topic:</b></td>
      <td> <div> {{lessonPlanInfo.topic_name}}</div></td>
    </tr>
    <tr>
      <td>
        <b class="mr-5">Sub Topic:</b>
      </td>
      <td><div class="mt-3 mb-2" style="font-size: 19px;">  <span class="text-blue-900">{{lessonPlanInfo.name}}</span></div> </td>
    </tr>
    <tr>
      <td>
        <b class="mr-5">Estimated Time:</b>
      </td>
      <td> <div> {{lessonPlanInfo.estimated_time}} (Min)</div></td>
    </tr>
  </table>

<div class="row mx-auto">
    <div class="col col-8">
        <new-lesson-plan-reference :lesson_plan_number="lessonPlanInfo.lesson_plan[0].number"></new-lesson-plan-reference>
    </div>

</div>





<!--<button @click="openReferenceDialog" class="btn btn-sm btn-secondary border-0 mt-2" data-bs-toggle="modal" data-bs-target="#referenceModal">
    <i style="font-size: 15px;" class="bi-plus mr-1"></i>
    Add Reference
</button>-->


  <div class="mt-10 mb-2" style="font-size: 18px;"><p>Lesson Plan / Concept(s)</p></div>
   <div></div>
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

import NewLessonPlanReference from "@/main/dashboard/curriculum/schemeOfWork/NewLessonPlanReference.vue";
import {ref} from "vue";


const props = defineProps({
  lessonPlanInfo: {}
})

const referenceDialog = ref(false)

const openReferenceDialog = () =>{
    alert("hello")
  referenceDialog.value = true
}

</script>

<style scoped>

</style>