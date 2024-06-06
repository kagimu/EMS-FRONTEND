<script setup>
 import { onMounted, reactive, ref, watch } from "vue";
import NewRole from "./roleComponents/NewRole.vue";
import UpdateRole from "./roleComponents/UpdateRole.vue"
import { useRolesStore } from "./store/roles";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const roleStore = useRolesStore()
const notificationStore = useNotificationStore()
const roleData = ref([])
const errorMessage = ref(null)
const showDialog = ref(false)
const roles_no = ref ([])
const showModal = ref(false)
const editMode=ref(false)
 const rolesData = ref([])
 const roleRef = ref(null)

 const showAddModal = ()=>{
  roleData.value = []
  showModal.value = true
  editMode.value=false
  // roleRef.value.clearRoleData();
  
 }

const setEditRolesId = (roleD) => {
  roleData.value = roleD
  showModal.value = true
  editMode.value=true
}

const  deleteRole = (roles) => {
  if(!confirm("Are you sure, you want to remove: " + roles.name)){
  // return
  notificationStore.errorToast("Cancelled","Action Cancelled Successfully !")
}else{
  roleStore.deleteRole(roles.number)

}
}

//fetch
onMounted(
    async () => {
      await roleStore.fetchRoles()
    } )

    watch(
    () => roleStore.deleteRoleResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        roleStore.fetchRoles()
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
    () => roleStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)

      }
    },
    {deep:true}
)

watch (
    () => roleStore.editRoleResponse,
    async (data) => {
      if(data){
        showModal.value = false
        editMode.value=false
        roleStore.fetchRoles()
      }
    },
    {deep:true}
)

watch (
    () => roleStore.newRoleResponse,
    async (data) => {
      if(data){
        showModal.value = false
        editMode.value=false
        roleStore.fetchRoles()
      }
    },
    {deep:true}
)

</script>


<template>
  <div>

    <!-- <div class="modal fade" id="addRoleModel" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: showDialog }">
      <div class="modal-dialog modal-lg">
     <NewRole></NewRole>
        </div>
      </div> -->

      <AppModal :title="editMode ? 'Edit Role' : 'Add New Role'" v-model="showModal" xl4>
        <NewRole ref="roleRef" :roleData="roleData"></NewRole>
    </AppModal>

      <!-- <div class="modal fade" id="updateRoleModel" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: showDialog }">
      <div class="modal-dialog modal-lg">
    <update-role :role-number="roles_no"></update-role>
        </div>
      </div> -->



      <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
                <button
                v-if="can('add_role','general')" 
                style="float: right; margin-right: 5px;" @click="showAddModal" type="button"  aria-controls="rolesDialog" class="btn btn-primary btn-sm"><i class="bi bi-plus"></i>New Role</button>
            </div>
    
           </div>
               </div>
                <div class="card-body" >
   

    <div class="row">
      <div class="col-12">
        <div class="cad mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="row">
      <div class="col-9"></div>
      <div class="col-3">
       
      </div>
    </div>

    <div class="container mt-4">
            <!-- <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Roles and Permission</div> -->

            <table class="table table-hover caption-top table-striped" style="font-size: 14px;">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
        <th scope="col">Permissions</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(roles, index) in rolesData" :key="index">
        <td>{{ roles.name }}</td>
        <td>{{ roles.description }}</td>
        <td>{{ roles.permissions }}</td>
        <td>
          <!-- Buttons for actions -->
          <button
          v-if="can('update_permission','general')"
           @click="setEditRolesId(roles)"  type="button" aria-controls="rolesDialog">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
          <button 
          v-if="can('delete_role','general')"
          @click="deleteRole(roles)" type="button">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
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

    </div>
    </div>
    </div>
    </div>

  </div>
</template>


<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}

.noFocus {
  box-shadow: none !important
}


</style>