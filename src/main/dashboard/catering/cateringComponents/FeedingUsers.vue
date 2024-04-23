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
        <div class="row">
    <div class="col-lg-12">
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 14px !important;"
      >
      <thead >
          <tr>
            <th style="width: 5px;"><input type="checkbox"   class="checkbox-primary"></th>
            <th>#</th>
            <th>Name</th>
            <th>Feeding Group</th>   
            <th>Menu</th>
            <th>Action</th>
          </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div>
        </thead>
        <tbody>
          <tr v-for="(student, index) in userList" :key="index">
            <td><input type="checkbox"  v-model="selectedStudents[index]" class="checkbox-primary"></td>
            <td>{{ index+1 }}</td>
            <td> 
           
                 {{ student.first_name + " " + student.second_name + " " + student.last_name}}
             </td>
            <td>Staff</td>
            <td>


            </td>
            <td>
              <i class="bi bi-x" style="color:red"></i> &nbsp;
              <i class="bi bi-check"></i>
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
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
        feedingGroupData.value = data.data
    },
    {deep: true}
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



//   watch (
//     () => enrollmentStore.enrolmentResponse,
//     async (data) => {
//       if(data){
//         userList.value = data.data
//       }
//     },
//     {deep:true}
//   )

  
    const selectedStudentNumber = computed(() => {
    const selectedNames = [];
    selectedStudents.value.forEach((isSelected, index) => {
      if (isSelected) {
        selectedNames.push(userList.value[index].number);
      }
    });
    return selectedNames;
  })
    
  
  const addFeedingGroupUsers = () => {
    // admitshow.value = true
    if (selectedStudentNumber.value.length === 0) {
      notificationStore.errorToast("Error", "Please select at least one student to offer admission.");
    } else {
      let data = reactive({
        feeding_group_number:formData.feeding_group_number,
        user_number:selectedStudentNumber,
        status:"ACTIVE"
      })
    //   alert(JSON.stringify(data)) 
      cateringStore.newFeedingGroupUsers(data)
    }
  }
//   newFeedingGroupResponse
watch (
  () => cateringStore.newFeedingGroupResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
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
  
  
    </script>
  
  
    
    <style scoped>
  
    </style>