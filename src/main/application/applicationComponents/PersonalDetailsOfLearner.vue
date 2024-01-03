<template>
  <div>
  <p class="ml-4 mt-4 mb-10" style="text-align: center !important;">DETAILS OF THE LEARNER</p>
  <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
    <form @submit.prevent="addLearnerDetails" style="margin-top: 15px;">
    <div class="row">
      <div class="col-12">
          <div class="mb-2">
            <label class="textColor text-sm"><small>Surname</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  v-model="form.surname"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm"><small>Second name</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm"><small>Other names</small> </label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm"><small>Prefered Class</small> <span class="star">*</span></label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.preferred_type_of_enrollment"  required class="form-control form-control-sm">
          </div>

          
          <div class="mb-2">
            <label class="textColor text-sm"><small>Reason to enroll </small> </label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.reason" required class="form-control form-control-sm">
          </div>


          <div class="mb-2">
              <label class="textColor text-sm"><small>Reason to enroll </small> </label>
              <select >
                  <option>News paper</option>
                  <option>Old parent</option>
                  <option>Television</option>
                  <option>Internet</option>
              </select>
          </div>


          <div class="mb-2">
              <label class="textColor text-sm"><small>Reason to enroll </small> </label>
              <select >
                  <option>News paper</option>
                  <option>Old parent</option>
                  <option>Television</option>
                  <option>Internet</option>
              </select>
          </div>

          <div class="row">
            <div class="col-lg-6">
              <label class="textColor text-sm"><small>DOB</small> <span class="star">*</span></label>
            <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.date_of_birth"  required
             class="form-control form-control-sm">
            </div>
            <div class="col-lg-6">
              <label class="textColor text-sm"><small>Sex</small> <span class="star">*</span></label>
            <select class="form-control form-control-sm" v-model="form.sex" style="outline: none 0 !important; box-shadow: none;">
              <option>-select-</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            </div>

          </div>
      </div>   
   
        <div class="text- mt-4">
          <div class="row" >
            <div class="col-lg-4">
              <button class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
           <small><i class="bi bi-box-arrow-in-left"></i> Back</small>
            <!-- <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div> -->
          </button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4 " style="color: white;float: right;">
               <small>Next &nbsp;<i class="bi bi-box-arrow-in-right"></i></small>  
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
  
  <script setup>
import {reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const buttonLoader = ref(false)
let errorMessage = ref(null)
const emit = defineEmits()

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
  
  const form = reactive({
  surname:null,
  second_name:null,
  other_name:null,
  preferred_type_of_enrollment:null,
  dob:null,
  sex:null,
  reason:null,

})


const addLearnerDetails = () => {
  buttonLoader.value = true
  applicationStore.newApplicationLeanerDetails(form)
}

watch (
    () => applicationStore.newApplicationDetailsLearnerResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", 3 )
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)
  </script>
  
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