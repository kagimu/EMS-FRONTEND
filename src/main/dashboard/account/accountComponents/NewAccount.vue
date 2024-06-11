<template>
    <div>
      <!-- {{ userInfo }} -->
        <form @submit.prevent="assignRole">
      <div class="mb-2">
        <label class="textColor"><small>Role</small></label>
        <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
       {{  role_numbers }}
<li class="list-group-item" v-for="(list, index) in rolesData" :key="index">
    <input
            v-model="role_numbers"
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" :value="list.number" :id="list.number">
    <label  :for="list.number"><small>{{list.name}}</small></label>
</li>

</ul>
      </div>

     <div class="flex justify-content-end mt-2" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i> submit</small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
    
    </div>

</template>

<script setup>
import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";

const props = defineProps({
  userInfo:{}
})

const roleStore = useRolesStore()
const accountStore = useAccountStore()
const notificationStore = useNotificationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const userData = ref([])
const user_number = ref(null)
const  role_numbers = ref([])

// const formData = reactive({
//     role_number:[],
// })


const rolesData= ref([])

   let myData = reactive({
    entity_number:localStorage.getItem('entity_number')
    })

//fetch
onMounted(
    async () => {
      roleStore.fetchRoles(myData)
      getUserInfo()
    } )

    watch(
    () => props.userInfo,
    async (data) => {
      if(data){
        getUserInfo()
      }
    }
    )

    const getUserInfo =() =>{
      let draft = props.userInfo
      user_number.value = draft?.number
      role_numbers.value = draft?.roles.map(item => item.role_number).join(',');
      // alert(JSON.stringify(draft?.roles.map(item => item.role_number).join(',')))
    }

    watch(
    () => roleStore.roleResponse,
    async (data) => {
      if(data){
        rolesData.value = data.data
      }
    },
    {deep:true}
    )
const assignRole = () =>{
  // alert(JSON.stringify(formData))
  accountStore.createNewAccount(formData)
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


//fetch
onMounted(
    async () => {
       accountStore.fetchAllUsers()
    } )

    watch(
    () => accountStore.userAllResponse,
    async (data) => {
      if(data){
        userData.value = data
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
.noFocus:focus {
outline: none 0 !important;
box-shadow: none;
-moz-box-shadow: none;
-webkit-box-shadow: none;
}
</style>