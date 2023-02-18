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

            <form @submit.prevent="doLogin">


              <div class="mb-2">
                <label class="textColor"><small>Email</small></label>
                <input type="email" v-model="form.email" required class="form-control">
              </div>

              <div class="mb-3">
                <label class="textColor"><small>Password</small></label>
                <input type="password" v-model="form.password" required class="form-control">
              </div>

              <div class="text-right">
                <button type="submit" class="btn btn-primary mb-2">Login</button>
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
import {reactive, watch} from 'vue'
import {useAuthStore} from "@/store/auth.js";

const form = reactive({
  email:null,
  password:null,
  rememberMe: true
})

let authStore = useAuthStore()


function doLogin(){
  authStore.userLogin(form)
}

watch(
    () => authStore.loginResponse,
    async (data) => {
      if(data){
        alert(JSON.stringify(data))
      }
    },
    {
      deep:true
    }
)


watch(
    () => authStore.loginError,
    async (data) => {
      if(data){
        alert(JSON.stringify(data))
      }
    },
    {
      deep:true
    }
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