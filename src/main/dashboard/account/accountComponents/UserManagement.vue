<template>
    <div>

          <!-- Popup warning Modal -->
    <div class="modal fade" id="removeRoleConfirmation" :class="{ show: showDialog }" tabindex="-1" aria-labelledby="removeRoleConfirmationLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="removeRoleConfirmationLabel">Confirmation</h5>
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
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
                <button @click="openModal()" style="float: right; margin-right: 5px;" data-bs-toggle="modal" data-bs-target="#addAccount"  type="button"  aria-controls="rolesDialog" class="btn btn-primary btn-sm">Assign Role</button>
 
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
          <th scope="col">Name</th>
          <th scope="col">Role (s)</th>
          <th scope="col">Email</th>
          <th scope="col">Gender</th>
          <th scope="col">Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          <!-- v-for="(roles, index) in rolesData" :key="index" -->
            <tr v-for="(user, index) in userData" :key="index">
            <td>{{ user.first_name + " " +user.last_name + " " + user.second_name }}</td>
            <td>{{ user.type }}
              <button @click="openRemoveRoleConfirmationModal(user.type,user.number)" data-bs-toggle="modal" data-bs-target="#removeRoleConfirmation" type="button" aria-controls="rolesDialog">
            &nbsp;<i class="bi bi-x-circle-fill" style="color:rgb(228, 23, 23)"></i>
          </button>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.gender }}</td>
            <td>
              <span v-if="user.status == 'Active'" style="color:rgb(8, 238, 8)"><b>{{ user.status }}</b>
            </span>
            <span v-if="user.status != 'Active'" style="color:rgb(239, 13, 13)"><b>{{ user.status }}</b>
            </span>
          </td>
            <td>
          <button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
          <button type="button">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button></td>
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
import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAccountStore } from "../store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import NewAccount from "./NewAccount.vue";

const roleStore = useRolesStore()
const accountStore = useAccountStore()
const notificationStore = useNotificationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const userData = ref([])
const showDialog = ref(false)
const assignDialog = ref(false)

const openModal = () =>{
  assignDialog.value = true
}



const rolesData= ref([])

//fetch
onMounted(
    async () => {
      await roleStore.fetchRoles()
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
onMounted(
    async () => {
      await accountStore.fetchUsersToAssign()
    } )

    watch(
    () => accountStore.userResponse,
    async (data) => {
      if(data){
        userData.value = data.data
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

</script>

    <style scoped>
    .btn{
      border-radius: 4px !important;
    }
    </style>