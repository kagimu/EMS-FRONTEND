<script setup>
import {onMounted,reactive, ref,computed, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const cateringStore = useCateringStore()
const accountStore = useAccountStore()
const school_number = ref("")
const schoolsList = ref([])
const campus_number = ref("")
const campusList = ref([])

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
  feeding_group_number:"",
  school_number:"",
  group_number:"", 
  campus_number:""
})


onMounted(
    () => {
      schoolStore.fetchSchools()
     
    }
)

const doFeedingUsers = (schoolN) =>{
  cateringStore.fetchFeedingGroup(schoolN)
  campusStore.fetchCampuses(schoolN)
  doFetchUsers()
}

watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
      feedingGroupData.value = data.data
    }
)



//fetch
const doFetchUsers = () =>{
  let data = {
     school_number:formData.school_number,
     group_number:formData.group_number, 
     campus_number:formData.campus_number
  }
  cateringStore.fetchGroupUsersList(data)

}


watch(
    () => cateringStore.feedingGroupUsersListResponse,
    async (data) => {
      if(data){
        userList.value = data.data
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




watch (
    () => cateringStore.newFeedingGroupResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if (data) {
        buttonLoader.value = false
        notificationStore.errorToast("Error", data.message)
      }
    }
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)

</script>
<template>
    <div>
  
        <div class="row mt-5 mb-2 mx-auto ">
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="formData.school_number"
                  @change="doFeedingUsers(formData.school_number)"
              >
                <option disabled value="">--filter by School--</option>
                <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>

          <div class="col-3">
          <div class="mb-2">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="formData.campus_number"
                @change="doFetchUsers"
            >
              <option disabled value="">--Select campus--</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
              </option>
            </select>
          </div>
          </div>

         <div class="col-3">
            <select @change="doFetchUsers" class="form-select form-control shadow-none" v-model="formData.feeding_group_number" required>
    <option value="" disabled>-select</option>
    <option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
          </select>
         </div>
     
        </div>

        <div class="row">
<div class="col-lg-12">
      <table
        class="table table-hover caption-top mt-1 table-sm table-striped"
        style="font-size: 13px !important;"
      >
      <thead >
          <tr>
           
            <th>#</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Feeding Group</th>
            <th>Campus</th>   
          </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div>
        </thead>
        <tbody>
            <!-- {{ userList }} -->
         <tr v-for="(list,index) in userList" :key="index">
            <td>{{ index+1 }}</td>
            <td style="text-transform: capitalize;">{{ list.name }}</td>
            <td>{{list.gender  }}</td>
            <td>{{ list.feeding_group_name }}</td>
            <td>{{ list.campus_name }}</td>

         </tr>
                    
        </tbody>
      </table>
    </div>


</div>
</div>
  
    </template>
    
    
    <style scoped>
  
    </style>