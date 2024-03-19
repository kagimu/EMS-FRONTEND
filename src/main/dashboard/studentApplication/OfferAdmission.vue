<template>
  <div>
    <form @submit.prevent="admitStudent">
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="card-body"><div class="pt-2"><div><div data-show="true"
               class="ant-alert ant-alert-info ant-alert-no-icon mb-3 css-zxymk0" role="alert">
              
               <div class="ant-alert-action">
                <button type="submit" class="ant-btn css-zxymk0 ant-btn-primary ant-btn-sm ant-btn-dangerous text-sm text-uppercase fw-bold"></button>
         </div>
              <div class="ant-card-body">
              <div class="row"><div class="col-md-9"><div class="table-responsive">
                <table class="text-sm table table-sm table-striped table-bordered">
                  <tbody>
                    <tr>
                      <td style="width: 200px;">APPLICANT:</td>
                      <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                  </span><span>{{appDatails.studentSurname + " "+ appDatails.Studentsecond_name + " " + appDatails.StudentOther_name}}</span></span>
                </td>

              </tr>
              <tr>
                      <td style="width: 200px;">GENDER:</td>
                      <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                  </span><span>{{ appDatails.StudentGender }}</span></span>
                </td>
              </tr>
              <tr>
                      <td style="width: 200px;">DOB:</td>
                      <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                  </span><span>{{ appDatails.StudentDate_of_birth }}</span></span>
                </td>
                
              </tr>

              <tr>
                <td>APPLICATION ID:</td><td>{{ appDatails.number }}</td></tr>
                  <tr><td>PREFERED CLASS:</td><td>P.2</td></tr>
                  <tr><td>SCHOOL:</td><td>Paul Mukasa Primary</td>
                  </tr>
                  <tr><td>CAMPUS:</td><td>{{ appDatails.preferred_campus_number }}</td></tr>
                  <tr><td>INTERVIEW STATUS:</td>
                    <td class="font500 text-info">{{ appDatails.status }}</td> </tr>
                    <tr><td>Payment Status:</td>
                      <td class="font500"><span class="font500 text-info ms-1"><span class="text-warning">PENDING</span></span></td>
                    </tr></tbody>
                  </table>

                </div>
              </div>
        
                  </div>
                
                  
                  </div>
                </div></div>
                </div>
              </div>

</div>
  </div>
  </div></div>
</form>

  </div>
  
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch,watchEffect,computed} from "vue"
import {useRouter} from "vue-router"
const routerData = useRouter()

import useNotificationStore from "@/composables/useNotification.js";
import useCommons from "@/composables/useCommons.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";


const router = useRouter()
const emit = defineEmits()
const studentNumber = routerData.currentRoute.value.query.st_id;
const appNo = routerData.currentRoute.value.query.applicationN;
// applicationN


const applicationStore = useApplicationStore()
const notificationStore = useNotificationStore()
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

onMounted(() => {
  applicationStore.fetchApplicationById(appNo)
      }
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
        appDatails.preferred_campus_number=data.Student.preferred_campus_number,
        appDatails.reason=data.Student.reason_for_choosing_school,
        appDatails.status=data.status
        appDatails.previousSchools=data.PreviousSchools
          appDatails.student_number = data.Student.number

        // alert(JSON.stringify(data.Parent.surname))
      }
    },
    {deep:true}
)


  watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message     
      }
    },
    {deep:true}
)


  </script>


  
  <style scoped>
  
  </style>