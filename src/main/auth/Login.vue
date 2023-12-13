<template>
  <div>

  
    <div class="row" style="margin-top: 80px;margin-bottom: 80px;">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="align-centre mt-2 h6 font500 text-uppercase mb-2">
          <p class="fs-4" style="color:#0b5dd7cc;"><b>Wholesome Education</b></p>
          <p style="text-align: center !important;color:#0b5dd7cc;font-size: 14px;;">ONLINE APPLICATION</p></div>
        <hr>
        <div class="card">
          <div class="card-body">
            <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
              {{errorMessage}}
            </div>
            <form @submit.prevent="doLogin">
              <div class="mb-2">
                <label class="textColor font500 mb-1 mt-0 "><small>Email Address <strong class="text-danger ms-1">*</strong></small></label>
                <input type="email" v-model="form.email" required class="form-control form-control-sm">
              </div>
              <label class="textColor font500 mb-1 mt-0"><small>Password<strong class="text-danger ms-1">*</strong></small></label>
              <div class="input-group mb-3">
                <input
                    :type="show ? 'text' : 'password'"
                    v-model="form.password" required
                    class="form-control form-control-sm" aria-label="Username"
                    aria-describedby="basic-addon1">
                <div style="cursor: pointer;"  @click="show = !show" class="input-group-text" id="basic-addon1">
                  <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                </div>
              </div>
              <div class="text-right">
                <button type="submit" class="btn btn-sm btn-primary mb-2 form-control">
                  <b><i class="bi bi-box-arrow-in-right"></i>&nbsp;LOGIN</b> 
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="text-sm mt-4 mb-4 text-muted text-center">Did you Forget your Password?
          <router-link type="button" class="font500 py-0 text-sm text-danger btn btn-link btn-sm" :to="{name:'register'}">Click Here</router-link>
        </div>

        <div class="mt-5 mb-2 text-center">
          <router-link class="d-inline text-sm2 font500 text-white text-uppercase btn btn-sm btn-success" :to="{name:'register'}" style="font-size: 12px !important;font-weight: 500px;"><i class="bi bi-question-circle"></i>&nbsp;How to Apply</router-link>&nbsp;&nbsp;
          <router-link class="d-inline text-sm2 font500 text-white text-uppercase btn btn-sm btn-primary" :to="{name:'register'}"  style="font-size: 12px !important;font-weight: 500px;"><i class="bi bi-pencil-square"></i>&nbsp;Get an account</router-link></div>
      </div>
      <div class="col-lg-4"></div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref, watch} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import useNotificationStore from "@/composables/useNotification.js";
import router from "@/config/router.js";
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

        authStore.userProfile()
      }
    },
    {deep:true}
)

watch(
    () => authStore.profile,
    async (data) => {
      if(data){
        let r = router.resolve({
          name: "home"
        });
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
  color:rgba(33,37,41,0.75);
    font-size: .875rem!important;
    line-height: 1.25rem!important;
    font-weight: 500!important;
    margin: bottom 0.25em;
}
.text-sm2 {
    font-size: 13px !important;
    line-height: 0.5rem!important;
    color:white !important;
    font-weight: 900px !important;
  
}
.btn-info{
  background-color: #1d5f7d !important;
}
.btn{
  border-radius: 0px !important;
}
hr {
    margin: 1rem 0;
    color:#0b5dd762;
    border: 0;
    border-top: 1px solid;
    opacity: .25;
}
.fs-4 {
    font-size: 1.2rem!important;
    text-align: center;

}
</style>