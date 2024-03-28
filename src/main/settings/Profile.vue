<template>
<div id="app">
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-4">
        <!-- User Profile Card -->
        <div class="card">
          <div class="card-header">
            User Info
          </div>
          <div class="card-body">
            <img :src="user.avatar" class="rounded-circle img-fluid mb-3" alt="User Avatar">
            <h5 class="card-title">{{ user.name }}</h5>
            <p class="card-text">{{ user.email }}</p>
            <p class="card-text">{{ user.Role }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <!-- User Details -->
        <div class="card">
          <div class="card-header">
            User Details
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item">Username: {{ user.username }}</li>
              <li class="list-group-item">Location: {{ user.location }}</li>
              <li class="list-group-item">Joined: {{ user.joined }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import {reactive, ref} from "vue";
const  user = reactive( {
          name: 'Collins Mpiima',
          username: 'collins',
          email: 'collinsmpiima@gmail.com',
          avatar: 'https://via.placeholder.com/150',
          location: 'Kampala Uganda',
          Role: 'Admin',
          joined: 'January 1, 2022'
        } )
</script>
