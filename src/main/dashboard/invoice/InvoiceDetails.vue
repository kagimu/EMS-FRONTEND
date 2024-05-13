<template>
    <div>
      <!-- invoice payment -->
      <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: showDialog }" aria-labelledby="" aria-hidden="true">
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
     <div class="modal fade" id="itemInKind" tabindex="-1" :class="{ show: showModl }" aria-labelledby="" aria-hidden="true">
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
            <button @click="openModal()"  class="btn btn-warning btn-sm mb-2 mr-4" style="float: right;" type="button" data-bs-toggle="modal" data-bs-target="#infoModal">
            <small><i class="bi bi-check-lg"><small>&nbsp;Mark As Paid</small></i></small></button>
            <button  class="btn btn-secondary  btn-sm mb-2 mr-4" style="float: right;">
            <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
        </div>

       </div>
           </div>
            <div class="card-body" style="padding: 0;">
    <div class="container mt-4">
<!--   
      "ref_number": "24055279",
        "date": "2024-05-13T11:18:19.477Z",
        "due_date": "2024-05-07T00:00:00Z",
        "total_amount": 0,
        "paid_amount": 0,
        "balance": 0,
        "status": "NOT_PAID", -->

      <div class="row">
      <div class="col-12">
      <div class="container mt-4 mb-4">
          <div class="row">
            <div class="col-lg-4">   
              <div class="mb-2">
              <label class="textColor"><small>Invoice Number</small></label>
              <input disabled type="text" class="form-control" v-model="myData.ref_number">
            </div>  
            <div class="mb-2">
              <label class="textColor"><small>Created On</small> </label>
              <input disabled type="text" class="form-control" v-model="myData.date">
            </div>         
            <div class="mb-2">
              <label class="textColor"><small>Due Date</small> </label>
              <input disabled type="text" class="form-control" v-model="myData.due_date">
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Total Amount</small> </label>
              <input disabled type="text" class="form-control" v-model="myData.total_amount">
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Paid Amount</small></label>
              <input disabled  class="form-control" v-model="myData.paid_amount">
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Balance</small></label>
              <input disabled  class="form-control" v-model="myData.balance">
            </div>
            <div class="mb-2">
              <label class="textColor"><small>Status</small></label>
              <input disabled  class="form-control" v-model="myData.status">
            </div>
            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-6">
              <p class="textColor" style="margin-bottom: 4px;text-align: center;">Products/Items</p>
              <div class="row align-services-center">

       <div v-for="(column, columnIndex) in invoiceData" :key="columnIndex" class="col-md-12">
         <ul class="list-group text-sm mb-4" style="border-radius: 0;"> 
           <li class="list-group-item" v-for="(item, index) in column.items" :key="index">
             <label class="form-check-label cursor-pointer textColor" :for="'itemCheckbox' + index">{{ item.item_name }} - [ ugshs {{ item.unit_cost }} ]- [ Qty {{ item.quantity }} ]</label> 
           </li>
         </ul>
       </div>


       </div>

              <div>

                <div>
    
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
import {onMounted, reactive, ref, watch,computed} from "vue";
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import { useRouter } from 'vue-router'
import useNotificationStore from "@/composables/useNotification.js"

const invoiceStore = useInvoiceStore()
const showDialog = ref(false)
const invoiceData = ref([])
const notificationStore = useNotificationStore()

const routerData = useRouter()
const invoice_number = routerData.currentRoute.value.query.invoice_id

onMounted(
    async () => {
      await invoiceStore.fetchInvoiceId(invoice_number)
    } 
  )


const myData = reactive ({
ref_number: invoice_number,
date :null,
 due_date: null,
total_amount:null,
paid_amount:null,
 balance: null,
status:null
})
  watch(
    () => invoiceStore.invoiceResponseById,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        invoiceData.value = data,

        myData.ref_number= data.data.ref_number,
        myData.date= data.data.date,
        myData.due_date= data.data.due_date,
        myData.total_amount= data.data.total_amount,
        myData.paid_amount= data.data.paid_amount,
        myData.balance= data.data.balance,
        myData.status=data.data.status
       
      }
    },
    {deep:true}
)

const goBack = () => {
     window.history.back()
    }

const openModal = () =>{
  showDialog.value = true
}

watch (
    () => invoiceStore.newInvoicePaymentResponse,
    async (data) => {
      if(data){
        showDialog.value = false
      }
    },
    {deep:true}
)

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