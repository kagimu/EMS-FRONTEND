<template>
  <div>

    <AppModal title="Scope" v-model="showingModal" lg>
    <Scope :user_number="user_number"></Scope>
    </AppModal>

    <AppModal title="New User" v-model="showingModalUser" lg>
    <NewStaff></NewStaff>
    </AppModal>

    <div class="row m-3">
      <div class="col-12">
        <button  style="float: right;"
        v-if="can('add_user','general')"
        class="btn btn-primary btn-sm" type="button" @click="showModalUser">New User</button>
      </div>
    </div>



    <div class="row">
      <div class="col-12">
        <div class="m-3">
          <div class="" style="padding: 0;">

            <div class="mb-3  mt-3" style="font-size: 18px;">User List</div>

            <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Role (s)</th>
          <th scope="col">Gender</th>
          <th scope="col">Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in userData" :key="index">
            <td>{{ user.first_name + " " +user.last_name + " " + user.second_name }}</td>
            <td>{{ user.type }}
            </td>
            <td>{{ user.gender }}</td>
            <td>
              <span v-if="user.status == 'Active'" style="color:rgb(8, 238, 8)"><b>{{ user.status }}</b>
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
          <button type="button">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button>
          <button class="btn btn-outline-primary btn-sm mb-2 ml-3" @click="showModal(user.number)"><small>Manage Scope</small></button>

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

import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAbility } from '@casl/vue';
import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import { useUserStore } from "./store/users.js"
// import StaffManager from "@/main/dashboard/profiles/StaffManager.vue";
import AppModal from "@/components/AppModal.vue";
import Scope from "@/main/dashboard/profiles/Scope.vue"
import NewStaff from "@/main/dashboard/profiles/NewStaff.vue"

const page = ref(1)
const per_page = ref(15)

const showingModal = ref(false)

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const roleStore = useRolesStore()
const accountStore = useAccountStore()
const rolesData = ref([])
const { can } = useAbility()
const errorMessage = ref(null)
const userData = ref([])
const buttonLoader = ref(false)
let show = ref(false)
let showingModalUser = ref(false)
const user_number = ref(null)

const showModal = (a) => {
    showingModal.value = true
    user_number.value = a
    // alert(JSON.stringify(a))
}

const showModalUser = () => {
    showingModalUser.value = true
}

const form = reactive({
  first_name:null,
  second_name:null,
  last_name:null,
  email:null,
  phone:null,
  location:null,
  level:"",
  role_numbers:[]
})


//fetch
onMounted(
    async () => {
      doFetchAccount()
    } )



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



function addCampus(){
  buttonLoader.value = true
  // alert(JSON.stringify(form))
  userStore.createNewUser(form)

}
//fetch
onMounted(
    async () => {
      await roleStore.fetchRoles()
    } )

watch (
    () => userStore.newUserResponse,
    async (data) => {
      if(data){
        accountStore.fetchUsersToAssign()
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        roleStore.fetchRoles()
        form.first_name = null
        form.second_name = null
        form.last_name=null,
        form.email=null,
        form. phone=null,
        form.location=null,
        form.level=null,
        form.role_numbers=null
      }
    },
    {deep:true}
)
watch (
    () => userStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)



    watch(
    () => roleStore.roleResponse,
    async (data) => {
      if(data){
        rolesData.value = data.data
      }
    },
    {deep:true}
    )

</script>

<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

</style>