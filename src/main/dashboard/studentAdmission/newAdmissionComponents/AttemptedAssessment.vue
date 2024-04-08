<template>
    <div>


      <div class="row">
        <div class="modal fade" id="admitMainModal" tabindex="-1" :class="{ show: admitshow }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">CHOOSE STUDY PERIOD</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
             <PromoteStudent  :studentNumber="studentNumber"></PromoteStudent>
          </div>
          </div>

        </div>
      </div>
    </div>


          
                 <div class="ant-alert-action mt-3">
                  <button type="submit" class="mb-2 btn btn-outline-primary btn-sm" style="float: right;"><i></i>Preview/Print Report</button>
                  <button @click="showDialog()" data-bs-toggle="modal" data-bs-target="#admitMainModal" type="submit" class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " style="float: right;"><i></i>Promote</button>
                  <!-- <button @click="showAdmit()"  type="submit" class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " style="float: right;"><i></i>Promote Student</button> -->

                </div>
                <div class="ant-card-body mt-0 mb-5">
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
                  <table class="text-sm table table-sm table-striped table-bordered">
                    <thead>
                        <th>ASSESSMENT</th>
                        <th>SCORE</th>
                        <th>GRADE</th>
                        <th>COMMENT</th>
                    </thead>
                    <tbody>
                  <tr v-for="(list, index) in resultDataList" :key="index">
                        <td style="width: 200px;">{{ list.Name }}</td>
                        <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>{{ list.Score }}</span></span>
                  </td>
                  <td><span class="ant-tag ant-tag-error css-zxymk0">
                    <span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>{{ list.Grade }}</span></span>
                  </td>
                  <td>{{ list.Comment }}</td>
                </tr>
        
                    </tbody>
                    </table>
  
                  </div>
                </div>
            </div>

  </div></div></div>

    
    </template>
    
    <script setup>
    import {onMounted,reactive, ref, watch,watchEffect,computed} from "vue"
    import useNotificationStore from "@/composables/useNotification.js"
    import AdmitModel from "../../studentApplication/AdmitModel.vue";
    import { useAdmissionStore } from "./store/adminission";
    import {useRouter} from "vue-router"
    import PromoteStudent from "@/main/settings/promotion/PromoteStudent.vue";
  const routerData = useRouter()
  const router = useRouter()
  let errorMessage = ref(null)
  const emit = defineEmits()
  const admitshow = ref(false)
  const admissionStore = useAdmissionStore()
  const resultDataList = ref([])

  const selectedconditions = ref([])
  const  notificationStore  = useNotificationStore()

  const studentNumber = routerData.currentRoute.value.query.st_id;
  const interviewNumber = routerData.currentRoute.value.query.interview_id;

  onMounted(
      () => {
        admissionStore.fetchStudentInterviewAssessmentResults(studentNumber,interviewNumber)
      }
  )
  watch(
      () => admissionStore.studentAssessmentResultsResponse,
      async (data) => {
        if(data){
          // notificationStore.successToast("Success", data.message)
          resultDataList.value = data.data
        }
      },
      {deep:true}
  )

  watch (
      () => admissionStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
        }
      },
      {deep:true}
  )

  const showDialog = () => {
    admitshow.value = true
  }
  

const showAdmit = () => {
  admissionStore.admitStudent(studentNumber)
}
watch(
      () => admissionStore.admitStudentResponse,
      async (data) => {
        if(data){
          notificationStore.successToast("Success", data.message)

        }
      },
      {deep:true}
  )
    
    </script>
  
  
    
    <style scoped>
    
    </style>