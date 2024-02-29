<template>
    <div>
        <div class="modal-content">
      <div class="modal-header text-sm p-0">
        <h6 class="modal-title ml-3 mt-2 mb-2"><small>Assign Role</small></h6>
        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="assignRole">
      <div class="mb-2">      
        <label class="textColor"><small>User</small></label>
              <select  v-model="formData.user_number"  style="box-shadow: none;" class="form-select form-select-sm" required >
                  <option disabled value="">Select User</option>
                  <option v-for="(list, index) in userData" :key="index" :value="list.number">{{ list.first_name }}
                  </option>
              </select>

      </div>
      <div class="mb-2">
        <label class="textColor"><small>Role</small></label>
        <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

<li class="list-group-item" v-for="(list, index) in rolesData" :key="index" :value="list.number">
    <input
            v-model="formData.role_number"

            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1" type="checkbox" :value="list.number" :id="list.number">
    <label class="textColor" :for="list.number"><small>{{list.name}}</small></label>
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
    </div>
    </div>

</template>

<script setup>
import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAccountStore } from "../store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";

const roleStore = useRolesStore()
const accountStore = useAccountStore()
const notificationStore = useNotificationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const userData = ref([])

const formData = reactive({
  user_number: null,
    role_number:[],
})


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