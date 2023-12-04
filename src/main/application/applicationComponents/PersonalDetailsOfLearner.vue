<template>
  <div>
  <p class="ml-4 mt-4 mb-10"> LEARNER'S DETAILS</p>
    <form>
    <div class="row">
      <div class="col-6">
          <div class="mb-2">
            <label class="textColor text-sm">Surname/Family name *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm">Second name *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
          </div>
  
          <div class="mb-2">
            <label class="textColor text-sm">Other names *</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
          </div>
      </div>
  
      <div class="col-6">
          <div class="mb-2">
            <label class="textColor text-sm">Desired Class</label>
            <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
          </div>
           <div class="row">
            <div class="col-lg-6">
              <div class="mb-2">
            <label class="textColor text-sm">DOB</label>
            <input type="date" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">

          </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-2">
            <label class="textColor text-sm">Sex *</label>
            <select class="form-control form-control-sm">
              <option>-select-</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
            </div>
           </div>
      </div>
    </div>
      <hr />
  
      <div class="text-right mt-4">
        <button type="submit" class="btn btn-primary mb-2 mr-4">
          Next
          <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </form>
  </div>
  </template>
  
  <script setup>
  
  import {reactive, ref, watch} from "vue";
  
  const buttonLoader = ref(false)
  let errorMessage = ref(null)
  
  </script>
  
  <style scoped>
  .mb-8 {
    margin-bottom: 2rem;
    text-align: left;
}
.mb-2 {
    margin-bottom: 2rem;
    text-align: left;
}
  </style>