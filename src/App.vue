<template>
  <div class="app container-fluid p-0 m-0">
    <notifications position="bottom right" />
    <router-view :key="$route.fullPath"></router-view>


  </div>
 
</template>

<script setup>

</script>

<style scoped>
.app{
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100vh;
}
 




.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}

.noFocus {
  box-shadow: none !important
}

.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  padding:0px;
}


</style>
