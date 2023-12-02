<template>
  <div>
    <div class="row">
      <div class="col-lg-2"></div>
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
           
            <div>
            <div class="text-center"><p class="h5"><b>Student Application</b></p><hr/>
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
      <div class="col-lg-2"></div>
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
