<template>
    <div>
    
      <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" v-model="searchQuery" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
                <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
                <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
                <button  class="btn btn-outline-primary  btn-sm mt-1" style="float: right; border:none">
                <small><i class="bi bi-book">&nbsp;Exam Types</i></small></button> 
             
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
          <th scope="col">#</th>
          <th scope="col">Column Name</th>
          <th scope="col">Column Name</th>
          <th scope="col">Column Name</th>
          <th scope="col">Column Name</th>
          <th scope="col"></th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
      
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

    </script>
    
    <style scoped>
    
    </style>