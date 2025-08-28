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

const form = reactive({
  comment:""
})


const addClassTeacherComments = () => {

  loader.value = true

  let data = {
    report_summary_number: props.reportDataInfo?.number,
    comment: form.comment
  };

  // alert(JSON.stringify(data, null, 2));

  teacherCommentStore.newClassTeacherOverallComment(data)
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
  <form @submit.prevent="addClassTeacherComments">

    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>


    <textarea v-model="form.comment"
              placeholder="Enter comment..."
              style="width: 100%; min-height: 80px; padding: 8px; font-size: 13px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;">
            </textarea>

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