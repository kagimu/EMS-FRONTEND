<template>
  <div style="height: 400px;">
    <Doughnut :data="data" :options="options" />
  </div>
</template>

<script setup>
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



</script>
