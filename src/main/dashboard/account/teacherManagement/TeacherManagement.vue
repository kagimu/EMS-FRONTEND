<script setup>
import { useAbility } from '@casl/vue';
import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAccountStore } from "../store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import { useUserStore } from "@/main/dashboard/profiles/store/users.js"
import AppModal from "@/components/AppModal.vue";
import AssignUserEntity from "@/main/dashboard/entity/entityComponents/AssignUserEntity.vue"
import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import NewAccount from "@/main/dashboard/account/accountComponents/NewAccount.vue";
import NewTeacher from "@/main/dashboard/account/teacherManagement/NewTeacher.vue";

const page = ref(1)
const status = ref("")
const entityStore = useEntityStore()
const userStore = useUserStore()
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)



const { can } = useAbility()

const roleStore = useRolesStore()
const accountStore = useAccountStore()
const notificationStore = useNotificationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const userData = ref([])
const showDialog = ref(false)
const assignDialog = ref(false)
const userAll = ref([])
const showingModalUser = ref(false)
const showingEntity = ref(false)
const entityList = ref(null)
const userInfo = ref(null)
const tableLoader = ref(true)
let entityN = localStorage.getItem("entity_number")

const openModal = (userInf) =>{
  userInfo.value = userInf
  assignDialog.value = true
}


const showModalUser = () => {
    showingModalUser.value = true
}

const rolesData= ref([])

//fetch
onMounted(
    async () => {
      await roleStore.fetchRoles()
      accountStore.fetchAllUsers()
      doFetchAccount()
      entityStore.fetchEntity()
    } )

    const openEntityModal = (userN) =>{
      showingEntity.value=true
      userNumber.value = userN
    }

    watch(
    () => roleStore.roleResponse,
    async (data) => {
      if(data){
        rolesData.value = data.data
      }
    }
    )
 
    
watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){
        assignDialog.value = false
      }
    },
    {deep:true}
)


//fetch
const doFetchAccount = () =>{
   let data = {
      page: 1,
      per_page: per_page.value,
      entity_number:entityN
   }
  //  loading.value = true;
   userData.value = []
   accountStore.fetchUsersToAssign(data)

  }


  function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    tableLoader.value = true
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      entity_number:entityN
   }
  //  loading.value = true;
   userData.value = []
   accountStore.fetchUsersToAssign(data)

  }
}

  const fetchUsers = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page
      tableLoader.value = false

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content

      let count_items = (current_page * per_page_item)
      let totalItems = data?.total_rows


      if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
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


    watch(
    () => accountStore.userAllResponse,
    async (data) => {
      if(data){
        userAll.data = data.data
      }
    },
    {deep:true}
    )


const formData = reactive({
  user_number:null,
  role_number:null
})
const selectedIndex = ref(null);



const removeRole = (roleN,userN,rolename,userName) => {
    if(!confirm("Are you sure, you want to remove: " + rolename +" role from " + userName)){
      notificationStore.errorToast("Cancelled","Action Cancelled Successfully !")
      return
    }

    let data = {
      role_number:roleN,
      user_number:userN
    }

    accountStore.removeAccountRole(data)
}





watch(
    () => accountStore.removeRoleResponse,
      async (data) => {
        if(data){
          notificationStore.successToast("Success", data.message)
          doFetchAccount()
        }
      }
    )

    
watch (
    () => accountStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    }
)

watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){
        doFetchAccount()
      }
    }
)


watch (
      () => userStore.newUserResponse,
      async (data) => {
        if(data){
          showingModalUser.value = false
          doFetchAccount()
        }
      }
  )

  watch (
  () => entityStore.entityResponse,
  async (data) => {
    if (data) {
  entityList.value = data.data
    }
  }
)

watch (
    () => entityStore.entityToUserResponse,
    async (data) => {
      if(data){
        showingEntity.value = false
      }
    }
)

</script>

<template>
    <div>

    <AppModal title="New User" v-model="showingModalUser" xl6>
      <new-teacher></new-teacher>
    </AppModal>

    <AppModal title="Assign Role" v-model="assignDialog" xl2>
      <new-account :userInfo="userInfo"></new-account>
    </AppModal>

    <AppModal title="Assign Entity" v-model="showingEntity" xs>
      <AssignUserEntity :userNumber="userNumber"></AssignUserEntity>
    </AppModal>

      <div class="row">
            <div class="col-12">

              <div class="flex flex-grow justify-end mx-2 mt-2">
                <button  style="float: right;border: none;"
                         class="btn btn-primary btn-sm" type="button"  @click="showModalUser">
                  <i class="bi bi-plus"></i>
                  New Teacher
                </button>
              </div>


              <div>


<!--                <div class="row mx-auto">
                  <div class="col-3">
                    <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="status">
                      <option disabled value="">&#45;&#45;filter by Status -</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>

                  </div>
                </div>-->

                <PaginationTemplate
                    @perPageChanged="doFetchAccount"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>

                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">
                  <table id="data"
                         class="table table-hover caption-top mt-1 table-sm table-striped"
                         style="font-size: 11px !important;" >
                    <thead>
                    <tr>
                      <th>#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Role (s)</th>
                      <th>Type</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Status</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(user, index) in userData" :key="index">
                      <td>{{ index+1 }}</td>
                      <td>{{ user.first_name + " " +user.last_name + " " + user.second_name }}</td>
                      <td>
              <span v-for="(rol,indx) in user.roles"  :key="indx" >
               {{ rol.role_name }}
               <button
                   v-if="can('remove_assigned_role','general')"
                   @click="removeRole(rol.role_number,user.number,rol.role_name,user.first_name)">
                  &nbsp;<i  class="bi bi-x-circle-fill" style="color:rgb(228, 23, 23)"></i>
                </button>
              </span>
                      </td>
                      <td>{{ user.type }}</td>
                      <td>{{ user.gender }}</td>
                      <td>
                        <span v-if="user.status === 'Active'" :style="user.status === 'Active' ? 'color:green' : 'color:rgb(239, 13, 13)'"><b>{{ user.status }}</b></span>
                      </td>
                      <td>
                        <button
                            v-if="can('update_assigned_role','general')"
                            data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
                          <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                        </button>
                        &nbsp;&nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>
                        <button @click="openModal(user.number)" type="button" class="btn btn-outline-primary mb-2 btn-small py-0 px-3 text-sm">
                          <small>Assign Role</small>
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
      


    <style scoped>
    .btn{
      border-radius: 4px !important;
    }
    </style>