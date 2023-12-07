<template>
  <div class="app container-fluid">
    <notifications position="bottom right" />
    <router-view :key="$route.fullPath"></router-view>

    <footer class="footer">
    <div class="d-flex flex-column flex-sm-row justify-content-between py-2 my-0 mx-0 border-top">
      <p>© 2023 WholeSome Ed, All rights reserved.</p>
      <ul class="list-unstyled d-flex">
        <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#twitter"></use></svg></a></li>
        <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg></a></li>
        <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#facebook"></use></svg></a></li>
      </ul>
    </div>
  </footer>
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
.footer {
   position: absolute !important;
   left: 0  !important;;
   bottom: 0  !important;;
   width: 100%  !important;;
   background-color:  rgb(13, 86, 195) !important;
   color: white;
   text-align: center;
   padding-left: 10px;
}
</style>
