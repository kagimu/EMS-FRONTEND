<template>
<div>


<p class="ml-4 mt-4 mb-10">PERSONAL DETAILS OF STUDENT</p>

  <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>

  <form @submit.prevent="addStudentEducationDetails">
  <div class="row mx-auto">
    <div class="col-6">


<div>
        <div class="mb-2">
          <label class="textColor text-sm">Surname/Family name *</label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.surname" required class="form-control form-control-sm">
        </div>

        <div class="mb-2">
          <label class="textColor text-sm">Second name *</label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name" required class="form-control form-control-sm">
        </div>

        <div class="mb-2">
          <label class="textColor text-sm">Other names *</label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name" required class="form-control form-control-sm">
        </div>


        <div class="mb-2">
          <label class="textColor text-sm">Date of Birth *</label>
          <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.date_of_birth" required class="form-control form-control-sm">
        </div>


          <div class="mb-2">
            <label class="textColor text-sm">Sex</label>
            <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select text-sm" v-model="form.sex" aria-label="Default select example">
              <option disabled value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>


</div>


    </div>
    <div class="col-6">

      <div class="row">
        <div class="col-6">

          <div class="mb-2">
            <label class="textColor text-sm">Birth Certificate No</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.birth_certificate_no" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Country of Birth  *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.country_of_birth" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home District  *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_district" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home Sub-county</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_sub_county" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home Village  *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_village" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home Phone 1  *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_phone1" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home E-mail 1  *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_email1" required class="form-control form-control-sm">
          </div>

        </div>
        <div class="col-6">


          <div class="mb-2">
            <label class="textColor text-sm">Religion  *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.religion" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home Country  *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_country" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home County</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_county" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home Parish</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_parish" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Nearest Town *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.nearest_town" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home Phone 2</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_phone2" required class="form-control form-control-sm">
          </div>

          <div class="mb-2">
            <label class="textColor text-sm">Home E-mail 2</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.home_email2" required class="form-control form-control-sm">
          </div>

        </div>
      </div>

    </div>
  </div>

    <hr />

    <div class="text-right mt-4">
      <button type="submit" class="btn btn-primary mb-2 mr-4">
        Next
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
    </div>

  </form>



</div>
</template>

<script setup>

import {reactive, ref, watch} from "vue";
import {useAdmissionStore} from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
import useNotificationStore from "@/composables/useNotification.js";

const admissionStore = useAdmissionStore()
const  notificationStore  = useNotificationStore()

const buttonLoader = ref(false)
let errorMessage = ref(null)

const emit = defineEmits()

const form = reactive({
  surname:null,
  second_name:null,
  other_name:null,
  date_of_birth:null,
  sex:"",
  birth_certificate_no:null,
  country_of_birth:null,
  home_district:null,
  home_sub_county:null,
  home_village:null,
  home_phone1:null,
  home_email1:null,
  religion:null,
  home_country:null,
  home_county:null,
  home_parish:null,
  nearest_town:null,
  home_phone2:null,
  home_email2:null,
})

const addStudentEducationDetails = () => {
  buttonLoader.value = true
  admissionStore.newStudentDetailsAdmission(form)
}




watch (
    () => admissionStore.newStudentDetailsAdmissionResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", 2 )
      }
    },
    {deep:true}
)


watch(
    () => admissionStore.errorMessage,
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

</style>