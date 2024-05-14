<template>
    <div>
      <div class="row">
        {{ userNumber }}
        <div class="col-12">
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

  const routerData = useRouter()
  const serviceStore= useServiceStore()
  const  invoiceStore  = useInvoiceStore()
  const router = useRouter()
  let errorMessage = ref(null)
  const emit = defineEmits()
  const  notificationStore  = useNotificationStore()
  const studentNumber = routerData.currentRoute.value.query.st_id;
  const user_number = ref(null)
  
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
  
  onMounted(
      async () => {
        await invoiceStore.fetchFinancialSummary(props.userNumber)
      } )

  
  watch (
    () => invoiceStore.financialSummaryResponseById,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
      }
    },
    { deep: true }
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
  