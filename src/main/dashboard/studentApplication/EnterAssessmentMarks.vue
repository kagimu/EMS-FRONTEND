<template>
  <div>
    <!-- {{ studentNumber }} -->
    <form @submit.prevent="enterResults" >
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <tbody>

        <tr>
          <td>
            <label class="label textColor">Score</label>
            <input type="number" v-model="form.actual_score" class="form-control" style="width:100px">

          </td></tr>
          <tr><td>
            <label  class="label textColor">Comment</label>
            <textarea v-model="form.comment" class="form-control mb-3 textColor"></textarea>

            <button type="submit"
                  class="btn btn-primary btn-sm"
              >Save</button>
          </td>
        </tr>   
          
        
      </tbody>
    </table>
</form> 


  </div>
</template>


<script setup>
import {onMounted, reactive, ref, watch,computed} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";

const routerData = useRouter()

const assessmentStore = useAssessmentStore()
const studentApplicationStore = useStudentApplicationStore()


let assessmentricsNumber = routerData.currentRoute.value.query.assessment_metric_id

const props = defineProps({
    studentNumber: String,
})

const notificationStore = useNotificationStore()

const assessment_metric_number = ref(null)

const loader = ref(false)
const errorMessage = ref(null)

const student = ref(null)


watch (
    () => props.studentNumber,
    async (data) => {
      if(data){
      student.value = props.studentNumber
      }
    },
    {deep:true}
)


const form = reactive({
    assessment_metric_number:assessmentricsNumber,
    comment:null,
    student_number:student,
    assessment_date:null,
    actual_score:null
})


const enterResults = () =>{
    // alert(JSON.stringify(form))
   
    studentApplicationStore.newInterviewAssessmentResult(form)
}

watch (
    () => studentApplicationStore.interviewAssessmentResultResponse,
    async (data) => {
      if(data){
        // buttonLoader.value = false
    form.comment=null
    form.student_number=null,
    form.assessment_date=null,
    form.actual_score=null

        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)
watch(
    () => studentApplicationStore.errorMessage,
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