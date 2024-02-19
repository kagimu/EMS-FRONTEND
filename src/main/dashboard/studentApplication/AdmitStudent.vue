<template>
  <div>
          <div v-show="step === 1">
            <OfferAdmission  v-on:next="nextPage" ></OfferAdmission>
          </div>
          <div v-show="step === 2">
            <RequirementInvoice  v-on:next="nextPage" ></RequirementInvoice>
          </div>
  </div>
  </template>
  
  <script setup>
  import {ref} from "vue";
  import OfferAdmission from "./OfferAdmission.vue"
  import RequirementInvoice from "./RequirementInvoice.vue"

  
  
const step = ref(1)

function nextPage(data){
  step.value = data
}

  </script>


  
  <style scoped>
  
  </style>