<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">


        <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">New Campus</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add New Campus</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">


            <form @submit.prevent="addCampus">


              <div class="mb-2">
                <label class="textColor"><small>Campus Name</small></label>
                <input type="email" v-model="form.name" required class="form-control">
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Phone</small></label>
                <input type="email" v-model="form.phone" required class="form-control">
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Email</small></label>
                <input type="email" v-model="form.email" required class="form-control">
              </div>

              <div class="mb-2">
                <label class="textColor"><small>Location</small></label>
                <input type="email" v-model="form.location" required class="form-control">
              </div>


              <div class="text-right">
                <button type="submit" class="btn btn-primary mb-2">
                  save

                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>


            </form>


          </div>
        </div>


      </div>
    </div>



    <div class="row">
      <div class="col-4">
        <div class="card mt-3">
              <div class="card-body">
                <div class="mb-3" style="font-size: 20px;">BUNAMWAYA CAMPUS</div>
                <small>
                  mwesigwa.noregrets@gmail.com<br />
                  +256752698545<br />
                  Bunamwaya, P.O.BOX 21671 Kampala
                </small>
              </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>

import {reactive, ref} from "vue";

const buttonLoader = ref(false)

const form = reactive({
  name:null,
  email:null,
  phone:null,
  location:null
})

function addCampus(){
alert(JSON.stringify(form))
}

</script>

<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

</style>