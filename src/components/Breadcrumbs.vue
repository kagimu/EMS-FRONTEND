<script setup>

import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute();

const breadcrumbs = computed(() => {
  let matchedRoutes = route.matched;
  return matchedRoutes.map(route => ({
    path: route.path,
    breadcrumb: route.meta.breadcrumb,
    name: route.name
  }));
});
</script>

<template>
  <div>

{{breadcrumbs}}
    <nav aria-label="breadcrumb">
      <ol class="flex space-x-2">
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
          <!-- Links for all except the last breadcrumb -->


          <router-link
              v-if="index !== breadcrumbs.length - 1"
              :to="{name:crumb?.name}"
              class="text-blue-500 hover:underline"
          >
            {{ crumb?.name === "dashboard" ? "Home" : crumb?.name }}
          </router-link>

          <!-- Last breadcrumb without a link -->
          <span v-else class="text-gray-600">{{ crumb.name }}</span>

          <!-- Separator -->
          <span v-if="index !== breadcrumbs.length - 1" class="px-2 text-gray-400">/</span>
        </li>
      </ol>
    </nav>

  </div>
</template>

<style scoped>

</style>