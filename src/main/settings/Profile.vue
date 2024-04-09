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
            <h5 class="card-title">{{ name }}</h5>
            <p class="card-text">{{ email }}</p>
            <p class="card-text">{{ username }}</p>
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
            <!-- <ul class="list-group">
              <li class="list-group-item">Username: {{ user.username }}</li>
              <li class="list-group-item">Location: {{ user.location }}</li>
              <li class="list-group-item">Joined: {{ user.joined }}</li>
            </ul> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {useAuthStore} from "@/main/auth/store/auth.js";
const authStore = useAuthStore()

const name = ref(null)
const email = ref(null)
const role = ref(null)
const username = ref(null)
let p = authStore.profile

name.value = p.first_name+" "+p.second_name+" "+p.last_name
email.value = p.email
role.value = p.role
username.value = p.email

const  user = reactive( {
          name: '',
          username: '',
          email: '',
          avatar: 'https://via.placeholder.com/150',
          location: '',
          Role: 'Admin',
          joined: ''
        } )



</script>
