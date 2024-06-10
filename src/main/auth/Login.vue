<script setup>
import {reactive, ref, watch} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import useNotificationStore from "@/composables/useNotification.js";
import router from "@/config/router.js";
import VictoriousLogo from "@/assets/images/victorious-logo.png";
const  notificationStore  = useNotificationStore()
const authStore = useAuthStore()

let errorMessage = ref(null)
let buttonLoader = ref(false)
let show = ref(false)

const form = reactive({
  email:null,
  password:null,
  // rememberMe: true
})




function doLogin(){
  buttonLoader.value = true
  errorMessage.value = ""
  authStore.userLogin(form)
}



watch(
    () => authStore.loginResponse,
    async (data) => {
      if(data){
        await authStore.userProfile()
      }
    }
)

watch(
    () => authStore.profile,
    async (data) => {
      if(data){
        let r = router.resolve({
          name: "entity-dashboard"
        });


        if (data.type === "User"){
          r = router.resolve({
            name: "client_dashboard"
          });
        }

        window.location.assign(r.href);

        notificationStore.successToast("Success","Login successfully")
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
    }
)

</script>
<template>
  <div>
    <div class="row" style="margin-top: 80px;margin-bottom: 80px;">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="align-centre mt-2 h6 font500 text-uppercase mb-2">
          <img alt="logo" style="width: 100px; margin: 0 auto" :src="VictoriousLogo"/>
          <div class="text-[#2c2f8c] text-center text-[20px]">
            Victorious Education Services
          </div>
          <p style="text-align: center !important;color:#0b5dd7cc;font-size: 14px;;">LOGIN</p></div>

        <div class="border bg-white px-3 py-5 rounded-lg">
          <div class="">
            <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
              {{errorMessage}}
            </div>
            <form @submit.prevent="doLogin">

              <div class="mb-3">
                <div class="text-[#76787a] text-sm">Email Address <strong class="text-danger ms-1">*</strong></div>
                <input
                    type="email"
                    v-model.trim="form.email" required
                    class="form-control shadow-none">
              </div>


              <div class="flex justify-between">
                <div class="text-[#76787a] text-sm">Password<strong class="text-danger ms-1">*</strong></div>

                <div class="text-sm text-muted text-center">
                  <router-link class="no-underline text-[#76787a] text-sm hover:text-green-700" :to="{name:'reset-password'}">Forgot Password?</router-link>
                </div>
              </div>


              <div class="input-group mb-10">
                <input
                    :type="show ? 'text' : 'password'"
                    v-model.trim="form.password"
                    required
                    class="form-control shadow-none"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    style="font-size: 12px;">
                      <div style="cursor: pointer;font-size: 12px;"  @click="show = !show" class="input-group-text px-2 py-0" id="basic-addon1">
                        <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                      </div>
              </div>

              <div>
                <button type="submit" class="bg-[#2c2f8c] text-white text-sm w-full rounded-md py-2">
                  <b><i class="bi bi-box-arrow-in-right"></i>&nbsp;LOGIN</b> 
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>

                <div class="text-center text-sm text-[#76787a] mt-10">
                  Dont have account?
                  <router-link class="no-underline text-[#2c2f8c] hover:text-green-700" :to="{name:'register'}">Register now</router-link>&nbsp;&nbsp;
                </div>


              </div>
            </form>
          </div>
        </div>


        <div class="mt-4 mb-2 text-center">
          <router-link class="d-inline text-sm2 font500 text-white text-uppercase btn btn-sm btn-success" :to="{name:'application-guide'}" style="font-size: 12px !important;font-weight: 500px;"><i class="bi bi-question-circle"></i>&nbsp;How to Apply</router-link>&nbsp;&nbsp;
        </div>
      </div>
      <div class="col-lg-4"></div>
    </div>
  </div>
</template>


<style scoped>

</style>