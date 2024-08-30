<script setup>

import {reactive, ref, watch,onMounted} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const buttonLoader = ref(false)
let errorMessage = ref(null)
const applicationId = ref(null)

const emit = defineEmits()

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

const formData =  reactive({
  schools: [
            {
              name: '',
              classes: [
                  {
                    year:'',
                    class:''
                  }
              ],
        }
      ],
})


const goBack = () =>{
  emit("next", {id:applicationId.value, step:2})
}

const skip = () =>{
  applicationStore.submitApplicationOnSkipPreviousSchool(applicationId)
  emit("next", {id:applicationId.value, step:4})
}
watch (
    () => applicationStore.submitApplicationOnSkipPreviousSchoolResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        emit("next", {id:applicationId.value, step:4})
      }
    }
)




const addSchoolDetails = () => {
    buttonLoader.value = true
    let application_id = applicationId.value
    applicationStore.newApplicationPrevSchoolDetails(application_id,formData.schools)
}


watch (
    () => applicationStore.updatePreviousSchoolresponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", {id:applicationId.value, step:4})
      }
    }
)



const addSchool = () => {
    formData.schools.push({
      name: '',
      classes: [{year:'',class:''}],
    });
}

const removeSchool = (schoolIndex) => {
  formData.schools.splice(schoolIndex, 1);
}

const addClass = (schoolIndex) => {
  const lastClass = formData.schools[schoolIndex].classes[formData.schools[schoolIndex].classes.length - 1];
  if (lastClass !== '') {
    formData.schools[schoolIndex].classes.push({year:'',class:''});
  }
}

const removeClass = (schoolIndex, classIndex) => {
  formData.schools[schoolIndex].classes.splice(classIndex, 1);
}





watch (
    () => applicationStore.newApplicationPreviousSchoolsResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success application submitted", data.message)
        emit("next", {id:applicationId.value, step:4})

      }
    }
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)


watch (
    () => applicationStore.applicationByIdResponse,
    async (data) => {
      if(data){
        applicationId.value = data.number
        // formData.schools = data.previous_schools
      }
    }
)

</script>
<template>
    <div>
    <p class="ml-4 mt-4 mb-2" style="text-align: center !important;">PREVIOUS SCHOOL RECORDS</p>
   </div>
