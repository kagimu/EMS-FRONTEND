<template>
<div>

  <div v-if="step === 1">
    <personal-details-of-student
        v-on:next="nextPage"
    ></personal-details-of-student>
  </div>

  <div v-if="step === 2">
    <physical-marks></physical-marks>
  </div>

  <div v-if="step === 3">
    <family-structure></family-structure>
  </div>

  <div v-if="step === 4">
    <medical-records></medical-records>
  </div>

  <div v-if="step === 5">
    <emergency-information></emergency-information>
  </div>

  <div v-if="step === 6">
    <special-attention></special-attention>
  </div>

  <div v-if="step === 7">
    <student-education></student-education>
  </div>

</div>
</template>

<script setup>

import PersonalDetailsOfStudent
  from "@/main/dashboard/studentAdmission/newAdmissionComponents/PersonalDetailsOfStudent.vue";
import PhysicalMarks from "@/main/dashboard/studentAdmission/newAdmissionComponents/PhysicalMarks.vue";
import FamilyStructure from "@/main/dashboard/studentAdmission/newAdmissionComponents/FamilyStructure.vue";
import MedicalRecords from "@/main/dashboard/studentAdmission/newAdmissionComponents/MedicalRecords.vue";
import EmergencyInformation from "@/main/dashboard/studentAdmission/newAdmissionComponents/EmergencyInformation.vue";
import SpecialAttention from "@/main/dashboard/studentAdmission/newAdmissionComponents/SpecialAttention.vue";
import StudentEducation from "@/main/dashboard/studentAdmission/newAdmissionComponents/StudentEducation.vue";
import {ref} from "vue";

const step = ref(1)

function nextPage(data){
  // alert(data)
  step.value = 2
}

</script>

<style scoped>

</style>