<script setup>
import {onMounted, ref} from "vue";
import PersonalDetailsOfStudent from "@/main/application/applicationComponents/PersonalDetailsOfParent.vue";
import PersonalDetailsOfLearner from "@/main/application/applicationComponents/PersonalDetailsOfLearner.vue";
import PreviousSchoolDetails from "@/main/application/applicationComponents/PreviousSchoolDetails.vue";
import ApplicationPayement from "@/main/application/applicationComponents/ApplicationPayement.vue";
import PreviousSchoolResults from "@/main/application/applicationComponents/PreviousSchoolResults.vue";
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
      <div style="padding-top: 50px;">
      <div  class="text-center font-bold text-[#2c2f8c]">STUDENT APPLICATION</div>
      <div  class="text-center">Get Started Today With Few Steps </div>
    </div>
      <div class="col-lg-12">
        <div class="card sect mx-auto" style="margin-bottom:60px;margin-top:50px;border-radius: 16px; width: 80%;">
          <div class="card-body" >
           <div class="row">
           
            <div class="col-lg-12">
              <div>


                <div class="w-full flex flex-col space-y-2 pt-10">

                  <div style="margin-top: 20px;">
                    <div class="flex relative space-x-2 justify-around text-[#414548] border-2 border-primary border-l-0 border-r-0 border-b-0 z-10">
                      <div style="margin-top:-20px" class="text-center -mt-5 z-0" :class="step === 1 ? 'font-bold':'italic'">
                        <i class="text-[30px] bg-white" :class="step === 1 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step <= 1 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                        <p class="text-sm">GUARDIAN/PARENT</p>
                      </div>
                      <div style="margin-top:-20px" class="text-center -mt-5 z-0" :class="step === 2 ? 'font-bold':'italic'">
                        <i class="text-[30px] bg-white" :class="step === 2 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step <= 2 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                        <p class="text-sm">LEARNER</p>
                      </div>
                      <div style="margin-top:-20px"  class="text-center -mt-5 z-0" :class="step === 3 ? 'font-bold':'italic'">
                        <i class="text-[30px] bg-white p-6"  :class="step === 3 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step < 3 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                        <p class="text-sm">PREVIOUS SCHOOL</p>
                      </div>
                      <div style="margin-top:-20px"  class="text-center -mt-5 z-0" :class="step === 4 ? 'font-bold':'italic'">
                        <i class="text-[30px] bg-white p-6"  :class="step === 4 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step < 4 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                        <p class="text-sm">PREVIOUS SCHOOL RESULTS</p>
                      </div>
                      <div style="margin-top:-20px" class="text-center -mt-5 z-0" :class="step === 5 ? 'font-bold' : 'italic'">
                        <i class="text-[30px] bg-white" :class="step === 5 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step < 5 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                        <p class="text-sm">PAYMENT</p>
                      </div>


                    </div>
                  </div>

                  <div class="mb-10">

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
                      <PreviousSchoolResults
                          v-on:next="nextPage"></PreviousSchoolResults>
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

.text-sm2{
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


.step-wizard-success {
  @apply text-green-600 z-0 border-green-600 rounded-full p-[2px];
}

.step-wizard-current {
  @apply text-primary z-0 border-primary rounded-full p-[2px];
}

.step-wizard-default {
  @apply text-gray-600 z-0 border-[#565656] rounded-full p-[2px];
}



</style>


