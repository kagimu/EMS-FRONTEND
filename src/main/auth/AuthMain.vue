<template>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container-fluid">
        <router-link :to="{name:'welcome'}" class="navbar-brand" style="margin-left:20px;font-size:17px; font-weight:400">Wholesome ED
</router-link>
        <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar navbar-collapse" id="navbarCollapse">
        <div class="navbar-nav">
        </div>
        <div class="navbar-nav">
          <router-link class="nav-item nav-link" :to="{name:'welcome'}"> 
            <i class="bi bi-house"></i> &nbsp;Home </router-link> 
          <!-- <router-link class="nav-item nav-link" :to="{name:'application'}"> 
          <i class="bi bi-arrow-right-circle"></i> &nbsp;Apply </router-link>  -->
          <router-link class="nav-item nav-link" :to="{name:'login'}"><i class="bi bi-box-arrow-in-right"></i>&nbsp; Login</router-link>
          <router-link class="nav-item nav-link" :to="{name:'register'}"><i class="bi bi-person"></i> &nbsp; Register </router-link>
        </div>
      </div>
      </div>
    </nav>
    <div class="container-fluid" style="margin-top:20px;">
      <router-view></router-view>
    </div>
</template>

<script>
export default {
name: "AuthMain"
}
</script>

<style scoped>
.navbar-expand-lg .navbar-nav .nav-link{
  color:white;
}
.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  padding: 0px !important; }
  .bg-primary{
    background-color: rgb(13, 86, 195) !important;
  }
  .navbar{
    padding: 0px;;
  }
  
</style>