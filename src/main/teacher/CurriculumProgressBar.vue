<template>
    <!-- {{ curriculums }} -->
    <div class="curriculum-progress">
      <div v-for="curriculum in curriculums" :key="curriculum.id" class="curriculum">
        <div class="curriculum-header">
          <h3 class="text-sm">{{ curriculum.curriculum }}</h3>
          <span>{{ curriculum.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :class="{ 'complete': curriculum.progress === 100 }"
            :style="{ width: curriculum.progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import {onMounted,reactive, ref, watch} from "vue";

  const curriculums = ref([]);

  const props = defineProps({
    progressInfoData: {},
   })
  
   onMounted(() => {
     doFetchCurriculumProgressInfo()
  })

  const doFetchCurriculumProgressInfo = () => {
    curriculums.value = props.progressInfoData
  }

  watch(
   () => props.progressInfoData,
   async (data) => {
   if (data) {
    doFetchCurriculumProgressInfo()
   }
   }
   )


//   const curriculums = ref([
//     { id: 1, name: 'Wholesome', completedPercentage: 100 },
//   ]);
  </script>
  
  <style scoped>
  .curriculum-progress {
    font-family: Arial, sans-serif;
    padding: 5px;
    max-width:100%;
    margin: auto;
    background: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .curriculum {
    margin-bottom: 1px;
  }
  
  .curriculum-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1px;
  }
  
  .progress-bar {
    width: 100%;
    height: 5px;
    background: #e0e0e0;
    border-radius: 3px;
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
  