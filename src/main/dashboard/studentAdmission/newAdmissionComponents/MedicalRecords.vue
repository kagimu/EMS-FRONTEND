<template>
  <div>

    <p class="ml-4 mt-4 mb-10"> MEDICAL RECORDS </p>

    <form @submit.prevent="addMedicalRecords">
      <div class="row mx-auto">
        <div class="col-6">


          <div>
            <div class="mb-2">
              <label class="textColor text-sm">Blood Type/Group</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.blood_type_group" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="textColor text-sm">Allergies</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.allergies" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="textColor text-sm">Existing Conditions</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.existing_conditions" required class="form-control form-control-sm">
            </div>

          </div>


        </div>
        <div class="col-6">

          <div>
            <div class="mb-2">
              <label class="textColor text-sm">Regular Medication</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.regular_medication" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="textColor text-sm">Doctor's Name</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.doctors_name" required class="form-control form-control-sm">
            </div>

            <div class="mb-2">
              <label class="textColor text-sm">Doctor's Phone</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.doctors_phone" required class="form-control form-control-sm">
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

import {reactive, ref} from "vue";

const buttonLoader = ref(false)
const emit = defineEmits()

const form = reactive({
  blood_type_group:null,
  allergies:null,
  existing_conditions:null,
  regular_medication:null,
  doctors_name:null,
  doctors_phone:null,
})

const addMedicalRecords = () => {
  emit("next", 5)
}


</script>

<style scoped>

</style>