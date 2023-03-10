<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">


        <button class="btn btn-primary btn-sm float-end mr-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#subjectDialog" aria-controls="subjectDialog">New Subject</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="subjectDialog" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">New Subject</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">


            <form @submit.prevent="addCampus">



              <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input type="text" v-model="form.name" required class="form-control noFocus">
              </div>


              <div class="mb-2">
                <label class="textColor"><small>Learning Area</small></label>
                <select class="form-select noFocus" v-model="form.learningArea" aria-label="Default select example">
                  <option value="">Select Learning Area</option>
                  <option value="MENTAL STUDIES">MENTAL STUDIES</option>
                  <option value="PHYSICAL STUDIES">PHYSICAL STUDIES</option>
                  <option value="RELIGIOUS STUDIES">RELIGIOUS STUDIES</option>
                  <option value="RELIGIOUS STUDIES">SOCIAL STUDIES</option>
                </select>
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
      <div class="col-12">
<!--        <div class="card mt-3">-->
<!--          <div class="card-body" style="padding: 0;">-->

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Kindergarten Subjects</div>

            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Learning Area</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Looking Carefully</td>
                <td>MENTAL STUDIES</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>Listening Closely</td>
                <td>MENTAL STUDIES</td>
              </tr>
              </tbody>
            </table>

<!--          </div>-->
<!--        </div>-->
      </div>


    </div>

  </div>
</template>

<script setup>

import {reactive, ref} from "vue";

const buttonLoader = ref(false)
let show = ref(false)

const form = reactive({
  name:null,
  learningArea:null,
})

function addCampus(){
  alert(JSON.stringify(form))
}

</script>

<style scoped>

 .noFocus:focus {
   outline: none 0 !important;
   box-shadow: none;
   -moz-box-shadow: none;
   -webkit-box-shadow: none;
 }

 .noFocus {
   box-shadow: none !important
 }


.textColor{
  color: #717375;
}

</style>