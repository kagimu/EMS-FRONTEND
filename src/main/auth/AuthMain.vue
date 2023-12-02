<template>
 <!-- Navbar start -->
 <div class="container-fluid sticky-top px-0">
            <div class="container-fluid bg-light">
                <div class="container px-0">
                    <nav class="navbar navbar-light navbar-expand-xl">
                      <div class="container-xl">
    <a class="navbar-brand" href="#">
      <img src="logo.svg" class="h-8" alt="Logo">
    </a>
      <div class="d-flex align-items-lg-center mt-3 mt-lg-0">
        <div class="row">
          <div class="col-lg-5" >
            <router-link class="btn btn-outline-danger" :to="{name:'application'}"> Application </router-link>
          </div>
          <div class="col-lg-3">
          <router-link class="btn btn-sm btn-primary w-full w-lg-auto" :to="{name:'login'}"> Login </router-link>
          </div>
          <div class="col-lg-4">
          <router-link class="btn btn-sm btn-primary w-full w-lg-auto" :to="{name:'register'}"> Register </router-link>
          </div>
        </div>
      </div>
    </div>
                    </nav>
                </div>
            </div>
        </div>
        <!-- Navbar End -->

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