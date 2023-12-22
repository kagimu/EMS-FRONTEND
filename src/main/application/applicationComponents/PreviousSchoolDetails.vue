<template>
    <div>
    <p class="ml-4 mt-4 mb-10" style="text-align: center !important;">PREVIOUS SCHOOL RECORDS</p>
      <form @submit.prevent="addSchoolDetails" style="margin-top: 20px; display: none;">
      <div class="row mx-auto">
        <div class="col-12" style="border-right:solid whitesmoke 1px;">
            <div class="mb-2">
            <label class="textColor text-sm"><small>How Did You Know ABout the School ?</small></label>
            <select style="outline: none 0 !important; box-shadow: none;font-size: 10px;" v-model="form.know_school"  required class="select form-control form-control-sm" multiple>
            <option value="1">Old parent</option>
            <option value="2">Friend</option>
            <option value="3">Newspaper</option>
            <option value="4">Television</option>
            <option value="5">Internet</option>
            </select>
            <br>
            <label  class="textColor text-sm"><small>Other (specify in form of memo description)</small> </label>
            <textarea  style="" class="select form-control form-control-sm" v-model="form.other_description"></textarea>
            </div>
        </div>
        <div class="text- mt-4">
          <div class="row">
          
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
         <small><i class="bi bi-box-arrow-in-left"></i> Back</small>  
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4" style="color: white;float: right !important;margin-right: 0px;">
                <small><i class="bi bi-save"></i> Submit</small>
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


   
<div class="container mt-0">
      <form @submit.prevent="submitForm">
  
        <div v-for="(school, schoolIndex) in formData.schools" :key="schoolIndex" class="school-section mb-4" style="background-color: #f8f9fa;">
          <div class="row">
            <div class="col-lg-12">
              <div class="form-group">
                <label class="textColor text-sm" ><small>School Name&nbsp;<button title="Remove Class" style="width:10px;padding:0px;height: 10px;color:red;"    @click="removeSchool(schoolIndex)">X</button></small> </label>
            <input type="text" class="form-control" v-model="school.name"> 
          </div>
            </div>
          </div>
         
          <div class="classes-section">
            <label class="textColor text-sm" ><small>Classes Attended   &nbsp;
                <button title="Add class" style="color:rgb(33, 9, 154);width: 12px;height: 12px;"  @click="addClass(schoolIndex)"><i class="bi bi-plus-circle"></i></button></small> </label>
            <div class="input-group mb-3" v-for="(className, classIndex) in school.classes" :key="classIndex">
              <input type="text" class="form-control" v-model="school.classes[classIndex]"> &nbsp;&nbsp;<button  @click="removeClass(schoolIndex, classIndex)" style="color:red;width: 12px;height: 12px;" title="Remove class"><i class="bi bi-x-circle-fill"></i></button>
           
            </div>
            
          </div>
          
        </div>
        <div class="row" style="margin-top: -20px;">
          <div class="col-lg-12">
            <!-- Only add a new school if the current school has a non-empty name and classes array is not empty -->
            <button class="btn btn-sm btn-outline-success mb-2 mr-4" @click="addSchool" :disabled="!canAddSchool()"><small  style="color: rgb(8, 8, 8);">Add Another School</small></button>
          </div>
        </div>
  
        <div class="col-12" style="border-right:solid whitesmoke 1px;">
            <div class="mb-2">
            <label class="textColor text-sm"><small>How Did You Know ABout the School ?</small></label>
            <select style="outline: none 0 !important; box-shadow: none;font-size: 10px;" v-model="form.know_school"  required class="select form-control form-control-sm" multiple>
            <option value="1">Old parent</option>
            <option value="2">Friend</option>
            <option value="3">Newspaper</option>
            <option value="4">Television</option>
            <option value="5">Internet</option>
            </select>
            <br>
            <label  class="textColor text-sm"><small>Other (specify in form of memo description)</small> </label>
            <textarea  style="" class="select form-control form-control-sm" v-model="form.other_description"></textarea>
            </div>
        </div>
        <div class="text- mt-4">
          <div class="row">
          
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
         <small><i class="bi bi-box-arrow-in-left"></i> Back</small>  
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4" style="color: white;float: right !important;margin-right: 0px;">
                <small><i class="bi bi-save"></i> Submit</small>
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
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
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
}
.mb-2 {
    /* margin-bottom: 2rem; */
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    /* font-size: 17px; */
    border-radius: 3px !important;
}
input{
  /* width:480px; */
  /* margin-top: 8px; */
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
.tit{
  /* width:480px; */
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

</style> 



<script>
export default {
  data() {
    return {
      formData: {
        schools: [{
          name: '',
          classes: [''],
        }],
      },
    };
  },
  methods: {
    addSchool() {
      const lastSchool = this.formData.schools[this.formData.schools.length - 1];
      // Only add a new school if the current school has a non-empty name and classes array is not empty
      if (lastSchool.name !== '' && lastSchool.classes.some(className => className !== '')) {
        this.formData.schools.push({
          name: '',
          classes: [''], // Add an initial empty class attended field for the new school
        });
      }
    },
    removeSchool(schoolIndex) {
      this.formData.schools.splice(schoolIndex, 1);
    },
    addClass(schoolIndex) {
      const lastClass = this.formData.schools[schoolIndex].classes[this.formData.schools[schoolIndex].classes.length - 1];
      // Only add a new class if the current class is non-empty
      if (lastClass !== '') {
        this.formData.schools[schoolIndex].classes.push('');
      }
    },
    removeClass(schoolIndex, classIndex) {
      this.formData.schools[schoolIndex].classes.splice(classIndex, 1);
    },
    submitForm() {
      // Handle form submission logic here
      // console.log('Form submitted:', this.formData);
    },
    canAddSchool() {
      const lastSchool = this.formData.schools[this.formData.schools.length - 1];
      return lastSchool.name !== '' && lastSchool.classes.some(className => className !== '');
    },
  },
};
</script>

<style scoped>
/* Add custom styles for small input fields and font size */
.small-input {
  width: 150px;
  font-size: 13px;
}
</style>
