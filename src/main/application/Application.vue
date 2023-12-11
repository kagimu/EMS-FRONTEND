<template>
  <div>
    <div class="row">
      <div style="padding-top: 120px;">
      <h5 class="txt" >APPLY</h5>
      <h1  class="txt">STUDENT APPLICATION</h1>
      <p  class="txt">Get Started Today With Few Steps </p>
    </div>
      <div class="col-lg-12">
        <div class="card" style="margin:50px;border-radius: 16px;">
          <div class="card-body" >
           <div class="row">
            <div class="col-lg-6" style="text-align: center;padding-top:20px;">
              <p>You are applying for</p>
              <h1>Wholesome Services</h1>
              <p>To continue your application, please fill out the form below.</p>
            </div>
            <div class="col-lg-6">
              <div>
            <div class="text-center">
              <ul class="nav nav-tabs text-xs" style="margin-top: 50px;">
              <li class="nav-item cursor-pointer">
                <a style="color: black;" class="nav-link" @click="nextPage(1)" :class="step === 1 ? 'active activeTab' : ''">GUARDIAN/PARENT DETAILS</a>
              </li>
              <li class="nav-item cursor-pointer">
                <a style="color: black;" class="nav-link" @click="nextPage(2)" :class="step === 2 ? 'active activeTab' : ''">DETAILS OF THE LEARNER</a>
              </li>
              <li class="nav-item cursor-pointer">
                <a style="color: black;" class="nav-link" @click="nextPage(3)" :class="step === 3 ? 'active activeTab' : ''">PREVIOUS SCHOOL RECORDS</a>
              </li>
            </ul>
          </div>
        
  <div v-show="step === 1">
    <personal-details-of-student
        v-on:next="nextPage"
    ></personal-details-of-student>
  </div>
  <div v-show="step === 2">
    <personal-details-of-learner
        v-on:next="nextPage"
    ></personal-details-of-learner>
  </div>
  <div v-show="step === 3">
    <previous-school-details
        v-on:next="nextPage"
    ></previous-school-details>
  </div>
 </div>
          </div>
        </div>
      </div>
 
   </div>
  </div>
            </div>

           </div>
          
</template>


<style scoped>

.content {
  position: absolute;
  left: 50%;
  top: 80%;
  transform: translate(-50%, -50%);
}

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
  float: left !important;
}.txt{
  text-align: center;
  color: #0b0b0b;
}

</style>

<script setup>

import PersonalDetailsOfStudent from "@/main/application/applicationComponents/PersonalDetailsOfParent.vue";
import PersonalDetailsOfLearner from "@/main/application/applicationComponents/PersonalDetailsOfLearner.vue";
import PreviousSchoolDetails from "@/main/application/applicationComponents/PreviousSchoolDetails.vue";


import {ref} from "vue";

const step = ref(1)

function nextPage(data){
  step.value = data
}

</script>
