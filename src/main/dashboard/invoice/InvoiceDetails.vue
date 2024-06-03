<script setup>
import InvoicePayment from './InvoicePayment.vue';
import {onMounted, reactive, ref, watch,computed} from "vue";
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import { useRouter } from 'vue-router'
import useNotificationStore from "@/composables/useNotification.js"
import AppModal from "@/components/AppModal.vue";


const invoiceStore = useInvoiceStore()
const showDialog = ref(false)
const invoiceData = ref([])
const notificationStore = useNotificationStore()

const routerData = useRouter()
const invoice_number = routerData.currentRoute.value.query.invoice_id
const mymodalpay = ref(false)
const thisInvoiceNumber = ref(null)

const  showModal = (invoice) =>{
  mymodalpay.value = true
  thisInvoiceNumber.value = invoice
}

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
  status:null,
  invoiceN:null
})
watch(
    () => invoiceStore.invoiceResponseById,
    async (data) => {
      if(data){
        invoiceData.value = data.data
        myData.ref_number= data.data.ref_number
        myData.date= data.data.date
        myData.due_date= data.data.due_date
        myData.total_amount= data.data.total_amount
        myData.paid_amount= data.data.paid_amount
        myData.balance= data.data.balance
        myData.status=data.data.status
        myData.invoiceN = data.data.number
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
    () => invoiceStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)





const invoice = ref({
  items: [
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


watch (
    () => invoiceStore.newInvoicePaymentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        mymodalpay.value = false
        await invoiceStore.fetchInvoiceId(invoice_number)
      }
    }
)



</script>
<template>
    <div>
      <!-- invoice payment -->

    <AppModal title="Pay" v-model="mymodalpay" xs>
    <InvoicePayment :invoiceNumber="thisInvoiceNumber"></InvoicePayment>
    </AppModal>

          <div class="row mt-4">
             <div class="col-12">
                <div class="card mt-0">
                  <div class="card-header">
                   <div class="row">
                    <div class="col-lg-8">
                        <h6 style="margin-top:20px; text-align: left;font-size: 15px;">
                          <i  @click="goBack()" class="bi bi-x-lg"></i>&nbsp;&nbsp;Invoice Details<b></b>     </h6>
                    </div>
                    <div class="col-lg-4">
                        <button  @click="showModal(myData.invoiceN)"  class="btn btn-warning btn-sm mb-2 mr-4" style="float: right;" type="button" >
                        <small><i class="bi bi-check-lg"><small>&nbsp;Make Payment</small></i></small></button>
                        <button  class="btn btn-secondary  btn-sm mb-2 mr-4" style="float: right;">
                        <small><i class="bi bi-printer">&nbsp;Print</i></small></button>
                    </div>

                   </div>
                 </div>
                  <div class="card-body" style="padding: 0;">
          <div class="container mt-1">
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

                <div class="row">
                  <div class="col-lg-4">
                    <div class="mb-2">
                    <label class="textSize"><small>Invoice Number</small></label>
                    <input disabled type="text" class="form-control" v-model="myData.ref_number">
                  </div>
                  <div class="mb-2">
                    <label class="textSize"><small>Created On</small> </label>
                    <input disabled type="text" class="form-control" v-model="myData.date">
                  </div>
                  <div class="mb-2">
                    <label class="textSize"><small>Due Date</small> </label>
                    <input disabled type="text" class="form-control" v-model="myData.due_date">
                  </div>
                  <div class="mb-2">
                    <label class="textSize"><small>Total Amount</small> </label>
                    <input disabled type="text" class="form-control" v-model="myData.total_amount">
                  </div>
                  <div class="mb-2">
                    <label class="textSize"><small>Paid Amount</small></label>
                    <input disabled  class="form-control" v-model="myData.paid_amount">
                  </div>
                  <div class="mb-2">
                    <label class="textSize"><small>Balance</small></label>
                    <input disabled  class="form-control" v-model="myData.balance">
                  </div>
                  <div class="mb-2">
                    <label class="textSize"><small>Status</small></label>
                    <input disabled  class="form-control" v-model="myData.status">
                  </div>
                  </div>
                  <div class="col-lg-8">
                    <p class="textSize" style="margin-bottom: 4px;text-align: left;">Items</p>
                    <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
                      <thead>
                      <tr>
                        <th scope="col" style="width: 10%;">#</th>
                        <th scope="col">Item</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Cost</th>
                        <th scope="col">Total</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(payment, index) in invoiceData.items" :key="index">
                        <td> {{(index + 1)}}</td>
                        <td> {{payment.item_name}}</td>
                        <td> {{payment.quantity}}</td>
                        <td> {{payment.unit_cost}}</td>
                        <td> {{payment.total_cost}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

        </div>
        </div>
        </div>
        </div>



          </div>



                 <div class="card mt-2">
                   <div class="card-header">
                      Payments
                     <hr />

                     <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
                       <thead>
                       <tr>
                         <th scope="col" style="width: 10%;">#</th>
                         <th scope="col">Invoice Number</th>
                         <th scope="col">Date</th>
                         <th scope="col">By</th>
                         <th scope="col">Amount</th>
                         <th scope="col">Action</th>
                       </tr>
                       </thead>
                       <tbody>
                       <tr v-for="(payment, index) in invoiceData.payments" :key="index">
                         <td> {{(index + 1)}}</td>
                         <td> {{payment.invoice_ref_number}}</td>
                         <td> {{payment.date_time}}</td>
                         <td> {{payment.recorded_by}}</td>
                         <td> {{payment.amount}}</td>
                         <td>
                           <div>
<!--                             <i
                                 v-if="can('edit_level','general')"
                                 style="font-size: 13px;"
                                 data-bs-toggle="modal" data-bs-target="#levelModal"
                                 class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                             <i
                                 v-if="can('delete_level','general')"
                                 style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                             <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                               <span class="visually-hidden">Loading...</span>
                             </div>-->
                           </div>
                         </td>
                       </tr>
                       </tbody>
                     </table>

                   </div>
               </div>


            </div>
          </div>
      </div>
    </template>



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
.textSize{
  font-size: 13px;
}

</style>