<script setup>
   import {onMounted, reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";

   import { useAccountStore } from "@/main/dashboard/account/store/account.js";
   import { useRolesStore } from "@/main/settings/roles/store/roles.js";
   import TeacherComboBox from "@/main/dashboard/account/teacherManagement/TeacherComboBox.vue";
   

   const notificationStore = useNotificationStore()
   const roleStore = useRolesStore()
   const accountStore = useAccountStore()
   const rolesData = ref([])

   const errorMessage = ref(null)
   const userData = ref([])
   const buttonLoader = ref(false)

   const rolesInfo = ref([])

   let entityN = localStorage.getItem("entity_number")

const props = defineProps({
  userInfo:String
})

   
   const form = reactive({
     user_number:null,
     stream_number:null,
     campus_class_number:null,
     assessment_area_number:null,
     school_number:null,
     curriculum_number:null,
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
       await accountStore.fetchAllUsers()
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
      <form @submit.prevent="addUser">
         <div class="row">
            <div class="col-12">


              <div class="mb-2">
                <label class="text-sm mt-3 mb-2"><small>Select User</small></label>
                <teacher-combo-box
                    v-model:optionResponse="form.user_number"
                    :optionDraft="form?.user_number"
                ></teacher-combo-box>
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










