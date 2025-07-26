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

 /* watch(() => roleStore.editRoleResponse, async (data) => {
    if (data) {
      buttonLoader.value = false;
      notificationStore.successToast("Success", data.message);
    }
  }, { deep: true });*/

/*  watch(() => roleStore.newRoleResponse,
      async (data) => {
          if (data) {
            showDialog.value = false;
            buttonLoader.value = false;
            form.name = null;
            form.description = null;
            permissionSelected.value = [];
            notificationStore.successToast("Success", data.message);
          }
    }, { deep: true });*/

const emit = defineEmits(["closeDialog"]);

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
  <div class=" mt-1">
    <div class="mb-5">
      <div class="mt-3">
        <div class="mb-4 text-gray-600 border-b">Role Information</div>
      </div>
      <div class="">
        <div class="mb-3">
          <div class="text-sm text-gray-600">Role Name</div>
          <input
              type="text"
              v-model="form.name"
              required
              class="form-control shadow-none">
        </div>

        <div class="mb-3">
          <div class="text-sm text-gray-600">Description</div>
          <textarea
              v-model="form.description"
              class="form-control shadow-none"
              rows="5"></textarea>
        </div>
      </div>
    </div>


    <div class="border rounded-md">
      <div class="mb-4  border-b">
        <div class="py-1 text-gray-600 ml-3">Permissions</div>
      </div>
      <div class="px-2 pb-2">
        <table id="" class="table table-sm table-bordered rounded-md" style="font-size: 13px;">
          <tbody>
            <tr v-for="(permissionGroup, groupIndex) in permissionData" :key="groupIndex">
              <td class="bg-light fw-bold p-3">{{ Object.keys(permissionGroup)[0] }}</td>
              <td class="p-3">
                <ul class="list-unstyled">
                  <li class="mb-2">
                   <div class="flex">
                     <input
                         type="checkbox"
                         :id="'select_all'+ groupIndex"
                         @change="toggleSelectAll(groupIndex, $event.target.checked)"
                         :checked="Object.values(permissionGroup)[0].every(p => permissionSelected.includes(p))"
                     >
                     <label :for="'select_all'+groupIndex" class="font-semibold text-gray-600 ml-2 text-md cursor-pointer">Select All</label>
                   </div>
                  </li>
                  <li v-for="(permission, permissionIndex) in Object.values(permissionGroup)[0]" :key="permissionIndex">
                    <input 
                      type="checkbox" 
                      :id="'permission_' + groupIndex + '_' + permissionIndex" 
                      v-model="permissionSelected" 
                      :value="permission"
                    >
                    &nbsp;<label class="text-sm cursor-pointer" :for="'permission_' + groupIndex + '_' + permissionIndex">{{ permission }}</label>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Save Button -->
   
  <div class="flex justify-between mt-2" style="width: 100%; ">
        <button
            type="button"
            class="btn btn-danger border-0 mr-2 btn-sm"
            @click="$emit('closeDialog')">
          Cancel
        </button>
      <button type="submit" class="btn btn-sm btn-primary px-4" @click.prevent="addRoles">
         {{role_number ? "Edit" : "Save"}}
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
