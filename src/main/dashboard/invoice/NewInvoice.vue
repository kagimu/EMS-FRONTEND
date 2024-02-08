<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-header">
     <div class="row">
      <div class="col-lg-4">
          <h6 class="textColor" style="margin-top:20px; text-align: left;font-size: 15px;">
            <i class="bi bi-x-lg" @click="goBack()"></i>&nbsp;&nbsp;&nbsp;Create Invoice <b></b> 
            
          </h6>
            
      </div>
      <div class="col-lg-8">
        <button type="link" @click="goBack()" class="link-primary textColor" style="margin-top:20px;float: right;font-size: 15px;margin-left:"><i class="bi bi-arrow-right" ></i>&nbsp;&nbsp;&nbsp;View Invoices</button>
      </div>
     </div>
         </div>
          <div class="card-body" style="padding: 0;">
      <div class="container mt-4">
        <form @submit.prevent="createInvoice">
        
          <div class="row">
            <div class="col-lg-4">
              <p class="textColor">Payee Details</p>
              <div class="mb-2">
              <label class="textColor text-sm"><small>Student</small> <span class="star">*</span></label>
              <select class="form-control">
                <option>-select-</option>
              </select>
            </div>
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
              <p class="textColor">Invoice Details</p>
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

              <p class="textColor">Product / Service Details</p>
              

              <div>

                <div>
      <div class="mb-3" v-for="(item, index) in items" :key="index">
        <div class="row align-items-center">
          <div class="col-lg-5">
            <label class="textColor"><small>Product/Service<span class="star">*</span></small></label>
            <input type="text" class="form-control" v-model="item.description" placeholder="Product Name">
          </div>
          <div class="col-lg-2">
            <label class="textColor"><small>Quantity<span class="star">*</span></small></label>
            <input type="number" class="form-control" v-model="item.quantity" placeholder="Quantity">
          </div>
          <div class="col-lg-2">
            <label class="textColor"><small>Unit Price<span class="star">*</span></small></label>
            <input type="number" class="form-control" v-model="item.price" placeholder="Unit Price">
          </div>
          <div class="col-lg-3">

            <label class="textColor"><small>Amount<span class="star">*</span></small></label>
            <p style="margin-top:8px;">{{ item.quantity * item.price }}
            <button style="float:right"  >
              <i v-if="index > 0" @click="removeItem(index)" style="color:red" class="bi bi-trash"></i></button>
            </p></div>

        </div>
      </div>
</div>
      <button type="button" class="link-primary textColor" @click="addItem">Add Another Service/Product</button>
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
            <div class="col-lg-8"></div>
          <div class="col-lg-4">
            <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4" style="color: white;float: right !important;margin-right: 0px;">
              <small><i class="bi bi-save"></i> Submit</small>
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
import { ref, computed } from 'vue';


const goBack = () => {
   window.history.back()
  }

const createInvoice = () =>{

}

const items = ref([
  { description: '', quantity: 0, price: 0 },
]);

const total = computed(() => items.value.reduce((acc, item) => acc + (item.quantity * item.price), 0));

function addItem() {
  items.value.push({ description: '', quantity: 0, price: 0 });
}

function removeItem(index) {
  items.value.splice(index, 1);
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