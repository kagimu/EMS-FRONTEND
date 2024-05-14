<template>
    <div>
      <div class="row">
<!--        <div class="col-12">
            <div class="card-body" style="padding: 0;">
                <div class="row">
                    <div class="col-lg-8">

                    </div>
                        <div class="col-lg-4">
                        <button   class="btn btn-warning btn-sm mb-2 mr-4" style="float: right;" type="button" >
                        <small><i class="bi bi-download"><small>&nbsp;Download</small></i></small></button>
                        <button  class="btn btn-secondary  btn-sm mb-2 mr-4" style="float: right;">
                        <small><i class="bi bi-printer">&nbsp;Print</i></small></button>
                    </div>
                </div>
                  <div class="container mt-4">
                
              </div>
            </div>
            <hr>
          </div>-->

        <div class="pb-5">
          <p>Financial Summary</p>

        <div class="row border rounded-md p-3">

          <div class="col-lg-4 mb-1">
            <div class="card-body border rounded-md text-xs">
             <div>Total Invoice</div>
              <div>{{financialSummary?.total_invoices}}</div>
            </div>
          </div>



        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div>Total Invoice Amount:</div>
          <div>{{financialSummary?.total_invoice_amount}}</div>
        </div>
        </div>

        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div>Total Payments:</div>
          <div>{{financialSummary?.total_payments}}</div>
        </div>
        </div>

        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div>Total Paid Amount </div>
          <div>{{financialSummary?.total_paid_amount}} </div>
        </div>
        </div>

        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div>Total Balance Amount:</div>
          <div>{{financialSummary?.total_balance_amount}}</div>
        </div>
        </div>

        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div>Invoice Amount: </div>
          <div>{{financialSummary?.most_recent?.invoice_amount}}</div>
        </div>
        </div>

        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div>Invoice Date:</div>
          <div>   {{financialSummary?.most_recent?.invoice_date}}</div>
        </div>
        </div>

        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div>Paid Amount:</div>
          <div>{{financialSummary?.most_recent?.paid_amount}}</div>
        </div>
        </div>

        <div class="col-lg-4 mb-1">
        <div class="card-body border rounded-md text-xs">
          <div> Paid Date:</div>
          <div>{{financialSummary?.most_recent?.paid_date}}</div>
        </div>
        </div>

</div>

        </div>
        
      </div>
    </div>
  </template>
  
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
  .textColor{
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
  