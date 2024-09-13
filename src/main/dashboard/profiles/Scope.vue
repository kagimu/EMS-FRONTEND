<template>
  <div>

    <AppModal title="Scope" v-model="showingModal" lg>
    <AssignScope :user_number="user_number"></AssignScope>
    </AppModal>

    <AppModal title="New User" v-model="showingModalUser" lg>
    <NewStaff></NewStaff>
    </AppModal>

    <div class="row mt-3">
      <div class="col-12">
      <table 
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Scope</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in userData" :key="index">
            <td>{{ user.first_name + " " +user.last_name + " " + user.second_name }}</td>
            <td>{{ user.type }}
            </td>
        
            <td>
                  

          </td>
            <td>
          <button class="btn btn-primary btn-sm mb-2" @click="showModal(user.number)">Scope</button>
        </td>
        </tr>
    
      
        </tbody>
      </table>
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
import AppModal from "@/components/AppModal.vue";
import AssignScope from "@/main/dashboard/profiles/AssignScope.vue"
import NewStaff from "@/main/dashboard/profiles/NewStaff.vue"
import {useScopeStore} from "@/main/dashboard/profiles/store/scope.js";

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
const scopeStore = useScopeStore()
const scopeData = ref([])

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

onMounted(
    async () => {
      await roleStore.fetchRoles()
      scopeStore.fetchScope()
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

    watch (
      () => scopeStore.newScopeResponse,
      async (data) => {
        if(data){
          showingModal.value=false
          doFetchAccount()
          scopeStore.fetchScope()
        }
      },
      {deep:true}
  )

  watch (
      () => scopeStore.scopeResponse,
      async (data) => {
        if(data){
         scopeData.value = data
        }
      },
      {deep:true}
  )
</script>

<style scoped>

input:focus {
  box-shadow: none;
}

.text-sm2{
  color: #717375;
}

</style>