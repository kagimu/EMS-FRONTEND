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
// import {useLoginStoreoginStore} from "../store/login.js";
// import {useLoginStore} from "../store"
import { ref } from 'vue'
import {useLoginStore} from "../store/login.js";

const form = ref({
  email:null,
  password:null
})

let authStore = useLoginStore() // loginStore()


function doLogin(){
  authStore.userLogin(form.value)
}



</script>

<style scoped>

</style>