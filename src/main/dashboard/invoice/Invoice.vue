<template>
  <div>


    <AppModal title="Creating New Invoice" v-model="mymodal" xl6>
    <NewInvoice :userNumber="userNumber"></NewInvoice>
    </AppModal>

    <AppModal title="Finance Statement" v-model="mymodalfinance" xl6>
     <FinancialStatement :userNumber="userNumber"></FinancialStatement>
    </AppModal>


    <AppModal title="Pay" v-model="mymodalpay" xs>
    <InvoicePayment :refN="refN"></InvoicePayment>
    </AppModal>

    <div class="rw mt-3"  >
      <div class="col-">    
     <div class="row">
      <div class="col-lg-4">
      </div>
      <div class="col-lg-8">
        <button  @click="showModalFinance()" class="btn btn-outline-danger btn-sm mb-2 ml-4" style="float: right;" v-if="can('add_custom_invoice','general')">
        <small>View Financial Statement</small></button>

        <button  @click="showModal()" class="btn btn-primary btn-sm mb-2" style="float: right;" v-if="can('add_custom_invoice','general')">
        <small><i class="bi bi-plus"> Add New Invoice</i></small></button></div>
     </div>
       
          <div class="card-bdy" style="padding: 0;">
  <div class="containr mt-4">
    <table
      class="table table-striped"
      style="font-size: 13px !important;width: 100%;"
    >
      <thead>
        <tr>
          <th>No.</th>
          <th>CreatedOn</th>
          <th>Due Date</th>
          <th>Total Amount</th>
          <th>Paid Amount</th>
          <th>Balance</th>
          <th>Status</th>
          <th style="width: 18%;"> Actions</th>
        </tr>
      </thead>
      <!-- "number": "c6ee1dc7-898c-4aaf-8d06-1192323cc5a3",
        "ref_number": "24055279",
        "date": "2024-05-13T11:18:19.477Z",
        "due_date": "2024-05-07T00:00:00Z",
        "total_amount": 0,
        "paid_amount": 0,
        "balance": 0,
        "status": "NOT_PAID" -->
      <tbody>
        <tr v-for="(list,index) in invoiceData"  :key="index">
        <td>{{ list.ref_number }}</td>
        <td>{{ list.date }}</td>
        <td>{{ list.due_date }}</td>
        <td>{{ list.total_amount }}</td>
        <td>{{ list.paid_amount }}</td>
        <td>{{list.balance}}</td>
        <td>{{ list.status }}</td>
        <td>
          <button  @click="showModalPay(list.ref_number)" class="btn btn-primary btn-sm mb-2" style="float: right;" v-if="can('add_custom_invoice','general')">
        <small>Pay</small></button>
         <router-link
              class="text-decoration-none"
              :to="{name:'invoice-details', query:{invoice_id:list.ref_number}}">
            <button class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
            <small>View</small>
            </button>
          </router-link>
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

<script setup>
import {onMounted, reactive, ref, watch,computed} from "vue";
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import useNotificationStore from "@/composables/useNotification.js"
import NewInvoice from "@/main/dashboard/invoice/NewInvoice.vue"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import {useRouter} from "vue-router"
import InvoicePayment from "./InvoicePayment.vue";
import FinancialStatement from "./FinancialStatement.vue";
const routerData = useRouter()
const applicationStore= useApplicationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const userNumber = ref(null)
const invoiceData = ref([])
const invoiceStore = useInvoiceStore()
const  notificationStore  = useNotificationStore()
const mymodal = ref(false)
const mymodalfinance  = ref(false)
const refN = ref(null)
const errorMessage = ref(null)
const loader  = ref(false)

const showModal = () =>{
  mymodal.value = true
}

const showModalFinance = () =>{
  mymodalfinance.value = true
}


const mymodalpay = ref(false)

const showModalPay = (refNo) =>{
  mymodalpay.value = true
  refN.value = refNo
  // alert(refN.value)
}

onMounted(
    async () => {
      await applicationStore.fetchStudent(studentNumber)

     
    } 
  )

    watch (
  () => applicationStore.studentDataResponse,
  async (data) => {
    if (data) {
      userNumber.value = data.user_number
      if(userNumber.value){
        let school_number ="", campus_number="",status=""
        invoiceStore.fetchInvoice(school_number,campus_number, userNumber.value,status)
      }
    }
  },
  { deep: true }
)

const { can } = useAbility()



watch(
    () => invoiceStore.invoiceResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        invoiceData.value = data
      }
    },
    {deep:true}
)


watch (
  () => invoiceStore.newInvoiceResponse,
  async (data) => {
    if (data) {
        let school_number ="", campus_number="",status=""
        invoiceStore.fetchInvoice(school_number,campus_number,userNumber.value,status)
        mymodal.value=false

    }
  },
  { deep: true }
)

watch (
    () => invoiceStore.newInvoicePaymentResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
        mymodalfinance.value=false
      }
    },
    {deep:true}
)

watch (
    () => invoiceStore.errorMessage,
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


<style>

</style>