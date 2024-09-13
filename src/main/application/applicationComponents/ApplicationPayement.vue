<script setup>
import { defineEmits, ref, watch } from 'vue';
import { useApplicationStore } from '@/main/application/applicationComponents/store/application.js';
import useNotificationStore from "@/composables/useNotification.js";
import { useRouter } from 'vue-router';

const applicationStore = useApplicationStore();
const errorMessage = ref(null);
const answer = ref('');
const mobileNumber = ref('');
const emit = defineEmits();
const notificationStore = useNotificationStore();
const buttonLoader = ref(false);
const showProgressBar = ref(false); // Progress bar control
const router = useRouter();

const props = defineProps({
   appMode:String
   })

const submitApplication = () => {
   buttonLoader.value = true;
   showProgressBar.value = true; // Show progress bar when submission starts
   let applicationNumber = localStorage.getItem('application-id');
   applicationStore.submitApplicationData(applicationNumber);
}

watch(
    () => applicationStore.submitApplicationResponse,
    async (data) => {
      if (data) {
         localStorage.removeItem('application-id');
         localStorage.removeItem('studentNumber');
         buttonLoader.value = false;
         
   
         setTimeout(() => {
            showProgressBar.value = false; 
         if(props.appMode){
              }else {
               notificationStore.successToast("Success", data.message); 
               router.push('/client-dashboard/applications');
            }
           
         }, 3000); // 3000 ms = 3 seconds
      }
      
    }
);

