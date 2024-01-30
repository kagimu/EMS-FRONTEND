<template>

<div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2"><small></small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <div>
  <div class="container mt-4">
    <table
      id="datatable"
      class="table table-striped border"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Question</th>
          <th>Correct Answer</th>
          <th>Student Answer</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(question, index) in interviewQuestionsListData" :key="index">
          <td>{{ question.question }}</td>
          <td>
          <label>{{ question.correct_answer }}</label>
        </td>
          <td>
          <input type="text" class="form-control" value="">
          </td>
          <td>
          <input type="text" class="form-control score" value="">
          </td></tr>    
      </tbody>
    </table>

    <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4 " style="color: white;float: right;">
               <small>Submit&nbsp;<i class="bi bi-box-arrow-in-right"></i></small>  
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>

  </div>




  </div>

              </div>
          </div>
</div>

  
  </template>
  
  <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import useCommons from "@/composables/useCommons.js";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const applicationStore = useApplicationStore()
const notificationStore = useNotificationStore()
const interviewQuestionsListData = ref([])
const errorMessage = ref(null)

  const props = defineProps({
    studentonInterviewid:String,
  })


  watch (
    () => props.studentonInterviewid,
    async (data) => {
      if(data){
        applicationStore.fetchQuestionsOnInterview(data)
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.QuestionsOnInterviewResponse,
    async (data) => {
      if(data){
        interviewQuestionsListData.value=data.data
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)
watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


  
  </script>


  
  <style scoped>
  .score{
    width: 50px;
    height: 30px;
  }
  </style>