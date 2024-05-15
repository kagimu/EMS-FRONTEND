<template>

      <!-- Prompt/modal for applying -->
      <div v-if="showPrompt" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Apply?</h5>
            <button type="button" class="btn-close" @click="cancelApply"></button>
          </div>
          <div class="modal-body">
            <p>Do you want to submit your payment?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelApply">Cancel</button>
            <button type="button" class="btn btn-primary" @click="submitApplication">Apply</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>


    <!-- Success Page -->
    <div v-if="success" class="container mt-5">
      <!-- Your success page content goes here -->
      <div class="row">
        <div class="col-lg-4"></div>
        <div class="col-lg-4"><img src="https://cdn.pixabay.com/photo/2014/04/02/11/01/tick-305245_1280.png"></div>
        <div class="col-lg-4"></div>
      </div>
      <p class="mt-2">Congratulations! Your Application hasbeen successfully submitted.</p>
    </div>

    <div v-if="!success">

    <p class="ml-4 mt-4 mb-4" style="text-align: center !important;">
      <i class="bi bi-arrow-left" @click="goBack()"></i> &nbsp;
      Payment Summary</p>
   </div>
<div class="container mt-0">
  <div>
      <div class="row">
            <div  style="padding: 0;">
        <div class="container mt-0">
          <form @submit.prevent="submitPayment" v-if="!success">

            <div class="row mx-auto" >
    <div class="col-6">
      <p>Choose Payment Method</p>
        <div class="mb-2">
          <input selected  v-model="answer" value="offline" class="mt-4" type="radio"   required> &nbsp;Offline<br>
          <input  v-model="answer" value="mobile" class="mt-4" type="radio"   required> &nbsp;Mobile Money<br>
          <input v-model="answer" value="bank" class="mt-4" type="radio"   required> &nbsp;Bank Deposit
        </div>
        </div>
       
        <hr>
        <div class="row" v-if="answer === 'mobile'">
          <div class="col-lg-9">
           <p>MMO : 07837474723</p>
          </div>
          <div class="col-lg-3">
            <button @click="submitApplication" type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Submit</button>
          </div>
        </div>
        <div class="row" v-if="answer === 'offline'">
    
          <div class="col-lg-3">
            <button @click="submitApplication" type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">SUBMIT</button>
          </div>
        </div>


      <!-- Bank Pay Slip -->
        <div class="row" v-if="answer === 'bank'">
          <div class="col-lg-12">
            <div class="">
              Bank : ABSA<br>
              Account No. 9000393993023<br>
              Amount : 50,000 UGX<br>
              Account Name: SASULA PRIMARY
            </div>
          </div>

          <div class="row">
            <hr>
            <div class="col-lg-9"></div>
          <div class="col-lg-3">
            <button  @click="submitApplication" type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Submit</button>
          </div>
        </div>
          </div>
        
        </div>

          </form>
        </div>
    </div>
    </div>
    </div>
    </div>
    </template>
 


 
 <script setup>
    
  import {onMounted,reactive, ref, watch,computed} from "vue";
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
  import { useRouter } from "vue-router";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const applicationStore= useApplicationStore()



const router = useRouter();
  
  const answer = ref('')
  const emit = defineEmits()
  const showPrompt = ref(true)
const loading = ref(false)
const success = ref(false)

  const goBack = () =>{
  emit("next", 3 )
  }

  const showSuccessPage = () =>{
    router.push("/client-dashboard/application-success");
  }

  const submitApplication = () => {
  loading.value = true;
  applicationStore.fetchApplicationList()
  setTimeout(() => {
    loading.value = false; 
    success.value = true; 
  }, 2000); 

  //removing application Id and studentNumber from local storage
  localStorage.removeItem('applicationId')
  localStorage.removeItem('studentNumber')
};

const cancelApply = () => {
  showPrompt.value = false; // Hide prompt if canceled
};
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

