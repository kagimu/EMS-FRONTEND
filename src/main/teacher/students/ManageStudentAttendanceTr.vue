<script setup>
import router from "@/config/router.js";
import { useAbility } from '@casl/vue';
import StudentAttendance from "@/main/dashboard/attendance/attendanceComponents/StudentAttendance.vue";
import RecordStudentAttendance from "@/main/dashboard/attendance/attendanceComponents/RecordStudentAttendance.vue";
import { UserCheck, Users } from "lucide-vue-next"
import RecordStudentCheckout from "@/main/dashboard/attendance/attendanceComponents/RecordStudentCheckout.vue";
import RecordStudentAttendanceTr from "./RecordStudentAttendanceTr.vue";
import StudentAttendanceTr from "./StudentAttendanceTr.vue";

const { can } = useAbility()

const selectedTab = router.currentRoute.value.query.type ?? 'record-attendance-tr';
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "manage-student-attendance-tr", query: {m:menu,type: data}});
}

</script>
<template>
    <div>
      <div class="card">
        <div class="card-header">
          
          <div class="flex items-center justify-between">
  <!-- Left Side: Users Icon & Text -->
  <div class="flex items-center space-x-2">
    <UserCheck size="24" class="text-primary" />
    <h4 class="card-title text-sm pt-2">Student Attendance</h4>
  </div>

  <!-- Right Side: Back Icon -->
  <i size="24" class=" bi bi-arrow-left text-gray-500 cursor-pointer hover:text-gray-700 text-xs" @click="goBack" >Back</i>
</div>

        
        </div>
        <div class="card-body">
      <div class="flex border-b mt-1">
        <div  class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'record-attendance-tr' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('record-attendance-tr')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Record Attendance
          </div>
        </div>

        <!-- <div v-if="can('create_staff_attendance','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'check-out' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('check-out')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Check Out
          </div>
        </div> -->

        <div  class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'student-attendance' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('student-attendance')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Attendance Data
          </div>
        </div>

      </div>


      <div v-if="selectedTab === 'record-attendance-tr'">
        <div>
         <record-student-attendance-tr></record-student-attendance-tr>
        </div>
      </div>

      <div v-if="selectedTab === 'student-attendance'">
        <div>
          <student-attendance-tr></student-attendance-tr>
        </div>
        </div>

          <div v-if="selectedTab === 'check-out'">
            <div>
             <RecordStudentCheckout></RecordStudentCheckout>
            </div>
          </div>

   


      </div>
    </div>
    </div>
</template>
