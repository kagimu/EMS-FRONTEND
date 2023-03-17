<template>
  <div style="height: 400px; width: 100%; display: flex; justify-content: center;">

    <canvas style="padding: 0; width: auto;" ref="chartCanvas"></canvas>

  </div>
</template>

<script setup>
import Chart from 'chart.js/auto';
import {onMounted, reactive, ref} from "vue";

const chartCanvas = ref(null);
const chartData = reactive({
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "December",
    "December"
  ],
  datasets: [{
    label: 'Sales',
    data: [
      700,
      410,
      3342,
      6050,
      2522,
      131,
      3157,
      795,
      481,
      1500,
      2900,
      3400,
      340,
      3700,
    ],
    fill: false,
    borderColor: "#2554FF",
    backgroundColor: "#2554FF",
    borderWidth: 1
  }]
});
const chartOptions = reactive({
  scales: {
    y: {
      beginAtZero: true
    }
  }
});

onMounted(() => {
  const chart = new Chart(chartCanvas.value, {
    type: 'line',
    data: chartData,
    options: chartOptions
  });
});


/*

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import {ref} from "vue";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)



 const data = ref({
   labels: [
     "January",
     "February",
     "March",
     "April",
     "May",
     "June",
     "July",
     "August",
     "September",
     "October",
     "November",
     "December"
   ],
   datasets: [
     {
       label: "primary",
       data: [
         700,
         4150,
         3342,
         6050,
         2522,
         13241,
         3157,
         795,
         4841,
         1500,
         2900,
         3400
       ],
       fill: false,
       borderColor: "#2554FF",
       backgroundColor: "#2554FF",
       borderWidth: 1
     },
     {
       label: "Secondary",
       data: [
         100,
         910,
         342,
         650,
         2522,
         241,
         157,
         15,
         9841,
         5000,
         900,
         400
       ],
       fill: false,
       borderColor: "green",
       backgroundColor: "green",
       borderWidth: 1
     }
   ]
 })

 const options = ref({
       tooltips: {
         mode: "index",
         axis: "y"
       },
       scales: {
         yAxes: [
           {
             ticks: {
               beginAtZero: true
             },
             gridLines: {
               display: true
             }
           }
         ],
         xAxes: [
           {
             gridLines: {
               display: false
             }
           }
         ]
       },
       legend: {
         display: true
       },
       responsive: true,
       maintainAspectRatio: false
     })

*/


</script>
