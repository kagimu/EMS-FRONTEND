<template>
    <div>

          <!-- modal for viewing more details -->
    <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: schoolDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <grade-application></grade-application>
      </div>
    </div>

    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Approved List For Interviews<hr style="width:30px;"></h6>
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 12px !important;"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Learner</th>
            <th>Preferred Class</th>
            <th>DOB</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>APN010105</td>
            <td>Collins Mpiima</td>
            <td>P2</td>
            <td>10/10/21</td>
            <td>
                <router-link data-bs-toggle="modal" data-bs-target="#infoModal"  :to="{name:'student-application', query:{id:123}}" class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small><i class="bi bi-pencil">&nbsp;Grade</i></small></router-link> 
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