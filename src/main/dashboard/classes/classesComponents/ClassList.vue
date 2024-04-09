<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="card mt-3 ">
            <div class="card-body" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="float: right; margin-right: 10px;"><i @click="goBack()" class="bi bi-x-lg"></i></div>

                <div>
    <div class="m-4">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Class List</small></button>
          <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small>Class Attendance</small></button>
          <button class="nav-link navColor" id="subject-attendance-tab" data-bs-toggle="tab" data-bs-target="#subject-attendance" type="button" role="tab" aria-controls="subject-attendance" aria-selected="false"><small>Subject Attendance</small></button>
          <button class="nav-link navColor" id="marks" data-bs-toggle="tab" data-bs-target="#subject-attendance2" type="button" role="tab" aria-controls="subject-attendance2" aria-selected="false"><small>Manage Marks</small></button>
          <button class="nav-link navColor" id="marks" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="" aria-selected="false"><small>Generate Reports</small></button>

          
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
            <ClassStudents></ClassStudents>
        </div>
        <div class="tab-pane fade" id="class-attendance" role="tabpanel" aria-labelledby="class-attendance-tab" tabindex="0">
        <ClassAttendance></ClassAttendance>
        </div>
        <div class="tab-pane fade" id="subject-attendance" role="tabpanel" aria-labelledby="subject-attendance-tab" tabindex="0">
           <SubjectAttendance></SubjectAttendance>
        </div>
      
       <div class="tab-pane fade" id="subject-attendance2" role="tabpanel" aria-labelledby="marks" tabindex="0">
           <ManageMarks></ManageMarks>
        </div>
        
      </div>

    </div>
  </div>
  
  
            </div>
          </div>
        </div>
  
  
      </div>
    </div>
</template>
<script setup>
import ClassStudents from './ClassStudents.vue';
import ClassAttendance from './ClassAttendance.vue'
import SubjectAttendance from './SubjectAttendance.vue';
import ManageMarks from './ManageMarks.vue';

const goBack = () => {
  window.history.back()
}
</script>