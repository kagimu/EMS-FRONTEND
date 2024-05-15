<template>
      <div class="row">
       
              <div class="text-center">
                <ul class="nav nav-tabs text-xs">
                <li class="nav-item cursor-pointer">
                  <a style="color: black;font-family: Roboto, sans-serif !important;" class="nav-link" @click="" :class="step === 1 ? 'active activeTab' : ''"><small>GUARDIAN/PARENT</small></a>
                </li>
                <li class="nav-item cursor-pointer">
                  <a style="color: black;" class="nav-link" @click="" :class="step === 2 ? 'active activeTab' : ''"><small>LEARNER</small></a>
                </li>
                <li class="nav-item cursor-pointer">
                  <a style="color: black;" class="nav-link" @click="" :class="step === 3 ? 'active activeTab' : ''">
                    <small>PREVIOUS SCHOOL</small>
                  </a>
                </li>
                <li class="nav-item cursor-pointer">
                  <a style="color: black;" class="nav-link" @click="nextPage(4)" :class="step === 4 ? 'active activeTab' : ''">
                    <small>PREVIOUS SCHOOL RESULTS</small>
                  </a>
                </li>            
  
                <li class="nav-item cursor-pointer">
                  <a style="color: black;" class="nav-link" @click="nextPage(5)" :class="step === 5 ? 'active activeTab' : ''">
                    <small>PAYMENT</small>
                  </a>
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
    <div v-show="step === 4">
    <PreviousSchoolResults v-on:next="nextPage"></PreviousSchoolResults>
    </div>
    <div v-show="step === 5">
      <application-payement  v-on:next="nextPage">
    </application-payement>
    </div>
   </div>
            
  </template>
  
  <style scoped>
  
  
  </style>
  
  <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import PersonalDetailsOfStudent from "@/main/application/applicationComponents/PersonalDetailsOfParent.vue";
  import PersonalDetailsOfLearner from "@/main/application/applicationComponents/PersonalDetailsOfLearner.vue";
  import PreviousSchoolDetails from "@/main/application/applicationComponents/PreviousSchoolDetails.vue";
  import ApplicationPayement from "@/main/application/applicationComponents/ApplicationPayement.vue";
  import PreviousSchoolResults from "@/main/application/applicationComponents/PreviousSchoolResults.vue";
  
  const step = ref(1)
  
  function nextPage(data){
    step.value = data
  }
  
  </script>
  