<template>
<div>

  <p class="ml-4 mt-4 mb-10"> PHYSICAL MARKS </p>

  <form @submit.prevent="addStudentPhysicalMarks">
    <div class="row mx-auto">
      <div class="col-6">


        <div>
          <div class="mb-2">
            <label class="textColor">Height:</label>
            <input type="text" v-model="form.height" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Feet:</label>
            <input type="text" v-model="form.feet" required class="form-control">
          </div>

        </div>


      </div>
      <div class="col-6">

        <div>
          <div class="mb-2">
            <label class="textColor">Weight:</label>
            <input type="text" v-model="form.weight" required class="form-control">
          </div>

          <div class="mb-2">
            <label class="textColor">Complextion:</label>
            <input type="text" v-model="form.complextion" required class="form-control">
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
  height:null,
  feet:null,
  weight:null,
  complextion:null,
})


function addStudentPhysicalMarks(){

}

</script>

<style scoped>

</style>