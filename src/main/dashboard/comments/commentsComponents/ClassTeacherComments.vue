<script setup>

import NewTeacherComment from "@/main/dashboard/manageLevel/report_setup/comments/NewTeacherComment.vue";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import NewClassTeacherComment from "@/main/dashboard/comments/commentsComponents/NewClassTeacherComment.vue";


import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);
import printJS from "print-js";


const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()
const commentsList = ref(null)
const showCommentModal = ref(false)
const classTeacherCommentList = ref([])
const editMode = ref(false)


onMounted(
    async () => {
      await  teacherCommentStore.fetchClassTeacherComment()
    }
)

const addComments = () => {
  classTeacherCommentList.value = ""
  editMode.value = false
  showCommentModal.value = true
}

const editComments = (comm) => {
  classTeacherCommentList.value = comm
  editMode.value = true
  showCommentModal.value = true
}



const deleteThisData = async (id,name) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
  if (agreed) {
    let data = {
      number : id
    }
    await teacherCommentStore.deleteClassTeacherComment(data)
  }
}

watch(
    () => teacherCommentStore.newClassTeacherCommentResponse,
    async (data) => {
      if(data){
        showCommentModal.value = false
        await teacherCommentStore.fetchTeacherComments()
      }
    }
)

watch(
    () => teacherCommentStore.classTeacherCommentResponse,
    async (data) => {
      if(data){
        commentsList.value = data.data
      }
    }
)


watch(
    () => teacherCommentStore.deleteClassTeacherCommentResponse,
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

const printComments = () => {
  printJS({
    printable: "teacher-comments",
    type: "html",
    targetStyles: ["*"],
    scanStyles: false,
    style: `
      body {
        font-family: Arial, sans-serif;
        color: #000;
        margin: 20px;
      }
    `,
    documentTitle: `teacher-comments`,
    showModal: true,
  });
};

</script>

<template>

  <div>


    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode?'Edit Comment':'Add Subject Teachers Comment'" v-model="showCommentModal" lg>
      <NewClassTeacherComment :classTeacherCommentList="classTeacherCommentList"></NewClassTeacherComment>
    </AppModal>



    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Class Teacher's Comments</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addComments">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add ClassTeacher Comment
          </button>

          <button @click="printComments" style="padding: 5px 10px; background-color: #2e2487; color: white; border: none; border-radius: 5px; cursor: pointer;">
            <i class="bi bi-printer"></i> Print
          </button>
        </div>
        
        <div id="teacher-comments" style="margin: 0px; font-family: Arial, sans-serif;">
<!--          {{commentsList}}-->
          <table class="table table-hover caption-top mt-5 table-sm text-sm"
                 style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #ccc;">
            <thead>
            <tr style="background-color: #f2f2f2; border-bottom: 2px solid #ccc;">
              <th>#</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Comment</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Class</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Academic Year</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Study Period</th>
<!--              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Teacher</th>-->
              <th style="padding: 8px; text-align: center; border: 0px solid #ccc;">#</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(com, index) in commentsList" :key="index"
                style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px; border: 0px solid #ccc;">{{index+1}}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.comment }}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.class_name }}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.academic_year }}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.study_period }}</td>
<!--              <td style="padding: 8px; border: 0px solid #ccc;">{{com.teacher_name}}</td>-->
              <td style="padding: 8px; text-align: center; border: 0px solid #ccc;">
                <button @click="editComments(com)"
                        style="background: none; border: none; cursor: pointer; margin-right: 6px;">
                  <i class="bi-pencil" style="font-size: 13px; color: #0520ab;"></i>
                </button>
                <button @click="deleteThisData(com.number, com.comment)"
                        style="background: none; border: none; cursor: pointer;">
                  <i class="bi-trash" style="font-size: 13px; color: #ca0b0b;"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>


      </div>
    </div>



  </div>

</template>

<style scoped>

</style>