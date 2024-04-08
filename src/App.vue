<template>
  <div class="app container-fluid">
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


*{
  scrollbar-width: thin;
  scrollbar-color: #cdcdcd #f0f0f0;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #f0f0f0;
}

*::-webkit-scrollbar-thumb {
  background-color: #cdcdcd;
  /*background: linear-gradient(to top, #33ccff 0%, #cc00ff 100%)*/
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
