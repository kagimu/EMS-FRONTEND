<template>
    <div class="p-4 max-w-lg mx-auto">
      <h2 class="text-xl font-bold mb-4">{{ concept.concept_name }} </h2>
      <ul class="space-y-2">
        <li 
          v-for="step in concept.all_steps" 
          :key="step.number" 
          class="flex items-center p-2 border rounded-lg"
          :class="{'bg-green-100': isDelivered(step.number)}"
        >
          <span class="flex-1">{{ step.name }} ({{ step.number }})</span>
          <span v-if="isDelivered(step.number)" class="text-green-600 font-bold">✔</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const concept = ref({
    concept_name: "Number sense",
    concept_number: "acxs-sdfxc",
    steps_delivered: [
      { name: "Step 1", number: "abc1" },
      { name: "Step 3", number: "abc3" }
    ],
    all_steps: [
      { name: "Step 1", number: "abc1" },
      { name: "Step 2", number: "abc2" },
      { name: "Step 3", number: "abc3" },
      { name: "Step 4", number: "abc4" }
    ]
  });
  
  const isDelivered = (stepNumber) => {
    return concept.value.steps_delivered.some(step => step.number === stepNumber);
  };
  </script>
  
  <style scoped>
  </style>
  