<script setup>
  import { onMounted, reactive, ref, watch } from "vue";
  import { useRolesStore } from "../store/roles.js";
  import useNotificationStore from "@/composables/useNotification.js";
  
  const roleStore = useRolesStore();
  const notificationStore = useNotificationStore();
  const buttonLoader = ref(false);
  const showDialog = ref(false);
  const role_number = ref(null);
  let entityN = localStorage.getItem("entity_number");

  const form = reactive({ 
    name: null, 
    description: null,
    entity_number: entityN
  });
  
  const permissionData = ref([]);
  const permissionSelected = ref([]);

  const props = defineProps({
    roleData: String
  });

  onMounted(async () => {
    roleStore.fetchPermissionGroups();
    prefillDraftData();
  });

  const prefillDraftData = () => {
    if (props.roleData.number) {
      let draft = props.roleData;
      form.name = draft.name;
      form.description = draft.description;
      role_number.value = draft.number;
      permissionSelected.value = draft.permissions;
    }
  };

  watch(() => props.roleData, async (data) => {
    if (data) {
      prefillDraftData();
    }
  });

  watch(() => roleStore.permisionGroupsResponse, async (data) => {
    if (data) {
      permissionData.value = data.data;
    }
  }, { deep: true });

  watch(() => roleStore.errorMessage, async (data) => {
    if (data) {
      notificationStore.errorToast("Error", data.message);
    }
  }, { deep: true });

  const toggleSelectAll = (groupIndex, selectAll) => {
    const permissions = Object.values(permissionData.value[groupIndex])[0];
    if (selectAll) {
      permissionSelected.value = [
        ...permissionSelected.value,
        ...permissions.filter((p) => !permissionSelected.value.includes(p))
      ];
    } else {
      permissionSelected.value = permissionSelected.value.filter((p) => !permissions.includes(p));
    }
  };

  const addRoles = () => {
    buttonLoader.value = true;
    let formData = { ...form };
    formData.permissions = permissionSelected.value;

    if (role_number.value) {
      formData.role_number = role_number.value;
      roleStore.editRole(formData);
    } else {
      roleStore.createNewRole(formData);
    }
  };

  watch(() => roleStore.editRoleResponse, async (data) => {
    if (data) {
      buttonLoader.value = false;
      notificationStore.successToast("Success", data.message);
    }
  }, { deep: true });

  watch(() => roleStore.newRoleResponse, async (data) => {
    if (data) {
      showDialog.value = false;
      buttonLoader.value = false;
      form.name = null;
      form.description = null;
      permissionSelected.value = [];
      notificationStore.successToast("Success", data.message);
    }
  }, { deep: true });
</script>

<!-- <template>
  <form @submit.prevent="addRoles">
    <div class="mb-2 mr-5 ml-5">
      <label style="font-size: 14px;">Role Name</label>
      <input placeholder="Role Name" type="text" v-model="form.name" required class="form-control">
    </div>

    <div class="mb-2 mr-5 ml-5">
      <label style="font-size: 14px;">Description</label>
      <textarea v-model="form.description" class="form-control" style="height: 100px"></textarea>
    </div>

    <table id="datatable" class="table table-sm table-bordered mt-5" style="font-size: 13px !important;">
      <tbody>
        <tr v-for="(permissionGroup, groupIndex) in permissionData" :key="groupIndex">
          <td>{{ Object.keys(permissionGroup)[0] }}</td>
          <td>
            <ul>
              <p>
                <input 
                  type="checkbox" 
                  @change="toggleSelectAll(groupIndex, $event.target.checked)"
                  :checked="Object.values(permissionGroup)[0].every(p => permissionSelected.includes(p))"
                > 
                <b>Select All</b>
              </p>
              <li v-for="(permission, permissionIndex) in Object.values(permissionGroup)[0]" :key="permissionIndex">
                <input 
                  type="checkbox" 
                  :id="'permission_' + groupIndex + '_' + permissionIndex" 
                  v-model="permissionSelected" 
                  :value="permission"
                >
                &nbsp;<label class="text-sm" :for="'permission_' + groupIndex + '_' + permissionIndex">{{ permission }}</label>
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
</template> -->



<template>
  <div class="container mt-5">
    <!-- Role Information Card -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Role Information</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Role Name</label>
          <input placeholder="Role Name" type="text" v-model="form.name" required class="form-control">
        </div>

        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea v-model="form.description" class="form-control" style="height: 100px"></textarea>
        </div>
      </div>
    </div>

    <!-- Permissions Card -->
    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white">
        <h5 class="mb-0">Permissions</h5>
      </div>
      <div class="card-body">
        <table id="datatable" class="table table-sm table-bordered" style="font-size: 13px;">
          <tbody>
            <tr v-for="(permissionGroup, groupIndex) in permissionData" :key="groupIndex">
              <td class="bg-light fw-bold">{{ Object.keys(permissionGroup)[0] }}</td>
              <td>
                <ul class="list-unstyled">
                  <li class="mb-2">
                    <input 
                      type="checkbox" 
                      @change="toggleSelectAll(groupIndex, $event.target.checked)"
                      :checked="Object.values(permissionGroup)[0].every(p => permissionSelected.includes(p))"
                    >
                    <b>Select All</b>
                  </li>
                  <li v-for="(permission, permissionIndex) in Object.values(permissionGroup)[0]" :key="permissionIndex">
                    <input 
                      type="checkbox" 
                      :id="'permission_' + groupIndex + '_' + permissionIndex" 
                      v-model="permissionSelected" 
                      :value="permission"
                    >
                    &nbsp;<label class="text-sm" :for="'permission_' + groupIndex + '_' + permissionIndex">{{ permission }}</label>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Save Button -->
    <div class="text-end mt-4">
      <button type="submit" class="btn btn-primary" @click.prevent="addRoles">
        Save Data
        <div class="spinner-border spinner-border-sm ms-2" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

.card {
  border-radius: 10px;
}

.card-header {
  font-size: 18px;
}

.table {
  margin-bottom: 0;
}

ul {
  padding-left: 0;
}

li {
  padding: 5px 0;
}
</style>
