<template>
    <div>  
        <form @submit.prevent="Enrol()">
            {{ studN }}
      <div class="mb-2">
              <label class="textColor"><small>School</small> </label>
              <input type="text" disabled v-model="form.school" class="form-control">
          </div>
  
  
          <div class="mb-2">
              <label class="textColor"><small>Campus</small>  </label>
              <input type="text" disabled v-model="form.campus" class="form-control">
          </div>
  
  
          <div class="mb-2">
              <label class="textColor"><small>Class</small> </label>
              <input type="text" disabled v-model="form.class" class="form-control">
          </div>
  
          <div class="mb-2">
              <label class="textColor"><small>Stream</small> </label>
              <input type="text" disabled v-model="form.stream" class="form-control">
          </div>
  
          <div class="mb-2">
              <label class="textColor"><small>Academic Year</small> </label>
              <input type="text" disabled v-model="form.academicYear" class="form-control">
          </div>
  
          <div class="mb-2">
              <label class="textColor"><small>Study Period</small> 
                <input type="text" disabled v-model="form.StudyPeriod" class="form-control">
              </label>
              
          </div>

          <div class="mb-2">
              <label class="textColor"><small>Enrolment Date</small> 
              </label>
              <input type="date" class="form-control" v-model="form.enrollment_date">
                <!-- <VueDatePicker
              text-input
              auto-apply
              :teleport="true"
              style="font-size: 7px;"
              v-model="form.enrollment_date"
              :preview-format="format"
              ></VueDatePicker> -->
             
          </div>
  
   
     <div class="flex justify-content-end mt-2" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small>Enrol <i class="bi bi-box-arrow-in-right"></i></small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
    </div>
  
  
  </template>
  
  <script setup>
  
  import {onMounted, reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useEnrolmentStore} from "@/main/dashboard/enrollment/store/enrollment.js"
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  
  const  notificationStore  = useNotificationStore()
  const buttonLoader = ref(false)
  const errorMessage = ref(null)
  const enrolmentStore = useEnrolmentStore()
  const studentN = ref(null)
  const admissionStore = useAdmissionStore()

const currentYear = ref((new Date()).getFullYear());
const date = ref();

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Selected date is ${day}/${month}/${year}`;
}


const props = defineProps({
  studN: String,
})

watch (
    () => props.studN,
    async (data) => {
    studentN.value = props.studN
    //fetch admission by studentNumber
    admissionStore.fetchAdmissionByStudentId(studentN)
    },
    {deep:true}
)

  const form = reactive({
  academic_year: null,
  StudyPeriod: null,
  class: null,
  campus: null,
  stream:null,
  school:null,
  enrollment_date:null
  })
  
  watch(
      () => admissionStore.admissionByStudentResponse,
      async (data) => {
        if(data){
        //   notificationStore.successToast("Success", data.message )
         form.academic_year = data.academicYear.name,
         form.StudyPeriod = data.StudyPeriod.study_period_name,
         form.class = data.Stream.class_name ,
         form.campus = data.Campus.name,
         form.stream = data.Stream.stream_name ,
         form.school = data.School.name
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


const formData = reactive ({
    student_number:studentN,
    enrollment_date:null
} )




  const Enrol = () =>{
    // alert(JSON.stringify(formData))
    enrolmentStore.newEnrolment(formData)
  }
  
  
  watch (
    () => enrolmentStore.newsEnrolmentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
  )
  
  watch (
    () => enrolmentStore.errorMessage,
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
  .noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  }
  </style>