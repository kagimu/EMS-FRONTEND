<template>
  <div>


    <AppModal title="Creating New Invoice" v-model="mymodal" xl6>
    <NewInvoice :userNumber="userNumber"></NewInvoice>
    </AppModal>

    <div class="row mt-3"  >
      <div class="col-12">    
     <div class="row">
      <div class="col-lg-4">
      </div>
      <div class="col-lg-8">
        <button  @click="showModal()" class="btn btn-primary btn-sm mb-2" style="float: right;" v-if="can('add_custom_invoice','general')">
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
          <th>Invoice No.</th>
          <th>CreatedOn</th>
          <th>Due Date</th>
          <th>Items</th>
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
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import useNotificationStore from "@/composables/useNotification.js"
import NewInvoice from "@/main/dashboard/invoice/NewInvoice.vue"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import {useRouter} from "vue-router"

const routerData = useRouter()
const applicationStore= useApplicationStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const userNumber = ref(null)


onMounted(
    async () => {
      await applicationStore.fetchStudent(studentNumber)
    } )

    watch (
  () => applicationStore.studentDataResponse,
  async (data) => {
    if (data) {
      userNumber.value = data.user_number
    }
  },
  { deep: true }
)

const { can } = useAbility()

const invoiceData = ref([])
const invoiceStore = useInvoiceStore()
const  notificationStore  = useNotificationStore()
const mymodal = ref(false)

const showModal = () =>{
  mymodal.value = true
}

onMounted(
    () => {
      invoiceStore.fetchInvoice()
    }
)

watch(
    () => invoiceStore.invoiceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

// watch (
//     () => invoiceStore.errorMessage,
//     async (data) => {
//       if(data){
//         notificationStore.errorToast("Error",data.message)
//       }
//     },
//     {deep:true}
// )

</script>


<style>

</style>