<template>
  <div>
  <p class="ml-4 mt-4 mb-10"> LEARNER'S DETAILS</p>
  <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
    <form @submit.prevent="addLearnerDetails">
    <div class="row">
      <div class="col-12">
          <div class="mb-2">
            <label class="textColor text-sm">Surname *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  v-model="form.surname"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm">Second name *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm">Other names *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Desired Class</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.desired_class"  required class="form-control form-control-sm">
          </div>
           <div class="row">
            <div class="col-lg-6">
              <div class="mb-2">
            <label class="textColor text-sm">DOB</label>
            <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.dob"  required class="form-control form-control-sm">

          </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-2">
            <label class="textColor text-sm">Sex *</label>
            <select class="form-control form-control-sm" v-model="form.sex">
              <option>-select-</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
            </div>
           </div>
      </div>   
   
        <div class="text- mt-4">
          <div class="row">
            <div class="col-lg-3">
              <button type="submit" class="btn btn-success mb-2 mr-4">
           <i class="bi bi-box-arrow-in-left"></i> Back
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
            <div class="col-lg-3">
              <button type="submit" class="btn btn-primary mb-2 mr-4">
                Next &nbsp;<i class="bi bi-box-arrow-in-right"></i> 
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
            </div>
            <div class="col-lg-6"></div>
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
  desired_class:null,
  dob:null,
  sex:null,
})


const addLearnerDetails = () => {
  buttonLoader.value = true
  applicationStore.newApplicationDetails(form)
}

watch (
    () => applicationStore.newApplicationDetailsResponse,
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
    margin-bottom: 2rem;
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
}
input{
  width:480px;
  margin-top: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
}
  </style>