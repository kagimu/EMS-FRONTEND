<template>
  <div>
    <div v-for="(student, index) in students" :key="index">
      <input type="checkbox" v-model="selectedStudents[index]" class="checkbox-primary">
      <p>{{ student.name }} - {{ student.age }} years old - {{ student.phoneNumber }}</p>
    </div>
    <p>Selected Students: {{ selectedStudentNames }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const students = ref([
  { name: 'Collins', age: 12, phoneNumber: '07883939393' },
  { name: 'Mark', age: 4, phoneNumber: '0848448848' },
  { name: 'Alice', age: 10, phoneNumber: '0755555555' },
  { name: 'John', age: 8, phoneNumber: '0777777777' },
  { name: 'Emily', age: 6, phoneNumber: '0733333333' }
]);

const selectedStudents = ref([false, false, false, false, false]); // Initially no student is selected

const selectedStudentNames = computed(() => {
  const selectedNames = [];
  selectedStudents.value.forEach((isSelected, index) => {
    if (isSelected) {
      selectedNames.push(students.value[index].name);
    }
  });
  return selectedNames;
});
</script>
