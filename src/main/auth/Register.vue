<template>
  <div>

    <div class="row">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <!-- <div class="text-center mb-3" style="font-size: 27px;">Wholesome Education</div> -->
        <div class="card">
          <div class="card-body">
            <div v-if="showSuccessPage" class="text-center mt-8" style="font-size: 16px; color: #757575;">
              <p style="color: green; font-size: 38px; font-weight: bold;" class="mb-9">Success</p>
              <p>You have successfully created an account with WHolesomeEd,<br />
                We have sent an emil on : <span class="text-decoration-none" style="color: green; font-weight: bold;">{{form.email}}</span> with instructions on how to activate your account. </p>
              <p>Please login to your email, find the activation link, click on it and set password </p>
              <br />
              <hr />
              <div style="padding-bottom: 20px;" class="mb-3">

                <router-link  :to="{ name: 'login' }">
                  <button
                      style="background-color: #1d2b36;"
                      type="submit"
                      class="btn btn-primary float-end">
                    Login
                  </button>
                </router-link>

              </div>

            </div>

            <div v-else>


            <div class="text-center textColor"><b>Create Account</b></div>
            <div class="text-center mb-3 textColor"><small>---- Create a New Account - It's Free----</small></div>

            <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
              {{errorMessage}}
            </div>

            <form @submit.prevent="doRegister">

              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-2">
                    <label class="textColor"><small>First name</small></label>
                    <input type="text" v-model="form.first_name" required class="form-control">
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-2">
                    <label class="textColor"><small>Second name</small></label>
                    <input type="text" v-model="form.second_name" required class="form-control">
                  </div>
                </div>
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Last name</small></label>
                <input type="text" v-model="form.last_name" class="form-control">
              </div>


              <div class="mb-2">
                <label class="textColor"><small>Gender</small></label>
              <select class="form-select" v-model="form.gender" aria-label="Default select example">
                <option disabled value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              </div>


              <div class="mb-2">
                <label class="textColor"><small>Phone</small></label>
                <input type="tel" v-model="form.phone" required class="form-control">
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Email</small></label>
                <input type="email" v-model="form.email" required class="form-control">
              </div>



              <div class="text-right">
                <button type="submit" class="btn btn-primary mb-2 mt-3">
                  Register
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>



              <div class="text-center">
                <small class="textColor">
                  Already have an account?<router-link class="ml-2 text-decoration-none textColor" :to="{name:'login'}"> Login </router-link>
                </small>
              </div>

            </form>

            </div>

          </div>
        </div>

      </div>
      <div class="col-lg-4"></div>
    </div>

  </div>
</template>

<script setup>
import {reactive, ref, watch} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import useNotificationStore from "@/composables/useNotification.js";

let errorMessage = ref(null)
let buttonLoader = ref(false)
let show = ref(false)
const showSuccessPage = ref(false)


let authStore = useAuthStore()
const  notificationStore  = useNotificationStore()


const form = reactive({
  first_name: null,
  second_name: null,
  last_name: null,
  gender: null,
  email: null,
  phone: null,
})



function doRegister(){
  buttonLoader.value = true
  errorMessage.value = ""
  authStore.userRegistration(form)
}



watch(
    () => authStore.registrationResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false

        // form.first_name = null
        // form.second_name = null
        // form.last_name = null
        // form.gender = null
        // form.email = null
        // form.phone = null

        showSuccessPage.value = true

        notificationStore.successToast("Error",data.message)
      }
    },
    {deep:true}
)


watch(
    () => authStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)



</script>

<style scoped>

.content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

</style>