<template>


    <div class="container-fluid" style="margin-top:20px;">
      <router-view></router-view>
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