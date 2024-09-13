<template>
  <div>

    <p class="ml-4 mt-4 mb-10"> EDUCATION DETAILS </p>

    <form @submit.prevent="addMedicalRecords">
      <div class="row mx-auto">
        <div class="col-6">


          <div>

            <div class="mb-2">
              <label class="text-sm"><small>Campus  *</small></label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select" v-model="form.campus" aria-label="Default select example">
                <option value="">Select Campus</option>
                <option value="dfg434d">Mutala Campus</option>
                <option value="we3434fdfg">Kalem Campus</option>
              </select>
            </div>

            <div class="mb-2">
              <label class="text-sm"><small>  Class Level  *</small></label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select" v-model="form.class_level" aria-label="Default select example">
                <option value="">Select Class Level</option>
                <option value="dfg434d">Nursery</option>
                <option value="we3434fdfg">Primary</option>
              </select>
            </div>

            <div class="mb-2">
              <label class="text-sm"><small>Class of Entry  *</small></label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select" v-model="form.class_of_entry" aria-label="Default select example">
                <option value="">Select Class of Entry</option>
                <option value="dfg434d">primary one</option>
                <option value="we3434fdfg">Primary two</option>
              </select>
            </div>


          </div>


        </div>
        <div class="col-6">

          <div>

            <div class="mb-2">
              <label class="text-sm"><small>Academic Year  *   </small></label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select" v-model="form.academic_year" aria-label="Default select example">
                <option value="">Select Academic Year</option>
                <option value="dfg434d">2021</option>
                <option value="we3434fdfg">2022</option>
                <option value="we3434fdfg">2023</option>
              </select>
            </div>

            <div class="mb-2">
              <label class="text-sm"><small>Study Period *</small></label>
              <select style="font-size: 13px; outline: none 0 !important; box-shadow: none;" class="form-select" v-model="form.study_period" aria-label="Default select example">
                <option value="">Select Study Period</option>
                <option value="dfg434d">term 1</option>
                <option value="we3434fdfg">term 2</option>
                <option value="we3434fdfg">term 3</option>
              </select>
            </div>


            <div class="mb-2">
            <label class="text-sm text-sm">Recommendation or school report from previous school for pupils entering any class other than Nursery must be provided</label>
            <div class="input-group mb-3">
              <input
                  type="file"
                  ref="recommendationAttachment"
                  class="form-control form-control-sm"
                  id="inputGroupFile02">
            </div>
            </div>



          </div>


        </div>
      </div>

      <hr />


      <div class="flex justify-content-between mt-4">

        <button type="button" @click="backPage" class="btn btn-outline-secondary mb-2 ml-4">
          Back
        </button>

        <button type="submit" class="btn btn-primary mb-2 mr-4">
          Finish
          <span class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </span>
        </button>

      </div>


    </form>

  </div>
</template>

<script setup>

import {reactive, ref} from "vue";

const buttonLoader = ref(false)
const emit = defineEmits()

const form = reactive({
  campus:null,
  class_level:null,
  class_of_entry:null,
  academic_year:null,
  study_period:null,
  recommendation_attachment:null,
})

const addMedicalRecords = () => {

}

const backPage = () => {
  emit("next", 6 )
}

</script>

<style scoped>

</style>