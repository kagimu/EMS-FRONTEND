<template>
  <div style="height: 400px;">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>

import Chart from 'chart.js/auto';
import {onMounted, reactive, ref} from "vue";

const chartCanvas = ref(null);
const chartData = reactive({
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
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
      text: 'My Doughnut Chart'
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
