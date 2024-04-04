<template>
  <div>

<div class="mx-auto h-screen flex justify-center items-center">

<div class="bg-white p-4 w-[40%] rounded-md border">
  <div v-if="showSuccessPage" class="text-center text-[25px]">WholesomeEd</div>
  <hr v-if="showSuccessPage" class="mt-4" />
  <div v-if="showSuccessPage" class="text-center mt-8" style="font-size: 15px; color: #757575;">
    <div class="text-[green] text-[30px]">Success</div>
    <p>You have successfully submitted to reset your password,<br />
      We have sent an emil on : <span class="text-decoration-none" style="color: green; font-weight: bold;">{{email}}</span> with instructions on how to reset your password. </p>
    <p>Please login to your email, find the reset password link, click on it and set password </p>
    <br />
    <hr class="pt-4" />
    <div style="padding-bottom: 15px;" class="mb-2">



<div class="flex justify-between">
  &nbsp;

  <router-link  :to="{ name: 'login' }">
    <button
        type="submit"
        class="btn btn-primary border-0 px-4 bg-[#0d6efd]">
      Login
    </button>
  </router-link>
</div>



    </div>

  </div>

  <div v-else>

    <div class="mt-4" style="text-align: center;">
      <small style="color: #4b4b4b;">
        <div class="text-[20px] mb-3">WholesomeEd</div>
        ---- Reset Password---- <br />
        Enter your email address to request for a password reset.
      </small>
    </div>



    <div class="mt-3">
      <form ref="form" @submit.prevent="doReset">

        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="resetError">
          {{ resetError }}
        </div>

        <div>

          <div class="pt-2 pb-2">

            <div class="mb-2">
              <div class="text-red"><small>Email</small></div>
              <input type="email" v-model="email" required class="form-control">
            </div>

          </div>

          <div class="flex justify-content-end mt-3">
            <button
                type="submit"
                class="btn btn-primary border-0 px-4 mb-3 bg-[#0d6efd]">
              Reset Password
              <span v-if="resetSpinner" class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </span>
            </button>
          </div>



          <div class="mb-2 flex justify-content-between mt-3">
            <small>
              <router-link style="color: #242f7e;" :to="{ name: 'login' }" class="text-decoration-none">
                <b>Login</b>
              </router-link>
            </small>

            <small class="float-end">
              New to WholesomeEd ?
              <router-link
                  style="color: #242f7e;"
                  :to="{ name: 'register' }"
                  class="text-decoration-none"
              >
                Create Account
              </router-link>
            </small>
          </div>


        </div>
      </form>
    </div>


  </div>
</div>


      </div>

  </div>


</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useAuthStore} from "@/main/auth/store/auth.js";

const resetSpinner = ref(false)
const showSuccessPage = ref(false)
const resetError = ref(null)
const email = ref(null)
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const authStore = useAuthStore()



function doReset(){
  resetSpinner.value = true
  resetError.value = null
  authStore.resetPassword({email:email.value})
}


watch(
    () => authStore.resetPasswordResponse,
    async (data) => {
      if(data){
        resetSpinner.value = false
        notificationStore.successToast("Success", data.message)
        showSuccessPage.value = true
      }
    },
    {deep:true}
)


watch(
    () => authStore.errorMessage,
    async (data) => {
      if(data){
        resetSpinner.value = false
        resetError.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

</script>

<style scoped>
input:focus {
  box-shadow: none;
}
</style>