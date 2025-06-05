<script setup>
import {onMounted, ref,watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import FamilyRecords from "@/main/dashboard/studentAdmission/newAdmissionComponents/FamilyRecords.vue";
import MedicalRecords from "@/main/dashboard/studentAdmission/newAdmissionComponents/MedicalRecords.vue";
import EmergencyInformation from "@/main/dashboard/studentAdmission/newAdmissionComponents/EmergencyInformation.vue";

const applicationStore= useApplicationStore()
const step = ref(1)
const isStaff = ref(null)
const application_number = ref(null)
const resumeYes = ref(null)

const props = defineProps({
  applicationMode:String,
  applicationNumb:String,
  resume:String
})

const emit = defineEmits(["closeDialog"]);

onMounted(() => {
      if (localStorage.getItem("application-id")) {
        let applicationId = localStorage.getItem("application-id")
        fetchApplicationData(applicationId)
      }else if(props.applicationNumb) {
        checkApplication()
        localStorage.setItem("application-id", props.applicationNumb)
      }

      if(props.applicationMode){
        isStaff.value = "isStaffApplying"
      }

      if(props.resume){
        resumeYes.value = props.resume
      }
    }
)

watch (
    () => props.applicationNumb,
    async (data) => {
      if(data){
        checkApplication()
        localStorage.setItem("application-id", props.applicationNumb)
      }
    }
)

const checkApplication = () => {
  if(props.applicationNumb){
    fetchApplicationData(props.applicationNumb)
  }
}

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
      <div style="padding-top: 20px;">
        <div  class="text-center font-bold text-[#2c2f8c]"> COMPLETE STUDENT PROFILE</div>
      </div>
      <div class="col-lg-12">
        <div class="mx-auto" style="margin-bottom:10px;margin-top:10px;border-radius: 16px; width: 100%;">
          <div  >
            <div class="row">

              <div class="col-lg-12">
                <div>
                  <div class="w-full flex flex-col space-y-2 pt-10">
                    <div style="margin-top: 20px;">


                      <div class="flex relative space-x-2 justify-around text-[#414548] border-2 border-primary border-l-0 border-r-0 border-b-0 z-10">
                        <div style="margin-top:-20px" class="text-center -mt-5 z-0" :class="step === 1 ? 'font-bold':'italic'">
                          <i class="text-[30px] bg-white" :class="step === 1 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step <= 1 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                          <p class="text-sm">Family Records</p>
                        </div>

                        <div style="margin-top:-20px" class="text-center -mt-5 z-0" :class="step === 2 ? 'font-bold':'italic'">
                          <i class="text-[30px] bg-white" :class="step === 2 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step <= 2 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                          <p class="text-sm">Medical Records</p>
                        </div>


                        <div style="margin-top:-20px"  class="text-center -mt-5 z-0" :class="step === 3 ? 'font-bold':'italic'">
                          <i class="text-[30px] bg-white p-6"  :class="step === 3 ? 'animate-bounce fa-solid fa-arrow-circle-down step-wizard-current' : step < 3 ? 'fa-solid fa-clock step-wizard-default' : 'fa-solid fa-check-circle step-wizard-success'"></i>
                          <p class="text-sm">Emergency Records</p>
                        </div>

                      </div>
                    </div>

                    <div class="mb-10">

                      <div v-show="step === 1">
                        <family-records  v-on:next="nextPage">
                        </family-records>

                      </div>

                      <div v-show="step === 2">
                        <medical-records
                            v-on:next="nextPage"
                            :resume="resumeYes">
                        </medical-records>

                      </div>

                      <div v-show="step === 3">
                        <emergency-information>

                        </emergency-information>
                      </div>


                    </div>

                    <!-- <div class="flex justify-left mb-10">
                      <button type="button" class="btn btn-danger btn-sm" @click="$emit('closeDialog')">Close</button>
                    </div> -->

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
  left: 10%;
  top: 10%;
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
   font-size: 15px;
   font-weight: 700;

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


