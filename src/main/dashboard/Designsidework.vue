<template>
  <div class="accordion">
    <div 
      v-for="(item, index) in data.content" 
      :key="item.number" 
      class="accordion-group"
    >
      <!-- Group Header -->

      <!-- <h3 class="group-title">
        {{ item.class }} - {{ item.stream }} (Teacher: {{ item.teacher }})
      </h3> -->

      <!-- Individual Steps as Accordion Panels -->
      <div
        v-for="(step, stepIndex) in item.steps"
        :key="`${item.number}-${stepIndex}`"
        class="accordion-item"
      >
        <!-- Accordion Header -->
        <button
          class="accordion-header"
          @click="togglePanel(`${item.number}-${stepIndex}`)"
        >
          <div class="header-info">
            <h4 class="text-xs">{{index+1}}. {{ step.name }}</h4>
            <span>{{ expandedPanel === `${item.number}-${stepIndex}` ? '▲' : '▼' }}</span>
          </div>
        </button>

        <!-- Accordion Content -->
        <div
          v-if="expandedPanel === `${item.number}-${stepIndex}`"
          class="accordion-body text-xs"
        >
          <p><strong>Concept:</strong> {{ step.concept }}</p>
          <p><strong>Topic:</strong> {{ step.topic }}</p>
          <p><strong>Sub-topic:</strong> {{ step.sub_topic }}</p>
          <p><strong>Date:</strong> {{ step.date }}</p>
          <p><strong>Comment:</strong> {{ step.comment || 'None' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Sample data
const data = {
  per_page: 20,
  page: 1,
  sort_column: "id",
  sort_direction: "desc",
  total_rows: 2,
  total_pages: 1,
  content: [
    {
      number: "fdbf6c28-920d-4cbe-91ab-77e4aff59ac6",
      steps: [
        {
          name: "Solving difficult equations",
          concept: "Drawing Halves And Quarters In A Whole",
          topic: "Activities in our community",
          subject: "",
          sub_topic: "Drawing halves and quarters in a whole",
          date: "11:01",
          time: "",
          comment: "None",
        },
      ],
      stream: "Agile",
      class: "Primary One",
      date: "2024-11-21 03:00:00 +0300 EAT",
      time: "11:01",
      teacher: "Collins MpiimaCollins",
      number_of_students: 0,
      comment: "",
      stream_number: "be4ecace-c135-4cb2-bb44-5878a6e6fc18",
      lesson_plan_step_number: null,
      teacher_number: "e20ee127-ffc6-486e-8e21-3dea4ec86ffd",
    },
    {
      number: "027375c1-059d-456b-891c-d145c41cb4a7",
      steps: [
        {
          name: "Old numbers",
          concept: "Drawing Halves And Quarters In A Whole",
          topic: "Activities in our community",
          subject: "",
          sub_topic: "Drawing halves and quarters in a whole",
          date: "11:11",
          time: "",
          comment: "Dozing\n",
        },
      ],
      stream: "Agile",
      class: "Primary One",
      date: "2024-11-21 03:00:00 +0300 EAT",
      time: "11:11",
      teacher: "Collins MpiimaCollins",
      number_of_students: 0,
      comment: "",
      stream_number: "be4ecace-c135-4cb2-bb44-5878a6e6fc18",
      lesson_plan_step_number: null,
      teacher_number: "e20ee127-ffc6-486e-8e21-3dea4ec86ffd",
    },
  ],
};

// State for tracking the expanded panel
const expandedPanel = ref(null);

// Function to toggle a panel
const togglePanel = (panelId) => {
  expandedPanel.value = expandedPanel.value === panelId ? null : panelId;
};
</script>

<style>
.accordion {
  margin: 20px;
}

.group-title {
  margin: 10px 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.accordion-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #f9f9f9;
  cursor: pointer;
  border: none;
  outline: none;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.accordion-body {
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}
</style>
