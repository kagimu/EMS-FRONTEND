<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>


    <div class="grid grid-cols-2 gap-4">
      <div class="bg-gray-200 p-4">Item 1</div>
      <div class="bg-gray-200 p-4">Item 2</div>
      <div class="bg-gray-200 p-4">Item 3</div>
      <div class="bg-gray-200 p-4">Item 4</div>
    </div>


    <div>
      <h2 class="text-2xl font-bold text-blue-800 underline">
        how to start your project with tailwind css & Vue 3
      </h2>
    </div>

    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>

    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
