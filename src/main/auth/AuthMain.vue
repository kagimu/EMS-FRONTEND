<template>

    <div class="container-fluid top-0 left-0">

      <div class="text-sm">
        <nav class="navbar navbar-expand-lg navbar-dark bg-[#2c2f8c] sticky-top py-3">
          <div class="container-fluid">
            <router-link
                :to="{name:'welcome'}"
                class="text-white no-underline ml-5 text-[16px]">
              Victorious Education Services
            </router-link>
            <div>
              <div class="flex text-sm">
<!--                <router-link :to="{name:'welcome'}" class="mr-3 no-underline text-white"><i class="bi bi-house mr-2"></i>Home </router-link>-->
                <router-link :to="{name:'application'}" class="mr-3 no-underline text-white"><i class="bi bi-arrow-right-circle mr-2"></i>Apply </router-link>
                <router-link :to="{name:'login'}" class="mr-3 no-underline text-white"><i class="bi bi-box-arrow-in-right mr-2"></i> Login</router-link>
                <router-link :to="{name:'register'}" class="mr-3 no-underline text-white"><i class="bi bi-person mr-2"></i>Register </router-link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <router-view></router-view>


      <footer class="absolute bottom-0 left-0 w-screen bg-[#2c2f8c] py-0">
        <div class="flex justify-between px-3 py-1">
          <div class="text-white text-sm"><small>© 2011 Victorious Education Services, All rights reserved.</small></div>
          <a  class="text-white no-underline text-sm" href="#"><small><span>Powered by</span> <b>Hamsoft</b></small></a>
        </div>
      </footer>

    </div>

</template>

<script>
export default {
name: "AuthMain"
}
</script>

<style scoped>
.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  padding: 0px !important; }
  .bg-primary{
    background-color: rgb(13, 86, 195) !important;
  }
  
</style>