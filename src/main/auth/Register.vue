<template>
  <div>

    <div class="row">
      <div class="col-lg-4 content">
        <div class="text-center mb-3" style="font-size: 27px;">Wholesome Education</div>
        <div class="card">
          <div class="card-body">

            <div class="text-center textColor"><b>Create Account</b></div>
            <!--          <div class="text-center">Wholesome Education</div>-->
            <div class="text-center mb-3 textColor"><small>---- Create a New Account - It's Free----</small></div>

            <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
              {{errorMessage}}
            </div>

            <form @submit.prevent="doRegister">

              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-2">
                    <label class="textColor"><small>First name</small></label>
                    <input type="text" v-model="form.firstName" required class="form-control">
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-2">
                    <label class="textColor"><small>Second name</small></label>
                    <input type="text" v-model="form.secondName" required class="form-control">
                  </div>
                </div>
              </div>


              <div class="mb-2">
                <label class="textColor"><small>Gender</small></label>
              <select class="form-select" v-model="form.gender" aria-label="Default select example">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
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

              <div class="row">
                <div class="col-lg-6">
                  <label class="textColor"><small>Password</small></label>
                  <div class="input-group mb-3">
                    <input
                        :type="show ? 'text' : 'password'"
                        v-model="form.password" required
                        class="form-control" aria-label="Username"
                        aria-describedby="basic-addon1">
                    <div style="cursor: pointer;"  @click="show = !show" class="input-group-text" id="basic-addon1">
                      <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </div>
                  </div>

                </div>
                <div class="col-lg-6">
                  <label class="textColor"><small>Confirm Password</small></label>
                  <div class="input-group mb-3">
                    <input
                        :type="show ? 'text' : 'password'"
                        v-model="form.confirmPassword" required
                        class="form-control" aria-label="Username"
                        aria-describedby="basic-addon1">
                    <div style="cursor: pointer;"  @click="show = !show" class="input-group-text" id="basic-addon1">
                      <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </div>
                  </div>

                </div>
              </div>


              <div class="text-right">
                <button type="submit" class="btn btn-primary mb-2">Register</button>
                <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                  <span class="visually-hidden">Loading...</span>
                </div>
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

  </div>
</template>

<script setup>
import {reactive, ref, watch} from 'vue'
import {useAuthStore} from "@/store/auth.js";

const form = reactive({
  firstName:null,
  secondName:null,
  gender:"",
  phone:null,
  email:null,
  password:null,
  confirmPassword:null,
})

let errorMessage = ref(null)
let buttonLoader = ref(false)
let show = ref(false)

let authStore = useAuthStore()


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