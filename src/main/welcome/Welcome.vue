<template>
 <div class="row">
  <div class="col-lg-2"></div>
  <div class="col-lg-8" style="height:300px;margin-top: -20px;" >
 <div class="center">
  <p><i>Welcome to Wholesome Ed</i></p>
  <h1  style="padding:10px;font-size:45px;;">Begin your Online Enrollment<br> Today !</h1>
<p>Get started in just 3 easy steps </p>
  </div>
  </div>
  <div class="col-lg-2"></div>
</div>
<div class="row"  style="background-color: white;border-top: 1px solid white; height: 300px;padding:60px;">
  <div class="row" >

  <div class="col-sm-4" >
    <router-link class="nav-item nav-link" :to="{name:'register'}"> 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Register</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
    </router-link>
  </div>
  <div class="col-sm-4">
    <router-link class="nav-item nav-link" :to="{name:'login'}"> 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Activate Account</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
    </router-link>
  </div>
  <div class="col-sm-4">
    <router-link class="nav-item nav-link" :to="{name:'application'}"> 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Apply</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
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

</style>

<script setup>

</script>
