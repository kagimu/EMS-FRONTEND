<template>

<div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
       <div class="row">
        <div class="col-lg-6 "> 
              <input type="text" v-model="searchQuery" class="form-control mt-1 mb-0" placeholder="Search...">  
        </div>
        <div class="col-lg-6">
          <!-- <button  class="btn btn-outline-primary  btn-sm mt-1" style="float: right; border:none">
            <small><i class="bi bi-download">&nbsp;Download</i></small></button>  -->
            <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
            <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
        </div>
       </div>
           </div>
    <div class="card-body" >
      <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Parent/Guardian</th>
          <th>Status</th>
          <th>Payment Status</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(applist, index) in applicationInfoList" :key="index">
          <td>{{ applist.Parent.surname+ " "+ applist.Parent.second_name+ " "+ applist.Parent.other_name  }} </td>
          <td>{{ applist.status == "ADMITTED" ? 'interview scheduled' : 'new'}} </td>
          <td>{{ applist.application_fee_payment === false ? 'pending' : 'completed' }}</td>
          <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" @click="setApplicationNumber(applist.number)" 
            class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
              
            {{  applist.status == "ADMITTED" ? 'view Details' : 'schedule Interview' }}
            <i class="bi bi-arrow-right"> </i></small></button>    
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    </div>
    </div>
    </div>







  <div>
    <!-- modal for viewing more details -->
    <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <application-details :application-number="applications"></application-details>
      </div>
    </div>


 
  </div>
  </template>
  
  <script setup>
import {onMounted,reactive, computed,ref, watch} from "vue";
import ApplicationDetails from './ApplicationDetails.vue';
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
const buttonLoader = ref(false)
const applicationInfoList = ref( [])
let errorMessage = ref(null)

const searchQuery = ref('')


const applications= ref(null)


const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const interviewDialog = ref(false)

const setApplicationNumber = (ap) =>{
  applications.value = ap
}


onMounted(
    async () => {
      await applicationStore.fetchApplicationList()
    } )

    watch(
    () => applicationStore.applicationListResponse,
    async (data) => {
      if(data){
        applicationInfoList.value = data.data
      }
    },
    {deep:true}
    )
    
    watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


  </script>



  <style scoped>
  
  </style>