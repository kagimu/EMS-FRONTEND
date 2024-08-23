<script setup>
import {onMounted, ref, watch,reactive} from "vue";
import useNotificationStore from "@/composables/useNotification.js"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import NewBillables from "@/main/settings/bills/NewBillables.vue"
import {useBillStore} from "@/main/settings/bills/store/bills.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"

const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const mymodal = ref(false)
const errorMessage = ref(null)
const loader  = ref(false)
const { can } = useAbility()
const schoolList = ref([])
const billStore = useBillStore()
const school_number = ref("")
const billableData= ref([])
onMounted(
    async () => {
     schoolStore.fetchSchools()
    }
)

const showModal = () =>{
  mymodal.value = true
}


 const doFetchBillables = (schoolN) =>{
  let data = {
    school_number:schoolN
  }
  billStore.fetchBillable(data)
 }



watch(
    () => billStore.billableResponse,
    async (data) => {
      if(data){
      
        billableData.value = data.data
        // alert(JSON.stringify(data))
      }
    },
    {deep:true}
)



watch(
      () => schoolStore.schoolsResponse,
      async (data) => {
          if (data) {
              schoolList.value = data.data
          }
      },
      {deep: true}
  )

watch (
    () => billStore.newBillableResponse,
    async (data) => {
      if (data) {
        mymodal.value=false
      }
    },
    { deep: true }
)



watch (
    () => billStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
        loader.value = false
      }
    },
    {deep:true}
)

</script>

<template>
    <div>

          <div class="row">
             <div class="col-12">
                <div class="card mt-0">
                  <div class="card-header">
                   <div class="row">
                    <div class="col-lg-7">
                        <h6 style="margin-top:20px; text-align: left;font-size: 15px;">
                          <i  @click="goBack()" class="bi bi-x-lg"></i>&nbsp;&nbsp;Invoice Details<b></b>     </h6>
                    </div>
                    <div class="col-lg-5">
                      <button  @click="deleteInvoice()" class="btn btn-danger  btn-sm mb-2 mr-4" style="float: right;">
                        <small><i class="bi bi-trash">&nbsp;Delete</i></small></button>
                      <!-- <button type="submit" class="btn btn-primary mb-3">Download Invoice</button> -->
                        <button   @click="showModal(myData.invoiceN)"  class="btn btn-primary btn-sm mb-2 mr-4"
                         style="float: right;" type="button" 
                         v-if="can('pay_invoice','general')">
                        <small><i class="bi bi-check-lg"><small>&nbsp;Make Payment</small></i></small>
                      </button>
                        <button  class="btn btn-secondary  btn-sm mb-2 mr-4" style="float: right;">
                        <small><i class="bi bi-printer">&nbsp;Print</i></small></button>
                        <button @click="cancelInvoice()"  class="btn btn-danger  btn-sm mb-2 mr-4" 
                        style="float: right;"
                        v-if="can('cancel_invoice','general')">
                        <small><i class="bi bi-x">&nbsp;cancel</i></small></button>
                    </div>

                   </div>
                 </div>
                  <div class="card-body" style="padding: 0;">
          <div class="container mt-1">

            <!-- Invoice 1 - Bootstrap Brain Component -->
<section class="py-3 py-md-5">
  <div class="container">
   
       
        <!-- <div class="row mb-3">
          <div class="col-12 col-sm-6 col-md-8" style="text-transform: capitalize;" >
            <h4>Bill To</h4>
            <address>
              <strong>  {{ studentName }} </strong><br>
              {{ school}}<br>
              {{ campus}}<br>
              {{ className+"("+stream+")"}}<br>
              {{ academicYear }} , {{ studyPeriod }}<br>
            
        
            </address>
          </div>
          <div class="col-12 col-sm-6 col-md-4" >
            <h4 class="row">
              <span class="col-6">Invoice #</span>
              <span class="col-6 text-sm-end ">{{ myData.ref_number }}</span>
            </h4>
            <div class="row">
              
              <span class="col-6">Invoice Date</span>
              <span class="col-6 text-sm-end">{{ myData.date }}</span>
              <span class="col-6">Due Date</span>
              <span class="col-6 text-sm-end">{{ myData.due_date }}</span>
              <span class="col-6">Status</span> <span class="col-6 text-sm-end badge bg-warning text-black fw-bold"><b>{{ myData.status }}</b></span>

            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="text-uppercase">Qty</th>
                    <th scope="col" class="text-uppercase">Item</th>
                    <th scope="col" class="text-uppercase text-end">Unit Price</th>
                    <th scope="col" class="text-uppercase text-end">Amount</th>
                  </tr>
                </thead>
                <tbody class="table-group-divider">
                  <tr v-for="(payment, index) in invoiceData.items" :key="index">
                    <th scope="row">{{payment.quantity}}</th>
                       
                        <td > {{payment.item_name}}</td>
                        <td class="text-end"> {{payment.unit_cost}}</td>
                        <td class="text-end"> {{payment.unit_cost}}</td>
                  </tr>
               
                  <tr>
                    <th scope="row" colspan="3" class="text-uppercase text-end">Total</th>
                    <td class="text-end">{{myData.total_amount}}</td>
                  </tr>
                  <tr >
                    <th scope="row" colspan="3" class="text-uppercase text-end">Paid</th>
                    <td class="text-end">{{myData.paid_amount}}</td>
                  </tr>
                  <tr >
                    <th scope="row" colspan="3" class="text-uppercase text-end">Balance</th>
                    <td class="text-end">{{ myData.balance }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div> -->
        
      </div>
   
</section>

            <div class="row">
            <div class="col-12">

               
        </div>
        </div>
        </div>
        </div>



          </div>



                 <!-- <div class="card mt-2">
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
                         <th >Action</th>
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
                          <button  @click="cancelInvoicePayment(payment.payment_number)" 
                          class="btn btn-warning  btn-sm mb-2 mr-2"
                          v-if="can('cancel_payment','general')">
                        <small><i class="bi bi-cancel">&nbsp;cancel</i></small></button>
                        <button  @click="deleteInvoicePayment(payment.payment_number)" class="btn btn-danger  btn-sm mb-2">
                        <small><i class="bi bi-trash"></i></small></button>
                         </td>
                       </tr>
                       </tbody>
                     </table>



                   </div>
               </div> -->


            </div>
          </div>
      </div>


      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <div>
 
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