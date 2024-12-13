<script setup>
   import {onMounted, reactive, ref, watch,computed} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import { useAbility } from '@casl/vue';
   import { useAccountStore } from "@/main/dashboard/account/store/account.js";
   import { useRolesStore } from "@/main/settings/roles/store/roles.js";
   import { useUserStore } from "@/main/dashboard/profiles/store/users.js"
   
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
   const userInfoData = ref({})
   const userRolesData = ref([])
   // const role_numbers = ref([])
   let entityN = localStorage.getItem("entity_number")

const props = defineProps({
  userInfo:String
})

   const form = reactive({
     user_number:null,
     expiry_date:null,
     role_numbers:null
   })


   let myData = reactive({
     entity_number:localStorage.getItem('entity_number')
   })


   onMounted(
       async () => {
         filterDraft()
         await accountStore.fetchUsersToAssign(entityN)
         await roleStore.fetchRoles(myData)
       } )

   watch(
       () => props.userInfo,
       async (data) => {
         if(data){
           filterDraft()
         }
       }
   )



   const filterDraft = () => {
     let user = props.userInfo
      userInfoData.value = user
      userRolesData.value = user.roles
   }



       watch(
       () => accountStore.userResponse,
       async (data) => {
         if(data){
           userData.value = data.data
         }
       },
       {deep:true}
       )


   
   function addUser(){
     buttonLoader.value = true
     let roles  = rolesInfo.value.filter(lst => lst.checkRole)
     form.user_number=userInfoData.value.number
     form.roles = roles
    accountStore.createNewAccount(form)
   
   }


watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){
        // buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        // formData.role_number = null
        // formData.user_number = null

      }
    },
    {deep:true}
)
   
       watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){
        // buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        // formData.role_number = null
        // formData.user_number = null

      }
    },
    {deep:true}
)


//fetch
onMounted(
    async () => {
       await accountStore.fetchAllUsers()
    } )


watch (
    () => accountStore.errorMessage,
    async (data) => {
      if(data){
        buttonLoader.value = false
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
              arr.push({expiry_date:"", role_number:lst.number,role_name:lst.name,checkRole:false})
            })


           arr = arr.map(item => {
             // Check if the item role_number exists in userRolesData.value
             let matchingRole = userRolesData.value?.find(a => a.role_number === item.role_number);

             // If a match is found, update the checkRole and expiry_date
             if (matchingRole) {
               item.checkRole = true;
               item.expiry_date = matchingRole.expiry_date;
             }
             return item;
           });


           rolesInfo.value = arr
           
         }
       },
       {deep:true}
       )
   
</script>
<template>
  {{ userInfoData }}<br>
  {{userRolesData}}
   <div>
      <form @submit.prevent="addUser">
         <div class="row">
            <div class="col-12">
               <div class="mb-2">

                 <div class="text-sm">
                   <div class="mb-2">Role</div>
                   <div class="alert alert-primary py-1 px-3">Set expiry date on each role</div>
                 </div>

                  <ul class="list-group text-sm mb-1" style="border-radius: 0 0 0 0;">
                     <li class="list-group-item" v-for="(lst, idx) in rolesInfo" :key="idx">
                        <div class="row">
                           <div class="col-lg-1">
                             <input
                              v-model="lst.checkRole"
                            :value="lst.role_number"
                            :id="lst.role_number"
                            class="shadow-none"
                            type="checkbox">
                           </div>
                           <div class="col-lg-4">
                              <label style="float: left;" class="text-sm cursor-pointer" :for="lst.role_number">{{lst.role_name}}</label>
                           </div>
                           <div class="col-lg-6">
                           <input
                            v-model="lst.expiry_date"
                            style="outline: none 0 !important; box-shadow: none;"
                            class="form-control" type="date">
                           </div>
                        </div>
                      
                     </li>


                  </ul>
               </div>
            </div>
         </div>
         <div class="text-right mt-1">
            <button type="submit" class="btn btn-primary mb-2 btn-sm">
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