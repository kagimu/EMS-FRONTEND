<template>
<div>


  <personal-details-of-student></personal-details-of-student>
  <physical-marks></physical-marks>
  <family-structure></family-structure>
  <medical-structure></medical-structure>
  <emergency-information></emergency-information>
  <special-attention></special-attention>
  <student-education></student-education>

</div>
</template>

<script setup>

import PersonalDetailsOfStudent
  from "@/main/dashboard/studentAdmission/newAdmissionComponents/PersonalDetailsOfStudent.vue";
import PhysicalMarks from "@/main/dashboard/studentAdmission/newAdmissionComponents/PhysicalMarks.vue";
import FamilyStructure from "@/main/dashboard/studentAdmission/newAdmissionComponents/FamilyStructure.vue";
import MedicalStructure from "@/main/dashboard/studentAdmission/newAdmissionComponents/MedicalStructure.vue";
import EmergencyInformation from "@/main/dashboard/studentAdmission/newAdmissionComponents/EmergencyInformation.vue";
import SpecialAttention from "@/main/dashboard/studentAdmission/newAdmissionComponents/SpecialAttention.vue";
import StudentEducation from "@/main/dashboard/studentAdmission/newAdmissionComponents/StudentEducation.vue";
</script>

<style scoped>

</style>