watch(
    () => applicationStore.errorMessage,
    async (data) => {
      if (data) {
        errorMessage.value = data.message;
        buttonLoader.value = false;
        showProgressBar.value = false; // Hide progress bar if there's an error
        notificationStore.errorToast("Error", data.message);
      }
    }
);
</script>
<template>
   <div class="container mt-0">
     <!-- Progress Bar -->
     <div v-if="showProgressBar" class="progress mb-4" style="height: 25px;">
       <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
         Submitting your application...
       </div>
     </div>
 
     <div>
       <div class="row">
         <div style="padding: 0;">
           <div class="container mt-0">
            <form  @submit.prevent="submitApplication">
                    <div class="row mx-auto">
                       <div class="col-12">
                          <h4 style="font-size: 18px;">Payment Method</h4>
                       </div>
                       <div class="mb-2">
                          <div class="card card-hover mt-4 w-100">
                             <div class="card-body d-flex justify-content-between align-items-center">
                                <label for="offline" class="mb-0"><i class="bi bi-wifi-off"></i> Offline</label>
                                <input id="offline" v-model="answer" value="offline" type="radio" name="payment-method" required>
                             </div>


                                  
                       <div v-if="answer === 'offline'" class="m-3">
                          <div class="col-12">
                             <div class="card card-hover mt-4 w-100">
                                <div class="card-body">
                                   <div class="card border-primary mt-3">
                                      <div class="card-body text-primary">
                                         <p>Please contact our office directly to arrange an offline payment. Make sure to follow all instructions provided by our staff. Thank you.</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div class="col-12 mt-2">
                            <div class="flex flex-grow justify-between">
                              <div>
                                <button
                                    @click="goBack()"
                                    type="button"
                                    class="btn btn-sm btn-success mb-2 mr-4"
                                    style="color: white;">
                                  <small><i class="bi bi-box-arrow-in-left"></i> Back</small>
                                </button>
                              </div>

                              <div>
                                <button
                                    @click="submitApplication"
                                    type="submit"
                                    class="btn btn-sm btn-primary"
                                    style="color:white !important">
                                  <div class="px-3">Submit
                                    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                                    <span class="visually-hidden">Loading...</span>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                       </div>

                       
                          </div>
                          <div class="card card-hover mt-4 w-100">
                             <div class="card-body d-flex justify-content-between align-items-center">
                                <label for="mobile" class="mb-0"><i class="bi bi-phone"></i> Mobile Money</label>
                                <input id="mobile" v-model="answer" value="mobile" type="radio" name="payment-method" required>
                             </div>

                             <div  v-if="answer === 'mobile'" class="m-3">
                          <div class="col-12">
                             <div class="card card-hover mt-4 w-100 d-flex justify-content-between align-items-center">
                                <div class="card-body ">
                                 
                                   <div class="d-flex">
                                      <div class="input-group">
                                         <span class="input-group-text" style="background-color: #0d6efd; color: white;font-weight: bold;">+256</span>
                                         <input
                                             type="text"
                                             class="form-control shadow-none"
                                             placeholder="Enter your number"
                                             v-model="mobileNumber" required>
                                      </div>
                                   </div>
                                   <div class="card border-primary mt-3">
                                      <div class="card-body text-primary">
                                         <p>Please provide a Ugandan number from which payment can be collected. Make sure you have a sufficient amount on your phone. Thank you.</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div class="col-12 mt-2">
                            <div class="flex flex-grow justify-between">
                              <div>
                                <button
                                    @click="goBack()"
                                    type="button"
                                    class="btn btn-sm btn-success mb-2 mr-4"
                                    style="color: white;">
                                  <small><i class="bi bi-box-arrow-in-left"></i> Back</small>
                                </button>
                              </div>

                              <div>
                                <button
                                    @click="submitApplication"
                                    type="submit"
                                    class="btn btn-sm btn-primary"
                                    style="color:white !important">
                                  <div class="px-3">Submit
                                    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                                    <span class="visually-hidden">Loading...</span>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                       </div>
                          </div>
                          <div class="card card-hover mt-4 w-100">
                             <div class="card-body d-flex justify-content-between align-items-center">
                                <label for="bank" class="mb-0"><i class="bi bi-bank"></i> Bank Deposit</label>
                                <input id="bank" v-model="answer" value="bank" type="radio" name="payment-method" required>
                             </div>
                          </div>
                       </div>
                  
                       <div v-if="answer === 'bank'" class="m-3">
                          <div class="col-12">
                             <div class="card card-hover mt-4 w-100">
                                <div class="card-body">
                                 
                                   <div>
                                      <p>Bank : ABSA</p>
                                      <p>Account No. 9000393993023</p>
                                      <p>Amount : 50,000 UGX</p>
                                      <p>Account Name: SASULA PRIMARY</p>
                                   </div>
                                   <div class="card border-primary mt-3">
                                      <div class="card-body text-primary">
                                         <p>Please deposit the specified amount into the above account. Make sure to keep the deposit slip for confirmation. Thank you.</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div class="col-12 mt-2">


                          <div class="flex flex-grow justify-between">
                            <div>
                              <button
                                  @click="goBack()"
                                  type="button"
                                  class="btn btn-sm btn-success mb-2 mr-4"
                                  style="color: white;">
                                <small><i class="bi bi-box-arrow-in-left"></i> Back</small>
                              </button>
                            </div>

                            <div>
                              <button
                                  @click="submitApplication"
                                  type="submit"
                                  class="btn btn-sm btn-primary"
                                  style="color:white !important">
                                <div class="px-3">Submit

                                 <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                                    <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                              </button>
                            </div>
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
  input {
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
  }
  .tit {
  text-align: center;
  margin-top: 15px;
  text-decoration: underline;
  }
  .star {
  color: red;
  }
  textarea {
  border-radius: 2px !important;
  }
  select {
  border-radius: 2px !important;
  }
  .small-input {
  width: 150px;
  font-size: 13px;
  }
  .card-hover:hover {
  background-color: #f8f9fa; /* Light gray background on hover */
  }
  .card.border-primary {
  border: 1px solid #007bff;
  }
  .card-body.text-primary {
  color: #007bff;
  padding: 10px;
  }

.progress-bar {
  background-color: #007bff; /* Primary color for the progress bar */
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
</style>
