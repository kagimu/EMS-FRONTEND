<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="card mt-3">
            <div class="card-header">
       <div class="row">
        <div class="col-lg-4">
            <h6 class="textColor" style="margin-top:20px; text-align: left;font-size: 15px;">
              <i class="bi bi-x-lg" @click="goBac()"></i>&nbsp;&nbsp;&nbsp;Offer Admission | School Requirements Invoice <b></b>    
            </h6>
        </div>
        <div class="col-lg-8">
          <RouterLink :to="{name : 'invoices'}" type="link" class="link-primary textColor" style="margin-top:20px;float: right;font-size: 15px;margin-left:"><i class="bi bi-arrow-right" ></i>&nbsp;&nbsp;&nbsp;View Invoices</RouterLink>
        </div>
       </div>
           </div>
            <div class="card-body" style="padding: 0;">
        <div class="container mt-4">
          <form @submit.prevent="submitInvoice">
            <div class="row">
              <div class="col-lg-4">
                <p class="textColor" style="margin-bottom: -4px;">Payee Details</p>
              <div class="mb-2">
                <label class="textColor"><small>Campus</small> </label>
                <input disabled type="text" class="form-control" value="Main Campus">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Class</small> </label>
                <input disabled type="text" class="form-control" value="P1">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input disabled type="text" class="form-control" value="collins Mpiima">
              </div>
              <div class="mb-2">
                <label class="textColor"><small>Email</small></label>
                <input disabled type="email" class="form-control" value="collinsmppima@gmail.com">
              </div>
              </div>
              <div class="col-lg-1"></div>
              <div class="col-lg-7">
                <p class="textColor" style="margin-bottom: -4px;">Invoice Details</p>
                <div class="row">
                  <div class="col-lg-8">
                  <div class="mb-2">
                    <label class="textColor"><small>Invoice Title <span class="star">*</span></small></label>
                    <input  type="text" class="form-control" >
                  </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-2">
                    <label class="textColor"><small>Due Date<span class="star">*</span></small></label>
                    <input  type="date" class="form-control" >
                    </div>
                  </div>
                </div>
  
               
                
  
                <div>
  
                  <div>
        <div class="mb-3">
          <div class="row align-services-center">
         
            <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
            <li class="list-group-item" >
                <div class="item-selector">
          <input type="checkbox" id="selectAll" v-model="selectAll" @change="selectAllItems">
          <label for="selectAll"><small>&nbsp;select all</small></label>
        </div>
          </li>
            <li class="list-group-item"  v-for="(item, index) in invoice.items" :key="index">
              <input  style="outline: none 0 !important; box-shadow: none;" class="form-check-input me-1" type="checkbox" :id="'itemCheckbox' + index" v-model="selectedItems" :value="index">
              <label class="form-check-label cursor-pointer textColor" :for="'itemCheckbox' + index">{{ item.description }} - Price: ugshs {{ item.price }}</label>
            </li>
          </ul>
  

          </div>
  
        </div>
  
  </div>  
      </div>
     <hr>
      <div class="text-end">
        
          <!-- <strong>Total: {{ total }}</strong> -->
        <div class="row">
          <div class="col-lg-7">
  
          </div>
          <div class="col-lg-2">
         <b>TOTAL</b> 
        </div>
        <div class="col-lg-3">
          <input style="color:rgb(15, 15, 15); border: none; font-size: 15px !important;font-weight: 600;" disabled  class="form-control" v-model="total">
        </div>
        </div>
  
      </div>
  
              </div>
  
            </div>
  
            <hr>
            <div class="row">
             
              <div class="col-lg-4">
              <button @click="goBac()" type="button" class="btn btn-sm btn-outline-danger mb-2 mr-4" style="float: left !important;margin-right: 0px;">
                <i class="bi bi-box-arrow-in-left"></i> back</button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-outline-primary mb-2 mr-4" style="float: right !important;margin-right: 0px;">
                <small><i class="bi bi-save"></i> Publish</small>
            <!-- <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div> -->
          </button>
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
  import { ref, computed,reactive } from 'vue';

  let  student_number = '1203039490402st'
  
  const invoice = ref({
    items: [
      { description: 'School Fees ', price: 100000000 },
      { description: 'Ream Of Papers', price: 200000 },
      { description: 'Broom', price: 15000 },
    ]
  })
  
  const selectAll = ref(false)
  const selectedItems = ref([])
  
  const total = computed(() => selectedItems.value.reduce((acc, index) => acc + invoice.value.items[index].price, 0));
  
  const selectAllItems = () => {
    if (selectAll.value) {
      selectedItems.value = invoice.value.items.map((item, index) => index);
    } else {
      selectedItems.value = [];
    }
  }
  
  const submitInvoice = () => {
    const selectedItemsData = selectedItems.value.map(index => {
      const item = invoice.value.items[index];
      return { description: item.description, price: item.price };
    })

    const data = {
        student_number,
      items: selectedItemsData
    }
    alert(JSON.stringify(data));
  }

  </script>
  
  <style>
  .mb-8 {
    margin-bottom: 2rem;
    text-align: left;
       color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
  }
  .mb-2 {
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
  }
  input{
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
  }
  select{
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
  }
  .star{
  color:red;
  }
  .textColor{
  font-size: 11px !important;
  }
  </style>