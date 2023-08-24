<template>
<div>

  <div v-show="step === 1">
    <personal-details-of-student
        v-on:next="nextPage"
    ></personal-details-of-student>
  </div>

  <div v-show="step === 2">
    <physical-marks
        v-on:next="nextPage"
    ></physical-marks>
  </div>

  <div v-show="step === 3">
    <family-structure
        v-on:next="nextPage"
    ></family-structure>
  </div>

  <div v-show="step === 4">
    <medical-records
        v-on:next="nextPage"
    ></medical-records>
  </div>

  <div v-show="step === 5">
    <emergency-information
        v-on:next="nextPage"
    ></emergency-information>
  </div>

  <div v-show="step === 6">
    <special-attention
        v-on:next="nextPage"
    ></special-attention>
  </div>

  <div v-show="step === 7">
    <student-education
        v-on:next="nextPage"
    ></student-education>
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
  step.value = data
}

</script>

<style scoped>

</style>