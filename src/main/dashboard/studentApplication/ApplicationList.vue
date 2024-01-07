<template>
  <div>
    <!-- modal for viewing more details -->
    <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <application-details :application-number="applications"></application-details>
      </div>
    </div>
  <div class="container mt-4">
    <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Application List<hr style="width:30px;"></h6>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
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
          <td>{{ applist.status }} </td>
          <td>{{ applist.application_fee_payment === false ? 'pending' : 'completed' }}</td>
          <td>
            <button data-bs-toggle="modal" data-bs-target="#infoModal" @click="setApplicationNumber(applist.number)" 
            class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small><i class="bi bi-eye">&nbsp;view more</i></small></button>    
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch} from "vue";
import ApplicationDetails from './ApplicationDetails.vue';
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";

const applicationInfoList = ref( [])
let errorMessage = ref(null)

const applications= ref(null)


const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

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