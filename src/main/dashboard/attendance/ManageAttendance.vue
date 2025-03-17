<script setup>
import { useRouter } from "vue-router";
import { UserCheck, Users } from "lucide-vue-next"

const router = useRouter();

const goToAttendancePage = (type) => {
  if (type === "students") router.push(`manage-student-attendance`);
  else router.push(`manage-staff-attendance`);
}
</script>

<template>
  <div class="container">
    <div class="row mt-4">
      <!-- Student Attendance Card -->
      <div class="col-md-6">
        <div class="card attendance-card" @click="goToAttendancePage('students')">
          <div class="card-body text-center">
            <UserCheck size="88" class="icon text-primary" />
            <h5 class="mt-3">Student Attendance</h5>
          </div>
        </div>
      </div>

      <!-- <div class="col-md-6">
        <div class="card attendance-card" @click="goToAttendancePage('staff')">
          <div class="card-body text-center">
            <Users size="88" class="icon text-success" />
            <h5 class="mt-3">Staff Attendance</h5>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.attendance-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.attendance-card:hover {
  transform: scale(1.05);
}
.icon {
  width: 50px;
  height: 50px;
}
</style>
