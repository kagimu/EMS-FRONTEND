<template>
  <div>
    <!-- end  -->
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body" style="padding: 0;">
            <div class="container mt-4">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <ul>
                        <h5 style="font-size: 14px;margin-top: 2px;">LEARNERS SCHEDULED FOR PRIMARY-ONE INTERVIEW</h5>
                        <li></li>
                      </ul>
                      <div class="row">
                        <div class="col-12">
                          <div class="mt-4">
                            <div class="row mx-auto">
                              <div class="col-2 mb-1">
                                <select
                                  style="box-shadow: none;font-size: 14px;"
                                  class="form-select form-select-sm"
                                  v-model="bulkAction"
                                  @change="performBulkAction"
                                >
                                  <option value="" disabled><b>BULK ACTIONS</b></option>
                                  <option value="admit">ADMIT</option>
                                  <option value="delete">DELETE</option>
                                </select>
                              </div>
                              <div class="col-6 mb-1"></div>
                              <div class="col-4 mb-1">
                                <input type="text" v-model="searchQuery" class="form-control mt-1 mb-0" placeholder="Search...">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <table
                id="datatable"
                class="table table-striped"
                style="font-size: 14px !important;"
              >
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in students" :key="index">
                    <td>{{ student.name }}</td>
                    <td>{{ student.gender }}</td>
                    <td>
                      <!-- Action buttons -->
                      <input type="checkbox" v-model="selectedStudents[index]"  class="checkbox-primary">
                      <button @click="admitStudent(student)" v-if="bulkAction === 'admit'">Admit</button>
                      <button @click="deleteStudent(student)" v-if="bulkAction === 'delete'">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedStudents = ref([]);
const bulkAction = ref('');
const searchQuery = ref('');

// Dummy data for students
const students = [
  { name: 'Collins Mpiima', gender: 'Male' },
  { name: 'Mark VAvav', gender: 'Male' },
  { name: 'Luka De', gender: 'Male' },
  // Add more students if needed
];

// Function to perform bulk action
const performBulkAction = () => {
  if (bulkAction.value === 'admit') {
    const selectedNames = selectedStudents.value
      .map((value, index) => value ? students[index].gender : null)
      .filter(name => name !== null);

    const confirmMessage = `Are you sure you want to admit the selected students: ${selectedNames.join(', ')}?`;
    if (window.confirm(confirmMessage)) {
      // User clicked OK, perform admission logic here
      alert('Students admitted successfully.');
    } else {
      // User clicked Cancel, do nothing
      // Optionally, you can clear the selected students array or perform other actions
    }
  }
};


// Function to admit a student
const admitStudent = (student) => {
  // Implement the logic to admit the student here
  console.log('Student admitted:', student);
};

// Function to delete a student
const deleteStudent = (student) => {
  // Implement the logic to delete the student here
  console.log('Student deleted:', student);
};
</script>