<div>




  <form @submit.prevent="addSchoolDetails">
        <div v-for="(school, schoolIndex) in formData.schools" :key="schoolIndex" class="school-section mb-4" 
        style="background-color: #f8f9fa;">
          <div class="row">
            <div class="col-lg-12">
              <div class="form-group">
              <label class="textColor text-sm" ><small>School Name
              <button @click="removeSchool(schoolIndex)" type="button">
                <i style="color:red;width: 12px;height: 12px;" class="bi bi-x-circle"></i></button></small>
               </label>
              <input type="text" class="form-control shadow-none" v-model="school.name">
            </div>
            </div>
          </div>
         
          <div class="classes-section">
              &nbsp;
              <label class="textColor text-sm" ><small> Classes Attended</small></label>
              <label class="textColor text-sm" ><small>
                  &nbsp;&nbsp;<button type="button" @click="addClass(schoolIndex)"><i  class="bi bi-plus-circle"></i></button></small> </label>

              <div class="row" v-for="(className, classIndex) in school.classes" :key="classIndex">
            <div class="col-lg-5">
                <div class="input-group mb-3 flex " >
                    <label class="textColor text-sm" ><small>Class</small></label>
              <input type="text" class="form-control mx-2 shadow-none" v-model="school.classes[classIndex].class">
            </div>
            </div>
            <div class="col-lg-5">
              <div class="mb-3 flex" >
                <label class="textColor text-sm" ><small>Year</small></label>
              <input type="text" class="form-control mx-2 shadow-none" v-model="school.classes[classIndex].year">

            </div>
            </div>
            <div class="col-lg-1">
              <label class="textColor text-sm" ><small></small></label>
             <button type="button"  @click="removeClass(schoolIndex, classIndex)" style="color:red;width: 12px;height: 12px;" title="Remove class"><i class="bi bi-x-circle-fill"></i></button>
            </div>
          </div>
           
          </div> 
        </div>
        <div class="row" style="margin-top: -20px;">
          <div class="col-lg-12">
            <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" @click="addSchool"><small>Add Another School</small></button>
          </div>
        </div>
        <div class="text- mt-4">
          <div class="row">
          
            <div class="col-lg-4">
              <button @click="goBack()" type="button" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
              <small><i class="bi bi-box-arrow-in-left"></i> Back</small>  
          </button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button @click="skip()"   type="button"  class="btn btn-sm btn-danger mb-2 ml-3" style="color: white;float: right;">
                <small><i class="bi bi-skip-end"></i>Skip</small>
          </button>
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-1" style="color: white;float: right !important;margin-right: 0px;">
                <small><i class="bi bi-save"></i>Next</small>
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
          </div>
        </div>
      </form>

      

      <!-- <form @submit.prevent="addSchoolDetails">
        <div v-for="(school, schoolIndex) in formData.schools" :key="schoolIndex" class="school-section mb-4" 
        style="background-color: #f8f9fa;">
          <div class="row">
            <div class="col-lg-12">
              <div class="form-group">
              <label class="textColor text-sm" ><small>School Name
              <button @click="removeSchool(schoolIndex)" type="button">
                <i style="color:red;width: 12px;height: 12px;" class="bi bi-x-circle"></i></button></small>
               </label>
              <input type="text" class="form-control shadow-none" v-model="school.name">
            </div>
            </div>
          </div>
         
          <div class="classes-section">
              &nbsp;
              <label class="textColor text-sm" ><small> Classes Attended</small></label>
              <label class="textColor text-sm" ><small>
                  &nbsp;&nbsp;<button type="button" @click="addClass(schoolIndex)"><i  class="bi bi-plus-circle"></i></button></small> </label>

              <div class="row" v-for="(className, classIndex) in school.classes" :key="classIndex">
            <div class="col-lg-5">
                <div class="input-group mb-3 flex " >
                    <label class="textColor text-sm" ><small>Class</small></label>
              <input type="text" class="form-control mx-2 shadow-none" v-model="school.classes[classIndex].class">
            </div>
            </div>
            <div class="col-lg-5">
              <div class="mb-3 flex" >
                <label class="textColor text-sm" ><small>Year</small></label>
              <input type="text" class="form-control mx-2 shadow-none" v-model="school.classes[classIndex].year">

            </div>
            </div>
            <div class="col-lg-1">
              <label class="textColor text-sm" ><small></small></label>
             <button type="button"  @click="removeClass(schoolIndex, classIndex)" style="color:red;width: 12px;height: 12px;" title="Remove class"><i class="bi bi-x-circle-fill"></i></button>
            </div>
          </div>
           
          </div> 
        </div>
        <div class="row" style="margin-top: -20px;">
          <div class="col-lg-12">
            <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" @click="addSchool"><small>Add Another School</small></button>
          </div>
        </div>
        <div class="text- mt-4">
          <div class="row">
          
            <div class="col-lg-4">
              <button @click="goBack()" type="button" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
              <small><i class="bi bi-box-arrow-in-left"></i> Back</small>  
          </button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button @click="skip()"   type="button"  class="btn btn-sm btn-danger mb-2 ml-3" style="color: white;float: right;">
                <small><i class="bi bi-skip-end"></i>Skip</small>
          </button>
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-1" style="color: white;float: right !important;margin-right: 0px;">
                <small><i class="bi bi-save"></i>Next</small>
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
          </div>
        </div>
      </form> -->
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
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
}
input{
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
.tit{
  text-align: center;
  margin-top: 15px;
  text-decoration: underline;
}
.star{
  color:red;
}
textarea{
  border-radius: 2px !important;
}
select{
  border-radius: 2px !important;
}
.small-input {
  width: 150px;
  font-size: 13px;
}
</style> 

