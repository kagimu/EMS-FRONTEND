<template>
  <div>



    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12" style="background-color: chocolate;">
        Column 1
      </div>
    </div>

      <div class="row">
        <div class="col-12 col-sm-1 col-md-2 col-lg-2" style="background-color: darkcyan;">
          menu
        </div>
        <div class="col-12 col-sm-11 col-md-10 col-lg-10">

          <div class="card">
            <div class="card-body">
              <router-view></router-view>
            </div>
          </div>


        </div>
      </div>


    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12" style="background-color: chocolate;">
        <!-- Footer -->
        <footer>
          <div>
            <small class="float-end mr-5">Wholesome Education</small>
          </div>
        </footer>
      </div>
    </div>





  </div>
</template>

<script>
export default {
  name: "Dashboard"
}
</script>

<style scoped>

</style>