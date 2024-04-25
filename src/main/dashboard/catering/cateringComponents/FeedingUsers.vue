<template>
    <div>
  
    
     
  
      <!-- end  -->
      <div class="row mt-3">
        <div class="col-12">
          <div class="">
            <div class="" style="padding: 0;">
    <div class="container mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="">
              <div class="">
                  <h5 style="font-size: 14px;margin-top: 2px;">Feeding Users</h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
    <div class="col-lg-12">
      <div class="mb-2" style="width: 200px;">
    <!-- <select
      style="box-shadow: none;"
      class="form-select form-select-sm"
      v-model="learning_area_number">
    <option disabled value="">--Filter by class--</option>
    <option value="">All</option>
    <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.name}}</option>
    </select> -->
<select   class="form-select form-select-sm" v-model="formData.feeding_group_number"
      style="box-shadow: none;">
    <option  disabled value="">-filter By Feeding Group - </option>
    <option>All</option>
    <option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
</select>
</div>
<div class="table-responsive">
      <table
        id="datatable"
        class="ext-sm table table-sm table-striped table-bordered"
        style="font-size: 14px !important;"
      >
      <thead >
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Group</th>   
            <th colspan="2">Menu</th>
          </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userList" :key="index">
            <td>{{ index+1 }}</td>
            <td> 
                 {{ user.first_name + " " + user.second_name + " " + user.last_name}}
             </td>
            <td>Staff</td>
            <td colspan="2">
              <div class="table-responsive">
                  <table class="text-sm table table-sm table-striped table-bordered p-5">
                    <thead>
                        <th>Item</th>
                        <th>Qty</th>
                    </thead>
                    <tbody>
                     <tr><td>Chicken</td><td><input type="number" value="1"></td></tr> 
                     <tr><td>Pork</td><td><input type="number" value="2"></td></tr> 
                     <tr><td>Water</td><td><input type="number" value="4"></td></tr> 
                    </tbody>
                    </table>
                   
  
                  </div>
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
    </div>
    </div>
  
  
    </div>
    </template>
    
    <script setup>
  import {onMounted,reactive, ref,computed, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";
  import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
  import { useUserStore } from "@/main/dashboard/profiles/store/users.js"
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
  import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import { RouterView } from "vue-router";


const cateringStore = useCateringStore()
const accountStore = useAccountStore()
const userN = ref(null)
const menuData = ref(null)

const setStudentN = (a) =>{
  userN.value = a
}

const form = reactive({
  user_number:userN,
})

// newFeedingsResponse,
// newFeedings



  const feedingGroupData = ref([])
  const enrollmentStore = useEnrolmentStore()


  const userList = ref( [])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const  notificationStore  = useNotificationStore()
  const selectedStudents = ref([])
  
  const formData = reactive ({
    feeding_group_number:null
  })
  

  onMounted(
      () => {
        enrollmentStore.fetchEnrolment()
        cateringStore.fetchFeedingGroup()
        accountStore.fetchUsersToAssign()
      }
  )
  
 

  watch(
    () => accountStore.userResponse,
    async (data) => {
      if(data){
        userList.value = data.data
      }
    },
    {deep:true}
    )



  watch(
    () => cateringStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )


  watch(
    () => cateringStore.newFeedingsResponse,
    async (data) => {
      notificationStore.successToast("Success", data.message)
    },
    {deep: true}
  )

  
    </script>
  
  
    
    <style scoped>
  
    </style>