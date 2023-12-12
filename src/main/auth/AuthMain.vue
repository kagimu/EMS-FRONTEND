<template>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container-fluid">
        <router-link :to="{name:'welcome'}" class="navbar-brand" style="margin-left:20px;font-size:19px; font-weight:400">Wholesome ED
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
          <router-link class="nav-item nav-link" :to="{name:'application'}"> 
          <i class="bi bi-arrow-right-circle"></i> &nbsp;Apply </router-link> 
          <router-link class="nav-item nav-link" :to="{name:'login'}"><i class="bi bi-box-arrow-in-right"></i>&nbsp; Login</router-link>
          <router-link class="nav-item nav-link" :to="{name:'register'}"><i class="bi bi-person"></i> &nbsp; Register </router-link>
        </div>
      </div>
      </div>
    </nav>
    <div class="container-fluid" style="margin-top:20px;">
      <router-view></router-view>
    </div>
    <footer class="footer">
    <div class="d-flex flex-column flex-sm-row justify-content-between py-2 my-0 mx-0 border-top">
      <p style="font-size: 12px;">© 2023 WholeSome Ed, All rights reserved.</p>
      <ul class="list-unstyled d-flex">
        <li class="ms-3" ><a  style="text-decoration: none;color:white !important;" class="link-dark" href="#"><span style="color: rgb(215, 213, 213);">Powered by</span> <b>Hamsoft</b> </a></li>
        <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg></a></li>
        <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#facebook"></use></svg></a></li>
      </ul>
    </div>
  </footer>
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
  .footer {
   position: absolute !important;
   margin-top: 20px;
   left: 0  !important;;
   bottom: 0  !important;
   width: 100%  !important;;
   background-color:  rgb(13, 86, 195) !important;
   color: rgb(216, 214, 214);
   text-align: center;
   padding-left: 10px;
   font-size: 12px;
}
  
</style>