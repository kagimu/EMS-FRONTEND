<script setup>
import {reactive, ref} from "vue";
import {useAuthStore} from "@/main/auth/store/auth.js";
const authStore = useAuthStore()

const name = ref(null)
const email = ref(null)
const role = ref(null)
const username = ref(null)
let profile = authStore.profile

name.value = profile?.first_name+" "+profile?.second_name+" "+profile?.last_name


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

<template>
<div id="app">
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-4">
        <!-- User Profile Card -->
        <div class="border rounded-lg mb-10 p-3">

          <div>

            <div class="text-center">
              <i class="bi-person-circle text-[100px] text-[#8a8888]"></i>
            </div>

<!--            <img :src="user.avatar" class="rounded-circle img-fluid mb-3" alt="User Avatar">-->
            <div class="text-[#8a8888] text-sm mb-[10px]"><i class="bi-person-circle mr-2"></i>{{ name }}</div>
            <div class="text-[#8a8888] text-sm mb-[10px]"><i class="bi-person-badge mr-2"></i>{{ profile?.type }}</div>
            <div class="text-[#8a8888] text-sm mb-[10px]"><i :class="(profile?.gender==='Male')?'bi-gender-male mr-2':'bi-gender-female'"></i>{{ profile?.gender }}</div>
            <div class="text-[#8a8888] text-sm mb-[10px]"><i class="bi-envelope mr-2"></i>{{ profile?.contacts?.[0].contact }}</div>
            <div class="text-[#8a8888] text-sm mb-[10px]"><i class="bi-telephone mr-2"></i>{{ profile?.contacts?.[1].contact }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <!-- User Details -->
<!--        <div class="card">
          <div class="card-header">
            User Details
          </div>
          <div class="card-body">
            &lt;!&ndash; <ul class="list-group">
              <li class="list-group-item">Username: {{ user.username }}</li>
              <li class="list-group-item">Location: {{ user.location }}</li>
              <li class="list-group-item">Joined: {{ user.joined }}</li>
            </ul> &ndash;&gt;
          </div>
        </div>-->
      </div>
    </div>
  </div>
</div>
</template>


