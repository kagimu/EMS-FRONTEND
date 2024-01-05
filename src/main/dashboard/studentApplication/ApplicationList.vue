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
      </thead>
      <tbody>

        <tr v-for="(applist, index) in applicationInfoList" :key="index">
          <td>{{ applist.number }}</td>
          <td>{{ applist.status }} </td>
          <td>{{ applist.application_fee_payment === false ? 'pending' : 'completed' }}</td>
          <td>
            <router-link data-bs-toggle="modal" data-bs-target="#infoModal"  
            :to="{name:'student-application', query:{id:applist.number}}" class="link-primary" style="border-width: 0px;text-decoration: none;" title="View Details"><small><i class="bi bi-eye">&nbsp;view more</i></small></router-link>
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

const applicationInfoList = ref( [])

const applicationStore= useApplicationStore()

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
  </script>


  
  <style scoped>
  
  </style>