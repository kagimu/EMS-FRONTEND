<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-0 py-3">
  <div class="container-xl">
    <a class="navbar-brand" href="#">
      <img src="https://preview.webpixels.io/web/img/logos/clever-light.svg" class="h-8" alt="...">
    </a>
      <div class="d-flex align-items-lg-center mt-3 mt-lg-0">
        <router-link class="btn btn-sm btn-primary w-full w-lg-auto" :to="{name:'application'}"> Application </router-link>
       | &nbsp;<router-link class="btn btn-sm btn-primary w-full w-lg-auto" :to="{name:'login'}"> Login </router-link>| 
       | &nbsp;<router-link class="btn btn-sm btn-primary w-full w-lg-auto" :to="{name:'register'}"> Register </router-link>
      </div>
    </div>
</nav>

<div class="p-20 bg-surface-secondary">
  <div class="mb-8 text-center">
    <router-view></router-view>
  </div>
</div>
  <div>
  </div>
</template>

<script>
export default {
  name: "AuthMain"
}
</script>

<style scoped>

</style>