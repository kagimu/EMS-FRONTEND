<template>
<div>

  <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
       <div class="row">
        <div class="col-lg-6">
            <h6 style=" text-align: left;font-size: 11px;">
              <input type="text" v-model="searchQuery" class="form-control" placeholder="Search..."><br>
                   </h6>
        </div>
        <div class="col-lg-6">
          <button  class="btn btn-outline-primary  btn-sm" style="float: right; border:none">
            <small><i class="bi bi-download">&nbsp;Download</i></small></button> 
            <button  class="btn btn-outline-secondary  btn-sm" style="float: right;border: none;">
            <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
        </div>

       </div>
           </div>
            <div class="card-body" style="padding: 0;">
    <div >
       
  <table id="datatable"
      class="table table-striped"
      style="font-size: 11px !important;" >
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First name</th>
      <th scope="col">Second name</th>
      <th scope="col">Gender</th>
      <th scope="col">Email</th>
      <th scope="col">Phone</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(info, index) in filteredInfoData" :key="info.id">
      <td>{{ index + 1 }}</td>
          <td>{{ info.firstname }}</td>
          <td>{{ info.secondname }}</td>
          <td>{{info.gender }}</td>
      <td>{{info.email }}</td>
      <td>{{info.phone }}</td>
      <td>
        <RouterLink :to="{name : 'new-admission'}" class="link-primary" style="text-decoration: none;"  >
          <i class="bi bi-person-fill-check"></i> admit  
        </RouterLink> <span style="color: rgb(42, 41, 41);">&nbsp;|&nbsp;</span>
        <RouterLink :to="{name : 'new-admission'}" class="link-danger" style="text-decoration: none;"  >
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
import { ref, computed } from 'vue'

const searchQuery = ref('')

const infoData = ref([
  { 
    id: 1, 
    firstname: 'Collins', 
    secondname: 'Mpiima', 
    gender: 'male',
    email: "collinsmpiima@gmail.com",
    phone : "07383839392"
   },
   { 
    id: 1, 
    firstname: 'Luke ', 
    secondname: 'Fisherman', 
    gender: 'male',
    email: "wlukka@gmail.com",
    phone : "0783839392"
   },
   { 
    id: 1, 
    firstname: 'Petero', 
    secondname: 'Awoluganda', 
    gender: 'male',
    email: "aowloow@gmail.com",
    phone : "09383839392"
   },
  
])

const filteredInfoData = computed(() => {
  return infoData.value.filter(infoData =>
  infoData.firstname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  infoData.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>

<style scoped>

</style>