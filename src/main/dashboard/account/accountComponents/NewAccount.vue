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

   onMounted(
       async () => {
         await accountStore.fetchUsersToAssign(entityN)
         roleStore.fetchRoles(myData)
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
     form.user_number=props.userInfo
     form.roles=rolesInfo.value
        //  alert(JSON.stringify(form))
    accountStore.createNewAccount(form)
   
   }


watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){
        // buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        formData.role_number = null
        formData.user_number = null

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
        formData.role_number = null
        formData.user_number = null

      }
    },
    {deep:true}
)


//fetch
onMounted(
    async () => {
       accountStore.fetchAllUsers()
    } )


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
       },
       {deep:true}
       )
   
</script>
<template>
   <div>
    <!-- {{ userInfo }} -->
      <form @submit.prevent="addUser">
         <div class="row">
            <div class="col-12">
               <div class="mb-2">
                  <label class="textColor"><small>Role <span class="alert alert-danger p-0">set Account expiry date</span></small></label>
                  <ul class="list-group text-sm mb-1" style="border-radius: 0 0 0 0;">
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
                            v-model="lst.expiry_date"
                            style="outline: none 0 !important; box-shadow: none;"
                            class="form-control" type="date" required>
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
   .textColor{
   }
</style>