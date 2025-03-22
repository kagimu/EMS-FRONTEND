<template>
  <div class="accordion" id="topicsAccordion">
    <div v-for="(dt, idx) in lessonsDataList" :key="idx" class="accordion-item">
      <h2 class="accordion-header">
        <button 
          class="accordion-button" 
          type="button" 
          data-bs-toggle="collapse" 
          :data-bs-target="'#topic-' + dt.number"
          :aria-controls="'topic-' + dt.number"
          :class="{ 'collapsed': idx !== 0 }">
          {{ dt.topic || "No Topic Available" }}
        </button>
      </h2>
      <div 
        :id="'topic-' + dt.number" 
        class="accordion-collapse collapse"
        :class="{ 'show': idx === 0 }"
        data-bs-parent="#topicsAccordion">
        <div class="accordion-body">
          <p><strong>Concept:</strong> {{ dt.concept || "No Concept Provided" }}</p>
          <p><strong>Sub-Topic:</strong> {{ dt.sub_topic || "N/A" }}</p>
          <p><strong>Time:</strong> {{ dt.time }}</p>
          <p><strong>Comment:</strong> {{ dt.comment || "No Comments" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// ✅ Your Data Sample
const lessonsDataList = ref([
  {
    number: "972eb62e-ac77-430e-aab6-d4ae0178c490",
    name: "step two",
    concept: "External Parts of the Human Body.",
    topic: "Introduce the Human Body",
    subject: "",
    sub_topic: "Growing in the Body",
    date: "2024-11-22 03:00:00 +0300 EAT",
    time: "22:22",
    comment: "",
  },
  {
    number: "4b1d6bab-d6d2-4a32-b545-d1f9063f0a30",
    name: "step one",
    concept: "Become aware that we grow little by little.",
    topic: "Introduce the Human Body",
    subject: "",
    sub_topic: "Growing in the Body",
    date: "2024-11-22 03:00:00 +0300 EAT",
    time: "22:22",
    comment: "",
  },
  {
    number: "17fa477c-fe17-4e89-9c33-adb421cb0454",
    name: "",
    concept: "",
    topic: "",
    subject: "",
    sub_topic: "",
    date: "2024-11-22 03:00:00 +0300 EAT",
    time: "12:02",
    comment: "none",
  },
  {
    number: "6b8ca664-8f27-4f4b-b485-31136059a9d2",
    name: "",
    concept: "",
    topic: "",
    subject: "",
    sub_topic: "",
    date: "2024-11-22 03:00:00 +0300 EAT",
    time: "11:11",
    comment: "ass",
  },
  {
    number: "4d0e5d90-4936-4630-a642-a2abb18bc714",
    name: "",
    concept: "",
    topic: "",
    subject: "",
    sub_topic: "",
    date: "2024-11-22 03:00:00 +0300 EAT",
    time: "11:01",
    comment: "None",
  },
  {
    number: "b3795077-3760-436e-9e0c-5fd285d61f89",
    name: "",
    concept: "",
    topic: "",
    subject: "",
    sub_topic: "",
    date: "2024-11-22 03:00:00 +0300 EAT",
    time: "11:11",
    comment: "Dozing",
  },
]);
</script>
