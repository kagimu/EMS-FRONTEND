<script setup>
import VictoriousLogo from "@/assets/images/victorious-logo.png";
let logoUrl = localStorage.getItem("logo")


</script>
<template>
 <div>
    <div class="row" style="margin-top: 120px;margin-bottom: 80px;">
      <div class="col-lg-3"></div>
      <div class="col-lg-6">
        <div class="align-centre mt-2 h6 font500 text-uppercase mb-2">

          <img alt="logo" style="width: 100px; margin: 0 auto" :src="logoUrl"/>
          <div class="text-[#2c2f8c] text-center text-[20px]">
            Victorious Education Services
          </div>

          <div class="text-[#0b5dd7cc] text-[14px] text-center mt-3 mb-5">APPLICATION GUIDELINES</div>


          </div>

        <div class="card">
          <div class="card-body">



      <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Getting Started
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <h1>How to get Started</h1>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Creating Your Account
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Activate  your Account
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Login to your Account
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Fill the Application Form
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
       Track Your Application Status
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>
</div>

          </div>
        </div>
       
        <div class="mt-5 mb-2 text-center">
          <router-link class="d-inline text-sm2 font500 text-white text-uppercase btn btn-sm btn-primary" :to="{name:'login'}"  style="font-size: 12px !important;font-weight: 500px;"><i class="bi bi-pencil-square"></i>&nbsp;BACK TO LOGIN PAGE</router-link></div>
      </div>
      <div class="col-lg-3"></div>
    </div>
  </div>

</template>


<style>

</style>