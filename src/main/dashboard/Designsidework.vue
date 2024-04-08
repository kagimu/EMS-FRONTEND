<template>
  <div>
    <p class="ml-4 mt-4 mb-10" style="text-align: center !important;">PREVIOUS SCHOOL RESULTS</p>
  </div>
  <div class="container mt-0">
    <form @submit.prevent="addSchoolResults">
      <div style="background-color: #f8f9fa;">
        <div class="row">
          <div class="col-lg-2"></div>
          <div class="col-lg-8">
            <table>
              <tr v-for="(subject, index) in formData.subjects" :key="index">
                <td>
                  <select v-model="subject.subjectName" class="form-select form-select-sm">
                    <option v-for="option in subjectOptions" :key="option">{{ option }}</option>
                  </select>
                </td>
                <td>
                  <input v-model="subject.grade" type="number" class="form-control">
                </td>
                <td>
                  <button @click="removeSubject(index)" class="btn btn-danger btn-sm"><i class="bi bi-x"></i></button>
                </td>
              </tr>
            </table>
            <button @click="addSubject" class="btn btn-primary mb-2 btn-sm" style="color:white !important"><i class="bi bi-plus"></i></button>
            <p class="mt-3">
              <label class="textColor">Attach Latest School Report</label>
              <input type="file" class="form-control">
            </p>
          </div>
          <div class="col-lg-2"></div>
        </div>
        <div class="row">
          <div class="col-lg-2"></div>
          <div class="col-lg-8">
          </div>
          <div class="col-lg-2">
            <button :disabled="!isFormValid" class="btn btn-primary mb-2 btn-sm" style="color:white !important">Submit</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmits } from 'vue';

const emit = defineEmits();

const formData = reactive({
  subjects: [{ subjectName: '', grade: '' }] // Initial subject
});

const subjectOptions = ['Mathematics', 'SST', 'Luganda']; // Sample data for dropdown options

const addSubject = () => {
  formData.subjects.push({ subjectName: '', grade: '' }); // Add new subject
};

const removeSubject = (index) => {
  formData.subjects.splice(index, 1); // Remove subject
};

const addSchoolResults = () => {
  // Handle form submission
};

const isFormValid = ref(false); // Validation flag, implement your validation logic here
</script>

<style scoped>
/* Your scoped styles here */
</style>
