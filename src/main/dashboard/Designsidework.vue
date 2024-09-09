<template>
{{subjectList}}
<div class="combo-box">

   <input
    @click="toggleDropdown"
      type="text"
      v-model="searchQuery"
      placeholder="Search and select..."
      class="form-control form-control-sm"
      @focus="openDropdown"
      @blur="closeDropdown"
    />
    
    <ul v-if="isOpen" class="dropdown-menu">
      <li
        v-for="(option, index) in filteredOptions"
        :key="index"
        @mousedown.prevent="selectOption(option)"
        class="dropdown-item"
      >
        {{ option.name }}
      </li>
    </ul>

    <button class="btn btn-primary mt-4" @click="submitSubjects">Submit Data</button>

    <!-- Display selected subjects -->
    <div v-if="subjects.length > 0">
      <p>Selected Subjects:</p>
      <ul>
        <li v-for="(subject, index) in subjects" :key="index">{{ subject }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed , reactive, defineEmits,onMounted,watch} from 'vue';
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
const subjectStore = useSubjectStore()
import useNotificationStore from "@/composables/useNotification.js";

const  notificationStore  = useNotificationStore()
const subjectList = ref([])
const option = ref([])

onMounted(
    async () => {
      filterSubjectList()
    } )


  const filterSubjectList = () => {
  subjectStore.fetchAllSubjects()
}



watch(
    () => subjectStore.subjectAllInfoResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
        option.value = subjectList.value
      }
    },
    {deep:true}
)



const searchQuery = ref('');
const isOpen = ref(false);
const selectedOption = ref(null);
const subjects = ref([]);  // Array to store selected subjects

const filteredOptions = computed(() => {
  if (!searchQuery.value) return options;
  return options.filter(option =>
    option.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectOption = (option) => {
  selectedOption.value = option;
  searchQuery.value = option.name;
  isOpen.value = false;

  // Add selected option to the subjects array if not already added
  if (!subjects.value.includes(option.name)) {
    subjects.value.push(option.name);
  }
};


const toggleDropdown = (event) => {
  if (event.target.closest('.dropdown-menu')) return;
  isOpen.value = !isOpen.value;
};

const openDropdown = () => {
  isOpen.value = true;
};

const closeDropdown = () => {
  setTimeout(() => {
    if (!document.activeElement.closest('.combo-box')) {
      isOpen.value = false;
    }
  }, 200);
};

document.addEventListener('click', (event) => {
  const comboBox = document.querySelector('.combo-box');
  if (!comboBox.contains(event.target)) {
    isOpen.value = false;
  }
});
</script>

<style scoped>
.combo-box {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.form-control {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.dropdown-menu {
  position: absolute;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: block;
}

.dropdown-item {
  padding: 8px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.selected-option {
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin: 4px 0;
}
</style>
