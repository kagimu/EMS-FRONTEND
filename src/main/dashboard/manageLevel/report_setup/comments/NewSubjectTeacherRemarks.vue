<script setup>

import {onMounted, ref, watch,reactive} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import useCommonsStore from "@/composables/useCommons.js";
import api from "@/config/api.js";

let imagePath = api.defaults.baseURL + "/attachments/download/"

const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()
const commons = useCommonsStore()
const loader = ref(false)
const errorMessage = ref("")


const props = defineProps({
  reportTemplateName:String,
  reportDetails:{},
  reportDataInfo:{}
})



const addSubjectsRemarks = () => {

  loader.value = true

  let commentDraft = props.reportDetails.learning_areas
      ?.flatMap(area =>
          area.assessments?.map(item => ({
            comment: item?.report_score_summary?.comment,
            assessment_area_number: item?.report_score_summary?.assessment_area_number,
          })) || []
      );

  let data = {
    report_summary_number: props.reportDataInfo?.number,
    assessment_area_comments: commentDraft
  };

  // alert(JSON.stringify(data, null, 2));

  teacherCommentStore.newSubjectsRemarkFromTeacher(data)
}



watch(
    () => teacherCommentStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
)
</script>

<template>
  <div>
<!--    {{reportDataInfo}}-->
<!--    {{reportDetails?.learning_areas[0]}}-->
  <form @submit.prevent="addSubjectsRemarks">

    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>



    <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #ddd;">
      <!-- Learning Areas Row -->
      <tr style="text-align: center; background: #f9f9f9; border-bottom: 2px solid #ddd;">
        <td v-for="(item, idx) in reportDetails?.learning_areas" :key="idx"
            style="width: 25%; padding: 10px; font-weight: bold; text-transform: uppercase; border-right: 1px solid #ddd;">
          {{ item?.name }}
        </td>
      </tr>

      <!-- Assessments Row -->
      <tr>
        <td v-for="(item, idx) in reportDetails?.learning_areas" :key="idx"
            style="vertical-align: top; padding: 10px; border-right: 1px solid #ddd;">

          <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
            <tr v-for="(lst, index) in item?.assessments" :key="index"
                style="border-bottom: 1px solid #eee;">
              <td>

                <table class="text-sm table-sm ">
                  <tr>
                    <td>
                      <span style="font-weight: 500;">{{ lst?.name }}</span>
                    </td>
                    <td>
                      <span style="color: #2c2f8c; font-weight: 600; margin-right: 10px;">
                        {{ lst?.report_score_summary?.summation }}%
                       </span>
                    </td>
                    <td>
                        <span v-if="lst?.report_score_summary?.grade !== 'N/A'"
                              style="color: #2c2f8c; font-weight: 600;">
                  {{ lst?.report_score_summary?.grade }}
                </span>
                    </td>
                  </tr>
                </table>



                <textarea
                    class="form-control mt-2 shadow-none row-2 text-xs"
                    v-model="lst.report_score_summary.comment"></textarea>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>


    <div class="flex justify-content-end mt-4" style="width: 100%;">
      <button
          type="submit"
          class="btn btn-primary border-0">
        Submit
        <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
      </button>
    </div>

  </form>
  </div>
</template>

<style scoped>

</style>