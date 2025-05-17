<script setup>

import {reactive, ref} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";

const buttonLoader = ref(false)
const emit = defineEmits()
const notificationStore  = useNotificationStore()

const props = defineProps({
  studentProfileData:{},
})

const form = ref({
  blood_type_group:null,
  allergies:null,
  existing_condition:null,
  regular_medication:null,
  doctor_name:null,
  doctor_phone:null,
})

const addMedicalRecords = () => {
  buttonLoader.value = true
  form.value.student_number = props.studentProfileData?.current_enrollment?.student_number
  saveMedicalRecords(form.value)
  // emit("next", 5)
}

const  saveMedicalRecords = async (data) => {
  await api.post("main/students/medical-records", data)
      .then((response) => {
        buttonLoader.value = false
        // levelResponse.value = response.data
        notificationStore.successToast("Success",response.data.message)
      })
      .catch((error) => {
        if(error && error.response){
          // errorMessage.value = error.response.data.message

          buttonLoader.value = false
          notificationStore.errorToast("Error",error.response.data.message)
        }
      })
}

/*const backPage = () => {
  emit("next", 3 )
}*/

</script>
<template>
  <div>

    <p class="ml-4 mt-4 mb-10"> MEDICAL RECORDS </p>

    <form @submit.prevent="addMedicalRecords">
      <div class="row mx-auto">
        <div class="col-6">


          <div>
            <div class="mb-2">
              <label class="text-sm">Blood Type/Group</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.blood_type_group" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Allergies</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.allergies" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Existing Conditions</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.existing_condition" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
        <div class="col-6">

          <div>
            <div class="mb-2">
              <label class="text-sm">Regular Medication</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.regular_medication" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Doctor's Name</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.doctor_name" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Doctor's Phone</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.doctor_phone" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
      </div>

      <hr />

      <div class="flex justify-end mt-4">

<!--        <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>-->

        <button type="submit" class="btn btn-primary mb-2 mr-4">
          Next
          <span class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </span>
        </button>

      </div>


    </form>

  </div>
</template>



<style scoped>

</style>