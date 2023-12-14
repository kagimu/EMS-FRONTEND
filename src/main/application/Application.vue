<template>


  <div class="temp">
    <div class="row">
      <div style="padding-top: 200px;">
      <h5 class="txt" >APPLY</h5>
      <h1  class="txt2">STUDENT APPLICATION</h1>
      <p  class="txt">Get Started Today With Few Steps </p>
    </div>
      <div class="col-lg-12">
        <div class="card" style="margin:50px;border-radius: 16px;">
          <div class="card-body" >
           <div class="row">
            <div class="col-lg-5" style="text-align: center;padding-top:28px;">
              <p class="txt4">You are applying for</p>
              <h1 class="txt3">Wholesome Services</h1>
              <p class="txt4">To continue your application, please fill out the form below.</p>
            </div>
            <div class="col-lg-7">
              <div>
            <div class="text-center">
              <ul class="nav nav-tabs text-xs" style="margin-top: 50px;">
              <li class="nav-item cursor-pointer">
                <a style="color: black;font-family: Roboto, sans-serif !important;" class="nav-link" @click="nextPage(1)" :class="step === 1 ? 'active activeTab' : ''">GUARDIAN/PARENT DETAILS</a>
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
  /* position: absolute; */
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
  color: rgb(215, 214, 214);
    font-family: Spartan, sans-serif;
    font-size: 17px;
    font-weight: 700;
}
.txt2{
  color: rgb(255, 255, 255);
    text-shadow: rgba(0, 0, 0, 0.3) 0px 0px 6px;
    text-transform: uppercase;
    font-family: Spartan, sans-serif;
    font-weight: 900;
    text-align: center;
    font-size: 20px;
    padding-top: 10px;
    padding-bottom: 14px;
}
.txt3{
  text-align: center;
    color: rgb(10, 77, 159);
    font-family: Spartan, sans-serif;
    font-size: 33px;
    font-weight: 800;
}
.tx4{
  text-align: center;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
}
.temp{ 
  height: 100%;
    width: 100%;
 background-image: linear-gradient(
    rgba(0, 0, 0, 0.705),
    rgba(0, 0, 0, 0.511)
    ),
    url(https://blog.bestbuy.ca/wp-content/uploads/2017/07/the-top-10-laptops-for-back-to-school.jpg);
  background-size: cover;
  background-position: top;
  position: relative;
    margin-top: -20px;
    margin-bottom: 30px;
    
    
}
.container-fluid{
  padding-top: 0%;
}
.nav-link{
  color: rgb(10, 77, 159) !important;
    font-family: Spartan, sans-serif !important;
  font-size: 12px !important;
  font-family: bold;
}
.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    color: red !important;
}
* {
  margin: 0;
  padding: 0;
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
