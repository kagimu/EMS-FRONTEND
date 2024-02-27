<template>
  <div>
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
      style="font-size: 11px !important;"
    >
      <thead>
        <tr>
          <th>Student</th>
          <th>Prefered Class</th>
          <th style="width:20px;">Av.Score</th>
          <th>Actions</th>
        </tr>

      </thead>
      <tbody>    
        <tr v-for="(resultList, index) in interviewResultList" :key="index">
          <td>{{ resultList.Student.surname }}</td>
          <td>{{ resultList.Student.preferred_type_of_enrollment }}</td>
          <td><input style="width: 30px;align-items: center;" disabled type="text" v-model="resultList.score"></td>
          <td>
            <router-link
                  class="text-decoration-none"
                  :to="{name:'admit-student',query:{id:resultList.Student.number}}"
              ><button class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
                 Offer Admission <i class="bi bi-arrow-right"></i></small></button>   
            </router-link>    
            </td>
        </tr> 
      </tbody>
    </table>
    </div>
    </div>
    </div>
    </div>
  </div>
 
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";

let sampleid ="hfhhdhdh00092"
const interviewResultList = ref( [])
let errorMessage = ref(null)

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

onMounted(
    async () => {
      await applicationStore.fetchInterviewResultsAll()
    } )

    watch(
    () => applicationStore.interviewResultsResponse,
    async (data) => {
      if(data){
        interviewResultList.value = data.data
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)
  </script>


  
  <style scoped>
  
  </style>