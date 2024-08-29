<template>
  <section class="student-portal bg-light py-14">
    <div class="container">
      <!-- Top Bar -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <img src="makerere-logo.png" alt="Makerere University" style="height: 50px;" />
          <h4 class="ms-3 mb-0">Makerere University</h4>
        </div>
        <div>
          <button class="btn btn-success me-2">APPLY NOW</button>
          <button class="btn btn-outline-success me-2">APPLICATION HISTORY</button>
          <button class="btn btn-outline-success">ADMISSION HISTORY</button>
          <div class="dropdown d-inline">
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ user.email }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <li><a class="dropdown-item" href="#">Profile Settings</a></li>
              <li><a class="dropdown-item" href="#">Log Out</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Profile and Navigation Section -->
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3">
          <div class="card shadow-sm mb-4 text-center">
            <div class="card-body">
              <img
                :src="user.profilePicture"
                alt="Profile Picture"
                class="rounded-circle mb-3"
                style="width: 120px; height: 120px; object-fit: cover;"
              />
              <h5 class="card-title">{{ user.name }}</h5>
              <p class="card-text text-muted">
                <i class="bi-calendar-date"></i> {{ user.dob }}
              </p>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <ul class="list-group list-group-flush">
              <li
                v-for="(item, index) in menuItems"
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ active: activeMenu === item.name }"
                @click="activeMenu = item.name"
              >
                <i :class="item.icon + ' me-2'"></i> {{ item.label }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi-person-circle me-2"></i> MY PROFILE DETAILS</h5>
              <button class="btn btn-danger" @click="reloadProfile">RELOAD</button>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3" v-for="(value, key) in userProfile" :key="key">
                  <label class="form-label">{{ key }}:</label>
                  <input type="text" class="form-control" :value="value" readonly />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// User Information
const user = ref({
  name: 'Solomon Chowere',
  dob: '1999-12-31',
  email: 'chowere@gmail.com',
  profilePicture: 'https://via.placeholder.com/150'
})

// Menu Items
const menuItems = ref([
  { name: 'profile', label: 'MY PROFILE', icon: 'bi-person' },
  { name: 'changePassword', label: 'CHANGE PASSWORD', icon: 'bi-key' },
  { name: 'applicationHistory', label: 'APPLICATION HISTORY', icon: 'bi-file-earmark-text' },
  { name: 'admissionHistory', label: 'ADMISSION HISTORY', icon: 'bi-archive' },
  { name: 'logout', label: 'LOG OUT', icon: 'bi-box-arrow-right' }
])

// Active Menu State
const activeMenu = ref('profile')

// Profile Information
const userProfile = ref({
  Surname: 'CHOWERE',
  'Other Names': 'Solomon',
  Gender: 'Male',
  Nationality: 'UGANDAN',
  Email: 'chowere@gmail.com',
  'Phone Number': '256709112694',
  'Date of Birth': '1999-12-31',
  'Last Log in': '2024-08-29T06:25:43.000Z'
})

// Reload Profile Function
const reloadProfile = () => {
  // Simulate reloading data
  console.log('Profile reloaded')
}
</script>

<!-- Styles (Optional) -->
<style scoped>
.student-portal {
  padding-top: 20px;
}

.card-header {
  background-color: #f8f9fa !important;
}

.list-group-item.active {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.list-group-item-action:hover {
  background-color: #f1f1f1;
}

.btn {
  border-radius: 20px;
}
</style>
