<script setup>

import NewTeacherComment from "@/main/dashboard/manageLevel/report_setup/comments/NewTeacherComment.vue";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";


const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()

const commentsList = ref(null)
const showCommentModal = ref(false)


onMounted(
    async () => {
        await teacherCommentStore.fetchTeacherComments()
    }
)

const addComments = () => {
  showCommentModal.value = true
}


watch(
    () => teacherCommentStore.newTeacherCommentResponse,
    async (data) => {
      if(data){
        showCommentModal.value = false
        await teacherCommentStore.fetchTeacherComments()
      }
    }
)

watch(
    () => teacherCommentStore.teacherCommentResponse,
    async (data) => {
      if(data){
       commentsList.value = data
      }
    }
)





</script>

<template>

  <div>

    <AppModal title="Add Head Teachers Comment" v-model="showCommentModal" lg>
        <NewTeacherComment></NewTeacherComment>
    </AppModal>



    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Head Teacher's Comments</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addComments">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Add Head Teachers Comment
          </button>
        </div>

        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">#</th>
            <th>(Min - Max) Aggregate</th>
            <th>Comment</th>
            <th>Accademic Year</th>
            <th>Study Period</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(com, index) in commentsList" :key="index">
            <td>{{ index+1 }}</td>
          <td>{{ "("+com.min_aggregate + " - " + com.max_aggregate+")"}}</td>
          <td>{{ com.comment }}</td>
          <td>{{ com.academic_year }}</td>
          <td>{{ com.study_period  }}</td>

          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>

</template>

<style scoped>

</style>