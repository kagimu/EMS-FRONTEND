<template>
    <div>

    <div class="row mt-4">

<div class="col-lg-8">

</div>
    </div>

      <table id="data"
        class="table table-striped">
        <thead>
      <tr>
        <th>#</th>
        <th scope="col">APN</th>
        <th>Name</th>
        <th scope="col">Score</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
    
    
      </tbody>
      <tbody>
     
      <tr>
         
      </tr>
    
      </tbody>
    </table>
    </div>
  </template>

  <script setup>
import {onMounted, ref, watch,reactive} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useStudentApplicationStore} from "@/main/dashboard/studentApplication/store/student_application.js";
import useNotificationStore from "@/composables/useNotification.js";


</script>
  <style></style>