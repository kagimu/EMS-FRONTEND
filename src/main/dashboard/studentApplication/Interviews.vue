<template>
  <div>
    <!-- modal for viewing more details -->
    <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: schoolDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <application-details></application-details>
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
          <th>APN</th>
          <th>Status</th>
          <th>Payment Status</th>
          <th>#</th>
        </tr>
      <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
      </thead>
      <tbody>

        <tr v-for="(interlist, index) in interviewList" :key="index">
          <td>{{ interlist.number }}</td>
          <td>{{ interlist.status }}</td>
          <td>{{ interlist.application_fee_payment }}</td>
          <td>
            <router-link data-bs-toggle="modal" data-bs-target="#infoModal" 
             :to="{name:'student-application', query:{id:interlist.number}}" class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small><i class="bi bi-eye">&nbsp;Grade</i></small></router-link>
    <button @click="openModal(interlist)" class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details">
      <small><i class="bi bi-eye">&nbsp;Grade</i></small>
    </button>
         
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

const interviewList = ref( [])
let errorMessage = ref(null)

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

onMounted(
    async () => {
      await applicationStore.fetchInterviewList()
    } )

    watch(
    () => applicationStore.interviewListResponse,
    async (data) => {
      if(data){
        interviewList.value = data.data
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