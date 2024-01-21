<template>
  <div>
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Interview Questions
      <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      data-bs-toggle="offcanvas" data-bs-target="#rolesDialogg" aria-controls="rolesDialogg">
     <b><i class="bi bi-plus"></i></b> <small>
        Add Questions</small></button>
      <hr style="width:30px;"></h6>
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>No.</th>
          <th>Question</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        <tr >
          <td>1</td>
          <td>Question one</td>
           <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" 
             class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-eye">&nbsp;View More</i></small></button>        
            </td>
        </tr>  
        <tr >
          <td>1</td>
          <td>Question two</td>
           <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" 
             class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
              <i class="bi bi-eye">&nbsp;View More</i></small></button>        
            </td>
        </tr>       
        


      </tbody>
    </table>
  </div>

  <!-- schedule interview -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" aria-labelledby="offcanvasRightLabel" >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Question</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <form>
              <div class="mb-2">
                <label class="textColor"><small>Interviews</small></label>
               <select class="form-control">
                <option>-select interview-</option>
                <option>interview 1</option>
                <option>interview 2</option>
               </select>
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Question</small></label>
                <input  type="text" required class="form-control">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Possible Answers</small></label>
                <input  type="text" required class="form-control" >
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Correct Answer</small></label>
                <input  type="text" required class="form-control" >
              </div>
             
              <div class="text-right mt-4">
                <button style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                    <span class="visually-hidden">Loading...</span>
                  </div></button>
              </div>
            </form>
          </div>
        </div>
<!-- wnd  -->


  </div>
  </template>
  
  <script setup>
    import {onMounted, reactive, ref, watch} from "vue";

    const buttonLoader = ref(false)
  </script>


  
  <style scoped>
  
  </style>