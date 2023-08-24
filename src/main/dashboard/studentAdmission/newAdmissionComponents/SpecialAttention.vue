<template>
  <div>

    <p class="ml-4 mt-4 mb-10"> SPECIAL ATTENTION </p>

    <form @submit.prevent="addMedicalRecords">
      <div class="row mx-auto">
        <div class="col-7">


          <div class="mb-2">
            <label class="textColor text-sm">Mention any special matter about the student that you would like to alert our attention to  *</label>
            <textarea style="outline: none 0 !important; box-shadow: none; height: 60px" class="form-control noFocus form-control-sm" v-model="form.special_matter" id="floatingTextarea2"></textarea>
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
const emit = defineEmits()

const form = reactive({
  special_matter:null,
})

const addMedicalRecords = () => {
  emit("next", 7)
}



</script>

<style scoped>

</style>