<script setup>
  import { onMounted, reactive, ref, watch } from "vue";
  import { useRolesStore } from "../store/roles.js";
  import useNotificationStore from "@/composables/useNotification.js";
  
  const roleStore = useRolesStore()
  const notificationStore = useNotificationStore()
  const buttonLoader = ref(false)
  const showDialog = ref(false)
  const role_number = ref(null)
  const form = reactive(
    { 
      name: null, 
      description: null
     })
  
  const permissionData = ref([])
  const permissionSelected = ref([])

  const props = defineProps({
    roleData:String
  })


onMounted(
    async () => {
      await roleStore.fetchPermissionGroups()
            roleStore.fetchRoles()
            prefillDraftData()
    } )

    const clearRoleData = () => {
      alert("I reach here")
      form.name = ""
      form.description = ""
      role_number.value = "" 
      permissionSelected.value = []
    }

    defineExpose({
      clearRoleData
    }); 

    const prefillDraftData = () => {
    if(props.roleData){
      let draft = props.roleData
      form.name = draft.name
      form.description = draft.description
      role_number.value = draft.number   
      permissionSelected.value = draft.permissions
     }
    }

    watch(
    () => props.roleData,
    async (data) => {
      if(data){
       prefillDraftData()
      }
    }
    )

    watch(
    () => roleStore.permisionGroupsResponse,
    async (data) => {
      if(data){
        permissionData.value = data.data
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

const addRoles = () => {
  buttonLoader.value=true
    let formData = form
        formData.permissions = permissionSelected.value
  if(role_number.value){
    formData.role_number = role_number.value
    roleStore.editRole(formData)
  }else{
    roleStore.createNewRole(formData)
  }
 
}

watch (
    () => roleStore.editRoleResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)


watch (
    () => roleStore.newRoleResponse,
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
</script>
<template>
  <!-- {{ roleData }} -->
        <form @submit.prevent="addRoles">
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
              Save Data
              <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </div>
        </form>
  
  </template>
  

  
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
  