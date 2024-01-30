<template>
  <div>
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview Questions
      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showInterviewDialog">
     <b><i class="bi bi-plus"></i></b> <small>
        Add Questions</small></button>
      <hr style="width:30px;"></h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <!-- <th>Interview</th> -->
          <th>Correct Answer</th>
          <th>Question</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        <!-- v-for="(interlist, index) in interviewList" :key="index" -->
        <tr v-for="(interviewQuestionData, index) in interviewQuestionList" :key="index">
          <!-- <td>{{ interviewQuestionData.interview_number }}</td> -->
          <td>{{ interviewQuestionData.correct_answer }}</td>
          <td>{{ interviewQuestionData.question }}</td>
           <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" 
             class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-eye">&nbsp;View More</i></small></button>        
            </td>
        </tr>  

      </tbody>
    </table>
    <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div> -->
  </div>

  <!-- schedule interview -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show: interviewDialog }" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Question</h5>
            <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeInterviewDialog"></button>
          </div>
          <div class="offcanvas-body">
            <form @submit.prevent="addInterviewQuestions">
              <div class="mb-2">
                <label class="textColor"><small>Interviews</small></label>
               <select required class="form-control" v-model="form.interview_number" >
                <option disabled value=""> - Select Interview - </option>
                  <option v-for="(list, index) in interviewListData" :key="index" :value="list.number">
                    {{ list.name}} 
                  </option>
               </select>
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Question</small></label>
                <input v-model="form.question"  type="text" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Correct Answer</small></label>
                <input  type="text" v-model="form.correct_answer"  required class="form-control" >
              </div>
              <div class="mb-2">
    <label class="textColor text-sm"><small>Possible Answers</small></label>
    <div v-for="(answer, index) in form.possible_answers" :key="index" class="mb-2">
      <div class="row">
        <div class="col-lg-11">
          <input :value="answer" @input="updatePossibleAnswer($event, index)" type="text" required class="form-control">
        </div>
        <div class="col-lg-1">
          <span @click="removePossibleAnswer(index)" style="color: red; width: 12px; height: 12px;" title="Remove Answer">
        <i class="bi bi-x-circle-fill"></i>
      </span>
        </div>
      </div>
    </div>
    <span @click="addPossibleAnswer" style="color: rgb(33, 9, 154); width: 12px; height: 12px;">
      <i class="bi bi-plus-circle"></i>
    </span>
              </div>
              <div class="text-right mt-4">
                <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                    <span class="visually-hidden">Loading...</span>
                  </div></button>
              </div>
            </form>
          </div>
        </div>
<!-- wnd  -->


  </div>
  </template>
  
  <script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
    import useNotificationStore from "@/composables/useNotification.js";

    const buttonLoader = ref(false)
    const interviewListData = ref([])
    const interviewQuestionList = ref([])
    const interviewDialog= ref(false)
    let errorMessage = ref(null)

    const applicationStore= useApplicationStore()
    const  notificationStore  = useNotificationStore()
    const form = reactive({ 
      interview_number:null,
      question:null,
      correct_answer:null,
      possible_answers:[],
    })

    
const addPossibleAnswer = () => {
  form.possible_answers.push('');
}

const removePossibleAnswer = (index) => {
  form.possible_answers.splice(index, 1);
}

const updatePossibleAnswer = (event, index) => {
  form.possible_answers[index] = event.target.value;
}

//working on dialog
const closeInterviewDialog = () => {
  interviewDialog.value = false;
};
const showInterviewDialog = () => {
  interviewDialog.value = true;
}


    const addInterviewQuestions = () => {
     alert(JSON.stringify(form))
    interviewDialog.value = true;
     buttonLoader.value = true
     applicationStore.createNewInterviewQuestion(form)
    }
  

    watch (
    () => applicationStore.newInterviewQuestionsResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
         buttonLoader.value = true
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

onMounted(
    async () => {
      await applicationStore.fetchInterviewList()
    } )

    watch(
    () => applicationStore.interviewListResponse,
    async (data) => {
      if(data){
        interviewListData.value = data.data
      }
    },
    {deep:true}
)

onMounted(
    async () => {
      await applicationStore.fetchApplicationInterviewQuestions()
    } )

    watch(
    () => applicationStore.interviewQuestionsResponse,
    async (data) => {
      if(data){
        interviewQuestionList.value = data.data
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
  
  </style>