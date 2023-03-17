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
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2, 3, 10],
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
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
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
});
/*
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {ref} from "vue";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


const chartData = ref({
  labels: [
    "2015-01",
    "2015-02",
    "2015-03",
    "2015-04",
    "2015-05",
    "2015-06",
    "2015-07",
    "2015-08",
    "2015-09",
    "2015-10",
    "2015-11",
    "2015-12",
    "2015-12",
    "2015-12",
    "2015-12",
    "2015-12",
    "2015-12"
  ],
  datasets: [
    {
      label: "Primary",
      borderWidth: 1,
      backgroundColor: [
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1",
        "#0276b1"
      ],
      borderColor: [],
      pointBorderColor: "#2554FF",
      data: [12, 19, 3, 5, 2, 60, 20, 30, 5, 6, 2, 10, 30, 23, 12, 8, 90]
    },
    {
      label: "Secondary",
      borderWidth: 1,
      backgroundColor: [
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green",
        "green"
      ],
      borderColor: [],
      pointBorderColor: "green",
      data: [12, 19, 1, 5, 2, 60, 20, 30, 5, 6, 2, 10, 30, 23, 12, 8, 10]
    }
  ]
})

const chartOptions = ref({
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

<style scoped>

</style>