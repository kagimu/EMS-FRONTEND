<template>
    <div>
    <p class="ml-4 mt-4 mb-10"> SCHOOLS ATTENDED</p>
      <form>
      <div class="row mx-auto">
        <div class="col-6" style="border-right:solid whitesmoke 1px;">
            <h6><center>1</center></h6>
            <div class="mb-2">
              <label class="textColor text-sm">School Name*</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
            </div>
    
            <div class="mb-2">
              <label class="textColor text-sm">Classes Attended *</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
            </div>
        </div>

        <div class="col-6" style="border-right:solid whitesmoke 1px;">
            <h6><center>2</center></h6>
            <div class="mb-2">
              <label class="textColor text-sm">School Name*</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
            </div>
    
            <div class="mb-2">
              <label class="textColor text-sm">Classes Attended *</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
            </div>
        </div>
      </div>

      <div class="row mx-auto">
        <div class="col-6" style="border-right:solid whitesmoke 1px;">
            <h6><center>3</center></h6>
            <div class="mb-2">
              <label class="textColor text-sm">School Name*</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
            </div>
    
            <div class="mb-2">
              <label class="textColor text-sm">Classes Attended *</label>
              <input type="text" style="outline: none 0 !important; box-shadow: none;"  required class="form-control form-control-sm">
            </div>
        </div>

        <div class="col-6" style="border-right:solid whitesmoke 1px;">
       
            <div class="mb-2">
              <label class="textColor text-sm">How Did You Know ABout the School ?</label>
              <input type="text" >
            <select style="outline: none 0 !important; box-shadow: none;"  required class="select form-control form-control-sm" multiple>
            <option value="1">Old parent</option>
            <option value="2">Friend</option>
            <option value="3">Newspaper</option>
            <option value="4">Television</option>
            <option value="5">Internet</option>
            </select>
            <br>
            <p>Other (specify in form of memo description) </p>
            <textarea class="select form-control form-control-sm"></textarea>
            </div>
        </div>
      </div>
        <hr />
    
        <div class="text-right mt-4">
          <button type="submit" class="btn btn-primary mb-2 mr-4">
            Submit
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
    
    </style>