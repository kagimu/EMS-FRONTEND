<script setup>

import NewTeacherComment from "@/main/dashboard/manageLevel/report_setup/comments/NewTeacherComment.vue";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import useCommonsStore from "@/composables/useCommons.js";


const notificationStore  = useNotificationStore()
const teacherCommentStore = useReportSetupStore()
const commons = useCommonsStore()

const commentsList = ref(null)
const loader = ref(false)

const form = reactive({
min_aggregate: 0,
max_aggregate : 0,
message : null,
report_setting_number:null
})

onMounted(
    async () => {
        teacherCommentStore.fetchTeacherComments()
    }
)

const addComments = () => {
    loader.value = true
 alert(JSON.stringify(form))
 teacherCommentStore.newTeacherComment(form)
}


watch(
    () => teacherCommentStore.newTeacherCommentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        loader.value=false
      }
    }
)

watch(
    () => teacherCommentStore.teacherCommentResponse,
    async (data) => {
      if(data){
       commentsList.value = data.data
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

<div class="row">
    <div class="col-6">
        <div class="mb-2">
      <label class="textColor">Minimum Aggregate</label>
      <input
          @keypress="commons.numbersOnlyValidator($event)"
          maxlength="10"
          type="text"
          style="outline: none 0 !important;
               box-shadow: none;"
               v-model="form.min_aggregate"
          required
          class="form-control form-select-sm">
    </div>
    </div>

    <div class="col-6">
        <div class="mb-2">
      <label class="textColor">Maximum Aggregate</label>
      <input
          @keypress="commons.numbersOnlyValidator($event)"
          maxlength="10"
          type="text"
          style="outline: none 0 !important;
               box-shadow: none;"
               v-model="form.min_aggregate"
          required
          class="form-control form-select-sm">
    </div>
    </div>

</div>

    <div class="mb-2">
      <label class="textColor"><small>Comment</small></label>
    <textarea class="form-control" v-model="form.message"></textarea>
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