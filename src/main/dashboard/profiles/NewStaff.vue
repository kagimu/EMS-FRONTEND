<template>
<div>
<form @submit.prevent="addCampus">
  <div class="row">
<div class="col-6">
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
    
</div>
<div class="col-6">
 
<div class="mb-2">
<label class="textColor"><small>Role <span class="alert alert-danger p-0">set Account expiry date</span></small></label>
<ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
{{ rolesData }}
<li class="list-group-item" v-for="(list, index) in rolesData" :key="index">
<div class="row">
  <div class="col-1">
    <input
v-model="list.role_number"
style="outline: none 0 !important; box-shadow: none;"
class="" type="checkbox" :value="list.number" :id="list.number">
  </div>
<div class="col-4">
<label class="textColor" :for="list.number">{{list.name}}</label>
</div>
<div class="col-7">
  <input
  v-model="list.date"
style="outline: none 0 !important; box-shadow: none;"
class="form-control" type="date" required>
</div>

</div>

<!-- <label class="textColor" :for="list.number"><small>Expiry Date</small></label> -->
</li>

</ul>
</div>


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
  let entityN = localStorage.getItem("entity_number")

  const form = reactive({
    first_name:null,
    second_name:null,
    last_name:null,
    email:null,
    phone:null,
    location:null,
    level:"",
    role_numbers:[],
    entity_number:entityN,
    date:null
  })
  
  
  //fetch
  onMounted(
      async () => {
        await accountStore.fetchUsersToAssign(entityN)
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
    alert(JSON.stringify(form))
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
          accountStore.fetchUsersToAssign(entityN)
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
  
  }
  
  </style>