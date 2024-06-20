<script setup>

import {onMounted, ref, watch,reactive} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";


const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()
const commons = useCommonsStore()
const loader = ref(false)
const errorMessage = ref("")

const props = defineProps({
    reportSummaryNumber:String
})


const form = reactive({
comment : null,
report_summary_number:props.reportSummaryNumber
})

const addComments = () => {
loader.value = true
let formData = {
comment : form.comment,
report_summary_number : form.report_summary_number
 }
 teacherCommentStore.newCommentFromTeacher(formData)
}


watch(
    () => teacherCommentStore.newCommentFromTeacherResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        loader.value=false
      }
    }
)



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
  <form @submit.prevent="addComments">

    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>


    <div class="mb-2 ">
      <label class="text-sm text-gray-600">Comment</label>
      <textarea
          class="form-control mt-2 shadow-none"
          v-model="form.comment"></textarea>
    </div>

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