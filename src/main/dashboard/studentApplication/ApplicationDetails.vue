<template>

    <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <!-- {{ applicationNumber }} -->
            <h6 class="modal-title ml-3 mt-2 mb-2"><small>Application Details</small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">

  <div class="row mx-auto">
    <div class="col-3" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-0 mt-2 mb-2" style="text-align: left !important;">GUARDIAN/PARENT DETAILS</p>
        <div class="mb-2">
          <span class="textColor text-sm"><small>Surname : <span class="details">{{appDatails.surname}}</span></small></span>
        </div>
        <div class="mb-2">
          <span class="textColor text-sm"><small>Second name : <span class="details">{{appDatails.second_name}}</span></small></span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Other names: <span class="details">{{ appDatails.other_name}}</span></small> </span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"> <small>Telephone No. : <span class="details">{{  appDatails.main_telephone_number}}</span></small></span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Alternative No.: <span class="details">{{ appDatails.alternative_telephone_number }}</span></small> </span>
        </div>
         <div class="row">
            <div class="mb-2">
          <span class="textColor text-sm"><small>Email: <span class="details">{{ appDatails.email }}</span></small></span>
        </div>
            <div class="mb-2">
          <span class="textColor text-sm"><small>Alternative Email: <span class="details">{{ appDatails.alternative_email }}</span></small></span>
        </div>
          </div>
        
    </div>


    <div class="col-3" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-0 mt-2 mb-2" style="text-align: left !important;">LEARNER DETAILS</p>
        <div class="mb-2">
          <span class="textColor text-sm"><small>Surname: <span class="details">{{ appDatails.studentSurname }}</span></small> </span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Second name: <span class="details">{{ appDatails.Studentsecond_name }}</span> </small></span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"><small>Other names</small>: <span class="details">{{ appDatails.StudentOther_name}}</span> </span>
        </div>

        <div class="mb-2">
          <span class="textColor text-sm"> <small>Prefered Class: <span class="details">{{ appDatails.preferred_campus_number  }}</span> </small></span>
        </div>

      
         <div class="row">
            <div class="mb-2">
          <span class="textColor text-sm"><small>Reason</small>: <span class="details"><i>{{ appDatails.reason}}</i></span> </span>
        </div>
            <div class="mb-2">
          <span class="textColor text-sm"><small>Age: <span class="details">{{getAge(appDatails.StudentDate_of_birth) }}</span></small></span>
        </div>
          </div>
        
    </div>


    
    <div class="col-3" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-0 mt-2 mb-2" style="text-align: left !important;">PREVIOUS SCHOOL DETAILS</p>
        
        <div v-for="(school,index) in appDatails.previousSchools" :key="index">
        
          <div class="row">
          <div class="col-lg-12">
          <span class="textColor text-sm" ><small><span class="details">{{ school.name}} </span></small> </span>
        </div>
        </div>

        <div v-for="(cls,idx) in school.Classes" :key="idx">
        <div class="row">
        <div class="col-lg-12">
          <span class="textColor text-sm" ><small> {{cls.class}}</small></span>
        </div></div>
        <div class="row">
        <div class="col-lg-6">
          <span class="textColor text-sm" ><small> {{cls.year}}</small></span>
        </div>
        </div>
      </div>
      </div>
        
    </div>
    <div class="col-3" v-if="appDatails.status == 'INTERVIEW_SCHEDULED'" > 
      <p>Interview Has Been Scheduled</p>

      <button class="btn btn-primary btn-sm"><i class="bi bi-printer"></i> Print</button>
    </div>

    <div class="col-3" v-if="appDatails.status == 'ADMITTED'" > 
      <p> STUDENT HASBEEN OFFERED AN ADMISSION</p>

      <button class="btn btn-primary btn-sm">View Admission Details</button>
    </div>

    <div class="col-3" v-if="appDatails.status == 'DRAFT'" > 
      <!-- {{ appDatails.status }} -->
  <form @submit.prevent="scheduleInterview" >
              <label> <span style="text-align: center;font-size: 12px;"><small>Select Interview</small></span></label>
              <select required class="form-control" v-model="formData.interview_number" >
                  <option v-for="(list, index) in interviewListData" :key="index" :value="list.number">
                    {{ list.name}} 
                  </option>
               </select>
              <div class="text-right mt-1">
                <button style="margin-right: 0px;float: left;" type="button" class="btn btn-sm btn-danger mb-2 mr-4" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i>&nbsp;<small>Reject</small></button>
                <button style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2"  ><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>
            </form>
    </div>

           
    </div>   
