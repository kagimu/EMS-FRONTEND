<script setup>

import NewTeacherComment from "@/main/dashboard/manageLevel/report_setup/comments/NewTeacherComment.vue";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";

import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);


const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()
const commentsList = ref(null)
const showCommentModal = ref(false)
const headTeacherCommentList = ref([])
const editMode = ref(false)


onMounted(
    async () => {
        await teacherCommentStore.fetchTeacherComments()
    }
)

const addComments = () => {
  headTeacherCommentList.value = ""
  editMode.value = false
  showCommentModal.value = true
}

const editComments = (comm) => {
  headTeacherCommentList.value = comm
  editMode.value = true
  showCommentModal.value = true
}



const deleteThisData = async (id,name) => {

  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
  if (agreed) {
    let data = {
   comment_number : id
    }

    await teacherCommentStore.deleteHeadTeacherComment(data)
  }
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


watch(
    () => teacherCommentStore.deleteHeadTeacherCommentResponse,
    async (data) => {
      if(data){
        await teacherCommentStore.fetchTeacherComments()
        notificationStore.successToast("success",data.message)
      }
    }
)

watch(
    () => teacherCommentStore.errorMessage,
    async (data) => {
      if(data){
        await teacherCommentStore.fetchTeacherComments()
        notificationStore.errorToast("error",data.error)

      }
    }
)

</script>

<template>

  <div>
 

 <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode?'Edit Comment':'Add Head Teachers Comment'" v-model="showCommentModal" lg>
        <NewTeacherComment :headTeacherCommentList="headTeacherCommentList"></NewTeacherComment>
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
            <th>#</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(com, index) in commentsList" :key="index">
            <td>{{ index+1 }}</td>
          <td>{{ "("+com.min_aggregate + " - " + com.max_aggregate+")"}}</td>
          <td>{{ com.comment }}</td>
          <td>{{ com.academic_year }}</td>
          <td>{{ com.study_period  }}</td>
          <td>
              <button  class="link-primary" style="border-width: 0px;text-decoration: none;" @click="editComments(com)"><small><i  style="font-size: 13px;color:rgb(5, 32, 171)" class="bi-pencil mr-2 cursor-pointer"></i></small></button>
              <button @click="deleteThisData(com.number,com.comment)"><i style="font-size: 13px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer"></i></button>
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