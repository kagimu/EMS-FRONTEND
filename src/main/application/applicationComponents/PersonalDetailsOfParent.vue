<template>
<div>
<p class="ml-4 mt-4 mb-10" style="text-align: center !important;">GUARDIAN/PARENT DETAILS</p>

<div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>

  <form  @submit.prevent="addParentPersonalDetails" style="margin-top: 16px;"> 
  <div class="row mx-auto">
    <div class="col-12">
        <div class="mb-8">
          <label class="textColor text-sm"><small>Surname/Family name</small> <span class="star">*</span></label>
          <input type="text" style="outline: none 0 !important; box-shadow: none; font-size: 10px;;" v-model="form.surname" required class="form-control form-control-sm">
        </div>

        <div class="mb-8">
          <label class="textColor text-sm"><small>Second name </small><span class="star">*</span></label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name"  required class="form-control form-control-sm">
        </div>

        <div class="mb-8">
          <label class="textColor text-sm"><small>Other names</small> </label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name"  required class="form-control form-control-sm">
        </div>

        <div class="mb-2">
          <label class="textColor text-sm"> <small>Telephone No. </small><span class="star">*</span></label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.main_telephone_number"   required class="form-control form-control-sm">
        </div>

        <div class="mb-2">
          <label class="textColor text-sm"><small>Alternative No.</small> </label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.alternative_telephone_number"  class="form-control form-control-sm">
        </div>
         <div class="row">
          
            <div class="mb-2">
          <label class="textColor text-sm"><small>Email</small> <span class="star">*</span></label>
          <input type="email" style="outline: none 0 !important; box-shadow: none;" v-model="form.email"  required class="form-control form-control-sm">
        </div>
         
          
            <div class="mb-2">
          <label class="textColor text-sm"><small>Alternative Email</small></label>
          <input type="email" style="outline: none 0 !important; box-shadow: none;" v-model="form.alternative_email" class="form-control form-control-sm">
        </div>
          </div>
        
    </div>
        <div class="text- mt-4">
          <div class="row">
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4" style="color: white;">
                <small>Next &nbsp;<i class="bi bi-box-arrow-in-right"></i></small> 
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
            </div>
            <div class="col-lg-5"></div>
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
  main_telephone_number:null,
  email:null,
  alternative_email:null,
  alternative_telephone_number:null,
})

const addParentPersonalDetails = () => {
  buttonLoader.value = true
  applicationStore.newApplicationDetails(form)
}

watch (
    () => applicationStore.newApplicationDetailsResponse,
    async (data) => {
      if(data){
          alert(data.application_number)
          localStorage.setItem("applicationId", data.application_number)
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", 2 )
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
    margin-bottom: 0.5rem !important;
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
   
}
.mb-2 {
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    /* font-size: 17px; */
    border-radius: 3px !important;
}
input{
  /* width:480px; */
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
.star{
  color:red;
}

</style>