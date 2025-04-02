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
   let entityN = localStorage.getItem("entity_number")
   
   
const emit = defineEmits(["closeDialog"]);

   const form = reactive({
     first_name:null,
     second_name:null,
     last_name:null,
     gender:"",
     email:null,
     phone:null,
     location:null,
     level:"",
     entity_number:entityN,
     expiry_date:null
   })


   onMounted(
       async () => {

         await roleStore.fetchRoles(myData)

         await accountStore.fetchUsersToAssign(entityN)
       } )


   let myData = reactive({
    entity_number:localStorage.getItem('entity_number')
    })



   
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
     errorMessage.value = ""
     form.roles=rolesInfo.value?.filter(item => item.role_number);
     userStore.createNewUser(form)
   
   }

   watch (
       () => userStore.errorMessage,
       async (data) => {
         if(data){
           buttonLoader.value = false
           errorMessage.value = data.message
           notificationStore.errorToast("Error",data.message)
         }
       }
   )

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
           form.roles=null
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
              arr.push({expiry_date:"", role_number:"",number:lst.number,role_name:lst.name})
            })

           rolesInfo.value = arr
           
         }
       }
       )
   
</script>
<template>
   <div>
     <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
       {{errorMessage}}
     </div>
      <form @submit.prevent="addUser">

         <div class="row">
            <div class="col-6">

              <div class="grid grid-cols-2 gap-4">
                <div class="mb-2">
                  <label class="text-sm"><small>First name</small></label>
                  <input type="text" v-model="form.first_name" required class="form-control">
                </div>
                <div class="mb-2">
                  <label class="text-sm"><small>Second name</small></label>
                  <input type="text" v-model="form.second_name" required class="form-control">
                </div>
              </div>


               <div class="mb-2">
                  <label class="text-sm"><small>Last name</small></label>
                  <input type="text" v-model="form.last_name"  class="form-control">
               </div>
               <div class="mb-2">
                  <label class="text-sm"><small>Gender</small></label>
                  <select class="form-select shadow-none" v-model="form.gender" aria-label="Default select example">
                     <option value="">Select Gender</option>
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                  </select>
               </div>
               <div class="mb-2">
                  <label class="text-sm"><small>Phone</small></label>
                  <input type="tel" v-model="form.phone" required class="form-control">
               </div>
               <div class="mb-2">
                  <label class="text-sm"><small>Email</small></label>
                  <input type="email" v-model="form.email" required class="form-control">
               </div>


<!--              <div class="grid grid-cols-2 gap-4">
              <div class="mb-2">
               <label class="text-sm"><small>Password</small></label>
               <div class="input-group mb-3">
                  <input
                     :type="show ? 'text' : 'password'"
                     v-model="form.password" required
                     class="form-control text-sm">
                  <div style="cursor: pointer;"  @click="show = !show" class="input-group-text py-1">
                     <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </div>
               </div>
              </div>


              <div class="mb-2">
               <label class="text-sm"><small>Confirm Password</small></label>
               <div class="input-group mb-3">
                  <input
                     :type="show ? 'text' : 'password'"
                     v-model="form.confirm_password" required
                     class="form-control text-sm">
                  <div style="cursor: pointer;"  @click="show = !show" class="input-group-text py-1">
                     <i :class="show ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </div>
               </div>
              </div>
              </div>-->


            </div>
            <div class="col-6">

              <div class="text-sm">
                <div class="mb-2">Role</div>
                <div class="alert alert-primary py-1 px-3">Set expiry date on each role</div>
              </div>

               <div class="mb-2">


                  <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

                     <li class="list-group-item" v-for="(lst, idx) in rolesInfo" :key="idx">

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
                              <label style="float: left;" class="text-sm cursor-pointer" :for="lst.number">{{lst.role_name}}</label>
                           </div>
                           <div class="col-lg-6">
                             <input
                              v-model="lst.expiry_date"
                              class="form-control shadow-none" type="date">
                             </div>
                        </div>
                      
                     </li>


                  </ul>
               </div>
            </div>
         </div>
         <div class="flex justify-between" style="width: 100%;">
      <button
          type="button"
          class="btn btn-danger border-0 mr-2 btn-sm mb-2"
          @click="$emit('closeDialog')">
        Cancel
      </button>
            <button type="submit" class="btn btn-primary mb-2 btn-sm ">
               Submit
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
   .text-sm2{
   }
</style>