<template>
  <div>



    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Students Admission</div>




            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First name</th>
                <th scope="col">Second name</th>
                <th scope="col">Gender</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>Male</td>
                <td>otto@gmail.com</td>
                <td>0789878765</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>Male</td>
                <td>thornton@gmail.com</td>
                <td>078675654</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry the Bird</td>
                <td>twitter</td>
                <td>Female</td>
                <td>twitter@gmail.com</td>
                <td>0709897656</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Larry the Bird</td>
                <td>twitter</td>
                <td>Male</td>
                <td>twitter@gmail.com</td>
                <td>0709897656</td>
              </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>

import {reactive, ref} from "vue";

const buttonLoader = ref(false)
let show = ref(false)

const form = reactive({
  first_name:null,
  second_name:null,
  email:null,
  phone:null,
  location:null,
  level:""
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