<template>
<!--  <div style="height: 400px;display: flex; justify-content: center;">-->
  <canvas ref="chartCanvas"></canvas>
<!--</div>-->
</template>

<script setup>
import Chart from 'chart.js/auto';
import {onMounted, reactive, ref} from "vue";

const chartCanvas = ref(null);
const chartData = reactive(
    {
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
}
);

const chartOptions = reactive({
  responsive: true,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
      }
    },
    y: {
      display: true,
      beginAtZero: true,
      title: {
        display: true,
      }
    }
  }
});

onMounted(() => {
  const canvas = chartCanvas.value;
  const context = canvas.getContext('2d');
  const container = canvas.parentNode;

  canvas.width = container.clientWidth;
  const chart = new Chart(context, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
});

</script>

<style scoped>



</style>