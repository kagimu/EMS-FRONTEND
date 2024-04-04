<script setup>

import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";

const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const assessmentStore= useAssessmentStore()
const metricListData = ref(null)
const metrics = ref("")
const studentsList = ref([])


onMounted(
    async () => {
      await assessmentStore.fetchAssessmentMetrics()

    }
)



const fetchStudents = (metrics) => {
  if(metrics){
    reportSetupStore.fetchStudentByAssessmentMetric(metrics)
  }
}







watch(
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data){
        metricListData.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => reportSetupStore.studentsByAssessmentMetricResponse,
    async (data) => {
      if(data){
       studentsList.value = data.data
      }
    },
    {deep:true}
)



const onlyNumberValidator = (event) => {
  const validChars = /^[0-9+\-*/.\s]+$/;
  if (!validChars.test(event.key)) return event.preventDefault();
}

const addMarks = (score, comment) => {
  let data = {
    score:score,
    comment:comment
  }
  reportSetupStore.addStudentMarks(data)
}





watch(
    () => reportSetupStore.studentMarksResponse,
    async (data) => {
      if(data){
         alert(JSON.stringify(data))
      }
    },
    {deep:true}
)

</script>

<template>

  <div>

    <div class="row mx-auto mt-3">
      <div class="col-3">
        <div class="mb-2">
          <label class="text-sm"><small>Assessment metric</small></label>
          <select
              style="box-shadow: none;"
              class="form-select py-10"
              v-model="metrics"
              @click="fetchStudents(metrics)"
          >
            <option class="text-[13px]" disabled value="">--Select Assessment Metric--</option>
            <option class="text-[13px]" v-for="(list, index) in metricListData" :key="index" :value="list.number">{{list.name}}</option>
          </select>
        </div>
      </div>
    </div>

    <hr />

    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Student Score</div>
        </div>


        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]">#</th>
            <th class="w-[30%]">Name</th>
            <th>Score</th>
            <th>Comment</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(std, index) in studentsList" :key="index">
            <td> {{(index + 1)}}</td>
            <td class="uppercase text-sm">
              {{std.student_surname ? std.student_surname : ""}}
              {{std.student_second_name ? " "+std.student_second_name : ""}}
              {{std.student_other_name ? " "+std.student_other_name : ""}}
            </td>
            <td>
              <input
                  @keypress="onlyNumberValidator($event)"
                  style="outline: none 0 !important; box-shadow: none;"
                  type="text"
                  v-model="std.score"
                  v-on:blur="addMarks(std.score, std.comment)"
                  required
                  class="form-control h-[35px]">
            </td>
            <td>
               <textarea
                   style="outline: none 0 !important; box-shadow: none;"
                   type="text"
                   v-model="std.comment"
                   v-on:blur="addMarks(std.score, std.comment)"
                   required
                   class="form-control form-select-sm h-1"></textarea>
            </td>

          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>

</template>

<style scoped>

</style>