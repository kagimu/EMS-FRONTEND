<template>

<div class="modal-content">
          <div class="modal-header text-sm p-0">
            <!-- {{ applicationNumber }} -->
            <h6 class="modal-title ml-3 mt-2 mb-2"><small>Grading : Collins Mpiima</small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <div>
  <div class="container mt-4">
    <table
      id="datatable"
      class="table table-striped border"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Question</th>
          <th>Answer</th>
          <th>Score</th>
        </tr>
      <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div> -->
      </thead>
      <tbody>
        <tr>
          <td>Who is the President of Uganda</td>
          <td>Museveni</td>
          <td>
          <form>
          <input type="text" class="form-control score" value="90">
          </form>
        </td>
        </tr>   
        <tr>
          <td>Do you eat pork?</td>
          <td>Neda</td>
          <td> <form>
          <input type="text" class="form-control score" value="59">
          </form></td>
  
        </tr>       
        
      </tbody>
    </table>
  </div>




  </div>

              </div>
          </div>
</div>

  
  </template>
  
  <script setup>


  </script>


  
  <style scoped>
  .score{
    width: 50px;
    height: 30px;
  }
  </style>