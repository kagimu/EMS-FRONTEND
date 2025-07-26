<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import { useUserStore } from "@/main/dashboard/profiles/store/users.js"
   
const userStore = useUserStore()
const routerData = useRouter()
const buttonLoader = ref(false)
const  notificationStore  = useNotificationStore()

onMounted(
    async () => {
     getStudentProfileData()
    } )

const form = reactive({
  surname: null,
  second_name: null,
  other_name: null,
  lin: null,
  date_of_birth: null,
  gender: null,
  apn_status: null,
  reason_for_choosing_school: null,
  preferred_type_of_enrollment: null,
  campus_class_number: null,
  school_number: null,
  
})

const props = defineProps({
    studentProfileData: {},
})

const getStudentProfileData = () => {
  form.surname = props.studentProfileData.surname
  form.second_name = props.studentProfileData.second_name
  form.other_name = props.studentProfileData.other_name
  form.lin = props.studentProfileData.lin
  form.date_of_birth = props.studentProfileData.date_of_birth
  form.gender =props.studentProfileData.gender
    form.apn_status = props.studentProfileData.apn_status
    form.reason_for_choosing_school = props.studentProfileData.reason_for_choosing_school
    form.preferred_type_of_enrollment = props.studentProfileData.current_enrollment.preferred_type_of_enrollment
    form.campus_class_number = props.studentProfileData.current_enrollment.campus_class_number
    form.school_number = props.studentProfileData.current_enrollment.school_number

}

watch(
    () => props.studentProfileData,
    async (data) => {
      if(data){
        getStudentProfileData()
      }
    }
)

const updateStudentBio = () => {
  buttonLoader.value = true
  form.student_number = routerData.currentRoute.value.query.st_id
//   alert(JSON.stringify(form))
  userStore.updateStudentBioDetails(form)
}

watch (
    () => userStore.errorMessage,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


watch (
    () => userStore.updateStudentBioResponse,    
    
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success",data.message)
      }
    },
    {deep:true}
)
</script>

<template>
    <!-- {{ studentProfileData }} -->
  <div>
  <p class="ml-4 mt-2 mb-2" style="text-align: center !important;">DETAILS OF THE LEARNER</p>
    <form @submit.prevent="updateStudentBio" style="margin-top: 1px;">
    <div class="row">
      <div class="col-12">
          <div class="mb-2">
            <label class="text-sm text-sm"><small>Surname</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  v-model="form.surname"  required class="form-control form-control-sm">
          </div>

        <div class="row">
          <div class="col-6">
            <div class="mb-2">
              <label class="text-sm text-sm"><small>Second name</small> <span class="star">*</span></label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name"  required class="form-control form-control-sm">
            </div>
          </div>
          <div class="col-6">
            <div class="mb-2">
              <label class="text-sm text-sm"><small>Other names</small> </label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name" class="form-control form-control-sm">
            </div>
          </div>
        </div>

          <div class="row">
            <div class="col-lg-6">
              <label class="text-sm text-sm"><small>DOB</small> <span class="star">*</span></label>
            <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.date_of_birth"  required
             class="form-control form-control-sm">
            </div>
            <div class="col-lg-6">
              <label class="text-sm text-sm"><small>gender</small> <span class="star">*</span></label>
            <select class="form-control form-control-sm"
             v-model="form.gender" style="outline: none 0 !important; box-shadow: none;">
              <option value="" disabled>-Select Gender-</option>
              <option value="Male">Male</option>
              <option value="Female" >Female</option>
            </select>
            </div>

          </div>
      </div>   
   
        <div class="text- mt-4">
          <div class="row" >
            <div class="col-lg-4">
           
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4 "
               style="color: white;float: right;">
               <small>Update &nbsp;<i class="bi bi-box-arrow-in-right"></i></small>  
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
            </div>
            
          </div>
        </div>
    </div>
    </form>
  </div>
  </template>
  

  
  <style scoped>
  .mb-8 {
    margin-bottom: 2rem;
    text-align: left;
       color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
}
.mb-2 {
    /* margin-bottom: 2rem; */
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
    /* font-size: 17px; */
}
input{
  /* width:480px; */
  /* margin-top: 8px; */
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
select{
  /* margin-top: 8px !important; */
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
.star{
  color:red;
}
  </style>