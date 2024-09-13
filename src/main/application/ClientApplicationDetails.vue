<template>

    <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <!-- {{ applicationNumber }} -->
            <h6 class="modal-title ml-3 mt-2 mb-2"><small>Student Application Details</small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">

  <div class="row mx-auto">
    <div class="col-4" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-4 mt-4 mb-10" style="text-align: left !important;">GUARDIAN/PARENT DETAILS</p>
        <div class="mb-2">
          <span class="text-sm text-sm"><small>Surname : <span class="details">{{appDatails.surname}}</span></small></span>
        </div>
        <div class="mb-2">
          <span class="text-sm text-sm"><small>Second name : <span class="details">{{appDatails.second_name}}</span></small></span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-sm"><small>Other names: <span class="details">{{ appDatails.other_name}}</span></small> </span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-sm"> <small>Telephone No. : <span class="details">{{  appDatails.main_telephone_number}}</span></small></span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-sm"><small>Alternative No.: <span class="details">{{ appDatails.alternative_telephone_number }}</span></small> </span>
        </div>
         <div class="row">
            <div class="mb-2">
          <span class="text-sm text-sm"><small>Email: <span class="details">{{ appDatails.email }}</span></small></span>
        </div>
            <div class="mb-2">
          <span class="text-sm text-sm"><small>Alternative Email: <span class="details">{{ appDatails.alternative_email }}</span></small></span>
        </div>
          </div>
        
    </div>


    <div class="col-4" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-4 mt-4 mb-10" style="text-align: left !important;">LEARNER DETAILS</p>
        <div class="mb-2">
          <span class="text-sm text-sm"><small>Surname: <span class="details">{{ appDatails.studentSurname }}</span></small> </span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-sm"><small>Second name: <span class="details">{{ appDatails.Studentsecond_name }}</span> </small></span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-sm"><small>Other names</small>: <span class="details">{{ appDatails.StudentOther_name}}</span> </span>
        </div>

        <div class="mb-2">
          <span class="text-sm text-sm"> <small>Prefered Class: <span class="details">{{ appDatails.preferred_type_of_enrollment }}</span> </small></span>
        </div>

      
         <div class="row">
          
            <div class="mb-2">
          <span class="text-sm text-sm"><small>Reason</small>: <span class="details"><i>{{ appDatails.reason}}</i></span> </span>
        </div>
         
          
            <div class="mb-2">
          <span class="text-sm text-sm"><small>Age: <span class="details">{{getAge(appDatails.StudentDate_of_birth) }}</span></small></span>
        </div>
          </div>
        
    </div>


    
    <div class="col-4" style="border-right: 1px solid rgba(128, 128, 128, 0.137);">
        <p class="ml-4 mt-4 mb-10" style="text-align: left !important;">PREVIOUS SCHOOL DETAILS</p>
        
        <div v-for="(school,index) in appDatails.previousSchools" :key="index">
        
          <div class="row">
          <div class="col-lg-12">
          <span class="text-sm text-sm" ><small><span class="details">{{ school.name}} </span></small> </span>
        </div>
        </div>

        <div v-for="(cls,idx) in school.Classes" :key="idx">
        <div class="row" style="width: 80px;">
        <div class="col-lg-4">
          <span class="text-sm text-sm" ><small> {{cls.class}}</small></span>
        </div>
        <div class="col-lg-4">
          <span class="text-sm text-sm" ><small> {{cls.year}}</small></span>
        </div>
        </div>
      </div>
    
  
      </div>
        
    </div>
<!--<div class="row">-->
<!--    <hr style="color: rgba(17, 17, 17, 0.265);">-->
<!--    <div class="col-lg-8">-->

<!--    </div>-->
<!--    <div class="col-lg-2">-->
<!--        <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-save2"></i>&nbsp;<small>Approve</small></button>-->
<!--</div>-->
<!--<div class="col-lg-2">-->
<!--    <button style="margin-right: 5px;" type="button" class="btn btn-sm btn-danger mb-2 mr-4"><i class="bi bi-x-circle"></i>&nbsp;<small>Reject</small></button>-->
<!--</div>-->

<!--</div>-->
           
    </div>   
</div>
</div>

<!-- schedule interview -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialog" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Schedule Interview</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
              {{ applicationNumber }}
            <form @submit.prevent="scheduleInterview" >
              <div class="mb-2">
                <label class="text-sm"><small>Date</small></label>
                <input v-model="formData.scheduled_on" type="datetime-local" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="text-sm"><small>Message</small></label>
                <textarea  v-model="formData.message" required class="form-control noFocus" id="floatingTextarea2" style="height: 100px"></textarea>
              </div>
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
import {reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import useCommons from "@/composables/useCommons.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";


const ApplicationStore = useApplicationStore()
const notificationStore = useNotificationStore()

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
previousSchools:[],
})


function getAge(dob){
  return useCommonsStore.getAgeFromDateOfBirth(dob)
}


watch (
    () => props.applicationNumber,
    async (data) => {
      if(data){
        ApplicationStore.fetchApplicationById(data)
        //.setvalues
      }
    },
    {deep:true}
)

watch (
    () => ApplicationStore.applicationByIdResponse,
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
        appDatails.preferred_campus_number=data.Student.preferred_campus_number,
        appDatails.reason=data.Student.reason
        appDatails.previousSchools=data.PreviousSchools
        // alert(JSON.stringify(data.Parent.surname))
      }
    },
    {deep:true}
)


const formData = reactive({
  scheduled_on:null,
  message:null,
})

function scheduleInterview(){
  // alert(JSON.stringify(formData))
  //code to call the endpoint
}

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