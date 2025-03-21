<script setup>
import { onMounted, ref, watch,reactive } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import { useUserStore } from "@/main/dashboard/profiles/store/users.js";
import { useEntityStore } from "@/main/dashboard/entity/store/entity.js";
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import { useAbility } from "@casl/vue";
import {useAttendanceStore} from "@/main/dashboard/attendance/store/attendance.js";

const buttonLoader  = ref(false)
const { can } = useAbility();
const accountStore = useAccountStore();
const entityStore = useEntityStore();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const roleStore = useRolesStore();
const attendanceStore = useAttendanceStore()
const page = ref(1);
const per_page = ref(20);
const total_items = ref(0);
const total_rows = ref(0);
const showingModalUser = ref(false);
const assignDialog = ref(false);
const showingEntity = ref(false);
const userData = ref([]);

const formData = reactive({
     check_in_time: "",
     check_out_time: "",
     present: "",
     user_number: "",
     campus_class_number: "",
     campus_number: "",
     absence_reason: "",
     date: "",
     student_number:""
   })

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


const recordAttendance = (checkInTime,present,user_number,absence_reason) =>{
     formData.check_in_time = checkInTime
     formData.present = present
     formData.user_number = user_number
     formData.absence_reason = absence_reason
    //  alert(JSON.stringify(formData))
   buttonLoader.value = true
     attendanceStore.newStudentAttendance(formData)
   }

     
   watch(
       () => attendanceStore.newStudentAttendanceResponse,
       async (data) => {
         if (data) {
           notificationStore.successToast("Success", data.message)
           buttonLoader.value = false
         }
       },
       {deep: true}
   )
   
   watch(
       () => attendanceStore.errorMessage,
       async (data) => {
         if (data) {
           notificationStore.errorToast("Error", data.message)
           buttonLoader.value = false
         }
       },
       {deep: true}
   )

</script>


<template>
  <div>
    <div class="row">
            <div class="row">
              <div class="col-lg-8 mt-3">
                📅 Select Date: <input type="date" class="border border-primary text-center fw-bold" id="attendanceDate"
                v-model="formData.date">
              </div>
              <div class="col-lg-4">
              <PaginationTemplate
              @perPageChanged="doFetchAccount"
              v-model:perPage="per_page"
              :per_page="per_page"
              :total_items="total_items"
              :total_rows="total_rows">
              </PaginationTemplate>
            </div>
          </div>
            <div class="w-full overflow-auto max-h-[520px] scrollbar-thin" @scroll="onScroll">
              <table class="table table-hover  caption-top mt-1 table-sm table-striped text-sm">
                <thead class="table-dark" style="position: sticky; top: 0;z-index: 12;" >
                <tr>
                  <th style="width:1px">#</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Gender</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Check In Time / Reason (if absent)</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, index) in userData" :key="index">
                  <td>{{ index+1 }}</td>
                  <td style="text-transform: capitalize;">{{ user.first_name + " " + user.last_name }}</td>
                  <td style="text-transform: capitalize;">{{ user.type}}</td>
                  <td style="text-transform: capitalize;">{{user.gender }}</td>
                  <td>
                    <!-- <select v-model="user.attendance" @change="handleAttendanceChange(user)">
                      <option value="">-- Select --</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                    <input v-if="user.attendance === 'Present'" type="time" v-model="user.attendanceTime" class="form-control mt-1"> -->
                    <input  type="radio" :name="'attendance' + user.number" value="YES" v-model="user.present" class="square-radio">
                  </td>
                  <td>
                    <input type="radio" :name="'attendance' + user.number" value="NO" v-model="user.present" class="square-radio">
                  </td>
                   <td>
                <textarea v-on:blur="recordAttendance(user.check_in_time,user.present,user.number,user.absence_reason)" v-if="user.present === 'NO'" class="form-control" v-model="user.absence_reason" placeholder="Enter reason "></textarea>
                    <span   style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                    role="status" v-if="buttonLoader && user.number == user.number && user.present === 'NO'"><span class="visually-hidden">Loading...</span></span> 
                    

                    <div class="row" v-if="user.present === 'YES'">
                      <div class="col-lg-6">
                    <div class="input-group input-group-sm">
                    <input 
                    type="time" 
                    class="form-control form-control-sm" 
                    v-model="user.check_in_time">
                    <button 
                    @click="recordAttendance(user.check_in_time, user.present, user.number, null)"
                    class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-check2"></i>

                    <span   style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                    role="status" v-if="buttonLoader && user.number ==user.number"><span class="visually-hidden">Loading...</span></span> 
                 
                    </button>
                    
                    </div>
                    </div>

                </div>
                                
                   </td>
                </tr>
                
                </tbody>
              </table>
            </div>
          </div>
        </div>



</template>

<style scoped>
   .square-radio {
   appearance: none;
   width: 25px;
   height: 25px;
   border: 2px solid #007bff;
   background-color: white;
   cursor: pointer;
   display: inline-block;
   position: relative;
   margin: 5px;
   border-radius: 5px; 
   }

   .square-radio:checked::after {
   content: "✔";
   font-size: 18px;
   color: white;
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   font-weight: bold;
   }
  
   .square-radio:checked {
   background-color: #007bff;
   border-color: #0056b3;
   }

   #attendanceDate {
   font-size: 1.2rem;
   padding: 10px;
   }
 
   textarea {
   min-width: 200px;
   min-height: 40px;
   }
  
   th, td {
   text-align: left;
   }
</style>