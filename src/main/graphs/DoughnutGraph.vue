<template>
  <div style="height: 450px;display: flex; justify-content: center;">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>

import Chart from 'chart.js/auto';
import {onMounted, reactive, ref} from "vue";

const chartCanvas = ref(null);
const chartData = reactive({
  labels: ["Primary", "Secondary", "Tertiary"],
  datasets: [{
    // label: 'My First Dataset',
    data: [1000, 500, 150],
    backgroundColor: ["#04a3f5", "green", "#98d1ee"],
    hoverOffset: 10
  }]
});
const chartOptions = reactive({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      // text: 'My Doughnut Chart'
    }
  }
});

onMounted(() => {
  const chart = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: chartData,
    options: chartOptions
  });
});

/*
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import {ref} from "vue";


ChartJS.register(ArcElement, Tooltip, Legend)

 const data = ref({
   labels: ["Primary", "Secondary", "Tertiary"],
   datasets: [
     {
       borderWidth: 1,
       borderColor: [],
       backgroundColor: ["#04a3f5", "green", "#98d1ee"],
       data: [1000, 500, 150]
     }
   ]
 })

 const options = ref({
   legend: {
     display: true
   },
   responsive: true,
   maintainAspectRatio: false
 })

*/


</script>
