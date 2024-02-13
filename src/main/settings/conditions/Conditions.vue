<template>
    <div>
    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Conditions
        <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
        data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showInterviewDialog">
       <b><i class="bi bi-plus"></i></b> <small>
          Add</small></button>
        <hr style="width:30px;"></h6>
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <!-- <th>Interview</th> -->
            <th>Name</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
         
  
        </tbody>
      </table>
    </div>
  
    <!-- schedule interview -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show:thisDialog }" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasRightLabel">Conditions</h5>
              <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeInterviewDialog"></button>
            </div>
            <div class="offcanvas-body">
              <form @submit.prevent="addCondition">
                <div class="mb-2">
                  <label class="textColor"><small>Name</small></label>
                  <input v-model="form.name"  type="text" required class="form-control">
                </div>
                
                <div class="text-right mt-4">
                  <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
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
      import {onMounted,reactive, ref, watch} from "vue";
      import useNotificationStore from "@/composables/useNotification.js";
  
      const buttonLoader = ref(false)
    
      const thisDialog= ref(false)
  
      const form = reactive({ 
        name:null,
      })
  
  
   //working on dialog
  const closeInterviewDialog = () => {
   thisDialog.value = false;
  };
  const showInterviewDialog = () => {
   thisDialog.value = true;
  }
  
  
      const addConditiont = () => {
      //  alert(JSON.stringify(form))
       thisDialog.value = true;
       buttonLoader.value = true
       
      }
    
  
    </script>
  
  
    
    <style scoped>
    
    </style>