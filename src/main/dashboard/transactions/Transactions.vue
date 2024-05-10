<template>
    <div>
  
  
      <AppModal title="Creating New Transaction" v-model="mymodal" xl6>
      <NewTransaction></NewTransaction>
      </AppModal>
  
      <div class="row mt-3"  >
        <div class="col-12">    
       <div class="row">
        <div class="col-lg-4">
        </div>
        <div class="col-lg-8">
          <button  @click="showModal" class="btn btn-primary btn-sm mb-2" style="float: right;" >
          <small><i class="bi bi-plus"> Add New Transaction</i></small></button></div>
       </div>
         
            <div class="card-body" style="padding: 0;">
    <div class="container mt-4">
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>Transaction No.</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Status</th>
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
    </template>
  
  <script setup>
  import {onMounted, reactive, ref, watch,computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import NewTransaction from "@/main/dashboard/transactions/NewTransaction.vue"
  import AppModal from "@/components/AppModal.vue";
  
  const mymodal = ref(false)
  
  const showModal = () =>{
    mymodal.value = true
  }
  
  </script>
  
  
  <style>
  
  </style>