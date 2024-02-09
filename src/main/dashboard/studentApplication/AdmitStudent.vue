<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Student Admission<b></b> 

      <button @click="goBack()" style="float: right" type="button" class="btn btn-outline-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-left"></i>&nbsp;<small>Back </small></button>

      <hr style="color:rgba(192, 192, 192, 0.781); width:200px"></h6>
 
      <table
      id="datatable"
      class="table table-striped border"
      style="font-size: 13px !important;border: 0px;"
    >
      <thead>
        <tr>
          <th>#</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr >
          <td>Name</td>
          <td>
          <label>Collins Mpiima</label>
        </td>
        </tr> 
        <tr >
          <td>Desired Class</td>
          <td>
          <label>P.1</label>
        </td>
        </tr>    
        <tr >
          <td>Campus</td>
          <td>
          <label>Kampala Campus</label>
        </td>
        </tr> 
      </tbody>
    </table>
    <form @submit.prevent="admitStudent">
    <label><small>Are there conditions to fullfil ?</small></label><br>
    <input type="radio" v-model="answer" value="no" >&nbsp; No  &nbsp;&nbsp;&nbsp;
    <input type="radio" v-model="answer" value="yes">&nbsp; Yes 
    <div class="mb-2" v-if="answer === 'yes'">
    <label class="textColor text-sm"><small>Specify Conditions</small></label>
    <div v-for="(cond, index) in form.conditions" :key="index" class="mb-2">
      <div class="row">
        <div class="col-lg-11">
          <input :value="cond" @input="updateCondition($event, index)" type="text" required class="form-control">
        </div>
        <div class="col-lg-1">
          <span @click="removeCondition(index)" style="color: red; width: 12px; height: 12px;" title="Remove Condition">
        <i class="bi bi-x-circle-fill"></i>
      </span>
        </div>
      </div>
    </div>
    <span @click="addCondition" style="color: rgb(33, 9, 154); width: 12px; height: 12px; margin-left:5px;">
      <i class="bi bi-plus-circle"></i>
    </span>
              </div>

    <div class="row">
    <hr style="color: rgba(17, 17, 17, 0.265);">
    <div class="col-lg-8">

    </div>
    <div class="col-lg-2">
        <button style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-save2"></i>&nbsp;<small>Admit</small></button>
</div>
<div class="col-lg-2">
    <button style="margin-right: 5px;" type="button" class="btn btn-sm btn-danger mb-2 mr-4"><i class="bi bi-x-circle"></i>&nbsp;<small>Cancel</small></button>
</div>

</div>
  </form>
    
  </div>
  </div>
  </div>
  </div>
  </div>




  </div>
  </template>
  
  <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import useNotificationStore from "@/composables/useNotification.js";

  const answer = ref('');


  const goBack = () => {
     window.history.back()
    }

  const form = reactive({ 
      conditions:[],
    })

const addCondition = () => {
  form.conditions.push('');
}

const removeCondition = (index) => {
  form.conditions.splice(index, 1);
}

const updateCondition = (event, index) => {
  form.conditions[index] = event.target.value;
}

const admitStudent = () =>{
  //go to invoice
  
}

  </script>


  
  <style scoped>
  
  </style>