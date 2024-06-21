<script setup>
import { defineEmits } from "vue";
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

const page = ref(1)
const per_page = ref(15)

onMounted(() => {

    }
)

const emit = defineEmits();

const goBack = () => {
  emit("goBack");
}
// router.push('/applications')
</script>
<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body text-center">
                <img src="data:yDbstqofM">
              <h1 class="mb-4">Success!</h1>
              <p>Your Application hasbeen submitted successfully.</p>
              <button @click="goBack" class="btn btn-primary mt-3">Go Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
    
  <style scoped>
  </style>
  