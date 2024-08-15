<script setup>
import {defineEmits, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/main/application/applicationComponents/store/application.js';

const applicationStore = useApplicationStore();
const router = useRouter();

const answer = ref('');
const mobileNumber = ref('');
const showPrompt = ref(true);
const loading = ref(false);
const success = ref(false);
const applicationId = ref(null)
const emit = defineEmits()



const submitApplication = () => {
  loading.value = true;
  applicationStore.fetchApplicationList();
  setTimeout(() => {
    loading.value = false;
    success.value = true;
  }, 2000);


  localStorage.removeItem('application-id');
  localStorage.removeItem('studentNumber');
};

const cancelApply = () => {
  showPrompt.value = false; // Hide prompt if canceled
};


const goBack = () =>{
  emit("next", {id:applicationId.value, step:4})
}

watch (
    () => applicationStore.applicationByIdResponse,
    async (data) => {
      if(data){
        applicationId.value = data.number
      }
    }
)

</script>
<template>
  <!-- Prompt/modal for applying -->
  <div v-if="showPrompt" class="modal" tabindex="-1" role="dialog">
     <div class="modal-dialog" role="document">
        <div class="modal-content">
           <div class="modal-header">
              <h5 class="modal-title">Apply?</h5>
              <button type="button" class="btn-close" @click="cancelApply"></button>
           </div>
           <div class="modal-body">
              <p>Do you want to submit your payment?</p>
           </div>
           <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cancelApply">Cancel</button>
              <button type="button" class="btn btn-primary" @click="submitApplication">Apply</button>
           </div>
        </div>
     </div>
  </div>
  <!-- Loader -->
  <div v-if="loading" class="text-center mt-5">
     <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
     </div>
  </div>
  <!-- Success Page -->
  <div v-if="success" class="container mt-5">
     <!-- Your success page content goes here -->
     <div class="row">
        <div class="col-lg-4"></div>
        <div class="col-lg-4">
           <img src="https://cdn.pixabay.com/photo/2014/04/02/11/01/tick-305245_1280.png" alt="Success">
        </div>
        <div class="col-lg-4"></div>
     </div>
     <p class="mt-2">Congratulations! Your Application has been successfully submitted.</p>
  </div>
  <div v-if="!success">
     <p class="ml-4 mt-4 mb-4" style="text-align: center !important;">
<!--        <i class="bi bi-arrow-left" @click="goBack()"></i> &nbsp;-->
        Payment Summary
     </p>
  </div>
  <div class="container mt-0">
     <div>
        <div class="row">
           <div style="padding: 0;">
              <div class="container mt-0">
                 <form   v-if="!success">
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
                          </div>
                          <div class="card card-hover mt-4 w-100">
                             <div class="card-body d-flex justify-content-between align-items-center">
                                <label for="mobile" class="mb-0"><i class="bi bi-phone"></i> Mobile Money</label>
                                <input id="mobile" v-model="answer" value="mobile" type="radio" name="payment-method" required>
                             </div>
                          </div>
                          <div class="card card-hover mt-4 w-100">
                             <div class="card-body d-flex justify-content-between align-items-center">
                                <label for="bank" class="mb-0"><i class="bi bi-bank"></i> Bank Deposit</label>
                                <input id="bank" v-model="answer" value="bank" type="radio" name="payment-method" required>
                             </div>
                          </div>
                       </div>
                       <div  v-if="answer === 'mobile'">
                          <div class="col-12">
                             <div class="card card-hover mt-4 w-100 d-flex justify-content-between align-items-center">
                                <div class="card-body ">
                                   <h5 class="card-title"><b>Phone Number</b></h5>
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
                                  <div class="px-3">Submit</div>
                                </button>
                              </div>
                            </div>
                          </div>
                       </div>
                       <div v-if="answer === 'offline'">
                          <div class="col-12">
                             <div class="card card-hover mt-4 w-100">
                                <div class="card-body">
                                   <h5 class="card-title">Offline Payment</h5>
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
                                  <div class="px-3">Submit</div>
                                </button>
                              </div>
                            </div>
                          </div>
                       </div>
                       <div v-if="answer === 'bank'">
                          <div class="col-12">
                             <div class="card card-hover mt-4 w-100">
                                <div class="card-body">
                                   <h5 class="card-title">Bank Deposit</h5>
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
                                <div class="px-3">Submit</div>
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
</style>