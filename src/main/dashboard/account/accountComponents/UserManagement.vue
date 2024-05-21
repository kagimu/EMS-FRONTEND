<script setup>
import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAccountStore } from "../store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import NewAccount from "./NewAccount.vue";
import { useUserStore } from "@/main/dashboard/profiles/store/users.js"

const loading = ref(false)
const page = ref(1)
const per_page = ref(15)

const userStore = useUserStore()

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const roleStore = useRolesStore()
const accountStore = useAccountStore()
const notificationStore = useNotificationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const userData = ref([])
const showDialog = ref(false)
const assignDialog = ref(false)
const userAll = ref([])

const openModal = () =>{
  assignDialog.value = true
}



const rolesData= ref([])

//fetch
onMounted(
    async () => {
      await roleStore.fetchRoles()
      accountStore.fetchAllUsers()
      doFetchAccount()
    } )

    watch(
    () => roleStore.roleResponse,
    async (data) => {
      if(data){
        rolesData.value = data.data
      }
    },
    {deep:true}
    )
 
    
watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){
        assignDialog.value = false
      }
    },
    {deep:true}
)


//fetch
const doFetchAccount = () =>{
   let data = {
      page: 1,
      per_page: per_page.value,
   }
  //  loading.value = true;
   userData.value = []
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

          const index = userData.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            userData.value.push(list);
          }

        })
      }


    }
  }

    watch(
    () => accountStore.userResponse,
    async (data) => {
      if(data){
        // userData.value = data.data
        fetchUsers(data)
      }
    },
    {deep:true}
    )


    watch(
    () => accountStore.userAllResponse,
    async (data) => {
      if(data){
        userAll.data = data.data
      }
    },
    {deep:true}
    )


const formData = reactive({
  user_number:null,
  role_number:null
})
const selectedIndex = ref(null);
const openRemoveRoleConfirmationModal = (index,num) => {
  showDialog.value=true
  selectedIndex.value = index
  formData.role_number=index
  formData.user_number=num
}


const confirmRemoveRole = () => {
  showDialog.value=false
  //  alert(JSON.stringify(formData))
   accountStore.removeAccountRole(formData)
}


watch(
    () => accountStore.removeRoleResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
    )

    
watch (
    () => accountStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){

        doFetchAccount()
      }
    },
    {deep:true}
)
</script>

<template>
    <div>

          <!-- Popup warning Modal -->
    <div class="modal fade" id="removeRoleConfirmation" :class="{ show: showDialog }" tabindex="-1" aria-labelledby="removeRoleConfirmationLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="removeRoleConfirmationLabel">Please Confirm !</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to remove this role?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">NO</button>
            <button type="button" class="btn btn-danger btn-sm" @click="confirmRemoveRole">YES</button>
          </div>
        </div>
      </div>
    </div>

    
        <div class="modal fade" :class="{ show: assignDialog }" id="addAccount" tabindex="-1"  aria-labelledby="" aria-hidden="true" >
      <div class="modal-dialog">
        <new-account></new-account>
        </div>
      </div>

      <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="mt-3">
           <div class="row">
            <div class="col-lg-6 "> 
            </div>
            <div class="col-lg-6">
                <button 
                v-if="can('assign_role','general')"
                @click="openModal()" style="float: right; margin-right: 5px;" data-bs-toggle="modal" data-bs-target="#addAccount"  type="button"  aria-controls="rolesDialog" class="btn btn-primary btn-sm">Assign Role</button>
                <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
                <small><i class="bi bi-printer">&nbsp;Print</i></small></button> 
            </div>
    
           </div>
               </div>
                <div class="card-body" >
        <div >

           
      <table id="data"
          class="table table-hover caption-top mt-4 table-sm table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th>Email</th>
          <th scope="col">Role (s)</th>
          <th>Type</th>
          <th scope="col">Gender</th>
          <th scope="col">Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          <!-- v-for="(roles, index) in rolesData" :key="index" -->
            <tr v-for="(user, index) in userData" :key="index">
            <td>{{ user.first_name + " " +user.last_name + " " + user.second_name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span v-for="(rol,indx) in user.roles"  :key="indx" >
               {{ rol }}
              </span>
              <!-- {{ user.type }} -->
              <button 
              v-if="can('remove_assigned_role','general')"
               @click="openRemoveRoleConfirmationModal(user.type,user.number)" data-bs-toggle="modal" data-bs-target="#removeRoleConfirmation" type="button" aria-controls="rolesDialog">
            &nbsp;<i class="bi bi-x-circle-fill" style="color:rgb(228, 23, 23)"></i>
          </button>
            </td>
            <td>{{ user.type }}</td>
            <td>{{ user.gender }}</td>
            <td>
              <span v-if="user.status == 'Active'" style="color:green"><b>{{ user.status }}</b>
            </span>
            <span v-if="user.status != 'Active'" style="color:rgb(239, 13, 13)"><b>{{ user.status }}</b>
            </span>
          </td>
            <td>
          <button 
          v-if="can('update_assigned_role','general')"
           data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>
          <!-- <button type="button">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button> -->
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
      


    <style scoped>
    .btn{
      border-radius: 4px !important;
    }
    </style>