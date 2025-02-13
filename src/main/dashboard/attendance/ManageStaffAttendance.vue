<script setup>
import UnitsOfMeasure from "@/main/dashboard/catering/cateringComponents/UnitsOfMeasure.vue";
import NewUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/NewUnitOfMeasurement.vue";
import router from "@/config/router.js";
import { useAbility } from '@casl/vue';
import StaffAttendance from "@/main/dashboard/attendance/attendanceComponents/StaffAttendance.vue";
import RecordStaffAttendance from "@/main/dashboard/attendance/attendanceComponents/RecordStaffAttendance.vue";
import { UserCheck, Users } from "lucide-vue-next"

const { can } = useAbility()

const selectedTab = router.currentRoute.value.query.type ?? 'record-attendance';
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "manage-staff-attendance", query: {m:menu,type: data}});
}

</script>
<template>
    <div>
      <div class="card">
        <div class="card-header">
          
          <div class="flex items-center justify-between">
  <!-- Left Side: Users Icon & Text -->
  <div class="flex items-center space-x-2">
    <Users size="24" class="text-primary" />
    <h4 class="card-title text-sm pt-2">Staff Attendance</h4>
  </div>

  <!-- Right Side: Back Icon -->
  <i size="24" class=" bi bi-arrow-left text-gray-500 cursor-pointer hover:text-gray-700 text-xs" @click="goBack" >Back</i>
</div>

        
        </div>
        <div class="card-body">
      <div class="flex border-b mt-1">
        <div v-if="can('create_staff_attendance','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'record-attendance' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('record-attendance')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Record Attendance
          </div>
        </div>

        <div v-if="can('create_staff_attendance','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'staff-attendance' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('staff-attendance')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Attendance
          </div>
        </div>

      </div>


      <div v-if="selectedTab === 'record-attendance'">
        <div>
         <record-staff-attendance></record-staff-attendance>
        </div>
      </div>

      <div v-if="selectedTab === 'staff-attendance'">
        <div>
          <staff-attendance></staff-attendance>
        </div>
        </div>

   


      </div>
    </div>
    </div>
</template>
