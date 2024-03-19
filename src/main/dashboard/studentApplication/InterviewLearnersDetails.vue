<template>
    <div>
    
      <div class="row">
          <div class="col-12">
            <div class="card mt-3">
              <div class="card-header">
         <div class="row">
          <div class="col-lg-4">
              <h6 class="textColor" style=" text-align: left;font-size: 15px;">
                <i class="bi bi-x-lg" @click="goBack()"></i>&nbsp;&nbsp;&nbsp;STUDENT ADMISSION<b></b>    
              </h6>
          </div>
          <!-- <div class="col-lg-8">
            <button type="link" @click="goBack()" class="btn btn-primary textColor" style="float: right;font-size: 15px;margin-left:">ADMIT STUDENT</button>
          </div> -->
         </div>
             </div>
              <div class="card-body" style="padding: 0;">
          <div class="container mt-4">
    
    
            
      <ul class="nav nav-tabs text-xs" style="margin-top: 50px;">
        <li class="nav-item cursor-pointer">
          <a style="color: black;" class="nav-link" @click="nextPage(1)" :class="step === 1 ? 'active activeTab' : ''">LEARNER'S DETAILS</a>
        </li>
        <li class="nav-item cursor-pointer">
          <a style="color: black;" class="nav-link" @click="nextPage(2)" :class="step === 2 ? 'active activeTab' : ''">PAYMENT/INVOICES </a>
        </li>
        <li class="nav-item cursor-pointer">
          <a style="color: black;" class="nav-link" @click="nextPage(3)" :class="step === 3 ? 'active activeTab' : ''">ATTEMPTED ASSESSMENTS</a>
        </li>
      </ul>

      <div v-show="step === 1">
        <admit-student  v-on:next="nextPage">
        </admit-student>
      </div>
      <div v-show="step === 2">
        <new-invoice v-on:next="nextPage">
        </new-invoice>
        
      </div>
      <div v-show="step === 3">
 <attempted-assessment v-on:next="nextPage"></attempted-assessment>
      </div>
    

    
            </div>
            </div>
            </div>
            </div>
            </div>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    </div>
    </template>
    
    <script setup>
    import NewInvoice from "@/main/dashboard/invoice/NewInvoice.vue";
    import AttemptedAssessment from "@/main/dashboard/studentAdmission/newAdmissionComponents/AttemptedAssessment.vue";
    import {ref} from "vue";
    import AdmitStudent from "@/main/dashboard/studentApplication/AdmitStudent.vue";
    
    const step = ref(1)
    
    function nextPage(data){
      step.value = data
    }
    
    const goBack = () => {
       window.history.back()
      }
    </script>
    
    <style scoped>
    .activeTab{
      font-weight: bold;
    }
    </style>