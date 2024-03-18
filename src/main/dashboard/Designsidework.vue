<template>
  <div class="card mt-5">
    <div class="card-body" >

      <div class="card-header">
       <div class="row">
        <div class="col-lg-6 "> 
              <input type="text" v-model="searchQuery" class="form-control mt-1 mb-0" placeholder="Search...">  
        </div>
        <div class="col-lg-6">
          <!-- <button  class="btn btn-outline-primary  btn-sm mt-1" style="float: right; border:none">
            <small><i class="bi bi-download">&nbsp;Download</i></small></button>  -->
            <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
            <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
        </div>
       </div>
           </div>

           
      <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
          <th>Grade</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Collins Mpiima</td>
          <td>90</td>
          <td>D1</td>
          <td>
            <button  data-bs-toggle="modal" data-bs-target="#infoModal" 
            class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
               
            <i class="bi bi-arrow-right"> </i></small></button>    
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script setup>
 
</script>

<style>
  /* Remove border and styling when select element is clicked */
  .select-no-border {
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
  }
  .inp{
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
  }
</style>