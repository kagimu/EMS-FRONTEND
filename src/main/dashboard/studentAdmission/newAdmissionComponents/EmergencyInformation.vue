<script setup>

import {reactive, ref} from "vue";
import api from "@/config/api.js";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";

const buttonLoader = ref(false)
const emit = defineEmits()
const commons = useCommonsStore()
const notificationStore  = useNotificationStore()

const form = ref({
  full_name_of_person_to_be_contacted_first_in_case_of_emergency:null,
  telephone_contact_of_first_person:null,
  full_name_of_alternative_person_to_be_contacted:null,
  telephone_contact_of_alternative_person:null,
  full_name_of_doctor_to_be_contacted:null,
  telephone_contact_of_doctor:null,
})

const addMedicalRecords = () => {
  // emit("next", 6)
  buttonLoader.value = true
  saveMedicalRecords(form.value)
}

/*const backPage = () => {
  // emit("next", 4 )
}*/




const  saveMedicalRecords = async (data) => {
  await api.post("main/assessment-areas", data)
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


const handleInput2 = () => {
  if (form.value.telephone_contact_of_alternative_person.length > 15) {
    form.value.telephone_contact_of_alternative_person = form.value.telephone_contact_of_alternative_person.slice(0, 15);
  }
}

const handleInput = () => {
  if (form.value.telephone_contact_of_doctor.length > 15) {
    form.value.telephone_contact_of_doctor = form.value.telephone_contact_of_doctor.slice(0, 15);
  }
}



</script>
<template>
  <div>

    <p class="ml-4 mt-4 mb-10"> EMERGENCY INFORMATION </p>

    <form @submit.prevent="addMedicalRecords">
      <div class="row mx-auto">
        <div class="col-6">


          <div>
            <div class="mb-2">
              <label class="text-sm">Full Name of person to be contacted first in case of emergency</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.full_name_of_person_to_be_contacted_first_in_case_of_emergency" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Telephone Contact of first person</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.telephone_contact_of_first_person" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Full Name of Alternative person to be contacted in case of emergency</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.full_name_of_alternative_person_to_be_contacted" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
        <div class="col-6">

          <div>
            <div class="mb-2">
              <label class="text-sm">Telephone Contact of alternative person</label>
              <vue-tel-input
                  @input="handleInput2"
                  @keypress="commons.onlyNumberValidator($event)"
                  style="padding:0; outline: none 0 !important; box-shadow: none;"
                  class="form-control"
                  :input-options="{placeholder: ''}"
                  v-model="form.telephone_contact_of_alternative_person"
                  :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                  :preferredCountries="['UG']"
                  mode="international"></vue-tel-input>
            </div>

            <div class="mb-2">
              <label class="text-sm">Full Name of Doctor to be contacted in case of direct emergency attention</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.full_name_of_doctor_to_be_contacted" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm">Telephone contact of Doctor</label>
              <vue-tel-input
                  @input="handleInput"
                  @keypress="commons.onlyNumberValidator($event)"
                  style="padding:0; outline: none 0 !important; box-shadow: none;"
                  class="form-control"
                  :input-options="{placeholder: ''}"
                  v-model="form.telephone_contact_of_doctor"
                  :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                  :preferredCountries="['UG']"
                  mode="international"></vue-tel-input>
            </div>

          </div>


        </div>
      </div>

<!--      <hr />-->



      <div class="flex justify-end mt-4 w-full">

<!--        <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>-->

       <div>
         <button type="submit" class="btn btn-primary mb-2 mr-4">
           Save
           <span class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </span>
         </button>
       </div>

      </div>


    </form>

  </div>
</template>



<style scoped>

</style>