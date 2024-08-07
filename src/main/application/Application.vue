<script setup>
import {onMounted, ref} from "vue";
import PersonalDetailsOfStudent from "@/main/application/applicationComponents/PersonalDetailsOfParent.vue";
import PersonalDetailsOfLearner from "@/main/application/applicationComponents/PersonalDetailsOfLearner.vue";
import PreviousSchoolDetails from "@/main/application/applicationComponents/PreviousSchoolDetails.vue";
import ApplicationPayement from "./applicationComponents/ApplicationPayement.vue";
import PreviousSchoolResults from "./applicationComponents/PreviousSchoolResults.vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const applicationStore= useApplicationStore()

const step = ref(1)


onMounted(() => {

        if (localStorage.getItem("application-id")) {
          let applicationId = localStorage.getItem("application-id")
          fetchApplicationData(applicationId)
        }

    }
)

const nextPage = (data) =>{
  if(data) {
    step.value = data?.step
    if(data?.id) {
      fetchApplicationData(data?.id)
    }
  }
}

const fetchApplicationData = (applicationNumber) => {

  if(applicationNumber){
    applicationStore.fetchApplicationById(applicationNumber)
  }
}

</script>
<template>
  <div class="temp">
    <div class="row">
      <div style="padding-top: 140px;">
      <h5 class="txt" >APPLY</h5>
      <h1  class="txt2">STUDENT APPLICATION</h1>
      <h5  class="txt">Get Started Today With Few Steps </h5>
    </div>
      <div class="col-lg-12">
        <div class="card sect mx-auto" style="margin-bottom:60px;margin-top:50px;border-radius: 16px; width: 80%;">
          <div class="card-body" >
           <div class="row">
            <div class="col-lg-6" style="text-align: center;padding-top:15px;">
              <p class="txt4">You are applying for</p>
              <h1 class="txt3">Victorious Education Services</h1>
              <p class="txt4">To continue your application, please fill out the form below.</p>
            </div>
            <div class="col-lg-6">
              <div>
            <div class="text-center">
              <ul class="nav nav-tabs text-xs" style="margin-top: 50px;">
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
          </div>
        </div>
      </div>
 
   </div>
  </div>
            </div>

           </div>
      
</template>

<style scoped>

.sect {
    /* padding: 60px 80px; */
    background: rgba(251, 251, 251, 0.94);
    border-radius: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 30px;
    display: flex;
    flex-direction: row;
    gap: 24px;
    padding: 10px;
}

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
  color: #070707;
  float: left !important;
}.txt{
  text-align: center;
  color: rgba(6, 6, 6, 0.623);
    font-family: Spartan, sans-serif;
    font-size: 17px;
    font-weight: 700;

}
.txt2{
    color: rgb(19, 108, 250);
    text-align: center;
    text-transform: uppercase;
    font-family: Spartan, sans-serif;
    font-weight: 600;
    padding-top: 20px;
    padding-bottom: 5px;
    font-size: 22px;;
}
.txt3{
  text-align: center;
    color: rgb(19, 108, 250);
    font-family: Spartan, sans-serif;
    font-size: 25px;
    font-weight: 800;
    padding: 10px;
    /* padding-bottom: 20px; */
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
  color: rgba(0, 0, 0, 0.874) !important;
  font-family: Spartan, sans-serif !important;
  font-size: 12px !important;
  font-family: bold;
}
.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    color: rgb(19, 108, 250) !important;
}
* {
  margin: 0;
  padding: 0;
}



</style>


