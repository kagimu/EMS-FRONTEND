<template>
  <div class="curriculum-progress">
    <div v-for="curriculum in curriculums" :key="curriculum.id" class="curriculum">
      <div class="curriculum-header">
        <h3 class="text-sm">{{ curriculum.name }}</h3>
        <span>{{ curriculum.completedPercentage }}%</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :class="{ 'complete': curriculum.completedPercentage === 100 }"
          :style="{ width: curriculum.completedPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const curriculums = ref([
  { id: 1, name: 'Wholesome', completedPercentage: 100 },
  { id: 2, name: 'Daycare Curriculum', completedPercentage: 40 },
  { id: 3, name: 'P.1- P.3 Thematic Curriculum', completedPercentage: 90 },
  { id: 4, name: 'Early Childhood Learning Framework', completedPercentage: 20 },
]);
</script>

<style scoped>
.curriculum-progress {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.curriculum {
  margin-bottom: 20px;
}

.curriculum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease;
}

.progress-fill.complete {
  background: #2196f3; /* Blue color for 100% completion */
}
</style>
