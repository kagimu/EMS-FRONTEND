<template>
    <div class="modal-content">
      <div class="modal-header text-sm p-0">
        <!-- {{ roleNumber }} -->
        <h6 class="modal-title ml-3 mt-2 mb-2"><small>Update Role</small></h6>
        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        
        <form @submit.prevent="editRoles">
          <div class="mb-2 mr-5 ml-5">
            <input placeholder="Role Name" type="text" v-model="form.name" required class="form-control">
          </div>
  
          <div class="mb-2 mr-5 ml-5">
            <textarea placeholder="Description" v-model="form.description" class="form-control noFocus" id="floatingTextarea2" style="height: 100px"></textarea>
          </div>
 
          <table id="datatable" class="table table-sm table-bordered mt-5" style="font-size: 13px !important;">
            <tbody>
              <tr v-for="(permissionGroup, index) in permissionData" :key="index">
                <td>{{ Object.keys(permissionGroup)[0] }}</td>
                <td>
                  <ul>
                    <li v-for="(permission, permissionIndex) in Object.values(permissionGroup)[0]" :key="permissionIndex">
                      <input type="checkbox" :id="'permission_' + index + '_' + permissionIndex" v-model="permissionSelected" :value="permission">
                      &nbsp;<label class="textColor" :for="'permission_' + index + '_' + permissionIndex">{{ permission }}</label>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div class="text-right mt-4">
            <button type="submit" class="btn btn-primary mb-2">
           Update Role
              <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
   import { onMounted, reactive, ref, watch } from "vue";
  import { useRolesStore } from "../store/roles.js";
  import useNotificationStore from "@/composables/useNotification.js";
  
  const roleStore = useRolesStore()
  const notificationStore = useNotificationStore()
  const buttonLoader = ref(false)
  const showDialog = ref(false)
  const form = reactive({ name: null, description: null })
  
  const permissionData = ref([])
  const permissionSelected = ref([])

  const props = defineProps({
    roleNumber:String
  })

onMounted(
    async () => {
      await roleStore.fetchRolesById(roleNumber)
    } )

    watch(
    () => roleStore.roleByIdResponse,
    async (data) => {
      if(data){
        permissionData.value = data.data
      }
    },
    {deep:true}
    )
    


const editRoles = () => {
    let formData = form
        formData.permissions = permissionSelected.value
 
  // alert(JSON.stringify(formData))
//   roleStore.updateRoles()
}

onMounted(
    async () => {
      await roleStore.fetchRoles()
    } )

watch (
    () => roleStore.updateRoles,
    async (data) => {
      if(data){
        showDialog.value = false
        buttonLoader.value = false
         roleStore.fetchRoles()
        form.name = null
        form.description = null
        permissionSelected.value = []
        notificationStore.successToast("Success", data.message)
      
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
  </script>
  
  <style scoped>
  .mb-2 {
    text-align: left;
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
  }
  
  .details {
    color: rgba(0, 0, 0, 0.824);
  }
  </style>
  