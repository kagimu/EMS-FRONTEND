<template>
  <div>
    <!-- modal for viewing more details -->
    <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: schoolDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2"><small>Application Details</small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <application-details></application-details>
            </div>
          </div>
        </div>
      </div>
    </div>

  

  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Application List<hr style="width:30px;"></h6>
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
            <router-link data-bs-toggle="modal" data-bs-target="#infoModal"  :to="{name:'student-application', query:{id:123}}" class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small><i class="bi bi-eye">&nbsp;view more</i></small></router-link>
          </td>
        </tr>

        <tr>
          <td>APN010108</td>
          <td>Muzamiru Ru</td>
          <td>P2</td>
          <td>10/10/21x</td>
          <td>
            <router-link data-bs-toggle="modal" data-bs-target="#infoModal"  :to="{name:'student-application', query:{id:123}}" class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small><i class="bi bi-eye">&nbsp;view more</i></small></router-link>
          </td>
        </tr>
        <tr>
          <td>APN010108</td>
          <td>Muzamiru Ru</td>
          <td>P2</td>
          <td>10/10/21x</td>
          <td>
            <router-link data-bs-toggle="modal" data-bs-target="#infoModal"  :to="{name:'student-application', query:{id:123}}" class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small><i class="bi bi-eye">&nbsp;view more</i></small></router-link>
          </td>
        </tr>
        
      </tbody>
    </table>
  </div>
  </div>
  </template>
  
  <script setup>
import ApplicationDetails from './ApplicationDetails.vue';
  </script>


  
  <style scoped>
  
  </style>