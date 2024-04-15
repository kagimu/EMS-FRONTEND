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
  
  <script setup>
    import { defineEmits } from "vue";
    
    const emit = defineEmits();
  
    const goBack = () => {
      // You can implement your logic here to navigate back to the previous page
      emit("goBack");
    };
  </script>
  
  <style scoped>
    /* Add your custom styles here */
  </style>
  