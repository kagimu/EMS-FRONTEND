<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const isFullscreen = ref(false);

const toggleFullscreen = () => {
  const element = document.documentElement; // or use a specific element ref for a section
  if (!isFullscreen.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});
</script>

<template>
  <div>
    <!-- Fullscreen Toggle Button -->
    <button @click="toggleFullscreen">
      {{ isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
    </button>

    <!-- Your other component content -->
    <div>
      <!-- Rest of the template content -->
    </div>
  </div>
</template>

<style scoped>
/* Optional: style adjustments for fullscreen mode */
</style>
