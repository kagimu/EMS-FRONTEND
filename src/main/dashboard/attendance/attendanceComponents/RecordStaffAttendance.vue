<template>
  <div>
    <AppModal title="New User" v-model="showingModalUser" xl6>
      <NewStaff></NewStaff>
    </AppModal>

    <AppModal title="Assign Role" v-model="assignDialog" xl2>
      <new-account :userInfo="userInfo"></new-account>
    </AppModal>

    <AppModal title="Assign Entity" v-model="showingEntity" xs>
      <AssignUserEntity :userNumber="userNumber"></AssignUserEntity>
    </AppModal>

    <div class="row">

            <PaginationTemplate
                @perPageChanged="doFetchAccount"
                v-model:perPage="per_page"
                :per_page="per_page"
                :total_items="total_items"
                :total_rows="total_rows">
            </PaginationTemplate>
            <div class="w-full overflow-auto max-h-[520px] scrollbar-thin" @scroll="onScroll">
              <table class="table table-hover caption-top mt-0 table-sm table-striped" style="font-size: 11px !important;">
                <thead>
                <tr>
                  <th style="width:1px">#</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Gender</th>
                  <th>Attendance</th>

                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, index) in userData" :key="index">
                  <td>{{ index+1 }}</td>
                  <td style="text-transform: capitalize;">{{ user.first_name + " " + user.last_name }}</td>
                  <td style="text-transform: capitalize;">{{ user.type}}</td>
                  <td style="text-transform: capitalize;">{{user.gender }}</td>


                  <td>
                    <select v-model="user.attendance" @change="handleAttendanceChange(user)">
                      <option value="">-- Select --</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                    <input v-if="user.attendance === 'Present'" type="time" v-model="user.attendanceTime" class="form-control mt-1">
                  </td>

                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>



</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import { useUserStore } from "@/main/dashboard/profiles/store/users.js";
import { useEntityStore } from "@/main/dashboard/entity/store/entity.js";
import AppModal from "@/components/AppModal.vue";
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import NewStaff from "@/main/dashboard/profiles/NewStaff.vue";
import AssignUserEntity from "@/main/dashboard/entity/entityComponents/AssignUserEntity.vue";
import { useAbility } from "@casl/vue";

const { can } = useAbility();
const accountStore = useAccountStore();
const entityStore = useEntityStore();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const roleStore = useRolesStore();
const page = ref(1);
const per_page = ref(20);
const total_items = ref(0);
const total_rows = ref(0);
const showingModalUser = ref(false);
const assignDialog = ref(false);
const showingEntity = ref(false);
const userData = ref([]);

const showModalUser = () => {
  showingModalUser.value = true;
};

const openModal = (userInf) => {
  userInfo.value = userInf;
  assignDialog.value = true;
};

const doFetchAccount = () => {
  let data = { page: 1, per_page: per_page.value };
  userData.value = [];
  accountStore.fetchUsersToAssign(data);
};

watch(() => accountStore.userResponse, async (data) => {
  if (data) {
    userData.value = data.content.map(user => ({ ...user, attendance: '', attendanceTime: '' }));
  }
}, { deep: true });

const handleAttendanceChange = (user) => {
  if (user.attendance !== 'Present') {
    user.attendanceTime = '';
  }
};

onMounted(() => {
  roleStore.fetchRoles();
  accountStore.fetchAllUsers();
  doFetchAccount();
  entityStore.fetchEntity();
});
</script>
