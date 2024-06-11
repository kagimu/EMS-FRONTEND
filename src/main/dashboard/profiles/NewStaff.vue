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
   const rolesInfo = ref([])
   // const role_numbers = ref([])
   let entityN = localStorage.getItem("entity_number")
   
   const form = reactive({
     first_name:null,
     second_name:null,
     last_name:null,
     email:null,
     phone:null,
     location:null,
     level:"",
     entity_number:entityN,
     date:null
   })
   
   let myData = reactive({
    entity_number:localStorage.getItem('entity_number')
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

   const addRoleNumber = (number, idx) => {
     rolesInfo.value[idx].role_number = rolesInfo.value?.[idx]?.role_number === number ? "" : number
   }
   
   function addUser(){
     buttonLoader.value = true
     form.role_numbers=rolesInfo.value
         // alert(JSON.stringify(form))
     userStore.createNewUser(form)
   
   }
   //fetch
   onMounted(
       async () => {
         await roleStore.fetchRoles(myData)
       } )
   
   watch (
       () => userStore.newUserResponse,
       async (data) => {
         if(data){
           accountStore.fetchUsersToAssign(entityN)
           buttonLoader.value = false
           notificationStore.successToast("Success", data.message)
           roleStore.fetchRoles(myData)
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
         if(data && data.data){
           let draft = data.data
           rolesData.value = draft

           let arr = []
            draft.forEach(lst => {
              arr.push({date:"", role_number:"",number:lst.number,role_name:lst.name})
            })

           rolesInfo.value = arr
           
         }
       },
       {deep:true}
       )
   
</script>
<template>
   <div>
      <form @submit.prevent="addUser">
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
<!--                      {{ rolesData }}-->
<!--                    {{rolesInfo}}-->
                    <!-- <div class="grid grid-cols-2 gap-2" v-for="(lst, idx) in rolesInfo" :key="idx">
                      <div >
                        <input
                            @change="addRoleNumber(lst.number, idx)"
                            :value="lst.number"
                            :id="lst.number"
                            class="shadow-none"
                            type="checkbox">
                            <label :for="lst.number">{{lst.role_name}}</label>
                      </div>
                      <div>
                        <input
                            v-model="lst.date"
                            style="outline: none 0 !important; box-shadow: none;"
                            class="form-control" type="date" required>
                      </div>
                    </div> -->
                     <li class="list-group-item" v-for="(lst, idx) in rolesInfo" :key="idx">
                          <!-- <div>{{lst}}</div> -->
                        <div class="row">
                           <div class="col-lg-1">
                             <input
                            @change="addRoleNumber(lst.number, idx)"
                            :value="lst.number"
                            :id="lst.number"
                            class="shadow-none"
                            type="checkbox">
                               
                           </div>
                           <div class="col-lg-4">
                              <label style="float: left;" class="textColor" :for="lst.number">{{lst.role_name}}</label>
                           </div>
                           <div class="col-lg-6">
                           <input
                            v-model="lst.date"
                            style="outline: none 0 !important; box-shadow: none;"
                            class="form-control" type="date" required>
                           </div>
                        </div>
                      
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
<style scoped>
   input:focus {
   box-shadow: none;
   }
   .textColor{
   }
</style>