</div>
</div>

<!-- schedule interview this is left out -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialog" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Schedule Interview</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
              <!-- {{ applicationNumber }} -->
            <form @submit.prevent="scheduleInterview" >
              <label> Select Interview</label>
              <select required class="form-control" v-model="formData.interview_number" >
                <option disabled value=""> - Select Interview - </option>
                  <option v-for="(list, index) in interviewListData" :key="index" :value="list.number">
                    {{ list.name}} 
                  </option>
               </select>
              <div class="text-right mt-4">
                <button style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
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
  import useNotificationStore from "@/composables/useNotification.js";
  import useCommons from "@/composables/useCommons.js";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";


const applicationStore = useApplicationStore()
const notificationStore = useNotificationStore()
const buttonLoader = ref(false)
const interviewListData = ref([])
let errorMessage = ref(null)
const useCommonsStore = useCommons()

  const props = defineProps({
    applicationNumber:String
  })

const appDatails = reactive({ 
surname: null,
second_name: null,
other_name: null,
application_number: null,
main_telephone_number: null,
alternative_telephone_number: null,
email: null,
alternative_email:null,
studentSurname: null,
Studentsecond_name: null,
StudentOther_name:null,
StudentGender: null,
StudentDate_of_birth: null,
preferred_type_of_enrollment: null,
preferred_campus_number:null,
reason:null,
status:null,
previousSchools:[],
    student_number: null,
})


function getAge(dob){
  return useCommonsStore.getAgeFromDateOfBirth(dob)
}


watch (
    () => props.applicationNumber,
    async (data) => {
      if(data){
        applicationStore.fetchApplicationById(data)
        //.setvalues
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.applicationByIdResponse,
    async (data) => {
      if(data){
        // alert(JSON.stringify(data))
        appDatails.surname = data.Parent.surname
        appDatails.second_name = data.Parent.second_name
        appDatails.other_name = data.Parent.other_name
        appDatails.main_telephone_number = data.Parent.alternative_telephone_number
        appDatails.alternative_telephone_number= data.Parent.alternative_telephone_number
        appDatails.email= data.Parent.email
        appDatails.alternative_email=data.Parent.alternative_email
        appDatails.studentSurname= data.Student.surname
        appDatails.Studentsecond_name=data.Student.second_name,
        appDatails.StudentOther_name=data.Student.other_name,
        appDatails.StudentGender= data.Student.gender,
        appDatails.StudentDate_of_birth=data.Student.date_of_birth,
        appDatails.preferred_type_of_enrollment=data.preferred_type_of_enrollment,
        appDatails.preferred_campus_number=data.Student.CampusClass.class_name,
        appDatails.reason=data.Student.reason_for_choosing_school,
        appDatails.status=data.status
        appDatails.previousSchools=data.PreviousSchools
          appDatails.student_number = data.Student.number

        // alert(JSON.stringify(data.Parent.surname))
      }
    },
    {deep:true}
)

onMounted(
    async () => {
      await applicationStore.fetchApplicationList()
    } )

const formData = reactive({
  interview_number:null
})

function scheduleInterview(){
  // alert(JSON.stringify(formData))
  buttonLoader.value = true
    // alert(JSON.stringify(appDatails.student_number))
  formData.student_number = appDatails.student_number
  applicationStore. addStudentToInterview(formData)
  
}

  watch(
      () => applicationStore.addStudentToInterviewResponse,
      async (data) => {
          if (data) {
            formData.interview_number = null
              buttonLoader.value = false
              applicationStore.fetchApplicationList()
              notificationStore.successToast("Success", data.message)       
          }
      },
      {deep: true}
  )

  watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        formData.interview_number = null
        errorMessage.value = data.message
        buttonLoader.value = false
      
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




  </script>


  
  <style scoped>
  .mb-2 {
    text-align: left;

    font-family: Roboto, sans-serif;
    /* font-size: 17px; */
    border-radius: 3px !important;
}
  .details{
    color:rgba(0, 0, 0, 0.824);
  }
  </style>