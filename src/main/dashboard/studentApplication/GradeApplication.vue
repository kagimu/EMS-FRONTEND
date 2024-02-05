<template>

  <div class="modal-content">
      {{student}}
            <div class="modal-header text-sm p-0">
              <h6 class="modal-title ml-3 mt-2 mb-2"><small>Your Grading : {{ surName }} {{ secondN }}</small></h6>
              <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mt-2 mb-2">
                <div>
    <div class="container mt-4">

      <form @submit.prevent="submitScores">
      <div >
        
        <table
        id="datatable"
        class="table table-striped border"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>Question</th>
            <th>Correct Answer</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, index) in interviewQuestionsListData" :key="index">
            <td>
              <label :for="question.number">{{ question.question }}</label>
            </td>
            <td>
            <label>{{ question.correct_answer }}</label>
          </td>
            <td>
        <input
          :id="question.number"
          v-model="scores[question.number]"
          type="number"
          placeholder="Enter score" class="form-control score"
        />
            </td></tr>  

        </tbody>
      
      </table>

        <!-- <label :for="question.number">{{ question.question }}</label>
        <input
          :id="question.number"
          v-model="scores[question.number]"
          type="number"
          placeholder="Enter score"
        /> -->
      </div>
      <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4 " style="color: white;float: right;">
                 <small>Submit&nbsp;<i class="bi bi-box-arrow-in-right"></i></small>  
          <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
    </form>
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
  const surName = ref(null)
  const secondN = ref(null)
const scores = ref({})
const buttonLoader = ref(false)


  
    const props = defineProps({
      studentonInterviewid:String,
      stud:{}
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
      () => props.stud,
      async (data) => {
        if(data){
  
          surName.value=props.stud.Student.surname
          secondN.value=props.stud.Student.second_name
          // alert(JSON.stringify(props.stud.Student.number))

        }
      },
      {deep:true}
  )
  
  watch (
      () => applicationStore.QuestionsOnInterviewResponse,
      async (data) => {
        if(data){
          interviewQuestionsListData.value=data.data

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



const submitScores = () => {
  const questionNumbers = Object.keys(scores.value);
  const scoresArray = questionNumbers.map((questionNumber) => scores.value[questionNumber]);
  const data = reactive({ 
    student_number: props.stud.Student.number,
    question_numbers: questionNumbers,
    interview_number: props.stud.interview_number,
    scores: scoresArray,
  })
  alert(JSON.stringify(data))
  //endpoint
  buttonLoader.value = true
  applicationStore.createInterviewResults(props.stud.Student.number,data) 
}

watch (
      () => applicationStore.interviewResultesponse,
      async (data) => {
        if(data){
        
        notificationStore.successToast("Success", data.message)
        buttonLoader.value = false
        }
      },
      {deep:true}
  )
    </script>
  

    
    <style scoped>
    .score{
      width: 150px;
      height: 40px;
    }
    </style>