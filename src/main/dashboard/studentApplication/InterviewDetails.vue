<template>
  <div>

       <!-- modal for viewing more details -->
       <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
       <GradeApplication></GradeApplication>
      </div>
    </div>
    <!-- end  -->

  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Students Scheduled For <b>ThisInterview</b> </h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>School&Campus</th>
          <th>Prefered Class</th>
          <th>#</th>
        </tr>
      <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div> -->
      </thead>
      <tbody>
        <tr>
          <td>Collins Mpima</td>
          <td>Seeta High/Main Campus</td>
          <td>P.6</td>
          <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-arrow">&nbsp;Grade</i></small></button>        
            </td>
        </tr>   
        <tr>
          <td>Peter</td>
          <td>Collin High/Main Campus</td>
          <td>P.6</td>
          <td>
            <button class="link-primary" data-bs-toggle="modal" data-bs-target="#infoModal" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-arrow">&nbsp;Grade</i></small></button>        
            </td>
        </tr>       
        
      </tbody>
    </table>
  </div>




  </div>
  </template>
  
  <script setup>
  import GradeApplication from './GradeApplication.vue';



  </script>


  
  <style scoped>
  
  </style>