<template>
<div class="text-sm" style="font-size: 8px;">

  <p style="font-size: 10px;">
    <b>Lesson Plan</b>
  </p>

  <br />

  <table style="width: 100%;">
    <tr>
      <td style="width: 50%;">
        <table class="mt-4" style="font-size: 8px;">
          <tr>
            <td style="width: 40%;">
              <b class="mr-5">Strand:</b>
            </td>
            <td>
              <div> {{lessonPlanInfo.strand_name}}</div>
            </td>
          </tr>
          <tr>
            <td><b class="mr-5">Topic:</b></td>
            <td>
              <div> {{lessonPlanInfo.topic_name}}</div>
            </td>
          </tr>
          <tr>
            <td>
              <b class="mr-5">Sub Topic:</b>
            </td>
            <td>
              <div class="mt-3 mb-2">
                <span class="text-blue-900">{{lessonPlanInfo.name}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <b class="mr-5">Estimated Time:</b>
            </td>
            <td>
              <div> {{lessonPlanInfo.estimated_time}} (Min)</div>
            </td>
          </tr>
        </table>
      </td>
      <td style="width: 50%;">
        <p style="font-size: 8px;"><b>Reference(s)</b></p>
          <table style="width: 100%; margin-top: 3px;font-size: 8px;"  v-if="lessonPlanDetailsInfo">
            <tr>
              <td>#</td>
              <td>Code</td>
              <td>Name</td>
            </tr>
            <tr v-for="(reference,idx) in lessonPlanDetailsInfo.references" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td>{{ reference.code }}</td>
              <td>{{ reference.name }}</td>
            </tr>
          </table>
      </td>
    </tr>
  </table>

<br />
<br />

  <div>
    <b>Lesson Plan / Concept(s)</b>
  </div>

  <table cellspacing="0" cellpadding="0" style="width: 100%;font-size: 8px;">
    <tr>
      <td style="width: 50%;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e; padding: 9px;">
        <div> <b class="mr-5">Concept</b></div>
      </td>
      <td style="width: 50%;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e; padding: 9px;">
        <div><b>Teaching steps</b></div>
      </td>
    </tr>

    <tr v-if="lessonPlanDetailsInfo" v-for="(lesson, index) in lessonPlanDetailsInfo.concepts" :key="index">
      <td style="border-bottom: 1px solid #7a7c7e; padding: 9px;">
        <div> <b class="mr-5">{{lesson.code}}.</b> {{lesson.concept_name}}</div>
      </td>
      <td style="border-bottom: 1px solid #7a7c7e; padding: 9px;">
        <div class="ml-5 mt-2" v-for="(lsn, idx) in lesson.steps" :key="idx">
          {{lsn.code+". "+lsn.step}}
        </div>
      </td>
    </tr>

  </table>




</div>
</template>

<script setup>

import {ref, watch} from "vue";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";


const lessonPlanDetailsInfo = ref(null)
const scheme_sub_topic_number = ref(null)
const schemeOfWorkStore = useSchemeOfWorkStore()


const props = defineProps({
  lessonPlanInfo: {}
})



watch(
    () => props.lessonPlanInfo,
    async (data) => {
      if (data) {
        lessonPlanDetailsInfo.value = null
        scheme_sub_topic_number.value = props.lessonPlanInfo.number
        await schemeOfWorkStore.fetchLessonPlanDetails(props.lessonPlanInfo.number)
      }
    },
    {deep: true}
)



watch(
    () => schemeOfWorkStore.lessonPlanResponse,
    async (data) => {
      if (data) {
       lessonPlanDetailsInfo.value = data.data
      }
    },
    {deep: true}
)





</script>

<style scoped>

</style>