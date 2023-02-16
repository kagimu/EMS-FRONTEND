<template>
<div>
  <form @submit.prevent="doLogin">
    <div class="row">
      <div class="col-lg-4 mx-auto">

        <div class="mb-2">
          <label for="exampleFormControlInput1" class="form-label"><small>Email</small></label>
          <input type="email" v-model="form.email" required class="form-control form-control-sm" id="exampleFormControlInput1">
        </div>

        <div class="mb-2">
          <label for="exampleFormControlInput1" class="form-label"><small>Password</small></label>
          <input type="password" v-model="form.password" required class="form-control form-control-sm" id="exampleFormControlInput1">
        </div>

        <div class="float-end">
          <button type="submit" class="btn btn-primary mb-3">Login</button>
        </div>

      </div>
    </div>


  </form>

</div>
</template>

<script setup>
import {loginStore} from "../store/login_store.js";
import { ref } from 'vue'

const form = ref({
  email:null,
  password:null
})

let authStore = loginStore()

function doLogin(){
  authStore.login(form.value)
}



</script>

<style scoped>

</style>