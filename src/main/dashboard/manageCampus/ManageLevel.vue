<template>
  <div>


    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-4 mt-2" style="font-size: 20px;">Bunamwaaya campus</div>

            <div style="width: 95%; font-size: 13px;" class="mx-auto mt-4">

              <div class="row">
                <div class="col-4">
                    <div class="mb-4">
                      Contacts<br />
                      Email:   mwesigwa.noregrets@gmail.com Phone:   +256752698545
                    </div>
                </div>



                <div class="col-4">
              <div class="mb-4">
                Address <br />
                Location: Bunamwaya, P.O.BOX 21671 Kampala
              </div>
                </div>



                    <div class="col-4">
              <div class="mb-4">
                Class Levels <br />
                kindergarten
                primary
              </div>
                    </div>
                  </div>

            </div>





          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12">


        <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">New Level</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Level</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">


            <form @submit.prevent="addCampus">


              <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input type="email" v-model="form.name" required class="form-control">
              </div>



              <div class="text-right mt-4">
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
      <div class="col-3">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Level</div>


            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link class="list-group-item list-group-item-action active" :to="{name:''}"><small style="font-size:12px;">Kindergarten</small></router-link>
              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Primary</small></router-link>
              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Secondary</small></router-link>
              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Tertiary</small></router-link>
              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Vocational</small></router-link>
            </div>



          </div>
        </div>
      </div>

      <div class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mt-4 ml-3">
              <nav>
              <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true"><small>Home</small></button>
                <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><small>Profile</small></button>
                <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false"><small>Contact</small></button>
                <button class="nav-link" id="nav-disabled-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" aria-controls="nav-disabled" aria-selected="false"><small>Disabled</small></button>
              </div>
            </nav>
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">kasendaa 1</div>
                <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">kasendaa 2</div>
                <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">kasendaa 3</div>
                <div class="tab-pane fade" id="nav-disabled" role="tabpanel" aria-labelledby="nav-disabled-tab" tabindex="0">kasendaa 4</div>
              </div>

            </div>






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
  name:null
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