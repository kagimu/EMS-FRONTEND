<template>
  <div>

    <p class="ml-4 mt-4 mb-10"> EMERGENCY INFORMATION </p>

    <form @submit.prevent="addMedicalRecords">
      <div class="row mx-auto">
        <div class="col-6">


          <div>
            <div class="mb-2">
              <label class="text-sm  text-sm">Full Name of person to be contacted first in case of emergency</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.full_name_of_person_to_be_contacted_first_in_case_of_emergency" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm text-sm">Telephone Contact of first person</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.telephone_contact_of_first_person" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm text-sm">Full Name of Alternative person to be contacted in case of emergency</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.full_name_of_alternative_person_to_be_contacted" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
        <div class="col-6">

          <div>
            <div class="mb-2">
              <label class="text-sm text-sm">Telephone Contact of alternative person</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.telephone_contact_of_alternative_person" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm text-sm">Full Name of Doctor to be contacted in case of direct emergency attention</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.full_name_of_doctor_to_be_contacted" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="text-sm text-sm">Telephone contact of Doctor</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.telephone_contact_of_doctor" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
      </div>

      <hr />



      <div class="flex justify-content-between mt-4">

        <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>

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

<script setup>

import {reactive, ref} from "vue";

const buttonLoader = ref(false)
const emit = defineEmits()

const form = reactive({
  full_name_of_person_to_be_contacted_first_in_case_of_emergency:null,
  telephone_contact_of_first_person:null,
  full_name_of_alternative_person_to_be_contacted:null,
  telephone_contact_of_alternative_person:null,
  full_name_of_doctor_to_be_contacted:null,
  telephone_contact_of_doctor:null,
})

const addMedicalRecords = () => {
  emit("next", 6)
}

const backPage = () => {
  emit("next", 4 )
}

</script>

<style scoped>

</style>