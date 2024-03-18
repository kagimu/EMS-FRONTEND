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
          <button  class="btn btn-outline-primary  btn-sm mt-1" style="float: right; border:none">
            <small><i class="bi bi-download">&nbsp;Download</i></small></button> 
            <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
            <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
        </div>

       </div>
           </div>
            <div class="card-body" >
    <div >
       
  <table id="data"
      class="table table-striped"
      style="font-size: 11px !important;" >
    <thead>
    <tr>
      <th scope="col"> Name</th>
      <th scope="col">Gender</th>
      <th scope="col">Email</th>
      <th scope="col">Phone</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr>
          <td>Collins Mpiima</td>
          <td></td>
          <td></td>
          <td></td>
      <td></td>
      <td></td>
      <td>
        <RouterLink :to="{name : 'new-admission',query:{id:studid}}" class="link-primary" style="text-decoration: none;"  >
          <i class="bi bi-person-fill-check"></i> admit  
        </RouterLink> <span style="color: rgb(42, 41, 41);">&nbsp;|&nbsp;</span>
        <RouterLink :to="{name : 'new-admission', query:{id:studid} }" class="link-danger" style="text-decoration: none;"  >
          <i class="bi bi-eye"></i>  
        </RouterLink>
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
import {onMounted,reactive, computed,ref, watch} from "vue";
import { useAdmissionStore } from "./newAdmissionComponents/store/adminission";
import useNotificationStore from "@/composables/useNotification.js";
const searchQuery = ref('')

let studid = "002773383838383"

const admissionOfferList = ref( [])
const admissionStore= useAdmissionStore()
const  notificationStore  = useNotificationStore()


   

const infoData = ref([])
const filteredInfoData = computed(() => {
  return infoData.value.filter(infoData =>
  infoData.firstname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  infoData.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>

<style scoped>

</style>