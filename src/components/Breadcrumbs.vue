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
    <nav aria-label="breadcrumb">
      <div class="flex">
        <div v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center text-[13px]">

          <router-link
              v-if="index !== breadcrumbs.length - 1"
              :to="{name:crumb?.name}"
              class="text-gray-600 hover:underline no-underline"
          >
           <div> {{ crumb?.name === "dashboard" ? "Home" : crumb?.name }}</div>
          </router-link>

          <!-- Last breadcrumb without a link -->
          <span v-else class="text-gray-600 capitalize">{{ crumb.name.toString().replace(/-/g, " ") }}</span>

          <!-- Separator -->
          <span v-if="index !== breadcrumbs.length - 1" class="px-2 text-gray-600">/</span>
        </div>
      </div>
    </nav>

  </div>
</template>

<style scoped>

</style>