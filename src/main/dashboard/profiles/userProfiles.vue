<template>
  <div>

    <div class="row m-3">
      <div class="col-12">


        <button  style="float: right;"
        v-if="can('add_user','general')"
        class="btn btn-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">New User</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">New User</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">


            <form @submit.prevent="addCampus">



                  <div class="mb-2">
                    <label class="textColor"><small>First name</small></label>
                    <input type="text" v-model="form.first_name" required class="form-control">
                  </div>

                  <div class="mb-2">
                    <label class="textColor"><small>Second name</small></label>
                    <input type="text" v-model="form.second_name" required class="form-control">
                  </div>

                  <div class="mb-2">
                    <label class="textColor"><small>Last name</small></label>
                    <input type="text" v-model="form.last_name" required class="form-control">
                  </div>



              <div class="mb-2">
                <label class="textColor"><small>Gender</small></label>
                <select class="form-select" v-model="form.gender" aria-label="Default select example">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>


              <div class="mb-2">
                <label class="textColor"><small>Phone</small></label>
                <input type="tel" v-model="form.phone" required class="form-control">
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Email</small></label>
                <input type="email" v-model="form.email" required class="form-control">
              </div>


          <div class="mb-2">
            <label class="textColor"><small>Role</small></label>
            <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

            <li class="list-group-item" v-for="(list, index) in rolesData" :key="index" :value="list.number">
            <input
            v-model="form.role_numbers"

            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" :value="list.number" :id="list.number">
            <label class="textColor" :for="list.number"><small>{{list.name}}</small></label>
            </li>

            </ul>
          </div>

                  <label class="textColor"><small>Password</small></label>
                  <div class="input-group mb-3">
                    <input
                        :type="show ? 'text' : 'password'"
                        v-model="form.password" required
                        class="form-control" aria-label="Username"
                        aria-describedby="basic-addon1">
                    <div style="cursor: pointer;"  @click="show = !show" class="input-group-text" id="basic-addon1">
                      <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </div>
                  </div>



                  <label class="textColor"><small>Confirm Password</small></label>
                  <div class="input-group mb-3">
                    <input
                        :type="show ? 'text' : 'password'"
                        v-model="form.confirm_password" required
                        class="form-control" aria-label="Username"
                        aria-describedby="basic-addon1">
                    <div style="cursor: pointer;"  @click="show = !show" class="input-group-text" id="basic-addon1">
                      <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </div>
                  </div>



              <div class="text-right mt-4">
                <button type="submit" class="btn btn-primary mb-2">
                  save

                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>


            </form>


          </div>
        </div>


      </div>
    </div>



    <div class="row">
      <div class="col-12">
        <div class="m-3">
          <div class="" style="padding: 0;">

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">User profiles</div>

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
              <!-- <button 
              v-if="can('remove_assigned_role','general')"
               @click="openRemoveRoleConfirmationModal(user.type,user.number)" data-bs-toggle="modal" data-bs-target="#removeRoleConfirmation" type="button" aria-controls="rolesDialog">
            &nbsp;<i class="bi bi-x-circle-fill" style="color:rgb(228, 23, 23)"></i>
          </button> -->
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
          <button 
          v-if="can('update_assigned_role','general')"
           data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>
          <button type="button">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
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
</template>

<script setup>

import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAbility } from '@casl/vue';
import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import { useUserStore } from "./store/users.js"

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