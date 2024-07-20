<script setup>
import {onMounted,reactive, ref, watch} from 'vue'
import {useAuthStore} from "@/main/auth/store/auth.js";
import useNotificationStore from "@/composables/useNotification.js";
import VictoriousLogo from "@/assets/images/victorious-logo.png";
import useCommonsStore from "@/composables/useCommons.js";

let errorMessage = ref(null)
let buttonLoader = ref(false)
let show = ref(false)
const showSuccessPage = ref(false)

let authStore = useAuthStore()
const  notificationStore  = useNotificationStore()
const commons = useCommonsStore()

const landingPage = ref(null);

onMounted(() => {
  landingPage.value =   localStorage.getItem("landingPageTitle")
  })


const form = reactive({
  first_name: null,
  second_name: null,
  last_name: null,
  gender: "",
  email: null,
  phone: null,
})


function handleInput() {
  if (form.phone.length > 15) {
      form.phone = form.phone.slice(0, 15);
  }
}

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

        notificationStore.successToast("Success",data.message)
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
<template>
  <div style="margin-top: 40px !important;">
    <div class="row" >
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="align-centre mt-2 h6 font500 text-uppercase mb-2">

          <img alt="logo" style="width: 100px; margin: 0 auto" :src="VictoriousLogo"/>
          <div class="text-[#2c2f8c] text-center text-[20px]">
          {{landingPage}}
          </div>


          <p style="text-align: center !important;color:#0b5dd7cc;font-size: 14px;;">CREATE ACCOUNT</p></div>





        <div class="card">
          <div class="card-body">
            <div v-if="showSuccessPage" class="text-center mt-8" style="font-size: 16px; color: #757575;">
              <p style="color: green; font-size: 38px; font-weight: bold;" class="mb-9">Success</p>
              <p>You have successfully created an account with Victorious Education Services,<br />
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
            <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
              {{errorMessage}}
            </div>

            <form @submit.prevent="doRegister">
              <div class="row mt-3">
                <div class="col-lg-6">
                  <div class="mb-2">
                    <div class="text-[#76787a] text-sm">First name</div>
                    <input type="text" v-model="form.first_name" required class="form-control shadow-none">
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-2">
                    <div class="text-[#76787a] text-sm">Second name</div>
                    <input type="text" v-model="form.second_name" required class="form-control shadow-none">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-2">
                <div class="text-[#76787a] text-sm">Last name</div>
                <input type="text" v-model="form.last_name" class="form-control shadow-none">
              </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-2">
                        <div class="text-[#76787a] text-sm">Gender</div>
                        <select class="form-control form-select shadow-none" v-model="form.gender" aria-label="Default select example">
                          <option disabled value="">--Select Gender--</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
              </div>


              <div class="mb-2">
                <div class="text-[#76787a] text-sm">Phone</div>
                <div class="input-group">
                  <vue-tel-input
                      @input="handleInput"
                      @keypress="commons.onlyNumberValidator($event)"
                      style="padding:0; outline: none 0 !important; box-shadow: none;"
                      class="form-control"
                      :input-options="{placeholder: ''}"
                      v-model="form.phone"
                      :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                      :preferredCountries="['UG']"
                      mode="international"></vue-tel-input>
                </div>
              </div>

              <div class="mb-10">
                <div class="text-[#76787a] text-sm">Email</div>
                <input type="email" v-model="form.email" required class="form-control shadow-none">
              </div>



              <div>
                <button type="submit" class="bg-[#2c2f8c] text-white text-sm w-full rounded-md py-2">
                  <b><i class="bi bi-pencil-square"></i>&nbsp;REGISTER</b>
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>

                <div class="text-sm mt-4 mb-3 text-muted text-center">Already Registered?
                  <router-link type="button" class="no-underline text-[#2c2f8c] hover:text-green-700" :to="{name:'login'}">Login Here</router-link>
                </div>

              </div>
            </form>   
            </div>
          </div>
        </div>
      </div>

        </div>
      <div class="col-lg-4"></div>
    </div>
</template>



<style scoped>

</style>