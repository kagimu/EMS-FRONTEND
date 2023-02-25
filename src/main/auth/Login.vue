<template>
  <div>

    <div class="row">
      <div class="col-lg-4 content">
        <div class="text-center mb-3" style="font-size: 27px;">Wholesome Education</div>
        <div class="card">
          <div class="card-body">






            <div class="text-center textColor"><b>Login</b></div>
            <!--          <div class="text-center">Wholesome Education</div>-->
            <div class="text-center mb-3 textColor"><small>---- Please login to your account.----</small></div>

            <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
              {{errorMessage}}
            </div>

            <form @submit.prevent="doLogin">


              <div class="mb-2">
                <label class="textColor"><small>Email</small></label>
                <input type="email" v-model="form.email" required class="form-control">
              </div>


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



              <div class="text-right">
                <button type="submit" class="btn btn-primary mb-2">
                  Login

                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>

              <div class="text-center">
                <small>
                  <router-link class="ml-2 text-decoration-none textColor" :to="{name:'register'}">Forgot Password?</router-link>
                </small>
              </div>

              <div class="text-center">
                <small class="textColor">
                  Dont have account?  <router-link class="ml-2 text-decoration-none textColor" :to="{name:'register'}"> Get an account </router-link>
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
import useNotificationStore from "@/composables/useNotification.js";
import router from "@/config/router.js";
// import router from "@/config/router.js";
const  notificationStore  = useNotificationStore()
const authStore = useAuthStore()

let errorMessage = ref(null)
let buttonLoader = ref(false)
let show = ref(false)

const form = reactive({
  email:null,
  password:null,
  rememberMe: true
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
  color: #717375;
}

</style>