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
                  <h5 style="font-size: 14px;margin-top: 2px;">Users List </h5>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-5 mb-2 mx-auto">
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="school_number"
                  @change="doFeedingUsers(school_number)"
              >
                <option disabled value="">--filter by School--</option>
                <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>
     
        </div>

        <div class="row">
<div class="col-lg-9">
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
            <th>Gender</th>  
            <th>Group</th>   
            <th>Action</th>
          </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userList" :key="index">
            <td><input type="checkbox"  v-model="selectedStudents[index]" class="checkbox-primary"></td>
            <td>{{ index+1 }}</td>
            <td> 
                <router-link style=""
                class="text-decoration-none"
                :to="{name:'feeding-group-user-details', query:{st_id:user.number}}">
                 {{ user.first_name + " " + user.second_name + " " + user.last_name}}

            </router-link>
              
             </td>
            <td>
              {{  user.gender }}
            </td>
            <td>Staff</td>
            <td>
              <i class="bi bi-x" style="color:red"></i> &nbsp;
              <i class="bi bi-check"></i>
            </td>
          </tr>   
                    
        </tbody>
      </table>
    </div>

<div class="col-lg-3">            
<label class="mt-4"><small>Feeding Group</small></label>
<select class="form-select form-control" v-model="formData.feeding_group_number" required>
    <option value="" disabled>-select</option>
    <option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
</select>

<div class="mt-2 mb-2">
<button  @click="addFeedingGroupUsers"  :data-bs-target="selectedStudentNumber.length > 0 ? '#' : ''" type="submit"
class="btn btn-primary btn-sm mb-2 " 
style="float: right;"><i></i><small>Submit</small></button>
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
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const schoolStore = useSchoolStore()
const cateringStore = useCateringStore()
const accountStore = useAccountStore()
const school_number = ref("")
const schoolsList = ref([])
const page = ref(1)
const per_page = ref(15)

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
        accountStore.fetchUsersToAssign()
        schoolStore.fetchSchools()
        doFetchAdmission()
      }
  )

  const doFeedingUsers = (schoolN) =>{
    cateringStore.fetchFeedingGroup(schoolN)
    doFetchAdmission()
  }
  
  watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
        feedingGroupData.value = data.data
    },
    {deep: true}
  )



  //fetch
const doFetchAdmission = () =>{
   let data = {
      page: 1,
      per_page: per_page.value,
   }
  //  loading.value = true;
   userList.value = []
   accountStore.fetchUsersToAssign(data)

  }


  const fetchUsers = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content


      if(objArray && objArray.length > 0){
        objArray.forEach((list, i) => {

          list.key =  (current_page - 1) * per_page_item + i + 1

          const index = userList.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            userList.value.push(list);
          }

        })
      }


    }
  }

  watch(
    () => accountStore.userResponse,
    async (data) => {
      if(data){
        // userList.value = data.data
        fetchUsers(data)
      }
    },
    {deep:true}
    )

    watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    }
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
      notificationStore.errorToast("Error", "Please select at least one user to offer admission.");
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