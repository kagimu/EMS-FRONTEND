<template>
  <div>
    <div class="accordion maximize-minize" :class="{ fullscreen: isMaximized }">
      <div>
        <button class="btn btn-primary" @click="toggleMaximize">
          {{ isMaximized ? "Minimize" : "Maximize" }} this section
        </button>
      </div>
      <div class="content">
        <p>
          This is some content inside the section that will be maximized or
          minimized. You can include your dynamic content here.
        </p>
        <div
          v-for="(item, index) in data.content"
          :key="item.number"
          class="accordion-group"
        >
          <div
            v-for="(step, stepIndex) in item.steps"
            :key="`${item.number}-${stepIndex}`"
            class="accordion-item"
          >
            <button
              class="accordion-header"
              @click="togglePanel(`${item.number}-${stepIndex}`)"
            >
              <div class="header-info">
                <h4 class="text-xs">{{ index + 1 }}. {{ step.name }}</h4>
                <span>
                  {{ expandedPanel === `${item.number}-${stepIndex}`
                    ? "▲"
                    : "▼" }}
                </span>
              </div>
            </button>
            <div
              v-if="expandedPanel === `${item.number}-${stepIndex}`"
              class="accordion-body text-xs"
            >
              <p><strong>Concept:</strong> {{ step.concept }}</p>
              <p><strong>Topic:</strong> {{ step.topic }}</p>
              <p><strong>Sub-topic:</strong> {{ step.sub_topic }}</p>
              <p><strong>Date:</strong> {{ step.date }}</p>
              <p><strong>Comment:</strong> {{ step.comment || "None" }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Mock data
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
    },
  ],
};

// Track the expanded panel
const expandedPanel = ref(null);

// Track maximize/minimize state
const isMaximized = ref(false);

const togglePanel = (panelId) => {
  expandedPanel.value = expandedPanel.value === panelId ? null : panelId;
};

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;
};
</script>

<style>
.accordion {
  margin: 20px;
  transition: all 0.3s ease-in-out;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  margin: 0;
  padding: 20px;
  background: white;
  border-radius: 0;
  overflow-y: auto;
}

.content {
  padding: 10px;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #eaeaea;
  cursor: pointer;
  border: none;
  outline: none;
}

.accordion-body {
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}
</style>
