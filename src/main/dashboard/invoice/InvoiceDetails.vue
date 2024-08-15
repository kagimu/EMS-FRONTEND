<template>
    <div>
      <!-- invoice payment -->


    <AppModal title="Pay" v-model="mymodalpay" xs>
    <InvoicePayment :invoiceNumber="thisInvoiceNumber"></InvoicePayment>
    </AppModal>

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
                        <button  @click="showModal(myData.invoiceN)"  class="btn btn-primary btn-sm mb-2 mr-4" style="float: right;" type="button" >
                        <small><i class="bi bi-check-lg"><small>&nbsp;Make Payment</small></i></small></button>
                        <button  class="btn btn-secondary  btn-sm mb-2 mr-4" style="float: right;">
                        <small><i class="bi bi-printer">&nbsp;Print</i></small></button>
                        <button @click="cancelInvoice()"  class="btn btn-danger  btn-sm mb-2 mr-4" style="float: right;">
                        <small><i class="bi bi-x">&nbsp;cancel</i></small></button>
                    </div>

                   </div>
                 </div>
                  <div class="card-body" style="padding: 0;">
          <div class="container mt-1">

            <!-- Invoice 1 - Bootstrap Brain Component -->
<section class="py-3 py-md-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12">
        <!-- <div class="row gy-3 mb-3">
          <div class="col-6">
            <h2 class="text-uppercase text-endx m-0">Invoice</h2>
          </div>
          <div class="col-6">
            <a class="d-block text-end" href="#!">
              <img src="./assets/img/bsb-logo.svg" class="img-fluid" alt="BootstrapBrain Logo" width="135" height="44">
            </a>
          </div>
          <div class="col-12">
            <h4>From</h4>
            <address>
              <strong>BootstrapBrain</strong><br>
              875 N Coast Hwybr<br>
              Laguna Beach, California, 92651<br>
              United States<br>
              Phone: (949) 494-7695<br>
              Email: email@domain.com
            </address>
          </div>
        </div> -->
        <div class="row mb-3">
          <div class="col-12 col-sm-6 col-md-8" style="text-transform: capitalize;" >
            <h4>Bill To</h4>
            <address>
              <strong>  {{ studentName }} </strong><br>
              {{ school}}<br>
              {{ campus}}<br>
              {{ className+"("+stream+")"}}<br>
              {{ academicYear }} , {{ studyPeriod }}<br>
            
            
              <!-- {{ userData }} -->
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

                  <!-- <tr >
                    <td colspan="3" class="text-end">Subtotal</td>
                    <td class="text-end">{{payment.total_cost}}</td>
                  </tr> -->
                  <!-- <tr>
                    <td colspan="3" class="text-end">VAT (5%)</td>
                    <td class="text-end">18.1</td>
                  </tr> -->
               
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
        </div>
        
      </div>
    </div>
  </div>
</section>

            <div class="row">
            <div class="col-12">

                <!-- <div class="row">
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
                </div> -->

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
                          <button  @click="cancelInvoicePayment(payment.payment_number)" class="btn btn-warning  btn-sm mb-2 mr-2">
                        <small><i class="bi bi-cancel">&nbsp;cancel</i></small></button>
                        <button  @click="deleteInvoicePayment(payment.payment_number)" class="btn btn-danger  btn-sm mb-2">
                        <small><i class="bi bi-trash"></i></small></button>
                         </td>
                       </tr>
                       </tbody>
                     </table>



                   </div>
               </div>


            </div>
          </div>
      </div>


      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <div>
 
      </div>
    </template>


<script setup>
import InvoicePayment from './InvoicePayment.vue';
import {onMounted, reactive, ref, watch,computed} from "vue";
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import { useRouter } from 'vue-router'
import useNotificationStore from "@/composables/useNotification.js"
import AppModal from "@/components/AppModal.vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);





const invoiceStore = useInvoiceStore()
const showDialog = ref(false)
const invoiceData = ref([])
const notificationStore = useNotificationStore()
const applicationStore= useApplicationStore()
const routerData = useRouter()
const invoice_number = routerData.currentRoute.value.query.invoice_id
const student_number = routerData.currentRoute.value.query.st_id
const userData = ref([])
const mymodalpay = ref(false)
const thisInvoiceNumber = ref(null)
const studentName = ref(null)
  const Sex = ref(null)
  const School= ref(null)
  const Campus= ref(null)
  const Level= ref(null)
  const className= ref(null)
  const dob = ref(null)
  const academicYear = ref(null)
  const studyPeriod=ref(null)
  const stream = ref(null)
  const status = ref(null)
  const campus = ref(null)
  const school = ref(null)
  const actionType = ref(null)
  const invoiceNum = ref(null)

const  showModal = (invoice) =>{
  mymodalpay.value = true
  thisInvoiceNumber.value = invoice
}

onMounted(
    async () => {
      await invoiceStore.fetchInvoiceId(invoice_number)
      applicationStore.fetchStudent(student_number)
    }
)

watch (
  () => applicationStore.studentDataResponse,
  async (data) => {
    if (data) {
      userData.value = data
      studentName.value = data.surname + " " + data.second_name+" "+ data.other_name
      dob.value = data.date_of_birth
      className.value = data.current_enrollment.class
      studyPeriod.value = data.current_enrollment.study_period
      stream.value = data.current_enrollment.stream
      status.value = data.current_enrollment.status
      campus.value = data.current_enrollment.campus
      school.value = data.current_enrollment.school
      academicYear.value = data.current_enrollment.academic_year
    
    }
  },
  { deep: true }
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
        myData.total_amount=  Intl.NumberFormat('en-US').format(data.data.total_amount)
        myData.paid_amount= Intl.NumberFormat('en-US').format(data.data.paid_amount)
        myData.balance= Intl.NumberFormat('en-US').format(data.data.balance)
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

const deleteInvoice = async (roles) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete this Invoice " );
if (agreed) {
  invoiceStore.deleteInvoice(myData.invoiceN)
}
}

const cancelInvoice = async (roles) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to cancel this Invoice " );
if (agreed) {
  invoiceStore.cancelInvoice(myData.invoiceN)
}
}

const cancelInvoicePayment = async (payment_number) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to cancel this Payment " );
if (agreed) {
  invoiceStore.cancelInvoicePayment(payment_number)
}
}


const deleteInvoicePayment = async (payment_number) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete this Payment" );
if (agreed) {
  invoiceStore.deleteInvoicePayment(payment_number)
}
}


watch (
    () => invoiceStore.cancelInvoiceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        await invoiceStore.fetchInvoiceId(invoice_number)
      }
    }
)

watch (
    () => invoiceStore.cancelInvoicePaymentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        await invoiceStore.fetchInvoiceId(invoice_number)
      }
    }
)

watch (
    () => invoiceStore.deleteInvoiceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        goBack()
      }
    }
)

watch (
    () => invoiceStore.deleteInvoicePaymentResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        await invoiceStore.fetchInvoiceId(invoice_number)
      }
    }
)
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
.textSize{
  font-size: 13px;
}

</style>