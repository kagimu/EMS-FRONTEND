<template>
    <div>
    
        <div class="modal fade" id="addAccount" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: showDialog }">
      <div class="modal-dialog">
       <NewGradeScale></NewGradeScale>
        </div>
      </div>

      <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
                <button style="float: right; margin-right: 5px;" data-bs-toggle="modal" data-bs-target="#addAccount"  type="button"  aria-controls="rolesDialog" class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> New Grade-Scale </button>
 
                <!-- <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
                <small><i class="bi bi-printer">&nbsp;Print</i></small></button>  -->
            </div>
    
           </div>
               </div>
                <div class="card-body" >
        <div >
           
      <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Class (s)</th>
          <th scope="col">Values(Min - Max)</th>
          <th scope="col">Score</th>
          <th scope="col">Grade Standard</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            <tr>
            <td>Name 1</td>
            <td>P1,P2</td>
            <td>80 - 100</td>
            <td>D1</td>
            <td>Grade Standard</td>
            <td>
          <button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
          <button type="button">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button></td>
        </tr>
    
      
        </tbody>
      </table>
        </div>
        </div>
        </div>
        </div>
        </div>
    </div>
    
    
    
    </template>
    
    <script setup>
    import {onMounted,reactive, computed,ref, watch} from "vue";
    import NewGradeScale from "@/main/dashboard/assessment/assessmentComponents/NewGradeScale.vue"

    
    </script>
    
    <style scoped>
    
    </style>