<script setup>
import {onMounted, ref, watch,reactive} from "vue";
import useNotificationStore from "@/composables/useNotification.js"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import NewBillables from "@/main/settings/bills/NewBillables.vue"
import {useBillStore} from "@/main/settings/bills/store/bills.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"

const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const mymodal = ref(false)
const errorMessage = ref(null)
const loader  = ref(false)
const { can } = useAbility()
const schoolList = ref([])
const billStore = useBillStore()
const school_number = ref("")
const billableData= ref([])
onMounted(
    async () => {
     schoolStore.fetchSchools()
    }
)

const showModal = () =>{
  mymodal.value = true
}


 const doFetchBillables = (schoolN) =>{
  let data = {
    school_number:schoolN
  }
  billStore.fetchBillable(data)
 }



watch(
    () => billStore.billableResponse,
    async (data) => {
      if(data){
      
        billableData.value = data.data
        // alert(JSON.stringify(data))
      }
    },
    {deep:true}
)



watch(
      () => schoolStore.schoolsResponse,
      async (data) => {
          if (data) {
              schoolList.value = data.data
          }
      },
      {deep: true}
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
      <AppModal title="Creating New Billable" v-model="mymodal" xl6>
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

      <div class="row">
       
                  <div class="col-lg-4">
                    <div class="mb-2">
            <label class="textSize"><small>School</small></label>
         <select
                 style="box-shadow: none;"
                 class="form-select form-select-sm" required
                 v-model="school_number"
                 @change="doFetchBillables(school_number)"
         >
             <option disabled value="">-filter School -</option>
             <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
             </option>
         </select>
     </div>
     </div>
     <div class="col-lg-4"></div>
     <div class="col-lg-4"></div>
     </div>
  
      <table
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;width: 100%;"
      >
        <thead>
          <tr>
            <th>No.</th>
            <th>Amount</th>
            <th>Campus</th>
            <!-- <th>Academic Year</th> -->
            <th>StudyPeriod</th>
            <th>Class</th>
            <!-- <th>Study Mode</th> -->
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
 
        <tbody>
          
          
         <tr  v-for="(list, index) in billableData" :key="index" >
        
          <td>{{ list.billable_number }}</td>
          <td>{{ list.total_amount }}</td>
          <td>{{ list.campus_name }}</td>
          <td>{{ list.study_period_name }}</td>
          <td>{{ list.class_name }}</td>
          <td>{{ list.type }}</td>
          <td>{{list.status}}</td>
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
 