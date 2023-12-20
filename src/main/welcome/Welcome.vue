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
 <div class="row">
  <div class="col-lg-2"></div>
  <div class="col-lg-8" style="height:300px;margin-top: -20px;" >
 <div class="center">
  <p style="font-weight: 900px; font-size: 18px; word-spacing: 0.2em;"><i><marquee>
    Welcome to Wholesome Ed</marquee></i></p>
  <h1  style="padding:10px;font-size:45px;font-weight: 900px; word-spacing: -0.1em;">
    <b>Begin your Online Enrollment<br> Today !</b></h1>
<p>Get started in just 3 easy steps </p>
  </div>
  </div>
  <div class="col-lg-2"></div>
</div>
<div class="row"  style="background-color: white;border-top: 1px solid white; height: 350px;padding:60px;">
  <div class="row" >

  <div class="col-sm-4" >
    <router-link class="nav-item nav-link" :to="{name:'register'}"> 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title text-gray"><b>Register</b></h5>
        <p class="card-text text-gray">With supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
    </router-link>
  </div>
 
  <div class="col-sm-4">
    <router-link class="nav-item nav-link" :to="{name:'login'}"> 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title text-gray"><b>Activate Account</b></h5>
        <p class="card-text text-gray">With supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
    </router-link>
  </div>
  <div class="col-sm-4">
    <router-link class="nav-item nav-link" :to="{name:'application'}"> 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title text-gray"><b>Apply<hr class="hr"></b></h5>
        <p class="card-text text-gray">With supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
    </router-link>
  </div>
  
</div>
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



<style scoped>
.center {
  padding: 70px 0;
  /* border: 3px solid green; */
  text-align: center;
}
html, body {
  height: 100%;
}
/* .cd{
  padding:20px;
  width:300px;
  box-shadow: black;
} */
div.card {
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  height: 180px;
  padding-top: 15px;
}
.text-gray {
    --tw-text-opacity: 1;
    color: rgba(80, 80, 80, var(--tw-text-opacity));
}
.card-title{
  font-size: 1.25rem;

}
.hr{
  display: none;
  border-top:none;
  width: 150px;
 border-bottom: 2px solid rgb(0, 123, 255);
 border-left: none;
 border-right: none;
margin-left: 30%;
 margin-right: 30%;
}
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

<script setup>

</script>
