<template>



 <div>
 Home
 </div>

</template>

<script setup>
import { ref } from 'vue'
import {useAuthStore} from "@/store/auth.js";

const authStore = useAuthStore()

const userProfile = ref(null)
const token = ref(null)
userProfile.value = authStore.profile
token.value = authStore.token


defineProps({
  msg: String,
})

const count = ref(0)
</script>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
