<template>
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
        <h5 class="card-title text-gray"><b>Apply</b></h5>
        <p class="card-text text-gray">With supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
    </router-link>
  </div>
  
</div>




</div>
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
</style>

<script setup>

</script>
