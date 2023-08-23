<template>
<div>


<p class="ml-4 mt-4 mb-10">PERSONAL DETAILS OF STUDENT</p>


  <form @submit.prevent="addStudentEducationDetails">
  <div class="row mx-auto">
    <div class="col-6">


<div>
        <div class="mb-2">
          <label class="textColor">Surname/Family name *</label>
          <input type="text" v-model="form.surname" required class="form-control">
        </div>

        <div class="mb-2">
          <label class="textColor">Second name *</label>
          <input type="text" v-model="form.second_name" required class="form-control">
        </div>

        <div class="mb-2">
          <label class="textColor">Other names *</label>
          <input type="text" v-model="form.other_name" required class="form-control">
        </div>


        <div class="mb-2">
          <label class="textColor">Date of Birth *</label>
          <input type="date" v-model="form.date_of_birth" required class="form-control">
        </div>


          <div class="mb-2">
            <label class="textColor"><small>Sex</small></label>
            <select style="box-shadow: none;" class="form-select" v-model="form.sex" aria-label="Default select example">
              <option disabled value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>


</div>


    </div>
    <div class="col-6">

      <div class="row">
        <div class="col-6">

          <div class="mb-2">
            <label class="textColor">Birth Certificate No</label>
            <input type="text" v-model="form.birth_certificate_no" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Country of Birth  *</label>
            <input type="text" v-model="form.country_of_birth" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home District  *</label>
            <input type="text" v-model="form.home_district" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home Sub-county</label>
            <input type="text" v-model="form.home_sub_county" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home Village  *</label>
            <input type="text" v-model="form.home_village" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home Phone 1  *</label>
            <input type="text" v-model="form.home_phone1" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home E-mail 1  *</label>
            <input type="text" v-model="form.home_email1" required class="form-control">
          </div>

        </div>
        <div class="col-6">


          <div class="mb-2">
            <label class="textColor">Religion  *</label>
            <input type="text" v-model="form.religion" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home Country  *</label>
            <input type="text" v-model="form.home_country" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home County</label>
            <input type="text" v-model="form.home_county" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home Parish</label>
            <input type="text" v-model="form.home_parish" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Nearest Town *</label>
            <input type="text" v-model="form.nearest_town" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home Phone 2</label>
            <input type="text" v-model="form.home_phone2" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Home E-mail 2</label>
            <input type="text" v-model="form.home_email2" required class="form-control">
          </div>

        </div>
      </div>

    </div>
  </div>

    <hr />

    <div class="text-right mt-4">
      <button type="submit" class="btn btn-primary mb-2 mr-4">
        Next
        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
    </div>

  </form>



</div>
</template>

<script setup>

import {reactive, ref} from "vue";

const buttonLoader = ref(false)

const form = reactive({
  surname:null,
  second_name:null,
  other_name:null,
  date_of_birth:null,
  sex:"",
  birth_certificate_no:null,
  country_of_birth:null,
  home_district:null,
  home_sub_county:null,
  home_village:null,
  home_phone1:null,
  home_email1:null,
  religion:null,
  home_country:null,
  home_county:null,
  home_parish:null,
  nearest_town:null,
  home_phone2:null,
  home_email2:null,
})

function addStudentEducationDetails(){

}

</script>

<style scoped>

</style>