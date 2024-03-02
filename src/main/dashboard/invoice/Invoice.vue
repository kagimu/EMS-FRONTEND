<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-header">
     <div class="row">
      <div class="col-lg-4">
          <!-- <h6 style="margin-top:20px; text-align: left;font-size: 15px;">4 Invoices<b></b>     </h6> -->
      </div>
      <div class="col-lg-8">
        <RouterLink :to="{name : 'new-invoice'}" class="btn btn-primary btn-sm" style="float: right;"
        v-if="can('add_custom_invoice','general')">
          <small><i class="bi bi-plus"> Add Custom Invoice</i></small></RouterLink></div>
     </div>
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
          <th>Payer</th>
          <th>Amount</th>
          <th>Title</th>
          <th>Status</th>
          <th>#</th>
        </tr>
   
      </thead>
      <tbody>
       
     
           <tr v-for="(invoiceList, index) in invoiceData" :key="index">
          <td>{{ invoiceList.surname + invoiceList.firstname }}</td>
          <td>{{ invoiceList.total }}</td>
          <td>{{ invoiceList.title }}</td>
          <td><span class="link-success">{{ invoiceList.status }}</span></td>
          <td>
            <router-link
                class="text-decoration-none"
                :to="{name:'invoice-details', query:{Invid:invoiceId}}"
            ><button class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
            <i class="bi bi-eye">&nbsp;View Details</i></small></button></router-link>  
            </td>
        </tr>  
          
      </tbody>
    </table>
  </div>
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
import { useAbility } from '@casl/vue';

const { can } = useAbility()
let invoiceId = "sirina-id"

const invoiceData = ref([])
const invoiceStore = useInvoiceStore()
const  notificationStore  = useNotificationStore()

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

watch (
    () => invoiceStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

</script>


<style>

</style>