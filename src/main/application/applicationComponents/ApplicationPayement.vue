<template>
    <div>
    <p class="ml-4 mt-4 mb-4" style="text-align: center !important;">
      <i class="bi bi-arrow-left" @click="goBack()"></i> &nbsp;
      Payment Summary</p>
   </div>
<div class="container mt-0">
  <div>
      <div class="row">
            <div  style="padding: 0;">
        <div class="container mt-0">
          <form @submit.prevent="submitPayment">

            <div class="row mx-auto">
    <div class="col-6">
      <p>Choose Payment Method</p>
        <div class="mb-2">
          <input  v-model="answer" value="mobile" class="mt-4" type="radio"   required> &nbsp;Mobile Money<br>
          <input v-model="answer" value="bank" class="mt-4" type="radio"   required> &nbsp;Bank Deposit
        </div>
        </div>
       
        <hr>
        <div class="row" v-if="answer === 'mobile'">
          <div class="col-lg-9">
            <input type="text" class="form-control" placeholder="Enter Phone Number to Pay">
          </div>
          <div class="col-lg-3">
            <button type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Pay</button>
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

          <div class="row" >
            <hr>
            <div class="col-lg-9"></div>
          <div class="col-lg-3">
            <button type="submit" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Print</button>
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
  
  const answer = ref('')
  const emit = defineEmits()

  const goBack = () =>{
  emit("next", 3 )
  }
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

