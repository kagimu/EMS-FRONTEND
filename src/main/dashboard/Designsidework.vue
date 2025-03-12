
<script setup>
import { ref, computed, onMounted } from "vue";

// Default date (today)
const attendanceDate = ref("");

// Get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};



// Attendance records with default time
const attendanceRecords = ref([
  { id: 1, name: "John Doe", role: "student", time: getCurrentTime(), attendance: "", absentReason: "" },
  { id: 2, name: "Jane Smith", role: "student", time: getCurrentTime(), attendance: "", absentReason: "" },
  { id: 3, name: "Mr. Wilson", role: "staff", time: getCurrentTime(), attendance: "", absentReason: "" },
  { id: 4, name: "Ms. Alice", role: "staff", time: getCurrentTime(), attendance: "", absentReason: "" }
]);

// Role filter
const selectedRole = ref("all");

// Compute filtered list based on role
const filteredAttendance = computed(() => {
  return selectedRole.value === "all"
    ? attendanceRecords.value
    : attendanceRecords.value.filter(person => person.role === selectedRole.value);
});

// Capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Set today's date on component mount
onMounted(() => {
  const today = new Date();
  attendanceDate.value = today.toISOString().split("T")[0]; // YYYY-MM-DD format
});

// Submit function
const submitAttendance = () => {
  console.log("Attendance Submitted", {
    date: attendanceDate.value,
    records: attendanceRecords.value
  });
  alert("Attendance recorded successfully!");
};
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow-lg p-4">
      <h2 class="text-center mb-4 text-primary">Attendance System</h2>

      <!-- General Date Selection (Larger & Centered) -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-6 text-center">
          <label for="attendanceDate" class="form-label fs-5 fw-bold text-dark">📅 Select Date:</label>
          <input type="date" class="form-control form-control-lg border border-primary text-center fw-bold" id="attendanceDate" v-model="attendanceDate">
        </div>
      </div>

      <!-- Role Filter -->
      <div class="row mb-4">
        <div class="col-md-6">
          <label for="roleFilter" class="form-label"><strong>Filter by Role:</strong></label>
          <select class="form-select form-select-lg" v-model="selectedRole">
            <option value="all">All</option>
            <option value="student">Students</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      <!-- Attendance List -->
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              <th>Time</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Reason (if absent)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(person, index) in filteredAttendance" :key="person.id">
              <td>{{ index + 1 }}</td>
              <td><strong>{{ person.name }}</strong></td>
              <td>{{ capitalize(person.role) }}</td>
              <td>
                <input type="time" class="form-control" v-model="person.time">
              </td>
              <td class="text-center">
                <input type="radio" :name="'attendance' + person.id" value="present" v-model="person.attendance" class="square-radio">
              </td>
              <td class="text-center">
                <input type="radio" :name="'attendance' + person.id" value="absent" v-model="person.attendance" class="square-radio">
              </td>
              <td>
                <textarea v-if="person.attendance === 'absent'" class="form-control" v-model="person.absentReason" placeholder="Enter reason"></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Submit Button -->
      <div class="text-center mt-3">
        <button class="btn btn-success btn-lg px-4" @click="submitAttendance">Submit Attendance</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Square Radio Buttons with Checkmark */
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
  border-radius: 5px; /* Slight rounding for softer look */
}

/* Checkmark when selected */
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

/* Change background color when checked */
.square-radio:checked {
  background-color: #007bff;
  border-color: #0056b3;
}

/* Bigger Date Picker */
#attendanceDate {
  font-size: 1.2rem;
  padding: 10px;
}

/* Styling textareas */
textarea {
  min-width: 200px;
  min-height: 40px;
}

/* Center table text */
th, td {
  text-align: center;
}
</style>
