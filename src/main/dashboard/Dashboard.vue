<template>
  <div>

    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12" style="background-color: chocolate;">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <div style="width: 10%; margin-right: 6%;">
              <a class="navbar-brand" href="#">Navbar scroll</a>
            </div>
            <div class="navbar-collapse">
              <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Link
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
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