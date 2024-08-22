<script setup>
import {onMounted, ref, watch,reactive} from "vue";
import useNotificationStore from "@/composables/useNotification.js"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import NewBillables from "@/main/settings/bills/NewBillables.vue"
import {useBillStore} from "@/main/settings/bills/store/bills.js";

const  notificationStore  = useNotificationStore()
const mymodal = ref(false)
const errorMessage = ref(null)
const loader  = ref(false)
const { can } = useAbility()
const billStore = useBillStore()

onMounted(
    async () => {
      doFetchBillables()
    }
)

const showModal = () =>{
  mymodal.value = true
}


 const doFetchBillables = () =>{
  let data = {
  }
  billStore.fetchBillable(data)
 }



watch(
    () => billStore.billableResponse,
    async (data) => {
      if(data){
        billableData.value = data
      }
    },
    {deep:true}
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
      <AppModal title="Creating New Billable" v-model="mymodal" xl8>
      <NewBillables :userNumber="userNumber"></NewBillables>
      </AppModal>

  
      <div class="rw mt-3"  >
        <div class="">
       <div class="row">
        <div class="col-lg-4">
        </div>
        <div class="col-lg-8">
          <button  @click="showModal()" class="btn btn-primary btn-sm mb-2" style="float: right;" v-if="can('add_custom_invoice','general')">
          <small><i class="bi bi-plus"> Add New Billable</i></small></button></div>
       </div>
         
            <div class="card-bdy" style="padding: 0;">
    <div class="mt-4">

  
      <table
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;width: 100%;"
      >
        <thead>
          <tr>
            <th>No.</th>
            <th>Amount</th>
            <th>Campus</th>
            <th>Academic Year</th>
            <th>StudyPeriod</th>
            <th>Class</th>
            <th>Study Mode</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
 
        <tbody>
         <tr>
          <td>1100202</td>
          <td>3000,000 ugx</td>
          <td>Devine Campus</td>
          <td>2024</td>
          <td>Term One</td>
          <td>Primary One</td>
          <td>Boarding</td>
          <td>No</td>
          <td>Active</td>
          <td>

            <button data-bs-toggle="offcanvas" aria-controls="rolesDialogg">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button">
            <i class="bi bi-eye" style="color:blue"></i>
          </button>

          </td>
          </tr> 
            
        </tbody>
      </table>
    </div>
    </div>
    </div>
    </div>
  
  
    </div>
    
  
  
  
    <div>
  
  
  
  
    </div>
    </template>
  
  
  
  
  <style>
  
  </style>
 