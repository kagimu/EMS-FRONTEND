<template>
    <div>
    <p class="ml-4 mt-4 mb-10"> SCHOOLS ATTENDED</p>
      <form @submit.prevent="addSchoolDetails">
      <div class="row mx-auto">
        <div class="col-12" style="border-right:solid whitesmoke 1px;">
            <h6><center>1</center></h6>
            <div class="mb-2">
              <label class="textColor text-sm">School Name*</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.school_name_one"   required class="form-control form-control-sm">
            </div>
    
            <div class="mb-2">
              <label class="textColor text-sm">Classes Attended *</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.classes_attended_one"   required class="form-control form-control-sm">
            </div>
         
              <h6><center>2</center></h6>
            <div class="mb-2">
              <label class="textColor text-sm">School Name*</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.school_name_two" required class="form-control form-control-sm">
            </div>

            <h6><center>3</center></h6>
            <div class="mb-2">
              <label class="textColor text-sm">School Name*</label>
              <input type="text" 
              style="outline: none 0 !important; box-shadow: none;" v-model="form.school_name_three" 
               required class="form-control">
            </div>
    
            <div class="mb-2">
              <label class="textColor text-sm">Classes Attended *</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.school_name_three"  required class="form-control form-control-sm">
            </div>
            <div class="mb-2">
              <label class="textColor text-sm">Classes Attended *</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.school_name_two"  required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
            <label class="textColor text-sm">How Did You Know ABout the School ?</label>
            <select style="outline: none 0 !important; box-shadow: none;" v-model="form.know_school"  required class="select form-control form-control-sm" multiple>
            <option value="1">Old parent</option>
            <option value="2">Friend</option>
            <option value="3">Newspaper</option>
            <option value="4">Television</option>
            <option value="5">Internet</option>
            </select>
            <br>
            <p>Other (specify in form of memo description) </p>
            <textarea class="select form-control form-control-sm" v-model="form.other_description"></textarea>
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
              <button type="submit" class="btn btn-primary mb-2 mr-4" style="align-items: left;">
                <i class="bi bi-save"></i> Submit
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
            <div class="col-lg-7"></div>
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
  school_name_one:null,
  classes_attended_one:null,
  school_name_two:null,
  classes_attended_two:null,
  school_name_three:null,
  classes_attended_three:null,
  know_school:null,
  other_description:null

})

const addSchoolDetails = () => {
  buttonLoader.value = true,
  applicationStore.newApplicationDetails(form)
}

watch (
    () => applicationStore.newApplicationDetailsResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
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
}
.mb-2 {
    margin-bottom: 2rem;
    text-align: left;
}
input{
  width:480px;
  margin-top: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
}
</style> 