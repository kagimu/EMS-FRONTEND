<script setup>
import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useRouter} from "vue-router"

import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const routerData = useRouter()
const  invoiceStore  = useInvoiceStore()
const router = useRouter()
let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const user_number = ref(null)
const financialSummary = ref(null)
const applicationStore= useApplicationStore()

const props = defineProps({
  userNumber:String
})


watch(
    () => props.userNumber,
    async (data) => {
      if(data){
        user_number.value = props.userNumber
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.studentDataResponse,
    async (data) => {
      if (data) {
        await invoiceStore.fetchFinancialSummary(data.user_number)
      }
    },
    { deep: true }
)


watch (
    () => invoiceStore.financialSummaryResponseById,
    async (data) => {
      if (data) {
        financialSummary.value = data.data
      }
    }
)

watch (
    () => invoiceStore.errorMessage,
    async (data) => {
      if (data) {
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    { deep: true }
)

</script>
<template>
    <div>
      <div class="row">


        <div class="pb-5">
          <p class="text-gray-600">Financial Summary</p>

        <div class="grid grid-cols-12 gap-2 my-4">

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
              <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.total_invoices?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
             <div>Total Invoice</div>
            </div>
          </div>



          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.total_invoice_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
          <div>Total Invoice Amount:</div>
        </div>
        </div>

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.total_payments?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
          <div>Total Payments:</div>
        </div>
        </div>

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.total_paid_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}} </div>
          <div>Total Paid Amount </div>
        </div>
        </div>

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.total_balance_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
          <div>Total Balance Amount:</div>
        </div>
        </div>

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.most_recent?.invoice_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
          <div>Invoice Amount: </div>
        </div>
        </div>

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.most_recent?.invoice_date}}</div>
          <div>Invoice Date:</div>
        </div>
        </div>

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.most_recent?.paid_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
          <div>Paid Amount:</div>
        </div>
        </div>


          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
              <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.most_recent?.paid_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
              <div>Total Credit:</div>
            </div>
          </div>

          <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
            <div class="bg-white border rounded-md text-xs text-center py-3 shadow-md">
          <div class="font-bold text-[#063070] text-[13px]">{{financialSummary?.most_recent?.paid_date}}</div>
          <div> Paid Date:</div>
        </div>
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
    /* font-size: 10px !important; */
  }
  select{
    background-color: transparent;
    border-radius: 2px;
    font-size: 10px !important;
  }
  .star{
    color:red;
  }
  .text-sm2{
    /* font-size: 1px !important; */
  }
    .select-no-border {
      border: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important; 
      outline: none !important;
      box-shadow: none !important;
    }
    .inp{
      border: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important; 
      outline: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
    }
  
  </style>
  