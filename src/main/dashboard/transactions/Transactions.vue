<template>
    <div>
  
  
      <AppModal title="Creating New Transaction" v-model="mymodal" xl6>
      <NewTransaction></NewTransaction>
      </AppModal>
  
      <div class="row mt-3"  >
        <div class="col-12">    
       <div class="row">
        <div class="col-lg-4">
        </div>
        <div class="col-lg-8">
          <button  @click="showModal" class="btn btn-primary btn-sm mb-2" style="float: right;" >
          <small><i class="bi bi-plus"> Add New Transaction</i></small></button></div>
       </div>
         
            <div class="card-body" style="padding: 0;">
    <div class="container mt-4">
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>Transaction No.</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
     
        </thead>
        <tbody>
   
            
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
  import useNotificationStore from "@/composables/useNotification.js"
  import NewTransaction from "@/main/dashboard/transactions/NewTransaction.vue"
  import AppModal from "@/components/AppModal.vue";
  import {useTransactionStore}  from "@/main/dashboard/transactions/store/transactions.js"
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import {useRouter} from "vue-router"

const routerData = useRouter()
const applicationStore= useApplicationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const userNumber = ref(null)
  const  notificationStore  = useNotificationStore()
  const mymodal = ref(false)
  const transactionStore = useTransactionStore()
  const transactionList = ref(null)
  const errorMessage = ref("")

  
  const showModal = () =>{
    mymodal.value = true
  }

    
  onMounted(() => {
    applicationStore.fetchStudent(studentNumber)
   }
  )

  watch (
  () => applicationStore.studentDataResponse,
  async (data) => {
    if (data) {
      userNumber.value = data.user_number
      if(userNumber.value){
        let school_number ="", campus_number=""
        transactionStore.fetchTransactions(school_number,userNumber.value)
      }
    }
  },
  { deep: true }
)

  
    watch(
    () => transactionStore.transactionResponse,
    async (data) => {
        if (data) {
            transactionList.value = data.data
        }
    },
    {deep: true}
  )

  watch(
    () => transactionStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )
  </script>
  
  
  <style>
  
  </style>