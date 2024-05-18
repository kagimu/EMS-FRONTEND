<template>
  <div>
    <div class="text-sm">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container-fluid">
          <router-link
              :to="{name:'welcome'}"
              class="text-white no-underline ml-5 text-[16px]">
            Wholesome ED
          </router-link>
          <button class="navbar-toggler" data-bs-target="#navbarCollapse" data-bs-toggle="collapse" type="button">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div id="navbarCollapse" class="navbar navbar-collapse">
            <div class="navbar-nav">
            </div>
            <div class="flex py-2">
              <router-link :to="{name:'welcome'}" class="mr-3 no-underline text-white"><i class="bi bi-house mr-2"></i>Home </router-link>
              <router-link :to="{name:'application'}" class="mr-3 no-underline text-white"><i class="bi bi-arrow-right-circle mr-2"></i>Apply </router-link>
              <router-link :to="{name:'login'}" class="mr-3 no-underline text-white"><i class="bi bi-box-arrow-in-right mr-2"></i> Login</router-link>
              <router-link :to="{name:'register'}" class="mr-3 no-underline text-white"><i class="bi bi-person mr-2"></i>Register </router-link>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <div class="row">
      <div class="col-lg-2"></div>
      <div class="col-lg-8" style="height:300px;margin-top: -20px;" >
        <div class="text-center mt-5">

          <h1  style="padding:10px;font-size:45px;font-weight: 900px; word-spacing: -0.1em;">
            <b>Begin your Online Enrollment<br> Today !</b></h1>
          <p>Get started in just 3 easy steps </p>
        </div>
      </div>
      <div class="col-lg-2"></div>
    </div>

    <div class="bg-white py-10">
      <div class="w-[70%] mx-auto">
        <div class="grid grid-cols-3 gap-4">

          <div>
            <router-link :to="{name:'register'}" class="nav-item nav-link">
              <div class="mx-auto bg-white border rounded-lg text-center py-3" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
                <div>
                  <div class="pb-2 text-gray-500"><b>Register</b></div>

                  <div class="text-gray py-4 px-3 text-gray-500 border-t border-b">
                    With supporting text below as a natural lead-in to additional content.
                  </div>
                  <div class="text-gray-500 mt-2"><b>More</b></div>
                </div>
              </div>
            </router-link>
          </div>


          <div>
            <router-link :to="{name:'login'}" class="nav-item nav-link">
              <div class="mx-auto bg-white border rounded-lg text-center py-3" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
                <div>
                  <div class="pb-2 text-gray-500"><b>Activate Account</b></div>

                  <div class="text-gray py-4 px-3 text-gray-500 border-t border-b">
                    With supporting text below as a natural lead-in to additional content.
                  </div>
                  <div class="text-gray-500 mt-2"><b>More</b></div>
                </div>
              </div>
            </router-link>
          </div>


          <div>
            <router-link :to="{name:'application-guide'}" class="nav-item nav-link">
              <div class="mx-auto bg-white border rounded-lg text-center py-3" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
                <div>
                  <div class="pb-2 text-gray-500"><b>Apply</b></div>

                  <div class="text-gray py-4 px-3 text-gray-500 border-t border-b">
                    With supporting text below as a natural lead-in to additional content.
                  </div>
                  <div class="text-gray-500 mt-2"><b>More</b></div>
                </div>
              </div>
            </router-link>
          </div>


        </div>
      </div>
    </div>



    <footer class="absolute bottom-0 left-0 w-screen bg-[#0d56c3] py-0">
      <div class="flex justify-between px-3 py-1">
        <div class="text-white text-sm"><small>© 2023 WholeSome Ed, All rights reserved.</small></div>
        <a  class="text-white no-underline text-sm" href="#"><small><span>Powered by</span> <b>Hamsoft</b></small></a>
      </div>
    </footer>

  </div>
</template>



<style scoped>

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


</style>

<script setup>

</script>
