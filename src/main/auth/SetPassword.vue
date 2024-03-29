<template>
  <div>

    <div>

<!--      <div  style="margin-top: 3%;">
        <img style="width: 30%" class="mx-auto" src="../../../public/img/tutor_view_logo_dark.png"  alt="logo"/>
      </div>-->
        <div class="mx-auto h-screen flex justify-center items-center">
        <div class="bg-white p-4 w-[40%] rounded-md border">
        <div class="mt-4" style="text-align: center;">
          <div class="text-[20px] mb-3">WholesomeEd</div>
          <small style="color: #4b4b4b;">
            ---- Set Your Password---- <br />
            You can now enter your password below.
          </small>
        </div>


        <form ref="form" @submit.prevent="doSetPassword">
          <div>

            <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="formErrorMessage">
              {{ formErrorMessage }}
            </div>


            <div class="mt-3">
              <label class="textColor p-0"><small>Password</small></label>
              <div class="input-group mb-3">
                <input
                    :type="show ? 'text' : 'password'"
                    v-model="password" required
                    class="form-control" aria-label="Username"
                    aria-describedby="basic-addon1">
                <div style="cursor: pointer;"  @click="show = !show" class="input-group-text" id="basic-addon1">
                  <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                </div>
              </div>

              <label class="textColor p-0"><small>Confirm Password</small></label>
              <div class="input-group mb-3">
                <input
                    :type="show ? 'text' : 'password'"
                    v-model="confirm_password" required
                    class="form-control" aria-label="Username"
                    aria-describedby="basic-addon1">
                <div style="cursor: pointer;"  @click="show = !show" class="input-group-text" id="basic-addon1">
                  <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                </div>
              </div>


            </div>


            <div class="flex justify-content-end">
              <button
                  type="submit"
                  class="btn btn-primary border-0 px-4 mb-3 bg-[#0d6efd]">
                Set password
                <span v-if="passwordSpinner" class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </span>
              </button>
            </div>



            <div class="text-center">
              <small>
                Already have an account? &nbsp;
                <router-link style="color: #242f7e;" :to="{ name: 'login' }">
                  Login
                </router-link>
              </small>
            </div>



          </div>
        </form>
        </div>
      </div>

    </div>
  </div>


</template>

<script setup>
import {ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useRouter} from "vue-router";
import router from "@/config/router.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useAuthStore} from "@/main/auth/store/auth.js";

const routerData = useRouter()
const show = ref(false)
const passwordSpinner = ref(false)
const formErrorMessage = ref(null)
const password = ref(null)
const confirm_password = ref(null)
const commons = useCommonsStore()
const authStore = useAuthStore()

const notificationStore  = useNotificationStore()

const token = routerData.currentRoute.value.params.id






function doSetPassword(){

  if(!password.value){
    formErrorMessage.value = "password is required!"
    return
  }

  if(password.value !== confirm_password.value){
    formErrorMessage.value = "password Mismatch!"
    return
  }
  passwordSpinner.value = true
  formErrorMessage.value = null
  authStore.setUserPassword({password:password.value, confirm_password:confirm_password.value, token:token})
}




watch(
    () => authStore.setUserPasswordResponse,
    async (data) => {
      if(data){
        passwordSpinner.value = false
        notificationStore.successToast("Success", data.message)
        let r = router.resolve({
          name: "login",
        });
        window.location.assign(r.href);
      }
    },
    {deep:true}
)



watch(
    () => authStore.errorMessage,
    async (data) => {
      if(data){
        passwordSpinner.value = false
        formErrorMessage.value = data.message
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