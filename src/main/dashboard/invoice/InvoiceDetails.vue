<template>
    <div>
      <!-- invoice payment -->
      <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: inShow }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Register Invoice Payment</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <InvoicePayment></InvoicePayment>
            </div>
          </div>

        </div>
      </div>
    </div>

     <!-- Item In Kind(Tick off brought Item)-->
     <div class="modal fade" id="itemInKind" tabindex="-1" :class="{ show: itemShow }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Item In Kind Payment</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <ItemInKindPayment></ItemInKindPayment>
            </div>
          </div>

        </div>
      </div>
    </div>


      <div class="row">
        <div class="col-12">
          <div class="card mt-3">
            <div class="card-header">
       <div class="row">
        <div class="col-lg-8">
            <h6 style="margin-top:20px; text-align: left;font-size: 15px;">
              <i  @click="goBack()" class="bi bi-x-lg"></i>&nbsp;&nbsp;Invoice Details<b></b>     </h6>
        </div>
        <div class="col-lg-4">
          <button  class="btn btn-primary  btn-sm mb-2 mr-4" style="float: right;" data-bs-toggle="modal" data-bs-target="#itemInKind">
            <small><i class="bi bi-book">&nbsp;Item In Kind</i></small></button> 
            <button  class="btn btn-warning btn-sm mb-2 mr-4" style="float: right;" type="button" data-bs-toggle="modal" data-bs-target="#infoModal">
            <small><i class="bi bi-check-lg"><small>&nbsp;Mark As Paid</small></i></small></button>
            <button  class="btn btn-secondary  btn-sm mb-2 mr-4" style="float: right;">
            <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
        </div>

       </div>
           </div>
            <div class="card-body" style="padding: 0;">
    <div class="container mt-4">
  
      <div class="row">
      <div class="col-12">
      <div class="container mt-4 mb-4">
          <div class="row">
            <div class="col-lg-4">   
              <div class="mb-2">
              <label class="textColor"><small>Student Name</small></label>
              <input disabled type="text" class="form-control" value="collins Mpiima">
            </div>  
            <div class="mb-2">
              <label class="textColor"><small>School</small> </label>
              <input disabled type="text" class="form-control" value="Main Campus">
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
              <label class="textColor"><small>Parent/Guardian Email</small></label>
              <input disabled type="email" class="form-control" value="collinsmppima@gmail.com">
            </div>
            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-7">
              <p class="textColor" style="margin-bottom: 4px;text-align: center;">Products/Items</p>
              <div class="row align-services-center">

       <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="col-md-4">
         <ul class="list-group text-sm mb-4" style="border-radius: 0;"> 
           <li class="list-group-item" v-for="(item, index) in column" :key="index">
             <label class="form-check-label cursor-pointer textColor" :for="'itemCheckbox' + index">{{ item.description }} - [ ugshs {{ item.price }} ]</label>
           </li>
         </ul>
       </div>


       </div>

              <div>

                <div>
     

</div>

    </div>

    <div class="text-end">
      <div class="row">
        <div class="col-lg-7">

        </div>
        <div class="col-lg-5">
       TOTAL : {{ total }}
      </div>

      </div>

    </div>
            </div>

          </div>


      </div>
  </div>
  </div>
  </div>
  </div>


      
    </div>
    </div>
    </div>
    </div>
    </template>

<script setup>
import InvoicePayment from './InvoicePayment.vue';
import { ref, computed,reactive } from 'vue'


const goBack = () => {
     window.history.back()
    }
const invoice = ref({
  items: [
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },

  ]
})

const total = 5000000;

const columns = computed(() => {
  const items = invoice.value.items
  const numColumns = Math.ceil(items.length / 7)
  const columns = Array.from({ length: numColumns }, (_, columnIndex) => {
    const startIndex = columnIndex * 7
    return items.slice(startIndex, startIndex + 7)
  })
  return columns
})



</script>

<style>
 .mb-8 {
    margin-bottom: 2rem;
    text-align: left;
       /* color: rgb(0, 0, 0); */
    font-family: Roboto, sans-serif;
    font-size: 17px;
}
.mb-2 {
    /* margin-bottom: 2rem; */
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
    /* font-size: 17px; */
}

</style>